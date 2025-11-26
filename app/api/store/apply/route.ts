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

        const body = await req.json()
        const { storeType, ficaDocumentUrl } = body

        if (!storeType || !ficaDocumentUrl) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // Update user with store application details
        const user = await prisma.user.update({
            where: { email: session.user?.email! },
            data: {
                storeType: 'NONE', // Remains NONE until approved
                ficaDocumentUrl,
                ficaSubmittedAt: new Date(),
                ficaVerified: false
                // In a real app, we might store the requested storeType in a separate Application model
                // For now, we'll assume the admin sets the correct type upon approval
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error('[STORE_APPLY]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
