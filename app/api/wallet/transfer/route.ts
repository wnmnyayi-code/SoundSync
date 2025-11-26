import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const transferSchema = z.object({
    recipientEmail: z.string().email(),
    amount: z.number().int().positive(),
    message: z.string().optional()
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { recipientEmail, amount, message } = transferSchema.parse(body)

        if (recipientEmail === session.user.email) {
            return NextResponse.json({ success: false, error: 'Cannot transfer to yourself' }, { status: 400 })
        }

        // Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get sender
            const sender = await tx.user.findUnique({ where: { id: session.user.id } })
            if (!sender || sender.coinBalance < amount) {
                throw new Error('Insufficient funds')
            }

            // 2. Get recipient
            const recipient = await tx.user.findUnique({ where: { email: recipientEmail } })
            if (!recipient) {
                throw new Error('Recipient not found')
            }

            // 3. Deduct from sender
            await tx.user.update({
                where: { id: sender.id },
                data: { coinBalance: { decrement: amount } }
            })

            // 4. Add to recipient
            await tx.user.update({
                where: { id: recipient.id },
                data: { coinBalance: { increment: amount } }
            })

            // 5. Record transactions
            await tx.coinTransaction.create({
                data: {
                    userId: sender.id,
                    type: 'TRANSFER_OUT',
                    amount: -amount,
                    relatedId: recipient.id, // Store recipient ID in relatedId
                }
            })

            await tx.coinTransaction.create({
                data: {
                    userId: recipient.id,
                    type: 'TRANSFER_IN',
                    amount: amount,
                    relatedId: sender.id, // Store sender ID in relatedId
                }
            })

            return { success: true, newBalance: sender.coinBalance - amount }
        })

        return NextResponse.json(result)

    } catch (error) {
        console.error('[TRANSFER_ERROR]', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Transfer failed'
        }, { status: 400 })
    }
}
