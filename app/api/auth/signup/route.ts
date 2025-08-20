'use server'

import { json } from '@/lib/api'
import { createJwt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { signupFormSchema } from '@/lib/validators/auth'
import { hash } from '@node-rs/argon2'

export async function POST(request: Request): Promise<Response> {
	if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data'))
		return json({ name: 'BAD_REQUEST' }, { status: 400 })

	const formData = await request.formData()

	const u = signupFormSchema.safeParse(Object.fromEntries(formData.entries()))

	if (!u.success)
		return json({ name: 'BAD_REQUEST' }, { status: 400 })

	// TODO: Handle the email unique constraint
	const user = await prisma.user.create({
		data: {
			email: u.data.email,
			name: u.data.email,
			password: await hash(u.data.password),
		},
	})

	const jwt = await createJwt({
		sub: user.id,
		email: user.email,
		name: user.name
	})

	return json({
		token: jwt,
	})
}
