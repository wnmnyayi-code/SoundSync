import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Verify admin status
        const admin = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            select: { role: true }
        })

        if (admin?.role !== 'ADMIN') {
            return new NextResponse('Forbidden', { status: 403 })
        }

        const body = await req.json()
        const { userId, approved, storeType } = body

        if (!userId || approved === undefined) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // Update user status
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ficaVerified: approved,
                storeType: approved ? storeType : 'NONE',
                // If rejected, we might want to clear ficaSubmittedAt so they can reapply
                ficaSubmittedAt: approved ? undefined : null
            }
        })

        // TODO: Send email notification to user

        return NextResponse.json(user)
    } catch (error) {
        console.error('[ADMIN_FICA_VERIFY]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
