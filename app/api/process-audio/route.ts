import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { queueAudioProcessing } from '@/lib/audio-queue'
import prisma from '@/lib/prisma'
import type { ApiResponse } from '@/types/api'

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { trackId } = await req.json()

    // Get track details
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: { creator: true }
    })

    if (!track) {
      return NextResponse.json({
        success: false,
        error: 'Track not found'
      }, { status: 404 })
    }

    if (track.creatorId !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 403 })
    }

    // Get user's audio settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { audioSettings: true }
    })

    const settings = user?.audioSettings as any || {
      preset: 'moderate',
      targetLUFS: -14,
      outputFormat: 'mp3'
    }

    // Queue processing job
    await queueAudioProcessing({
      trackId: track.id,
      originalFileKey: track.fileKey,
      userId: session.user.id,
      options: {
        preset: settings.preset,
        targetLUFS: settings.targetLUFS,
        outputFormat: settings.outputFormat
      }
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Audio processing queued' }
    })
  } catch (error) {
    console.error('Process audio error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to queue processing'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'