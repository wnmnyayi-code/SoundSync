import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const followSchema = z.object({
    targetUserId: z.string()
})

// Follow a user
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { targetUserId } = followSchema.parse(body)

        // Prevent self-follow
        if (targetUserId === session.user.id) {
            return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId
                }
            }
        })

        if (existingFollow) {
            return NextResponse.json({ error: 'Already following this user' }, { status: 400 })
        }

        // Create follow relationship
        const follow = await prisma.follow.create({
            data: {
                followerId: session.user.id,
                followingId: targetUserId
            },
            include: {
                following: {
                    select: {
                        id: true,
                        artistName: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json({ success: true, data: follow })
    } catch (error) {
        console.error('Follow error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to follow user' },
            { status: 500 }
        )
    }
}

// Unfollow a user
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const targetUserId = searchParams.get('targetUserId')

        if (!targetUserId) {
            return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
        }

        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unfollow error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to unfollow user' },
            { status: 500 }
        )
    }
}

// Get followers/following
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId') || session.user.id
        const type = searchParams.get('type') || 'followers' // 'followers' or 'following'

        if (type === 'followers') {
            const followers = await prisma.follow.findMany({
                where: { followingId: userId },
                include: {
                    follower: {
                        select: {
                            id: true,
                            artistName: true,
                            image: true,
                            bio: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            return NextResponse.json({ success: true, data: followers })
        } else {
            const following = await prisma.follow.findMany({
                where: { followerId: userId },
                include: {
                    following: {
                        select: {
                            id: true,
                            artistName: true,
                            image: true,
                            bio: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            return NextResponse.json({ success: true, data: following })
        }
    } catch (error) {
        console.error('Get follows error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get follows' },
            { status: 500 }
        )
    }
}
