import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'af-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('track') as File
    
    // Generate unique key (auto-deleted by lifecycle policy)
    const key = `temp-streams/${session.user.id}/${Date.now()}-${file.name}`
    
    // Create S3 command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: file.type,
      Metadata: {
        'creator-id': session.user.id,
        'original-name': file.name,
        'upload-timestamp': Date.now().toString(),
      },
    })
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import prisma from '@/lib/prisma'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'af-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('track') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique key (auto-deleted by S3 lifecycle policy after 24h)
    const key = `temp-streams/${session.user.id}/${Date.now()}-${file.name}`
    
    // Create S3 command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
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
      uploadUrl,
      key,
      instructions: "Use this URL to upload directly from client"
    })

  } catch (error) {
    console.error('S3 error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}