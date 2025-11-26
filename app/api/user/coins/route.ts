import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    const coins = await prisma.coinTransaction.findMany({ where: { userId: decoded.userId }, orderBy: { createdAt: 'desc' } });

    return NextResponse.json({ success: true, coins });
  } catch (err) {
    console.error('Fetch coins error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message || 'Server error' }, { status: 500 });
  }
}
