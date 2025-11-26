import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function GET(req: Request) {
  const decoded = adminOnly(req as any);
  if (decoded instanceof NextResponse) return decoded;

  const transactions = await prisma.coinTransaction.findMany({
    include: { user: { select: { id: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ success: true, transactions });
}

export const runtime = 'nodejs';
