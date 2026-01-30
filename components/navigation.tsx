'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Music, Menu, X, Coins, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export function Navigation() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-glow bg-card/50 border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold gradient-text">
            <Music className="w-6 h-6" />
            SoundSync
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground transition">
              Explore
            </Link>
            <Link href="/live" className="text-muted-foreground hover:text-foreground transition">
              Live
            </Link>
            <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition">
              Marketplace
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <>
                {/* Coin Balance */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold">500</span>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/20 transition">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 py-2 bg-card border border-border rounded-lg shadow-glow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-muted/20 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-muted/20 transition"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted/20 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/20 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/explore"
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/live"
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Live
              </Link>
              <Link
                href="/marketplace"
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>

              {session ? (
                <>
                  <div className="border-t border-border pt-4 mt-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-muted/20 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted/20 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border mt-2">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
