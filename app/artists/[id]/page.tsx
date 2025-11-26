import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ArtistProfileView from './ArtistProfileView'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ArtistProfilePage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    const { id } = await params

    const artist = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            artistName: true,
            image: true,
            bio: true,
            facebookUrl: true,
            twitterUrl: true,
            instagramUrl: true,
            tiktokUrl: true,
            youtubeUrl: true,
            role: true,
            tracks: {
                where: { processingStatus: 'completed' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    originalName: true,
                    duration: true,
                    image: true,
                    genre: true
                }
            },
            sessions: {
                where: {
                    scheduledAt: { gt: new Date() },
                    status: 'SCHEDULED'
                },
                orderBy: { scheduledAt: 'asc' },
                select: {
                    id: true,
                    scheduledAt: true,
                    rsvpPriceCoins: true
                }
            }
        }
    })

    if (!artist || artist.role !== 'CREATOR') {
        notFound()
    }

    // Check if user has RSVP'd to any of the sessions
    const sessionIds = artist.sessions.map(s => s.id)
    let userRsvps: string[] = []

    if (session?.user?.id) {
        const rsvps = await prisma.rSVP.findMany({
            where: {
                fanId: session.user.id,
                sessionId: { in: sessionIds }
            },
            select: { sessionId: true }
        })
        userRsvps = rsvps.map(r => r.sessionId)
    }

    return (
        <ArtistProfileView
            artist={artist}
            userRsvps={userRsvps}
            currentUserId={session?.user?.id}
        />
    )
}
