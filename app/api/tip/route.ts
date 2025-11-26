import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const tipSchema = z.object({
  recipientId: z.string(),
  amount: z.number().int().positive(),
  message: z.string().optional()
})

// Send a tip with optional message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { recipientId, amount, message } = tipSchema.parse(body)

    // Check if user has enough coins
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coinBalance: true }
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

      // Add to recipient
      await tx.user.update({
        where: { id: recipientId },
        data: { coinBalance: { increment: amount } }
      })

      // Record transactions
      await tx.coinTransaction.create({
        data: {
          userId: session.user.id,
          type: 'TIP_SENT',
          amount: -amount,
          relatedId: recipientId
        }
      })

      await tx.coinTransaction.create({
        data: {
          userId: recipientId,
          type: 'TIP_RECEIVED',
          amount: amount,
          relatedId: session.user.id
        }
      })

      // Send message if provided
      if (message) {
        await tx.message.create({
          data: {
            senderId: session.user.id,
            recipientId,
            content: `💰 Sent you ${amount} coins: ${message}`
          }
        })
      }

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Tip error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send tip' },
      { status: 500 }
    )
  }
}
