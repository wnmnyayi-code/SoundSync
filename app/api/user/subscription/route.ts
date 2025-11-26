import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    const { subscriptionTier } = await req.json();
    if (!['BASIC','STANDARD','PREMIUM'].includes(subscriptionTier)) {
      return NextResponse.json({ success: false, error: 'Invalid subscription tier' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { subscriptionTier }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        subscriptionTier: user.subscriptionTier
      }
    });

  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
