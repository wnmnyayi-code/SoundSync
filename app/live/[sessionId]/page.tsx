import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import LiveSessionView from './LiveSessionView'

interface PageProps {
    params: Promise<{ sessionId: string }>
}

export default async function LiveSessionPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    const { sessionId } = await params

    if (!session) {
        redirect(`/login?callbackUrl=/live/${sessionId}`)
    }

    const liveSession = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            creator: {
                select: {
                    artistName: true,
                    image: true
                }
            }
        }
    })

    if (!liveSession) {
        return <div className="text-white p-8">Session not found</div>
    }

    const rsvp = await prisma.rSVP.findFirst({
        where: {
            sessionId,
            fanId: session.user.id
        }
    })

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coinBalance: true }
    })

    return (
        <LiveSessionView
            session={liveSession}
            hasRsvp={!!rsvp}
            userCoinBalance={user?.coinBalance || 0}
            userId={session.user.id}
        />
    )
}
