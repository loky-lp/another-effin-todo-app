import { extractJwtFromCookies } from '@/lib/server/auth'
import { verifyJwt } from '@/lib/auth'
import { NextResponse, NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname
	const isPublicRoute = path.startsWith('/auth')

	if (isPublicRoute)
		return NextResponse.next()

	const jwt = await extractJwtFromCookies()
	if (!jwt)
		return NextResponse.redirect(new URL('/auth/login', req.nextUrl))

	const result = await verifyJwt(jwt)
	if (result.error)
		return NextResponse.redirect(new URL('/auth/login', req.nextUrl))

	return NextResponse.next()
}


// Routes Middleware should not run on
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.well-known|.*\\.png$|.*\\.ico$).*)'],
}
