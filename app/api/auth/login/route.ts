'use server'

import { json } from '@/lib/server/api'
import { createJwt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loginFormSchema } from '@/lib/validators/auth'
import { verify } from '@node-rs/argon2'

export async function POST(request: Request): Promise<Response> {
	if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data'))
		return json({ name: 'BAD_REQUEST' }, { status: 400 })

	const formData = await request.formData()

	const u = loginFormSchema.safeParse(Object.fromEntries(formData.entries()))

	if (!u.success)
		return json({ name: 'BAD_REQUEST' }, { status: 400 })

	const user = await prisma.user.findUnique({
		where: {
			email: u.data.email,
		}
	})

	if (!user || !await verify(user.password, u.data.password))
		return json({ name: 'BAD_REQUEST' }, { status: 400 })

	const jwt = await createJwt({
		sub: user.id,
		email: user.email,
		name: user.name
	})

	return json({
		token: jwt,
	})
}
