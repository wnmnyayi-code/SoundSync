import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const COIN_RATES = {
  10: 200,
  25: 500,
  50: 1000,
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amountZar, paymentMethodId } = await req.json()
  
  if (!COIN_RATES[amountZar]) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  try {
    // Calculate amounts (in cents for Stripe)
    const amountInCents = amountZar * 100
    const vatAmountZar = amountZar * 0.15
    const platformFeeZar = amountZar * 0.30
    
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'zar',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        userId: session.user.id,
        coinAmount: COIN_RATES[amountZar],
        type: 'coin_purchase'
      },
      // Add application fee (platform keeps 30%)
      application_fee_amount: Math.round(platformFeeZar * 100),
      transfer_data: {
        destination: process.env.STRIPE_CONNECTED_ACCOUNT_ID!, // Creator payout account
      },
    })

    // Update user wallet
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coinBalance: { increment: COIN_RATES[amountZar] } }
    })

    // Create transaction record
    await prisma.coinTransaction.create({
      data: {
        userId: session.user.id,
        type: 'PURCHASE',
        amount: COIN_RATES[amountZar],
        zarAmount: amountZar,
        vatAmount: vatAmountZar,
      }
    })

    return NextResponse.json({ 
      success: true, 
      coins: COIN_RATES[amountZar],
      paymentIntentId: paymentIntent.id
    })

  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ 
      error: error.message || 'Payment failed' 
    }, { status: 500 })
  }
}