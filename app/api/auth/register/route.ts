import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import sendEmail from '@/lib/mailer';
import { env } from '@/lib/env';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
  subscriptionTier: z.string().optional(),
  artistName: z.string().optional(),
  artistStatus: z.string().optional(),
  sarsNumber: z.string().optional(),
  referralCode: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input',
        details: parsed.error.errors
      }, { status: 400 });
    }

    const data = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const saltRounds = parseInt(env.BCRYPT_SALT_ROUNDS || '12', 10);
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Handle single role from new form
    const roleInput = data.role || 'FAN';
    const selectedRoles = [roleInput === 'CREATOR' ? 'ARTIST' : roleInput];

    // Check for default admin credentials
    const isDefaultAdmin = data.email === 'admin@soundsync.co.za' && data.password === 'SoundSync@Admin2025!';

    let primaryRole = roleInput;
    let verificationStatus = 'APPROVED'; // Auto-approve for now for easier testing
    let subscriptionTier = data.subscriptionTier ?? 'BASIC';

    if (isDefaultAdmin) {
      primaryRole = 'ADMIN';
      verificationStatus = 'APPROVED';
      subscriptionTier = 'PREMIUM';
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: primaryRole as any,
        // Admin gets all possible roles
        selectedRoles: isDefaultAdmin ? ['FAN', 'ARTIST', 'MERCHANT', 'INFLUENCER'] : selectedRoles,
        subscriptionTier: subscriptionTier,
        artistName: data.artistName ?? null,
        verificationStatus: verificationStatus as any
      }
    });

    // Handle Referral
    if (data.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode }
      });

      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: user.id
          }
        });
      }
    }

    // send verification token (best-effort)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.token.create({ data: { token, type: 'VERIFICATION', userId: user.id, expiresAt } });
    try {
      const verifyUrl = `${env.NEXTAUTH_URL}/verify?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: 'Verify your SoundSync account',
        text: `Verify your account: ${verifyUrl}`,
        html: `<p>Verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`
      });
    } catch (e) {
      console.error('Email send failed:', e);
    }

    return NextResponse.json({ success: true, user: { id: user.id, roles: selectedRoles, subscriptionTier: user.subscriptionTier } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
