import type { JwtData } from '@/lib/auth'
import { JWT_COOKIE_NAME, verifyJwt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export type VerifyJwtApiResult = {
	ok: false
	data?: never,
	return: NextResponse
} | {
	ok: true,
	data: JwtData,
	return?: never
}

export async function verifyJwtApi(): Promise<VerifyJwtApiResult> {
	const jwt = (await cookies()).get(JWT_COOKIE_NAME)?.value
	if (!jwt)
		return { ok: false, return: NextResponse.json(null, { status: 401 }) }

	const result = await verifyJwt(jwt)
	if (result.error)
		return { ok: false, return: NextResponse.json(result, { status: 403 }) }

	return { ok: true, data: result.data }
}
