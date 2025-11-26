import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';
import { requireRole } from '@/lib/middleware/role';

export const GET = requireRole('CREATOR')(async (req: Request) => {
  try {
    const token = req.headers.get('authorization')!.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    const tracks = await prisma.track.findMany({ where: { creatorId: decoded.userId } });

    return NextResponse.json({ success: true, tracks });
  } catch (err) {
    console.error('Fetch tracks error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message || 'Server error' }, { status: 500 });
  }
});
