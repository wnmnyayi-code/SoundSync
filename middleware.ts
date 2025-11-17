// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createCsrfCookie, validateCsrfToken } from './lib/csrf'
import { env } from './lib/env'

// Routes that do NOT require CSRF validation
const PUBLIC_ROUTES = [
  '/api/auth', // NextAuth callbacks
  '/api/webhooks', // Stripe/webhooks
]

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip public routes completely
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const method = req.method.toUpperCase()

  // SAFE methods: GET / HEAD / OPTIONS → set CSRF cookie if missing
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfCookie = req.cookies.get('ssync_csrf')

    // If cookie already exists → continue
    if (csrfCookie?.value) {
      return NextResponse.next()
    }

    // Else create a new CSRF token & attach cookie
    const { cookie } = createCsrfCookie()

    const res = NextResponse.next()
    res.headers.append('Set-Cookie', cookie)

    return res
  }

  // NON-SAFE methods (POST, PUT, PATCH, DELETE)
  const headerToken = req.headers.get('x-csrf-token')
  const cookieToken = req.cookies.get('ssync_csrf')?.value

  const valid = validateCsrfToken(headerToken, cookieToken)

  if (!valid) {
    return new NextResponse(
      JSON.stringify({
        error: 'Invalid CSRF token',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

