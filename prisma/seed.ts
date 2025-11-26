// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import prisma from '../lib/prisma';

async function main() {
  console.log('🌱 Starting database seed...')

  // ===== USERS =====
  const usersData = [
    {
      email: 'admin@soundsync.co.za',
      password: 'SoundSync@Admin2025!',
      role: 'ADMIN' as const,
      subscriptionTier: 'ADMIN' as const,
      artistName: 'SoundSync Official',
      coinBalance: 10000,
      verificationStatus: 'APPROVED' as const,
      selectedRoles: ['FAN', 'ARTIST', 'MERCHANT', 'INFLUENCER'],
    },
    {
      email: 'fan.basic@soundsync.co.za',
      password: 'Password123!',
      role: 'FAN' as const,
      subscriptionTier: 'BASIC' as const,
      artistName: null,
      selectedRoles: ['FAN'],
    },
    {
      email: 'fan.premium@soundsync.co.za',
      password: 'Password123!',
      role: 'FAN' as const,
      subscriptionTier: 'PREMIUM' as const,
      artistName: null,
      selectedRoles: ['FAN', 'ARTIST', 'MERCHANT', 'INFLUENCER'],
    },
    {
      email: 'artist.standard@soundsync.co.za',
      password: 'Password123!',
      role: 'CREATOR' as const,
      subscriptionTier: 'STANDARD' as const,
      artistName: 'Standard Artist',
      selectedRoles: ['ARTIST', 'FAN'],
    },
    {
      email: 'artist.premium@soundsync.co.za',
      password: 'Password123!',
      role: 'CREATOR' as const,
      subscriptionTier: 'PREMIUM' as const,
      artistName: 'Premium Artist',
      selectedRoles: ['FAN', 'ARTIST', 'MERCHANT', 'INFLUENCER'],
    },
  ]

  const userMap: Record<string, any> = {}

  for (const u of usersData) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } })
    if (exists) {
      userMap[u.email] = exists
      continue
    }
    const hashed = bcrypt.hashSync(u.password, 10)
    const user = await prisma.user.create({
      data: {
        email: u.email,
        password: hashed,
        role: u.role,
        artistName: u.artistName ?? undefined,
        coinBalance: u.coinBalance ?? 1000,
        verificationStatus: u.verificationStatus ?? 'APPROVED',
        subscriptionTier: u.subscriptionTier,
        selectedRoles: u.selectedRoles,
      },
    })
    userMap[u.email] = user
  }

  console.log('✅ Users seeded.')

  // ===== PLAYLISTS & TRACKS =====
  const artists = Object.values(userMap).filter(u => u.role === 'CREATOR')

  for (const artist of artists) {
    const playlist = await prisma.playlist.create({
      data: {
        name: `${artist.artistName}'s Playlist`,
        creatorId: artist.id,
      },
    })

    for (let i = 1; i <= 3; i++) {
      await prisma.track.create({
        data: {
          filename: `track-${i}-${artist.id}.mp3`,
          originalName: `Track ${i}`,
          fileKey: `tracks/${artist.id}/track-${i}.mp3`,
          duration: Math.floor(Math.random() * 300) + 60,
          creatorId: artist.id,
          playlistId: playlist.id,
          verified: true,
        },
      })
    }
  }

  console.log('✅ Playlists and tracks seeded.')

  // ===== SESSIONS & RSVPs =====
  const fans = Object.values(userMap).filter(u => u.role === 'FAN')

  for (const artist of artists) {
    for (let i = 1; i <= 2; i++) {
      const session = await prisma.session.create({
        data: {
          creatorId: artist.id,
          scheduledAt: new Date(Date.now() + i * 3600 * 1000),
          rsvpPriceCoins: 50,
          maxAttendees: 50,
        },
      })

      const sessionFans = fans.slice(0, Math.min(fans.length, 3))
      for (const fan of sessionFans) {
        await prisma.rSVP.create({
          data: {
            sessionId: session.id,
            fanId: fan.id,
            amountPaid: 50,
          },
        })
      }
    }
  }

  console.log('✅ Sessions and RSVPs seeded.')

  // ===== MERCHANDISE =====
  for (const artist of artists) {
    for (let i = 1; i <= 2; i++) {
      await prisma.merchandise.create({
        data: {
          creatorId: artist.id,
          title: `${artist.artistName} Merch ${i}`,
          category: i % 2 === 0 ? 'DIGITAL' : 'PHYSICAL',
          condition: 'NEW',
          price: Math.floor(Math.random() * 500) + 50,
          sold: Math.floor(Math.random() * 10),
        },
      })
    }
  }

  console.log('✅ Merchandise seeded.')

  // ===== COIN TRANSACTIONS =====
  for (const fan of fans) {
    await prisma.coinTransaction.create({
      data: {
        userId: fan.id,
        type: 'PURCHASE',
        amount: 500,
        zarAmount: 100,
      },
    })
  }

  console.log('✅ CoinTransactions seeded.')

  // ===== SOCIAL ACCOUNTS =====
  for (const user of Object.values(userMap)) {
    await prisma.socialAccount.createMany({
      data: [
        {
          userId: user.id,
          platform: 'facebook',
          accountId: `${user.id}-fb`,
          username: `${user.email.split('@')[0]}_fb`,
        },
        {
          userId: user.id,
          platform: 'twitter',
          accountId: `${user.id}-tw`,
          username: `${user.email.split('@')[0]}_tw`,
        },
      ],
    })
  }

  console.log('✅ SocialAccounts seeded.')
  console.log('🌱 Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

