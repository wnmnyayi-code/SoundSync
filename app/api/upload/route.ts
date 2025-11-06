import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('track') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Verify file type
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Must be audio file' }, { status: 400 })
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${session.user.id}-${Date.now()}-${file.name}`
    const path = join(process.cwd(), 'public/uploads', filename)
    
    await writeFile(path, buffer)

    // Create track record (auto-expires in 24h)
    const track = await prisma.track.create({
      data: {
        filename,
        originalName: file.name,
        duration: 0, // Would extract from metadata
        creatorId: session.user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })

    // Auto-delete after 24 hours (simulated)
    setTimeout(async () => {
      try {
        await unlink(path)
        await prisma.track.delete({ where: { id: track.id } })
      } catch (e) {
        console.log('Auto-delete failed:', e)
      }
    }, 24 * 60 * 60 * 1000)

    return NextResponse.json({ success: true, track })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}