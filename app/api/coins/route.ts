import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET!) as any;
    const userId = decoded.userId ?? decoded.id;
    if (!userId) throw new Error('Unauthorized');

    const transactions = await prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, transactions });

  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 401 });
  }
}

// Add or spend coins
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET!) as any;
    const userId = decoded.userId ?? decoded.id;
    if (!userId) throw new Error('Unauthorized');

    const { type, amount, zarAmount, relatedId } = await req.json();

    const transaction = await prisma.coinTransaction.create({
      data: {
        userId,
        type,
        amount,
        zarAmount,
        relatedId
      }
    });

    // Update user coin balance (coinBalance field)
    await prisma.user.update({
      where: { id: userId },
      data: { coinBalance: { increment: amount } }
    });

    return NextResponse.json({ success: true, transaction });

  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 401 });
  }
}

export const runtime = 'nodejs';
