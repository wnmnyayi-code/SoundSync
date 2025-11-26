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

        const [liveSessions, playlists, totalTracks] = await Promise.all([
            prisma.session.count({ where: { creatorId: user.id } }),
            prisma.playlist.count({ where: { creatorId: user.id } }),
            prisma.track.count({ where: { creatorId: user.id } })
        ]);

        return NextResponse.json({
            liveSessions,
            playlists,
            totalTracks,
            coins: user.coins
        });
    } catch (error) {
        console.error('Error fetching artist stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
