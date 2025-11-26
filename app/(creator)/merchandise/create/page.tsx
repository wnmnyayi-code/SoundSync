import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { CreateProductForm } from './CreateProductForm'

import prisma from '@/lib/prisma'

export default async function CreateProductPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login?callbackUrl=/merchandise/create')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
        select: {
            id: true,
            storeType: true,
            ficaVerified: true,
            role: true
        }
    })

    // Check if user has a store or is admin
    const hasStore = user?.storeType !== 'NONE' || user?.role === 'ADMIN'

    if (!hasStore) {
        redirect('/store/apply')
    }

    return <CreateProductForm ficaVerified={user?.ficaVerified || false} />
}
