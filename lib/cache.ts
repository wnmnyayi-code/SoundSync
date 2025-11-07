import { NextResponse } from 'next/server'

export function withCache(handler: Function, options: { maxAge: number } = { maxAge: 3600 }) {
  return async function(req: Request) {
    const response = await handler(req)

    if (response instanceof NextResponse) {
      response.headers.set('Cache-Control', `public, max-age=${options.maxAge}`)
    }

    return response
  }
}

interface CacheConfig {
  [key: string]: {
    maxAge: number
    staleWhileRevalidate?: number
  }
}

export const cacheConfig: CacheConfig = {
  // Static assets and images
  '/uploads/': { maxAge: 31536000 }, // 1 year
  '/images/': { maxAge: 2592000 }, // 30 days
  
  // API responses
  '/api/discover': { maxAge: 300, staleWhileRevalidate: 60 }, // 5 mins, stale for 1 min
  '/api/artists': { maxAge: 3600 }, // 1 hour
  
  // Dynamic content
  '/api/live/': { maxAge: 0 }, // No cache for live content
  '/api/user/': { maxAge: 0 }, // No cache for user-specific content
}