import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { phoneNumber, message, trackId, sessionId } = await req.json()

    // Log share activity
    // In production, this would integrate with WhatsApp Business API
    // For now, we generate a WhatsApp Web link
    
    const whatsappUrl = phoneNumber
      ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`

    return NextResponse.json({
      success: true,
      data: {
        whatsappUrl,
        message: 'WhatsApp share link generated'
      }
    })
  } catch (error) {
    console.error('WhatsApp share error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate share link'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'