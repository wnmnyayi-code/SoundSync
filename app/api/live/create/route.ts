import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { scheduledAt, rsvpPriceCoins, maxAttendees } = await req.json()

  // Create session
  const sessionRecord = await prisma.session.create({
    data: {
      creatorId: session.user.id,
      scheduledAt: new Date(scheduledAt),
      rsvpPriceCoins,
      maxAttendees,
    }
  })

  return NextResponse.json({
    success: true,
    sessionId: sessionRecord.id,
  })
}