import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FicaVerificationList } from './FicaVerificationList'

import prisma from '@/lib/prisma'

export default async function AdminFicaPage() {
    const session = await getServerSession(authOptions)

    // Ensure user is admin
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email! },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
        redirect('/')
    }

    // Fetch pending FICA submissions
    const pendingApplications = await prisma.user.findMany({
        where: {
            ficaSubmittedAt: { not: null },
            ficaVerified: false
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            ficaDocumentUrl: true,
            ficaSubmittedAt: true
        },
        orderBy: { ficaSubmittedAt: 'asc' }
    })

    return <FicaVerificationList applications={pendingApplications} />
}
