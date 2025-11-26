import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/lib/env'
import type { ApiResponse, UploadResponse } from '@/types/api'

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<UploadResponse>>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const formData = await req.formData()
    const file = (formData.get('file') || formData.get('track')) as File
    const type = formData.get('type') as string || 'track' // 'track' or 'image'

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Generate unique key (auto-deleted by S3 lifecycle policy after 24h)
    const prefix = type === 'image' ? 'images' : 'temp-streams'
    const key = `${prefix}/${session.user.id}/${Date.now()}-${file.name}`

    // Create S3 command
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: file.type,
      Metadata: {
        'creator-id': session.user.id,
        'original-name': file.name,
        'verified': 'false', // Admin will verify
      },
    })

    // Generate presigned URL (valid for 5 minutes)
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl,
        key,
        instructions: "Use this URL to upload directly from client"
      }
    })

  } catch (error) {
    console.error('S3 error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'