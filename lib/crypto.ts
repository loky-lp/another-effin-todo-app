import { env } from '@/lib/env'

export const jwtHmacAlgorithmIdentifier = ['HS256', 'HS384', 'HS512'] as const
export type JwtHmacAlgorithmIdentifier = typeof jwtHmacAlgorithmIdentifier[number]

export const hmacHashAlgorithmIdentifier = ['SHA-256', 'SHA-384', 'SHA-512'] as const
export type HmacHashAlgorithmIdentifier = typeof hmacHashAlgorithmIdentifier[number]

export const JwtAlgHmacDictionary = {
	HS256: 'SHA-256',
	HS384: 'SHA-384',
	HS512: 'SHA-512',
} as const satisfies Record<JwtHmacAlgorithmIdentifier, HmacHashAlgorithmIdentifier>

export const HashJwtAlgHmacDictionary = {
	'SHA-256': 'HS256',
	'SHA-384': 'HS384',
	'SHA-512': 'HS512',
} as const satisfies Record<HmacHashAlgorithmIdentifier, JwtHmacAlgorithmIdentifier>

export type GetJwtKeyOptions = {
	hash?: HmacHashAlgorithmIdentifier
	length?: number
}
export type GetJwtKeyReturn = {
	key: CryptoKey,
	alg: JwtHmacAlgorithmIdentifier,
}

export async function getJwtKeyFromSecret(options: GetJwtKeyOptions = { hash: 'SHA-256' }): Promise<GetJwtKeyReturn> {
	const key = await globalThis.crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(env.SUPER_SNEAKY_AUTH_SECRET),
		{ name: 'HMAC', ...options },
		false,
		['sign', 'verify'],
	)

	return {
		key,
		alg: HashJwtAlgHmacDictionary[options.hash!],
	}
}
