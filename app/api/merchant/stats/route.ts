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

        const [totalProducts, totalSales] = await Promise.all([
            prisma.merchandise.count({ where: { creatorId: user.id } }),
            // Simplified sales count - count transaction items related to this seller's products
            // This is complex without a direct relation, let's assume 0 for now or implement if schema supports
            // For now, let's just return 0 for sales as we don't have a direct Order model linked yet or it's complex
            0
        ]);

        return NextResponse.json({
            totalProducts,
            totalSales
        });
    } catch (error) {
        console.error('Error fetching merchant stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
