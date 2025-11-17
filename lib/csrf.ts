// lib/csrf.ts
import { env } from './env'

const CSRF_COOKIE_NAME = 'ssync_csrf'
const CSRF_TOKEN_BYTES = 32
const CSRF_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function generateCsrfToken(): string {
  // Use crypto to produce a base64url token
  const arr = crypto.getRandomValues(new Uint8Array(CSRF_TOKEN_BYTES))
  // base64url encode
  const b64 = Buffer.from(arr).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Create a Set-Cookie header string to send from middleware.
 * Returns { token, cookie } so middleware can set both header and cookie.
 */
export function createCsrfCookie(): { token: string; cookie: string } {
  const token = generateCsrfToken()
  const cookieParts = [
    `${CSRF_COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`, // inaccessible to JS
    `SameSite=Strict`,
    `Max-Age=${CSRF_COOKIE_MAX_AGE}`,
  ]

  // When running in production with HTTPS, add Secure
  if (env.NODE_ENV === 'production') {
    cookieParts.push('Secure')
    // you can also scope domain here if needed: `Domain=yourdomain.com`
  }

  const cookie = cookieParts.join('; ')
  return { token, cookie }
}

/**
 * Validate token from header against cookie value
 * - headerToken: token from x-csrf-token header
 * - cookieToken: token read from cookie header "cookie"
 *
 * Returns boolean
 */
export function validateCsrfToken(headerToken: string | null | undefined, cookieToken: string | null | undefined): boolean {
  if (!headerToken || !cookieToken) return false
  // use constant time compare to avoid timing attacks
  return constantTimeEq(headerToken, cookieToken)
}

function constantTimeEq(a: string, b: string) {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
