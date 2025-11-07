'use server'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const userId = session.user.id

    const [tracks, followers, earnings, totalRevenue] = await Promise.all([
      prisma.track.count({ where: { userId } }),
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.transaction.aggregate({
        where: {
          creatorId: userId,
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.transaction.aggregate({
        where: {
          creatorId: userId
        },
        _sum: {
          amount: true
        }
      })
    ])

    return NextResponse.json({
      tracks,
      followers,
      monthlyEarnings: earnings._sum.amount || 0,
      totalRevenue: totalRevenue._sum.amount || 0
    })
  } catch (error) {
    console.error('Failed to fetch creator stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}