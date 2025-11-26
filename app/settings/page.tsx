import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            email: true,
            artistName: true,
            bio: true,
            image: true,
            phone: true,
            role: true,
            facebookUrl: true,
            twitterUrl: true,
            instagramUrl: true,
        }
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            <SettingsForm user={user} />
        </div>
    )
}
