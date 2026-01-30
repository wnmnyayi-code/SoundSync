import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET all public tracks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isPublic: true,
    }

    if (genre) {
      where.genre = genre
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { artist: { contains: search, mode: 'insensitive' } },
      ]
    }

    const tracks = await prisma.track.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.track.count({ where })

    return NextResponse.json({
      tracks,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Get tracks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new track
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has ARTIST role
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: session.user.id,
        role: 'ARTIST',
        isActive: true,
      },
    })

    if (userRoles.length === 0) {
      return NextResponse.json(
        { error: 'Artist role required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      artist,
      genre,
      bpm,
      key,
      duration,
      originalFile,
      coverArt,
      fileSize,
      format,
      price,
      isPublic,
    } = body

    if (!title || !artist || !originalFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const track = await prisma.track.create({
      data: {
        userId: session.user.id,
        title,
        artist,
        genre,
        bpm,
        key,
        duration,
        originalFile,
        coverArt,
        fileSize,
        format,
        price: price || 0,
        isPublic: isPublic !== false,
      },
    })

    return NextResponse.json({ track }, { status: 201 })
  } catch (error) {
    console.error('Create track error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
