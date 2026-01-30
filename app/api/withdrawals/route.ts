import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET withdrawal history
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ withdrawals })
  } catch (error) {
    console.error('Get withdrawals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST request withdrawal
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, bankName, accountNumber, accountHolder } = body

    if (!amount || !bankName || !accountNumber || !accountHolder) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const MINIMUM_WITHDRAWAL = 1000

    if (amount < MINIMUM_WITHDRAWAL) {
      return NextResponse.json(
        { error: `Minimum withdrawal is R${MINIMUM_WITHDRAWAL}` },
        { status: 400 }
      )
    }

    // Calculate available balance
    const earnings = await prisma.earning.aggregate({
      where: {
        userId: session.user.id,
        status: 'AVAILABLE',
      },
      _sum: {
        amount: true,
      },
    })

    const availableBalance = earnings._sum.amount || 0

    if (amount > availableBalance) {
      return NextResponse.json(
        { error: 'Insufficient available balance' },
        { status: 400 }
      )
    }

    // Create withdrawal request
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Create withdrawal
      const newWithdrawal = await tx.withdrawal.create({
        data: {
          userId: session.user.id,
          amount,
          bankName,
          accountNumber,
          accountHolder,
          status: 'PENDING',
        },
      })

      // Mark earnings as withdrawn
      await tx.earning.updateMany({
        where: {
          userId: session.user.id,
          status: 'AVAILABLE',
        },
        data: {
          status: 'WITHDRAWN',
        },
      })

      return newWithdrawal
    })

    return NextResponse.json({
      withdrawal,
      message: 'Withdrawal request submitted successfully',
    })
  } catch (error) {
    console.error('Withdrawal request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
