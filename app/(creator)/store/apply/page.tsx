import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { StoreApplicationForm } from './StoreApplicationForm'
import { PrismaClient } from '@prisma/client'

import prisma from '@/lib/prisma'

export default async function StoreApplicationPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login?callbackUrl=/store/apply')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
        select: {
            id: true,
            storeType: true,
            ficaVerified: true,
            ficaSubmittedAt: true
        }
    })

    if (user?.storeType !== 'NONE') {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">You already have a store!</h1>
                <p className="text-muted-foreground mb-8">
                    Manage your products and inventory from your dashboard.
                </p>
                {/* Link to dashboard would go here */}
            </div>
        )
    }

    if (user?.ficaSubmittedAt && !user.ficaVerified) {
        return (
            <div className="container mx-auto py-12 px-4 text-center max-w-2xl">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8">
                    <h1 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">Application Under Review</h1>
                    <p className="text-muted-foreground mb-6">
                        Your store application and FICA documents are currently being reviewed by our team.
                        This process typically takes 24-48 hours. You will be notified via email once approved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Submitted on: {new Date(user.ficaSubmittedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        )
    }

    return <StoreApplicationForm />
}
