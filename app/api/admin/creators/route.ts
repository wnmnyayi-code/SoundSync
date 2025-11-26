import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function GET(req: Request) {
  const decoded = await adminOnly(req);
  if (decoded instanceof NextResponse) return decoded;

  const pendingCreators = await prisma.user.findMany({
    where: {
      role: 'CREATOR',
      verificationStatus: 'PENDING',
    },
    select: {
      id: true,
      email: true,
      artistName: true,
      subscriptionTier: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, pendingCreators });
}

export async function PATCH(req: Request) {
  const decoded = await adminOnly(req);
  if (decoded instanceof NextResponse) return decoded;

  const { userId, approve }: { userId: string; approve: boolean } = await req.json();
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: approve ? 'APPROVED' : 'REJECTED',
    },
  });

  return NextResponse.json({ success: true, user });
}

export const runtime = 'nodejs';
