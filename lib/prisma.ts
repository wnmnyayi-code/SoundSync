// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (globalThis.prisma) {
    prisma = globalThis.prisma;
} else {
    prisma = new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
}

export default prisma;
