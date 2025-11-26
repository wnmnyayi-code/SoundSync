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

    const sessions = await prisma.session.findMany({
      where: { creatorId: userId },
      include: { rsvps: true }
    });

    return NextResponse.json({ success: true, sessions });

  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 401 });
  }
}

// RSVP to a session
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET!) as any;
    const userId = decoded.userId ?? decoded.id;
    if (!userId) throw new Error('Unauthorized');

    const { sessionId, amountPaid } = await req.json();

    const rsvp = await prisma.rSVP.create({
      data: {
        sessionId,
        fanId: userId,
        amountPaid
      }
    });

    // Update attendees count
    await prisma.session.update({
      where: { id: sessionId },
      data: { attendees: { increment: 1 } }
    });

    return NextResponse.json({ success: true, rsvp });

  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 401 });
  }
}

export const runtime = 'nodejs';
