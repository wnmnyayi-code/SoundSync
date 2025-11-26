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

    const { sessionId, targetUserId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Determine who the RSVP is for
    let fanId = session.user.id
    if (targetUserId) {
      // Verify target user exists
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
      if (!targetUser) {
        return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
      }
      fanId = targetUserId
    }

    // Check if session exists and has capacity
    const liveSession = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    if (!liveSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (liveSession.attendees >= liveSession.maxAttendees) {
      return NextResponse.json(
        { error: 'Session is full' },
        { status: 400 }
      )
    }

    // Check if fan already RSVPed
    const existingRsvp = await prisma.rSVP.findFirst({
      where: {
        sessionId,
        fanId: fanId
      }
    })

    if (existingRsvp) {
      return NextResponse.json(
        { error: targetUserId ? 'User already has an RSVP' : 'You have already RSVPed to this session' },
        { status: 400 }
      )
    }

    // Check payer balance and deduct coins if price > 0
    if (liveSession.rsvpPriceCoins > 0) {
      const payer = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coinBalance: true }
      })

      if (!payer || payer.coinBalance < liveSession.rsvpPriceCoins) {
        return NextResponse.json(
          { error: 'Insufficient coins' },
          { status: 400 }
        )
      }

      // Deduct coins from payer
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          coinBalance: {
            decrement: liveSession.rsvpPriceCoins
          }
        }
      })

      // Record transaction
      await prisma.coinTransaction.create({
        data: {
          userId: session.user.id,
          type: targetUserId ? 'GIFT_RSVP' : 'RSVP',
          amount: -liveSession.rsvpPriceCoins,
          relatedId: sessionId,
          vatAmount: 0 // VAT disabled for now
        }
      })
    }

    // Create RSVP
    await prisma.rSVP.create({
      data: {
        fanId: fanId,
        sessionId,
        amountPaid: liveSession.rsvpPriceCoins
      }
    })

    // Increment attendee count
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        attendees: {
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