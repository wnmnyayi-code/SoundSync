import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@soundsync.co.za';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'SoundSync@Admin2025!';
    const hashedPassword = await hash(password, 12);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            role: Role.ADMIN,
            isVerified: true,
            verificationStatus: 'VERIFIED',
            coinBalance: 1000,
            artistName: process.env.ADMIN_NAME || 'SoundSync Administrator',
        },
    });

    console.log({ admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
