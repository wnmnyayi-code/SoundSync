import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'
import { env } from '@/lib/env'
import type { PurchaseResponse, ApiResponse } from '@/types/api'

// Initialize Stripe only if key is present
const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' as any })
  : null

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<PurchaseResponse>>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { price, paymentMethodId, type = 'coins' } = await req.json()

    let coinsAmount = 0
    let isShelfSpace = false

    if (type === 'shelf_space') {
      if (price !== 99) { // Fixed price for Shelf Space for now
        return NextResponse.json({ success: false, error: 'Invalid price for Shelf Space' }, { status: 400 })
      }
      isShelfSpace = true
    } else {
      // Variable Coin Logic
      // Base rate: 20 Coins per ZAR
      // Bonus: If price >= 200, 25 Coins per ZAR
      const rate = price >= 200 ? 25 : 20
      coinsAmount = Math.floor(price * rate)
    }

    if (!stripe) {
      console.warn("Stripe key missing, simulating successful purchase for dev/demo if intended, otherwise error.")
      return NextResponse.json({
        success: false,
        error: "Payment gateway not configured (Missing STRIPE_SECRET_KEY)"
      }, { status: 500 })
    }

    // Calculate amounts (in cents for Stripe)
    const amountInCents = price * 100
    const platformFee = price * 0.30

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'zar',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        userId: session.user.id,
        coinAmount: coinsAmount,
        type: isShelfSpace ? 'shelf_space' : 'coin_purchase'
      },
      application_fee_amount: Math.round(platformFee * 100),
      transfer_data: env.STRIPE_CONNECTED_ACCOUNT_ID ? {
        destination: env.STRIPE_CONNECTED_ACCOUNT_ID,
      } : undefined,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({
        success: false,
        error: `Payment failed with status: ${paymentIntent.status}`
      }, { status: 400 })
    }

    // Update user wallet or limits
    if (isShelfSpace) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          playlistLimit: { increment: 5 },
          trackLimit: { increment: 50 }
        }
      })
    } else {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { coinBalance: { increment: coinsAmount } }
      })
    }

    // Create transaction record
    await prisma.coinTransaction.create({
      data: {
        userId: session.user.id,
        type: isShelfSpace ? 'SHELF_SPACE' : 'PURCHASE',
        amount: isShelfSpace ? 0 : coinsAmount,
        zarAmount: price,
        vatAmount: 0,
      }
    })

    // Fetch user to check for referrer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { referredBy: true }
    })

    // Handle Commission (only for coin purchases for now, or maybe shelf space too? Let's do both)
    if (user?.referredBy) {
      const commissionZar = price * 0.10
      const commissionCoins = Math.floor(commissionZar * 20) // Convert ZAR commission to coins for referrer

      // Update Referrer Balance
      await prisma.user.update({
        where: { id: user.referredBy.referrerId },
        data: { coinBalance: { increment: commissionCoins } }
      })

      // Update Referral Stats
      await prisma.referral.update({
        where: { id: user.referredBy.id },
        data: { totalCommission: { increment: commissionZar } }
      })

      // Record Transaction
      await prisma.coinTransaction.create({
        data: {
          userId: user.referredBy.referrerId,
          type: 'COMMISSION',
          amount: commissionCoins,
          zarAmount: commissionZar,
          relatedId: user.id // Link to the user who made the purchase
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        coins: coinsAmount,
        paymentIntentId: paymentIntent.id
      }
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    }, { status: 500 })
  }
}