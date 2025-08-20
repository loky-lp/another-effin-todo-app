import { JWT_COOKIE_NAME } from '@/lib/auth'
import { decodeJWT } from '@oslojs/jwt'
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { z } from 'zod/v4/mini'

const jwtPayload = z.object({
	sub: z.string(),
	name: z.string(),
	email: z.string(),
})

export function useUser() {
	const [isLoading, setIsLoading] = useState(false)
	const [user, setUser] = useState<z.infer<typeof jwtPayload> | undefined>()

	const login = useCallback(async (jwt: string) => {
		setIsLoading(true)
		const payload = jwtPayload.safeParse(decodeJWT(jwt))

		if (!payload.success) {
			console.error('Malformed JWT payload', payload)
			setIsLoading(false)
			return
		}

		setUser(payload.data)
		await globalThis.cookieStore.set(JWT_COOKIE_NAME, jwt)
		setIsLoading(false)
		redirect('/')
	}, [])

	const logout = useCallback(async () => {
		setIsLoading(true)
		setUser(undefined)
		await globalThis.cookieStore.delete(JWT_COOKIE_NAME)
		setIsLoading(false)
		redirect('/')
	}, [])

	useEffect(() => {
		(async () => {
			setIsLoading(true)
			const jwt = await globalThis.cookieStore.get(JWT_COOKIE_NAME).then(c => c?.value)
			if (!jwt) return

			const payload = jwtPayload.safeParse(decodeJWT(jwt))

			if (!payload.success) {
				console.error('Malformed JWT payload', payload)
				setIsLoading(false)
				return
			}

			setUser(payload.data)
			setIsLoading(false)
		})()
	}, [])

	return {
		isLoading,
		user,
		login,
		logout,
	}
}
