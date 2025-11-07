import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success: true }) // don't reveal

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: true })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.token.create({ data: { token, type: 'RESET', userId: user.id, expiresAt } })
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset?token=${token}`
    // Send email if configured, otherwise fallback to log
    try {
      const sendEmail = (await import('@/lib/mailer')).default
      await sendEmail({ to: email, subject: 'SoundSync password reset', text: `Reset: ${resetUrl}`, html: `<p>Reset password: <a href="${resetUrl}">${resetUrl}</a></p>` })
    } catch (err) {
      console.log(`Password reset token for ${email}: ${token}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reset request error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
