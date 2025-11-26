import { PrismaClient, ProductCategory, ProductCondition } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MerchandiseBrowseView } from './MerchandiseBrowseView'

import prisma from '@/lib/prisma'

export default async function MerchandisePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getServerSession(authOptions)

    const category = typeof searchParams.category === 'string' ? searchParams.category as ProductCategory : undefined
    const condition = typeof searchParams.condition === 'string' ? searchParams.condition as ProductCondition : undefined
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
    const sellerType = typeof searchParams.sellerType === 'string' ? searchParams.sellerType : undefined

    const where: any = {}

    if (category) where.category = category
    if (condition) where.condition = condition
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ]
    }

    // Filter by seller type
    if (sellerType === 'soundsync') {
        where.seller = { role: 'ADMIN' } // Assuming SoundSync official store is run by admins
    } else if (sellerType === 'artist') {
        where.seller = { role: 'CREATOR' }
    } else if (sellerType === 'merchant') {
        where.seller = { role: 'USER', storeType: { not: 'NONE' } } // Merchants are users with stores
    }

    const products = await prisma.merchandise.findMany({
        where,
        include: {
            seller: {
                select: {
                    name: true,
                    image: true,
                    role: true,
                    storeType: true,
                    ficaVerified: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <MerchandiseBrowseView
            products={products}
            initialFilters={{ category, condition, search, sellerType }}
        />
    )
}
