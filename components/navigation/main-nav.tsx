// components/navigation/main-nav.tsx
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/theme"

export default function MainNav() {
  const { data: session, status } = useSession()

  // If loading, show a simple nav
  if (status === 'loading') {
    return (
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="font-bold">SoundSync</Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-bold">SoundSync</Link>
          {session && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {/* Add more nav items based on role */}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <form action="/api/auth/signout" method="POST">
                <Button type="submit" variant="outline">Sign out</Button>
              </form>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}