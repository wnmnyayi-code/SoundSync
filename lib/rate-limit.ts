// src/lib/rate-limit.ts
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  maxTokens: number
  refillRate: number // tokens per second
  tokensPerRequest?: number
}

const RATE_LIMITS: { [key: string]: RateLimitConfig } = {
  default: {
    maxTokens: 50,
    refillRate: 10
  },
  auth: {
    maxTokens: 10,
    refillRate: 2,
    tokensPerRequest: 2 // Costs more tokens per request
  },
  verify: {
    maxTokens: 5,
    refillRate: 1,
    tokensPerRequest: 1
  }
}

export function createRateLimiter(config: RateLimitConfig = RATE_LIMITS.default) {
  const tokenBucket = new Map<string, { tokens: number; lastRefill: number }>()

  return function checkRateLimit(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    const now = Date.now()
    
    let bucket = tokenBucket.get(ip)
    if (!bucket) {
      bucket = { tokens: config.maxTokens, lastRefill: now }
      tokenBucket.set(ip, bucket)
    }

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastRefill
    const refillAmount = Math.floor(timePassed / 1000) * config.refillRate
    bucket.tokens = Math.min(config.maxTokens, bucket.tokens + refillAmount)
    bucket.lastRefill = now

    const tokensNeeded = config.tokensPerRequest || 1
    if (bucket.tokens < tokensNeeded) {
      const retryAfter = Math.ceil((tokensNeeded - bucket.tokens) / config.refillRate)
      return {
        success: false,
        retryAfter
      }
    }

    bucket.tokens -= tokensNeeded
    return { success: true }
  }
}

export const authRateLimiter = createRateLimiter(RATE_LIMITS.auth)
export const verifyRateLimiter = createRateLimiter(RATE_LIMITS.verify)