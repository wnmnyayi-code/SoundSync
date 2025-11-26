import { PrismaClient } from '@prisma/client'

import prisma from '../lib/prisma';

async function main() {
    console.log('Deleting all tokens...')
    const result = await prisma.token.deleteMany({})
    console.log(`Deleted ${result.count} tokens`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
