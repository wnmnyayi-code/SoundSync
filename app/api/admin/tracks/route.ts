import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function GET(req: Request) {
  const decoded = adminOnly(req as any);
  if (decoded instanceof NextResponse) return decoded;

  const tracks = await prisma.track.findMany({
    include: { creator: { select: { id: true, email: true, artistName: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ success: true, tracks });
}

export const runtime = 'nodejs';
