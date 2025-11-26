import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const giftSchema = z.object({
    sessionId: z.string(),
    giftType: z.string(),
    amount: z.number().int().positive()
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { sessionId, giftType, amount } = giftSchema.parse(body)

        // Fetch session to get creator
        const liveSession = await prisma.session.findUnique({
            where: { id: sessionId },
            select: { creatorId: true }
        })

        if (!liveSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        const creatorId = liveSession.creatorId

        // Check if user has enough coins
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coinBalance: true, artistName: true, email: true } // Get name for notification
        })

        if (!user || user.coinBalance < amount) {
            return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 })
        }

        // Perform transaction
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from sender
            await tx.user.update({
                where: { id: session.user.id },
                data: { coinBalance: { decrement: amount } }
            })

            // Add to creator
            await tx.user.update({
                where: { id: creatorId },
                data: { coinBalance: { increment: amount } }
            })

            // Record transactions
            await tx.coinTransaction.create({
                data: {
                    userId: session.user.id,
                    type: 'GIFT_SENT',
                    amount: -amount,
                    relatedId: creatorId
                }
            })

            await tx.coinTransaction.create({
                data: {
                    userId: creatorId,
                    type: 'GIFT_RECEIVED',
                    amount: amount,
                    relatedId: session.user.id
                }
            })

            // Create Notification for creator
            const senderName = user.artistName || user.email?.split('@')[0] || 'A fan'
            await tx.notification.create({
                data: {
                    userId: creatorId,
                    type: 'GIFT',
                    message: `${senderName} sent you a ${giftType} (${amount} coins)!`,
                    relatedId: sessionId,
                    read: false
                }
            })

            return { success: true, newBalance: user.coinBalance - amount }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Gift error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send gift' },
            { status: 500 }
        )
    }
}
