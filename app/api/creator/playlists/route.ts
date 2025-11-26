import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

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
      where: { creatorId: userId },
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
      isActive: playlist.isActive,
      createdAt: playlist.createdAt,
      coverImage: playlist.coverImage,
      isLiveOnly: playlist.isLiveOnly,
      isEphemeral: playlist.isEphemeral
    }))

    return NextResponse.json(playlistsWithDuration)
  } catch (error) {
    console.error('Failed to fetch playlists:', error)
    return NextResponse.json(
import { getServerSession } from 'next-auth'
    import { NextResponse } from 'next/server'
    import prisma from '@/lib/prisma'
    import { authOptions } from '@/lib/auth'

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
          where: { creatorId: userId },
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
          isActive: playlist.isActive,
          createdAt: playlist.createdAt,
          coverImage: playlist.coverImage,
          isLiveOnly: playlist.isLiveOnly,
          isEphemeral: playlist.isEphemeral
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

    export async function POST(req: Request) {
      const session = await getServerSession(authOptions)

      if (!session || session.user.role !== 'CREATOR') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      try {
        const body = await req.json()
        const { name, description, isLiveOnly, isEphemeral } = body

        const playlist = await prisma.playlist.create({
          data: {
            name,
            creatorId: session.user.id,
            isLiveOnly: isLiveOnly || false,
            isEphemeral: isEphemeral || false,
          }
        })

        return NextResponse.json(playlist)
      } catch (error) {
        console.error('Failed to create playlist:', error)
        return NextResponse.json(
          { error: 'Failed to create playlist' },
          { status: 500 }
        )
      }
    }