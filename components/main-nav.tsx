// components/main-nav.tsx
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function MainNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center">
          <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SoundSync</Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SoundSync</Link>

          <div className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Roles <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/register?role=artist">Artist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register?role=fan">Fan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register?role=merchant">Merchant</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register?role=influencer">Influencer</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session && (
              <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {session.user.email}
              </span>
              <form action="/api/auth/signout" method="POST">
                <Button type="submit" variant="outline" size="sm">Sign out</Button>
              </form>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}