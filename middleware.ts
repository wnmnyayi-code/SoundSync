import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/lib/env'
import { validateCsrfToken, setCsrfCookie } from '@/lib/csrf'
import { authRateLimiter, verifyRateLimiter } from '@/lib/rate-limit'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // 1. Rate Limiting for auth endpoints
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    const limiter = req.nextUrl.pathname.includes('/verify') ? 
      verifyRateLimiter : authRateLimiter
    
    const rateLimit = limiter(req)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter)
          }
        }
      )
    }
  }

  // 2. CSRF Protection for mutations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Skip CSRF for external APIs
    if (req.headers.get('origin') !== env.NEXTAUTH_URL) {
      return response
    }

    const csrfToken = req.headers.get('x-csrf-token')
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }

  // 3. User limit check (for beta)
  if (req.nextUrl.pathname === '/api/auth/register') {
    try {
      const betaResponse = await fetch('https://api.vercel.com/v1/usage', {
        headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` }
      })
      const data = await betaResponse.json()
      const userCount = data.count || 0
      
      if (userCount >= env.BETA_USER_LIMIT) {
        return NextResponse.json(
          { error: 'Beta user limit reached' },
          { status: 503 }
        )
      }
    } catch (error) {
      console.error('Failed to check user limit:', error)
      // Allow registration on error to prevent blocking legitimate users
    }
  }

  // 4. Set CSRF cookie for GET requests to auth pages
  if (req.method === 'GET' && (
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/register' ||
    req.nextUrl.pathname === '/reset'
  )) {
    const token = setCsrfToken()
    response.headers.set('x-csrf-token', token)
  }

  return response
}
        )
      }
    } catch (error) {
      console.error('Failed to check user limit:', error)
      // Allow registration to proceed if we can't check the limit
      // You might want to change this behavior based on your requirements
    }
  }

  // Continue to the next middleware or route handler
  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}