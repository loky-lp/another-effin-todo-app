'use server'

import { JWT_COOKIE_NAME } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function extractJwtFromCookies(): Promise<string | undefined> {
	return (await cookies()).get(JWT_COOKIE_NAME)?.value
}
