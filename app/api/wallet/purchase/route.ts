import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'
import { env } from '@/lib/env'
import type { PurchaseRequest, PurchaseResponse, ApiResponse } from '@/types/api'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
})

const COIN_RATES: Record<number, number> = {
  10: 200,
  25: 500,
  50: 1000,
} as const

type ValidAmount = keyof typeof COIN_RATES
type StripeError = { error: { message: string } }

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<PurchaseResponse>>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<PurchaseResponse>>({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { amount, paymentMethodId } = await req.json() as { 
      amount: ValidAmount; 
      paymentMethodId: string 
    }

    if (!COIN_RATES[amount]) {
      return NextResponse.json<ApiResponse<PurchaseResponse>>({ 
        success: false,
        error: 'Invalid amount' 
      }, { status: 400 })
    }

    // Calculate amounts (in cents for Stripe)
    const amountInCents = amount * 100
    const vatAmount = amount * 0.15
    const platformFee = amount * 0.30
    
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'zar',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        userId: session.user.id,
        coinAmount: COIN_RATES[amount],
        type: 'coin_purchase'
      },
      application_fee_amount: Math.round(platformFee * 100),
      transfer_data: {
        destination: env.STRIPE_CONNECTED_ACCOUNT_ID,
      },
    })

    // Update user wallet
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coinBalance: { increment: COIN_RATES[amount] } }
    })

    // Create transaction record
    await prisma.coinTransaction.create({
      data: {
        userId: session.user.id,
        type: 'PURCHASE',
        amount: COIN_RATES[amount],
        zarAmount: amount,
        vatAmount,
      }
    })

    const response: ApiResponse<PurchaseResponse> = {
      success: true,
      data: {
        coins: COIN_RATES[amount],
        paymentIntentId: paymentIntent.id
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json<ApiResponse<PurchaseResponse>>({
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    }, { status: 500 })
  }
}