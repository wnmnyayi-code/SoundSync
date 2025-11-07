import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })

    const dbToken = await prisma.token.findUnique({ where: { token } })
    if (!dbToken || dbToken.type !== 'VERIFY' || dbToken.used || dbToken.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 })
    }

    await prisma.user.update({ where: { id: dbToken.userId }, data: { verificationStatus: 'APPROVED' } })
    await prisma.token.update({ where: { id: dbToken.id }, data: { used: true } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
