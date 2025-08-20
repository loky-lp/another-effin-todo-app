import type { HmacHashAlgorithmIdentifier } from '@/lib/crypto'
import { getJwtKeyFromSecret, jwtHmacAlgorithmIdentifier } from '@/lib/crypto'
import {
	createJWTSignatureMessage,
	encodeJWT,
	JWSRegisteredHeaders,
	JWTRegisteredClaims,
	parseJWT,
} from '@oslojs/jwt'

type JSONPrimitive = string | number | boolean | null | undefined

type JSONValue = JSONPrimitive | JSONValue[] | {
	[key: string]: JSONValue
}

const JWT_HASH_ALGORITHM: HmacHashAlgorithmIdentifier = 'SHA-256' as const

export type JwtData = {
	sub: string
} & Record<string, JSONValue>

const tokenDuration = 60 * 60 * 24 * 30 // 30 Days

export async function createJwt(payload: JwtData): Promise<string> {
	const { key, alg } = await getJwtKeyFromSecret({ hash: JWT_HASH_ALGORITHM })

	const headerJSON = JSON.stringify({
		alg,
		typ: 'JWT',
	})

	payload.exp = Math.floor(Date.now() / 1000) + tokenDuration
	const payloadJSON = JSON.stringify(payload)

	const message = createJWTSignatureMessage(headerJSON, payloadJSON) as Uint8Array<ArrayBuffer>
	const signatureBuffer = await crypto.subtle.sign('HMAC', key, message)
	return encodeJWT(headerJSON, payloadJSON, new Uint8Array(signatureBuffer))
}

export function extractJwt(request: Request): string | undefined {
	if (!request.headers || !request.headers.has('Authorization'))
		return undefined

	const headerValue = request.headers.get('Authorization')!
	if (!headerValue.startsWith('Bearer '))
		return undefined

	return headerValue.split('Bearer ')[1]
}

export type VerifyJwtReturn = {
	data: JwtData
	error?: never
} | {
	data?: never
	error: 'NOT_WELL_FORMATTED' | 'UNSUPPORTED_ALGORITHM' | 'INVALID_SIGNATURE' | 'EXPIRED' | 'INVALID_SHAPE'
}

export async function verifyJwt(jwt: string): Promise<VerifyJwtReturn> {
	let header: ReturnType<typeof parseJWT>[0]
	let payload: ReturnType<typeof parseJWT>[1]
	let signature: ReturnType<typeof parseJWT>[2]
	let signatureMessage: ReturnType<typeof parseJWT>[3]
	try {
		[header, payload, signature, signatureMessage] = parseJWT(jwt)
	} catch (e) {
		return { error: 'NOT_WELL_FORMATTED' }
	}

	const headerParameters = new JWSRegisteredHeaders(header)
	if (!headerParameters.hasAlgorithm() || !jwtHmacAlgorithmIdentifier.includes(headerParameters.algorithm() as any))
		return { error: 'UNSUPPORTED_ALGORITHM' }

	const { key } = await getJwtKeyFromSecret({ hash: JWT_HASH_ALGORITHM })
	const validSignature = await crypto.subtle.verify(
		'HMAC',
		key,
		signature as Uint8Array<ArrayBuffer>,
		signatureMessage as Uint8Array<ArrayBuffer>,
	)
	if (!validSignature)
		return { error: 'INVALID_SIGNATURE' }

	const claims = new JWTRegisteredClaims(payload)
	if (!claims.hasExpiration() || !claims.verifyExpiration())
		return { error: 'EXPIRED' }

	if (!claims.hasSubject())
		return { error: 'INVALID_SHAPE' }

	return {
		data: payload as JwtData,
	}
}
