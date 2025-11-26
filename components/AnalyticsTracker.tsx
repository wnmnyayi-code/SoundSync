'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function AnalyticsTracker() {
    const { data: session } = useSession()

    useEffect(() => {
        if (session?.user) {
            // Track session/location
            fetch('/api/analytics/session', { method: 'POST' })
                .catch(err => console.error('Failed to track session', err))
        }
    }, [session])

    return null
}
