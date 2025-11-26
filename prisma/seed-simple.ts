// prisma/seed-simple.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting simple database seed...')

    // Create admin user
    const adminExists = await prisma.user.findUnique({
        where: { email: 'admin@soundsync.co.za' }
    })

    if (!adminExists) {
        const hashedPassword = bcrypt.hashSync('SoundSync@Admin2025!', 10)
        await prisma.user.create({
            data: {
                email: 'admin@soundsync.co.za',
                password: hashedPassword,
                role: 'ADMIN',
                subscriptionTier: 'ADMIN',
                artistName: 'SoundSync Official',
                coinBalance: 10000,
                verificationStatus: 'APPROVED',
                selectedRoles: ['FAN', 'ARTIST', 'MERCHANT', 'INFLUENCER'],
            },
        })
        console.log('✅ Admin user created')
    } else {
        console.log('ℹ️  Admin user already exists')
    }

    // Create fan user
    const fanExists = await prisma.user.findUnique({
        where: { email: 'fan@soundsync.co.za' }
    })

    if (!fanExists) {
        const hashedPassword = bcrypt.hashSync('Password123!', 10)
        await prisma.user.create({
            data: {
                email: 'fan@soundsync.co.za',
                password: hashedPassword,
                role: 'FAN',
                subscriptionTier: 'BASIC',
                coinBalance: 1000,
                verificationStatus: 'APPROVED',
                selectedRoles: ['FAN'],
            },
        })
        console.log('✅ Fan user created')
    } else {
        console.log('ℹ️  Fan user already exists')
    }

    // Create artist user
    const artistExists = await prisma.user.findUnique({
        where: { email: 'artist@soundsync.co.za' }
    })

    if (!artistExists) {
        const hashedPassword = bcrypt.hashSync('Password123!', 10)
        await prisma.user.create({
            data: {
                email: 'artist@soundsync.co.za',
                password: hashedPassword,
                role: 'CREATOR',
                subscriptionTier: 'PREMIUM',
                artistName: 'Test Artist',
                coinBalance: 2000,
                verificationStatus: 'APPROVED',
                selectedRoles: ['ARTIST', 'FAN'],
            },
        })
        console.log('✅ Artist user created')
    } else {
        console.log('ℹ️  Artist user already exists')
    }

    console.log('🌱 Database seeding complete!')
    console.log('\n📝 Test Credentials:')
    console.log('Admin: admin@soundsync.co.za / SoundSync@Admin2025!')
    console.log('Fan: fan@soundsync.co.za / Password123!')
    console.log('Artist: artist@soundsync.co.za / Password123!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
