import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

    const body = await req.json()
    const { preset, targetLUFS, enableNormalization, enableMastering, outputFormat } = body

    // Save settings to user preferences
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        audioSettings: {
          preset,
          targetLUFS,
          enableNormalization,
          enableMastering,
          outputFormat
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Settings saved successfully' }
    })
  } catch (error) {
    console.error('Audio settings error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save settings'
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { audioSettings: true }
    })

    return NextResponse.json({
      success: true,
      data: user?.audioSettings || {
        preset: 'moderate',
        targetLUFS: -14,
        enableNormalization: true,
        enableMastering: true,
        outputFormat: 'mp3'
      }
    })
  } catch (error) {
    console.error('Audio settings error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch settings'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'