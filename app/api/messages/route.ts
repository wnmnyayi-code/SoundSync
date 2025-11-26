import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const messageSchema = z.object({
    recipientId: z.string(),
    content: z.string().min(1).max(1000)
})

// Send a message
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { recipientId, content } = messageSchema.parse(body)

        // Prevent messaging yourself
        if (recipientId === session.user.id) {
            return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
        }

        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                recipientId,
                content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        artistName: true,
                        image: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        artistName: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json({ success: true, data: message })
    } catch (error) {
        console.error('Send message error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send message' },
            { status: 500 }
        )
    }
}

// Get messages (conversation)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const otherUserId = searchParams.get('userId')

        if (!otherUserId) {
            // Get all conversations
            const conversations = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: session.user.id },
                        { recipientId: session.user.id }
                    ]
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            artistName: true,
                            image: true
                        }
                    },
                    recipient: {
                        select: {
                            id: true,
                            artistName: true,
                            image: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 50
            })

            return NextResponse.json({ success: true, data: conversations })
        } else {
            // Get conversation with specific user
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: session.user.id, recipientId: otherUserId },
                        { senderId: otherUserId, recipientId: session.user.id }
                    ]
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            artistName: true,
                            image: true
                        }
                    }
                },
                orderBy: { createdAt: 'asc' }
            })

            // Mark messages as read
            await prisma.message.updateMany({
                where: {
                    senderId: otherUserId,
                    recipientId: session.user.id,
                    read: false
                },
                data: { read: true }
            })

            return NextResponse.json({ success: true, data: messages })
        }
    } catch (error) {
        console.error('Get messages error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get messages' },
            { status: 500 }
        )
    }
}
