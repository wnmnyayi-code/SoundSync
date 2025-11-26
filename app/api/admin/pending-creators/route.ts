import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Ensure only admins can access
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (currentUser?.subscriptionTier !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
        role: true,
        selectedRoles: true,
      },
    });

    const formattedCreators = pendingCreators.map(creator => ({
      ...creator,
      roles: Array.isArray(creator.selectedRoles) ? creator.selectedRoles : [creator.role]
    }));

    return NextResponse.json({ pendingCreators: formattedCreators });
  } catch (err) {
    console.error('Pending creators API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

