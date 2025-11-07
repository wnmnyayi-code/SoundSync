import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { z } from 'zod'
import crypto from 'crypto'
import sendEmail from '@/lib/mailer'
import { env } from '@/lib/env'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['FAN', 'CREATOR', 'ADMIN']).default('FAN'),
  artistName: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
    }

    const { email, password, role, artistName } = parsed.data

    // prevent duplicate accounts
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
        artistName: role === 'CREATOR' ? artistName ?? null : null,
        verificationStatus: 'PENDING',
      },
    })

    // Create verification token and send email (or log)
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    await prisma.token.create({ data: { token, type: 'VERIFY', userId: user.id, expiresAt } })
    const verifyUrl = `${env.NEXTAUTH_URL}/verify?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Verify your SoundSync account',
      text: `Verify your account by visiting: ${verifyUrl}`,
      html: `<p>Click to verify your account: <a href="${verifyUrl}">${verifyUrl}</a></p>`
    })

  return NextResponse.json({ success: true, data: { id: user.id } }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
