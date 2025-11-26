// app/api/user/profile/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
// use the generic export which is compatible in App Router contexts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch minimal user fields to avoid failing when relations differ between environments
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        selectedRoles: true,
        subscriptionTier: true,
        artistName: true,
        coinBalance: true,
        verificationStatus: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Safe counts (avoid requiring specific includes)
    const playlistCount = await prisma.playlist.count({ where: { creatorId: user.id } })
    const liveSessionCount = await prisma.session.count({
      where: { creatorId: user.id, status: 'LIVE' },
    })
    const followingCount = await prisma.follow.count({ where: { followerId: user.id } })
    const productCount = await prisma.merchandise.count({ where: { creatorId: user.id } })
    const referralCount = await prisma.referral.count({ where: { referrerId: user.id } })

    // Parse selectedRoles if it's a string (though Prisma usually handles Json as object)
    // But in the seed it was string array.
    // In the interface it's Json?.
    let roles: string[] = []
    if (Array.isArray(user.selectedRoles)) {
      roles = user.selectedRoles as string[]
    } else if (user.role) {
      roles = [user.role]
    }

    const responseUser = {
      id: user.id,
      email: user.email,
      primaryRole: user.role,
      roles: roles,
      subscriptionTier: user.subscriptionTier ?? null,
      artistName: user.artistName ?? null,
      coins: user.coinBalance ?? 0,
      verified: user.verificationStatus === 'APPROVED',
      playlistCount,
      liveSessionCount,
      followingCount,
      productCount,
      referralCount,
    }

    return NextResponse.json({ user: responseUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
