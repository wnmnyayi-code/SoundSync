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
            where: { email: session.user.email },
            select: { subscriptionTier: true }
        });

        if (user?.subscriptionTier !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [totalUsers, pendingApprovals, verifiedCreators] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { verificationStatus: 'PENDING', role: 'CREATOR' } }),
            prisma.user.count({ where: { verificationStatus: 'APPROVED', role: 'CREATOR' } })
        ]);

        // Calculate platform revenue (simplified for now - sum of all coin purchases)
        // In a real app, this would be more complex (e.g. sum of transaction fees + coin sales)
        // For now, let's just sum coin purchases in ZAR if we have that field, or just return 0
        const revenueResult = await prisma.coinTransaction.aggregate({
            where: { type: 'PURCHASE' },
            _sum: { zarAmount: true }
        });

        const totalRevenue = revenueResult._sum.zarAmount || 0;

        return NextResponse.json({
            totalUsers,
            pendingApprovals,
            verifiedCreators,
            totalRevenue
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
