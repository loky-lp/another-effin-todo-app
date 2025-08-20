import { z } from 'zod/v4'

export const loginFormSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
})

export const signupFormSchema = loginFormSchema.extend({
	name: z.string().min(2),
})
