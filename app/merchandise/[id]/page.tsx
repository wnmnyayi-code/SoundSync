import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProductDetailView } from './ProductDetailView'
import { notFound } from 'next/navigation'

import prisma from '@/lib/prisma'

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)

    const product = await prisma.merchandise.findUnique({
        where: { id: params.id },
        include: {
            seller: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                    storeType: true,
                    ficaVerified: true,
                    bio: true
                }
            }
        }
    })

    if (!product) {
        notFound()
    }

    // Fetch related products from same seller
    const relatedProducts = await prisma.merchandise.findMany({
        where: {
            sellerId: product.sellerId,
            id: { not: product.id }
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
            seller: {
                select: {
                    name: true,
                    ficaVerified: true
                }
            }
        }
    })

    return (
        <ProductDetailView
            product={product}
            relatedProducts={relatedProducts}
        />
    )
}
