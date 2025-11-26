import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminOnly } from '@/lib/middleware/admin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const decoded = await adminOnly(req);
  if (decoded instanceof NextResponse) return decoded;

  const data = await req.json();
  const session = await prisma.session.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ success: true, session });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const decoded = await adminOnly(req);
  if (decoded instanceof NextResponse) return decoded;

  await prisma.session.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export const runtime = 'nodejs';
