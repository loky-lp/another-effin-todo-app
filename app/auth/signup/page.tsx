'use client'

import { JWT_COOKIE_NAME } from '@/lib/auth'
import { signupFormSchema } from '@/lib/validators/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardTitle, CardHeader } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function SignUpPage() {
	const form = useForm<z.infer<typeof signupFormSchema>>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof signupFormSchema>) {
		const formData = new FormData()
		for (const [key, value] of Object.entries(values)) {
			formData.append(key, value)
		}

		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			body: formData,
		})
		if (!res.ok) {
			console.error('Sign up failed.')
			return
		}

		const data = await res.json()
		if (!data || !data.result || !data.result.token || typeof data.result.token !== 'string') {
			console.error('Missing token.')
			return
		}

		await globalThis.cookieStore.set(JWT_COOKIE_NAME, data.result.token)

		redirect('/')
	}

	return (
		<div className="flex w-full h-full min-h-screen flex-col items-center justify-center gap-6">
			<Card className="w-full max-w-sm">
				<form onSubmit={form.handleSubmit(onSubmit)} className="contents">
					<CardHeader>
						<CardTitle>Registrati</CardTitle>
						<CardDescription>
							Inserisci le credenziali e registrati per accedere all'app.
							<br />
							Hai già un account? Accedi <Link href="/auth/login" className="hover:underline text-sky-500">qui</Link>.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-6">
						<Form {...form}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input placeholder="Mario rossi" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" placeholder="mario.rossi@esempio.it" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</Form>
					</CardContent>
					<CardFooter className="justify-end-safe">
						{/* TODO: Enable button only when the form is valid */}
						<Button type="submit" disabled={form.formState.isSubmitting} className="cursor-pointer">
							{form.formState.isSubmitting
								? (<>
									<LoaderCircle className="size-4 animate-spin" />
									Registrazione…
								</>)
								: 'Registrati!'
							}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
