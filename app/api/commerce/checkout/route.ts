import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

import prisma from '@/lib/prisma'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any,
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { items } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user?.email! },
            include: { referredBy: true }
        })

        if (!user) return new NextResponse('User not found', { status: 404 })

        if (!items || items.length === 0) {
            return new NextResponse('Cart is empty', { status: 400 })
        }

        const lineItems = []
        const errors = []

        // Verify inventory and build line items
        for (const item of items) {
            const product = await prisma.merchandise.findUnique({
                where: { id: item.productId }
            })

            if (!product) {
                errors.push(`Product ${item.title} not found`)
                continue
            }

            // Check inventory for physical items
            if (product.category !== 'DIGITAL' && product.category !== 'SOFTWARE') {
                if (product.inventory < item.quantity) {
                    errors.push(`Not enough stock for ${item.title} (Available: ${product.inventory})`)
                    continue
                }
            }

            lineItems.push({
                price_data: {
                    currency: 'zar',
                    product_data: {
                        name: item.title,
                        images: item.image ? [item.image] : [],
                        metadata: {
                            productId: item.productId,
                            sellerId: item.sellerId,
                            category: item.category
                        }
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects cents
                },
                quantity: item.quantity,
            })
        }

        if (errors.length > 0) {
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
        }

        // Create Stripe Checkout Session
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/merchandise`,
            metadata: {
                userId: user.email!, // Using email as ID for now if user ID not available in session
                type: 'MERCHANDISE_PURCHASE',
                referrerId: user.referredBy?.referrerId || '' // Pass referrer ID to webhook
            }
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error('[CHECKOUT_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
