import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get date ranges for comparison
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      // User metrics
      totalUsers,
      totalCreators,
      totalMerchants,
      totalInfluencers,
      newUsersLast30Days,
      newUsersLast7Days,

      // Content metrics
      totalTracks,
      totalPlaylists,

      // Engagement metrics
      totalFollows,
      totalMessages,
      totalNotifications,

      // Revenue metrics
      totalTransactions,
      totalRevenue,
      revenueLastMonth,

      // Recent activity
      recentUsers,
      recentTracks,

      // Top performers
      topCreators,
      topTracks,

    ] = await Promise.all([
      // User counts
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CREATOR' } }),
      prisma.user.count({ where: { role: 'MERCHANT' } }),
      prisma.user.count({ where: { role: 'INFLUENCER' } }),
      prisma.user.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.user.count({ where: { createdAt: { gte: last7Days } } }),

      // Content counts
      prisma.track.count(),
      prisma.playlist.count(),

      // Engagement counts
      prisma.follow.count(),
      prisma.message.count(),
      prisma.notification.count(),

      // Revenue data
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { createdAt: { gte: last30Days } },
        _sum: { amount: true }
      }),

      // Recent activity
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          artistName: true,
          email: true,
          role: true,
          createdAt: true,
          emailVerified: true,
          isVerified: true
        }
      }),
      prisma.track.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          plays: true,
          user: {
            select: {
              id: true,
              artistName: true
            }
          }
        }
      }),

      // Top performers
      prisma.user.findMany({
        where: { role: 'CREATOR' },
        take: 10,
        orderBy: { coinBalance: 'desc' },
        select: {
          id: true,
          artistName: true,
          coinBalance: true,
          _count: {
            select: {
              tracks: true,
              followers: true
            }
          }
        }
      }),
      prisma.track.findMany({
        take: 10,
        orderBy: { plays: 'desc' },
        select: {
          id: true,
          title: true,
          plays: true,
          likes: true,
          user: {
            select: {
              id: true,
              artistName: true
            }
          }
        }
      }),
    ]);

    // Calculate growth rates
    const userGrowthRate = totalUsers > 0
      ? ((newUsersLast7Days / totalUsers) * 100).toFixed(2)
      : '0';

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCreators,
          totalMerchants,
          totalInfluencers,
          totalTracks,
          totalPlaylists,
        },
        growth: {
          newUsersLast30Days,
          newUsersLast7Days,
          userGrowthRate: parseFloat(userGrowthRate),
        },
        engagement: {
          totalFollows,
          totalMessages,
          totalNotifications,
          avgFollowsPerUser: totalUsers > 0 ? (totalFollows / totalUsers).toFixed(2) : '0',
        },
        revenue: {
          totalTransactions,
          totalRevenue: totalRevenue._sum.amount || 0,
          revenueLastMonth: revenueLastMonth._sum.amount || 0,
          avgTransactionValue: totalTransactions > 0
            ? ((totalRevenue._sum.amount || 0) / totalTransactions).toFixed(2)
            : '0',
        },
        topCreators: topCreators.map((creator: any) => ({
          id: creator.id,
          name: creator.artistName || 'Unknown',
          coinBalance: creator.coinBalance,
          tracks: creator._count.tracks,
          followers: creator._count.followers,
        })),
        topTracks: topTracks.map((track: any) => ({
          id: track.id,
          title: track.title,
          plays: track.plays,
          likes: track.likes,
          creator: {
            id: track.user.id,
            name: track.user.artistName || 'Unknown'
          },
        })),
        recentActivity: {
          users: recentUsers,
          tracks: recentTracks,
        }
      }
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error'
    }, { status: 500 });
  }
}
