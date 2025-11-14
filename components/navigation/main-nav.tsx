'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Music, Users, ShoppingBag, TrendingUp, Coins } from 'lucide-react'

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/artists', label: 'Artists', icon: Music },
    { href: '/fans', label: 'Fans', icon: Users },
    { href: '/merchants', label: 'Merchants', icon: ShoppingBag },
    { href: '/influencers', label: 'Influencers', icon: TrendingUp },
    { href: '/coins', label: 'Coins', icon: Coins },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-glow border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground text-glow">SoundSync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" asChild className="border-border text-foreground hover:bg-card">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="gradient-primary text-white hover:opacity-90">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="flex flex-col space-y-2 pt-3 border-t border-border">
                <Button variant="outline" asChild className="border-border text-foreground hover:bg-card">
                  <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="gradient-primary text-white hover:opacity-90">
                  <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}