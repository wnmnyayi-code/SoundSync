import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface VerifyRequestBody {
  creatorId: string;
  action: 'APPROVE' | 'REJECT';
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (currentUser?.subscriptionTier !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: VerifyRequestBody = await req.json();
    if (!body.creatorId || !['APPROVE', 'REJECT'].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updatedCreator = await prisma.user.update({
      where: { id: body.creatorId },
      data: {
        verificationStatus:
          body.action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
      },
    });

    return NextResponse.json({
      success: true,
      creator: {
        id: updatedCreator.id,
        email: updatedCreator.email,
        verificationStatus: updatedCreator.verificationStatus,
      },
    });
  } catch (err) {
    console.error('Verify creator API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
