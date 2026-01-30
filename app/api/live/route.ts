import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET all live sessions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // SCHEDULED, LIVE, ENDED

    const where: any = {}

    if (status) {
      where.status = status
    } else {
      // By default, show upcoming and live sessions
      where.status = {
        in: ['SCHEDULED', 'LIVE'],
      }
    }

    const parties = await prisma.liveParty.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        rsvps: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    })

    return NextResponse.json({ parties })
  } catch (error) {
    console.error('Get live sessions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new live session
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has ARTIST role
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: session.user.id,
        role: 'ARTIST',
        isActive: true,
      },
    })

    if (userRoles.length === 0) {
      return NextResponse.json(
        { error: 'Artist role required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, scheduledAt, rsvpPrice, maxAttendees } = body

    if (!title || !scheduledAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const party = await prisma.liveParty.create({
      data: {
        userId: session.user.id,
        title,
        description,
        scheduledAt: new Date(scheduledAt),
        rsvpPrice: rsvpPrice || 0,
        maxAttendees,
        status: 'SCHEDULED',
      },
    })

    return NextResponse.json({ party }, { status: 201 })
  } catch (error) {
    console.error('Create live session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
