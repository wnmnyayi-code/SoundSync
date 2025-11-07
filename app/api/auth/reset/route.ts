import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ success: false, error: 'Missing' }, { status: 400 })

    const dbToken = await prisma.token.findUnique({ where: { token } })
    if (!dbToken || dbToken.type !== 'RESET' || dbToken.used || dbToken.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 })
    }

    const hashed = await hashPassword(password)
    await prisma.user.update({ where: { id: dbToken.userId }, data: { password: hashed } })
    await prisma.token.update({ where: { id: dbToken.id }, data: { used: true } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reset error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
