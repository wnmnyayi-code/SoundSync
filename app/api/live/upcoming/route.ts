import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Get upcoming live sessions
    const sessions = await prisma.session.findMany({
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
        },
        _count: {
          select: { rsvps: true }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      take: 20
    })

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        artistId: s.creatorId,
        artistName: s.creator.artistName || s.creator.email,
        scheduledAt: s.scheduledAt.toISOString(),
        rsvpPrice: s.rsvpPriceCoins,
        maxAttendees: s.maxAttendees,
        currentAttendees: s.attendees,
        rsvpCount: s._count.rsvps,
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