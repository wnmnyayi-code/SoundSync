import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Server } from 'socket.io'
import { createWorker } from 'mediasoup'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { scheduledAt, rsvpPriceCoins, maxAttendees } = await req.json()

  // Create MediaSoup worker (run this once at server startup)
  const worker = await createWorker({
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
  })

  const router = await worker.createRouter({
    mediaCodecs: [
      { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },
    ],
  })

  // Create session
  const sessionRecord = await prisma.session.create({
    data: {
      creatorId: session.user.id,
      scheduledAt: new Date(scheduledAt),
      rsvpPriceCoins,
      maxAttendees,
      // Store router info for later
      streamUrl: router.rtpCapabilities as any,
    }
  })

  return NextResponse.json({ 
    success: true, 
    sessionId: sessionRecord.id,
    rtpCapabilities: router.rtpCapabilities 
  })
}