import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Check if session exists and has capacity
    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId }
    })

    if (!liveSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (liveSession.currentAttendees >= liveSession.maxAttendees) {
      return NextResponse.json(
        { error: 'Session is full' },
        { status: 400 }
      )
    }

    // Create RSVP
    await prisma.rSVP.create({
      data: {
        userId: session.user.id,
        sessionId,
        status: 'CONFIRMED'
      }
    })

    // Increment attendee count
    await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        currentAttendees: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'RSVP confirmed',
      sessionId
    })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Failed to process RSVP' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'