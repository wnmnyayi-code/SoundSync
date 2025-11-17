import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { ApiResponse } from '@/types/api'

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
      select: {
        facebookUrl: true,
        twitterUrl: true,
        instagramUrl: true,
        tiktokUrl: true,
        youtubeUrl: true,
        whatsappNumber: true,
        socialAccounts: {
          select: {
            platform: true,
            username: true,
            followers: true,
            isActive: true,
            accountId: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        links: {
          facebookUrl: user?.facebookUrl || '',
          twitterUrl: user?.twitterUrl || '',
          instagramUrl: user?.instagramUrl || '',
          tiktokUrl: user?.tiktokUrl || '',
          youtubeUrl: user?.youtubeUrl || '',
          whatsappNumber: user?.whatsappNumber || ''
        },
        accounts: user?.socialAccounts || []
      }
    })
  } catch (error) {
    console.error('Social accounts error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch social accounts'
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { links } = await req.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        facebookUrl: links.facebookUrl,
        twitterUrl: links.twitterUrl,
        instagramUrl: links.instagramUrl,
        tiktokUrl: links.tiktokUrl,
        youtubeUrl: links.youtubeUrl,
        whatsappNumber: links.whatsappNumber
      }
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Social media links updated successfully' }
    })
  } catch (error) {
    console.error('Social accounts error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update social accounts'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'