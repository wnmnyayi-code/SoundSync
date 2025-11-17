// lib/rate-limit.ts
import type { NextRequest } from 'next/server'
import { env } from './env'

type RateResult = { success: true } | { success: false; retryAfter: number }

// Simple in-memory map: key -> { tokens, lastRefill }
const BUCKETS = new Map<string, { tokens: number; lastRefill: number }>()

/**
 * token bucket limiter factory
 * limit: tokens capacity
 * refillRate: tokens per second
 */
function limiterFactory(limit: number, refillRate: number) {
  return (req: NextRequest): RateResult => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || req.headers.get('x-real-ip')
      || req.ip // next/server may not expose ip; this is best-effort
      || 'unknown'

    const key = `rl:${ip}`
    const now = Date.now()
    const bucket = BUCKETS.get(key) ?? { tokens: limit, lastRefill: now }

    // refill tokens
    const elapsed = (now - bucket.lastRefill) / 1000
    const refill = Math.floor(elapsed * refillRate)
    if (refill > 0) {
      bucket.tokens = Math.min(limit, bucket.tokens + refill)
      bucket.lastRefill = now
    }

    if (bucket.tokens > 0) {
      bucket.tokens -= 1
      BUCKETS.set(key, bucket)
      return { success: true }
    } else {
      // estimate retryAfter in seconds
      const retryAfter = Math.ceil(1 / refillRate) || 1
      return { success: false, retryAfter }
    }
  }
}

// Example rate limiters
export const authRateLimiter = limiterFactory(10, 1) // 10 requests, 1 token/sec
export const verifyRateLimiter = limiterFactory(5, 0.2) // 5 requests, 0.2 token/sec

// ---------------------------
// PRODUCTION / REDIS NOTE:
// ---------------------------
// Replace limiterFactory implementation with a Redis-based token bucket:
// - Use a Lua script or atomic INCREXPIRE patterns
// - Example providers: Upstash (REST), ioredis, redis v4
// - When REDIS_URL is provided, prefer Redis for global rate-limiting.
// ---------------------------
