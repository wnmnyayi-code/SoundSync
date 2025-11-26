import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const [totalReferrals, earnings] = await Promise.all([
            prisma.referral.count({ where: { referrerId: user.id } }),
            // Calculate earnings from CoinTransactions of type REFERRAL_BONUS or similar
            // Assuming we have a way to track this. For now, 0.
            0
        ]);

        return NextResponse.json({
            totalReferrals,
            earnings
        });
    } catch (error) {
        console.error('Error fetching influencer stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
