'use server'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const userId = session.user.id

    const upcomingSession = await prisma.session.findFirst({
      where: {
        creatorId: userId,
        scheduledAt: {
          gt: new Date()
        },
        status: 'SCHEDULED'
      },
      include: {
        _count: {
          select: { rsvps: true }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    if (!upcomingSession) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: upcomingSession.id,
      scheduledAt: upcomingSession.scheduledAt,
      rsvpPriceCoins: upcomingSession.rsvpPriceCoins,
      maxAttendees: upcomingSession.maxAttendees,
      attendees: upcomingSession.attendees,
      rsvpCount: upcomingSession._count.rsvps
    })
  } catch (error) {
    console.error('Failed to fetch upcoming session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming session' },
      { status: 500 }
    )
  }
}