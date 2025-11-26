'use server'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

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

    const [tracks, playlists, coinTransactions] = await Promise.all([
      prisma.track.count({ where: { creatorId: userId } }),
      prisma.playlist.count({ where: { creatorId: userId } }),
      prisma.coinTransaction.findMany({
        where: {
          userId: userId,
          type: { in: ['TIP', 'RSVP'] }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    // Calculate earnings from coin transactions
    const monthlyEarnings = coinTransactions
      .filter(t => {
        const transactionDate = new Date(t.createdAt)
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return transactionDate >= oneMonthAgo
      })
      .reduce((sum, t) => sum + (t.zarAmount || 0), 0)

    const totalRevenue = coinTransactions
      .reduce((sum, t) => sum + (t.zarAmount || 0), 0)

    return NextResponse.json({
      tracks,
      playlists,
      followers: 0, // TODO: Add follow system
      monthlyEarnings,
      totalRevenue
    })
  } catch (error) {
    console.error('Failed to fetch creator stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}