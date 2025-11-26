import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { deleteFile } from '@/lib/storage';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Allow Admin or a specific cron secret (if implemented)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find tracks associated with ENDED sessions
        // Note: This assumes sessions are marked as ENDED elsewhere
        const tracksToDelete = await prisma.track.findMany({
            where: {
                session: {
                    status: 'ENDED'
                }
            },
            include: {
                session: true
            }
        });

        const deletedIds: string[] = [];
        const errors: string[] = [];

        for (const track of tracksToDelete) {
            try {
                // Delete file from storage
                if (track.fileKey) {
                    await deleteFile(track.fileKey);
                }

                // Delete track record
                await prisma.track.delete({
                    where: { id: track.id }
                });

                deletedIds.push(track.id);
            } catch (err) {
                console.error(`Failed to delete track ${track.id}:`, err);
                errors.push(`Track ${track.id}: ${(err as Error).message}`);
            }
        }

        return NextResponse.json({
            success: true,
            deletedCount: deletedIds.length,
            deletedIds,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
