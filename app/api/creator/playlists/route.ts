'use server'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const userId = session.user.id

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: {
        tracks: true,
        _count: {
          select: { tracks: true }
        }
      }
    })

    const playlistsWithDuration = playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      trackCount: playlist._count.tracks,
      totalDuration: playlist.tracks.reduce((sum, track) => sum + track.duration, 0),
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt
    }))

    return NextResponse.json(playlistsWithDuration)
  } catch (error) {
    console.error('Failed to fetch playlists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    )
  }
}