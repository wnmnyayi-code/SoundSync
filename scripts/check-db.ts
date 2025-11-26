import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        const users = await prisma.user.findMany()
        console.log(`Found ${users.length} users.`)
        users.forEach(u => {
            console.log(`- ${u.email} (Role: ${u.role})`)
        })
    } catch (e) {
        console.error('Error connecting to database:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
