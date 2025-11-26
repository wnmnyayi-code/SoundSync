import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function GET(req: Request) {
  const decoded = adminOnly(req as any);
  if (decoded instanceof NextResponse) return decoded;

  const sessions = await prisma.session.findMany({
    include: { creator: { select: { id: true, email: true, artistName: true } }, rsvps: true },
    orderBy: { scheduledAt: 'desc' }
  });

  return NextResponse.json({ success: true, sessions });
}

export const runtime = 'nodejs';
