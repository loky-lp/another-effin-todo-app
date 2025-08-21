import { JWT_COOKIE_NAME } from '@/lib/auth'

async function internalFetch<T>(...args: Parameters<typeof fetch>): Promise<T> {
	// This function could be more feature-rich, like having validation for both requests and responses.
	// The scope has been kept simple to avoid unnecessary complexity for this simple app.
	let [input, init] = args

	const jwt = await globalThis.cookieStore.get(JWT_COOKIE_NAME).then(c => c?.value)

	if (!init)
		init = {}

	if (!init.method)
		init.method = 'GET'

	if (!init.headers)
		init.headers = new Headers({
			'Authorization': `Bearer ${jwt}`,
		})

	const res = await fetch(input, init)

	if (!res.ok) {
		const details = (res.status >= 400 && res.status < 500) ? await res.json() : undefined
		throw new Error('Failed to fetch', details)
	}

	return await res.json().then(v => v.result) as T
}
