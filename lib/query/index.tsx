'use client'

/**
 * Most of this code has been adapted from `create-t3-turbo` template;
 * it includes some things that would normally be used in trpc environments, hence the unnecessary complexity.
 */

import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

import { createQueryClient } from './client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
	if (typeof window === 'undefined') {
		// Server: always make a new query client
		return createQueryClient()
	} else {
		// Browser: use the singleton pattern to keep the same query client
		return (clientQueryClientSingleton ??= createQueryClient())
	}
}

export function QueryProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
		</QueryClientProvider>
	)
}
