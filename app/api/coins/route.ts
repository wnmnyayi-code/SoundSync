import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { zarToCoins } from '@/lib/utils'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount } = body // Amount in ZAR

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Minimum purchase is R10' },
        { status: 400 }
      )
    }

    if (amount > 10000) {
      return NextResponse.json(
        { error: 'Maximum purchase is R10,000' },
        { status: 400 }
      )
    }

    // Calculate coins
    const coins = zarToCoins(amount)

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'zar',
      metadata: {
        userId: session.user.id,
        coins: coins.toString(),
        type: 'coin_purchase',
      },
    })

    // Create pending transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: 'COIN_PURCHASE',
        amount: coins,
        amountZAR: amount,
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
        description: `Purchase ${coins} coins`,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      transaction,
      coins,
    })
  } catch (error) {
    console.error('Coin purchase error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET coin balance
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        coinBalance: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ balance: user.coinBalance })
  } catch (error) {
    console.error('Get coin balance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
