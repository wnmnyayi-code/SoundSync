// proxy.ts (Next.js 16 replacement for middleware)

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/settings'
]

const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/dashboard/artist': ['CREATOR'],
  '/dashboard/merchant': ['MERCHANT'],
  '/dashboard/influencer': ['INFLUENCER'],
  '/dashboard/fan': ['FAN']
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role check
    for (const [route, roles] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(route)) {
        const userRole = token?.role ? String(token.role) : ''
        if (!roles.includes(userRole)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
        break
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|login|register|robots.txt|sitemap.xml).*)',
  ],
}
