import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { calculateRevenueShare } from '@/lib/utils'

export async function POST(
  request: Request,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const partyId = params.id

    // Get party details
    const party = await prisma.liveParty.findUnique({
      where: { id: partyId },
      include: {
        user: true,
        rsvps: true,
      },
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    // Check if already RSVP'd
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_partyId: {
          userId: session.user.id,
          partyId: partyId,
        },
      },
    })

    if (existingRSVP) {
      return NextResponse.json(
        { error: 'Already RSVP\'d to this party' },
        { status: 400 }
      )
    }

    // Check if party is full
    if (party.maxAttendees && party.rsvps.length >= party.maxAttendees) {
      return NextResponse.json({ error: 'Party is full' }, { status: 400 })
    }

    // Get user's coin balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.coinBalance < party.rsvpPrice) {
      return NextResponse.json(
        { error: 'Insufficient coins' },
        { status: 400 }
      )
    }

    // Create RSVP and process payment
    const result = await prisma.$transaction(async (tx) => {
      // Deduct coins from user
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          coinBalance: {
            decrement: party.rsvpPrice,
          },
        },
      })

      // Create RSVP
      const rsvp = await tx.rSVP.create({
        data: {
          userId: session.user.id,
          partyId: partyId,
          paidAmount: party.rsvpPrice,
        },
      })

      // Update party attendee count
      await tx.liveParty.update({
        where: { id: partyId },
        data: {
          attendeeCount: {
            increment: 1,
          },
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: 'RSVP',
          amount: party.rsvpPrice,
          status: 'COMPLETED',
          description: `RSVP for ${party.title}`,
        },
      })

      // Calculate and record earnings
      const amountInZAR = party.rsvpPrice * 0.05 // R0.05 per coin
      const revenueShare = calculateRevenueShare(amountInZAR, false)

      await tx.earning.create({
        data: {
          userId: party.userId,
          type: 'RSVP',
          amount: revenueShare.artist,
          source: `RSVP: ${party.title}`,
          status: 'AVAILABLE',
        },
      })

      return rsvp
    })

    return NextResponse.json({
      rsvp: result,
      message: 'RSVP successful',
    })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
