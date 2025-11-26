import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const decoded = adminOnly(req as any);
  if (decoded instanceof NextResponse) return decoded;

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, message: 'User deleted' });
}

export const runtime = 'nodejs';
