import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            select: { id: true, referralCode: true, role: true }
        })

        if (!user) return new NextResponse('User not found', { status: 404 })

        // Only Influencers (and maybe others?) can generate codes
        // For now, let's allow anyone to have a referral code, but only influencers get commission
        // Or strictly enforce role check:
        // if (user.role !== 'INFLUENCER' && user.role !== 'ADMIN') {
        //   return new NextResponse('Only influencers can generate referral codes', { status: 403 })
        // }

        if (user.referralCode) {
            return NextResponse.json({ code: user.referralCode })
        }

        // Generate new code
        // Use username if available, else random
        // For simplicity, let's use a random 8-char string
        const code = nanoid(8)

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { referralCode: code }
        })

        return NextResponse.json({ code: updatedUser.referralCode })
    } catch (error) {
        console.error('[REFERRAL_CODE_GEN]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            select: { referralCode: true }
        })

        return NextResponse.json({ code: user?.referralCode || null })
    } catch (error) {
        console.error('[REFERRAL_CODE_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
