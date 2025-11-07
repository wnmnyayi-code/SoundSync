import NextAuth from 'next-auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { authRateLimiter } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'

async function auth(request: NextRequest) {
  // For GET requests, pass through to NextAuth
  if (request.method === 'GET') {
    return NextAuth(authOptions)(request)
  }

  try {
    // Apply rate limiting for login attempts
    const rateLimit = authRateLimiter(request)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'TooManyRequests' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter)
          }
        }
      )
    }

    // Validate CSRF token
    const headersList = headers()
    const csrfToken = headersList.get('x-csrf-token')
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { error: 'InvalidCSRFToken' },
        { status: 403 }
      )
    }

    // Pass to NextAuth handler
    return NextAuth(authOptions)(request)
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'InternalServerError' },
      { status: 500 }
    )
  }
}

export const GET = auth
export const POST = auth