import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying database connection...')

    try {
        const userCount = await prisma.user.count()
        console.log(`✅ Database connected! Found ${userCount} users.`)

        const users = await prisma.user.findMany({
            select: { email: true, role: true, subscriptionTier: true }
        })

        console.log('📋 Users found:')
        users.forEach(u => console.log(`- ${u.email} (${u.role}) - ${u.subscriptionTier}`))

    } catch (error) {
        console.error('❌ Database connection failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
