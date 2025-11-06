import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const userCount = await fetch('https://api.vercel.com/v1/usage', {
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` }
  })

  if (userCount > 6000) {
    return NextResponse.json({ error: 'Beta limit reached' }, { status: 503 })
  }

  return NextResponse.next()
}