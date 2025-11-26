import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPresignedUploadUrl } from '@/lib/s3'
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

        const { filename, contentType, folder } = await req.json()

        if (!filename || !contentType) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: filename, contentType'
            }, { status: 400 })
        }

        // Validate content type
        const allowedTypes = [
            'audio/mpeg',
            'audio/mp4',
            'audio/wav',
            'audio/flac',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ]

        if (!allowedTypes.includes(contentType)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid content type'
            }, { status: 400 })
        }

        // Determine folder based on content type if not provided
        let uploadFolder = folder || 'uploads'
        if (contentType.startsWith('audio/')) {
            uploadFolder = 'audio'
        } else if (contentType.startsWith('image/')) {
            uploadFolder = 'images'
        }

        // Get presigned URL
        const { url, key } = await getPresignedUploadUrl(
            filename,
            contentType,
            uploadFolder,
            3600 // 1 hour expiry
        )

        return NextResponse.json({
            success: true,
            data: {
                uploadUrl: url,
                fileKey: key,
                expiresIn: 3600
            }
        })
    } catch (error) {
        console.error('Presigned URL error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate upload URL'
        }, { status: 500 })
    }
}

export const runtime = 'nodejs'
