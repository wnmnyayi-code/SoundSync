import NextAuth from 'next-auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { authRateLimiter } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'

const handler = NextAuth(authOptions)

async function auth(request: NextRequest, context: any) {
  // For GET requests, pass through to NextAuth
  if (request.method === 'GET') {
    return handler(request, context)
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
    const headersList = await headers()
    const csrfToken = headersList.get('x-csrf-token')
    const isValidCsrf = await validateCsrfToken(csrfToken)
    if (!isValidCsrf) {
      return NextResponse.json(
        { error: 'InvalidCSRFToken' },
        { status: 403 }
      )
    }

    // Pass to NextAuth handler
    return handler(request, context)
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