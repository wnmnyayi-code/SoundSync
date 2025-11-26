import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    const tracks = await prisma.track.findMany({
      where: { creatorId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, tracks });

  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 401 });
  }
}

// POST for uploading new track
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    const { filename, originalName, fileKey, genre, isExplicit } = await req.json();

    // Check track limits
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { trackLimit: true }
    });

    if (!user) throw new Error('User not found');

    const trackCount = await prisma.track.count({
      where: { creatorId: decoded.userId }
    });

    if (trackCount >= user.trackLimit) {
      return NextResponse.json(
        { success: false, error: `Track limit reached (${user.trackLimit}). Upgrade your plan to upload more.` },
        { status: 403 }
      );
    }

    const track = await prisma.track.create({
      data: {
        filename,
        originalName,
        fileKey,
        creatorId: decoded.userId,
        genre,
        isExplicit: isExplicit || false
      }
    });

    return NextResponse.json({ success: true, track });

  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 401 });
  }
}

export const runtime = 'nodejs';
