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

        const user = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            select: { id: true, storeType: true, ficaVerified: true, role: true }
        })

        if (!user || (user.storeType === 'NONE' && user.role !== 'ADMIN')) {
            return new NextResponse('Store required', { status: 403 })
        }

        const body = await req.json()
        const {
            title, description, price, category, condition,
            inventory, deliveryRadius, images, imageUrl, fileUrl
        } = body

        // Server-side validation for FICA requirement
        if ((category === 'PHYSICAL' || category === 'HARDWARE') && !user.ficaVerified) {
            return new NextResponse('FICA verification required for physical items', { status: 403 })
        }

        const product = await prisma.merchandise.create({
            data: {
                title,
                description,
                price,
                category,
                condition,
                inventory,
                deliveryRadius,
                images,
                imageUrl,
                fileUrl,
                creatorId: user.id
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('[PRODUCT_CREATE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
