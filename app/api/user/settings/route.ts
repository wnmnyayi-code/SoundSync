import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const settingsSchema = z.object({
    name: z.string().min(2).optional(),
    bio: z.string().max(500).optional(),
    image: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    artistName: z.string().optional().or(z.literal('')),
    facebookUrl: z.string().url().optional().or(z.literal('')),
    twitterUrl: z.string().url().optional().or(z.literal('')),
    instagramUrl: z.string().url().optional().or(z.literal('')),
})

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const validatedData = settingsSchema.parse(body)

        // If user is not a creator, they shouldn't be setting artistName, but we'll allow it for now as it might be part of becoming a creator.
        // Ideally, we check roles.

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...validatedData,
                // If artistName is provided, ensure it updates the artistName field
                artistName: validatedData.artistName || undefined
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('[SETTINGS_UPDATE]', error)
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data', { status: 400 })
        }
        return new NextResponse('Internal Error', { status: 500 })
    }
}
