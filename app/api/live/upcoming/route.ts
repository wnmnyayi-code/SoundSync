import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Get upcoming live sessions
    const sessions = await prisma.liveSession.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          gte: new Date()
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            artistName: true,
            email: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      take: 20
    })

    return NextResponse.json({
      sessions: sessions.map((s: any) => ({
        id: s.id,
        artistId: s.creatorId,
        artistName: s.creator.artistName || s.creator.email,
        title: s.title,
        description: s.description,
        scheduledAt: s.scheduledAt.toISOString(),
        rsvpPrice: s.rsvpPrice,
        maxAttendees: s.maxAttendees,
        currentAttendees: s.currentAttendees,
        status: s.status
      })),
      totalCount: sessions.length
    })
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'