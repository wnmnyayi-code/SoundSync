import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const supportSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long')
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { message } = supportSchema.parse(body)

        const supportMessage = await prisma.supportMessage.create({
            data: {
                userId: session.user.id,
                message,
                status: 'OPEN'
            }
        })

        return NextResponse.json({ success: true, data: supportMessage })
    } catch (error) {
        console.error('Support API Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send message' },
            { status: 400 }
        )
    }
}
