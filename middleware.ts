import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export const runtime = 'experimental-edge'
import { env } from '@/lib/env'
import { validateCsrfToken, setCsrfCookie } from '@/lib/csrf'
import { authRateLimiter, verifyRateLimiter } from '@/lib/rate-limit'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Skip static and Next.js assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/icons') ||
    url.pathname.startsWith('/images')
  ) {
    return NextResponse.next()
  }

  const isApiRoute = url.pathname.startsWith('/api/')
  const isAuthPage = ['/login', '/register', '/reset'].includes(url.pathname)

  if (!isApiRoute && !isAuthPage) {
    return NextResponse.next()
  }

  // 1. Rate Limiting
  if (url.pathname.startsWith('/api/auth')) {
    const limiter = url.pathname.includes('/verify')
      ? verifyRateLimiter
      : authRateLimiter

    const rateLimit = limiter(req)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }
  }

  // 2. CSRF Protection
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (req.headers.get('origin') === env.NEXTAUTH_URL) {
      const csrfToken = req.headers.get('x-csrf-token')
      if (!validateCsrfToken(csrfToken)) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
      }
    }
  }

  // 3. Beta User Limit Check
  if (url.pathname === '/api/auth/register') {
    try {
      const betaResponse = await fetch('https://api.vercel.com/v1/usage', {
        headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` },
      })
      const data = await betaResponse.json()
      const userCount = data.count || 0

      const betaLimit = Number(env.BETA_USER_LIMIT || 1000) // default fallback

      if (userCount >= betaLimit) {
        return NextResponse.json(
          { error: 'Beta user limit reached' },
          { status: 503 }
        )
      }
    } catch (error) {
      console.error('Failed to check user limit:', error)
    }
  }

  // 4. Set CSRF cookie for GET auth pages
  if (req.method === 'GET' && isAuthPage) {
    const token = await setCsrfCookie()
    const response = NextResponse.next()
    response.headers.set('x-csrf-token', token)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/(login|register|reset)'],
}
