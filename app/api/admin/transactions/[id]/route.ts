import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const decoded = await adminOnly(req);
  if (decoded instanceof NextResponse) return decoded;

  await prisma.coinTransaction.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export const runtime = 'nodejs';
