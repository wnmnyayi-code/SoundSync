// components/auth/protected-route.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['ADMIN'] 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (status === 'authenticated' && allowedRoles.length > 0) {
      if (!allowedRoles.includes(session.user.role)) {
        router.push('/unauthorized')
      }
    }
  }, [status, session, allowedRoles, router])

  if (status === 'loading' || (status === 'authenticated' && !allowedRoles.includes(session.user.role))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}