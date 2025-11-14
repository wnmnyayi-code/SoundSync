// src/lib/csrf.ts
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import crypto from 'crypto'

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function setCsrfCookie() {
  const token = generateCsrfToken()
  const cookieStore = await cookies()
  cookieStore.set('csrf', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Short expiry to prevent replay attacks
    maxAge: 60 * 60 // 1 hour
  })
  return token
}

export async function validateCsrfToken(token: string | null): Promise<boolean> {
  if (!token) return false
  const cookieStore = await cookies()
  const storedToken = cookieStore.get('csrf')?.value
  return token === storedToken
}