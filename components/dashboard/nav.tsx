// components/dashboard/nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { User } from 'next-auth'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    roles: ['ADMIN', 'CREATOR', 'FAN', 'MERCHANT', 'INFLUENCER']
  },
  {
    name: 'My Music',
    href: '/dashboard/artist/tracks',
    roles: ['CREATOR']
  },
  {
    name: 'Playlists',
    href: '/dashboard/fan/playlists',
    roles: ['FAN']
  },
  {
    name: 'Store',
    href: '/dashboard/merchant/store',
    roles: ['MERCHANT']
  },
  {
    name: 'Referrals',
    href: '/dashboard/influencer/referrals',
    roles: ['INFLUENCER']
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    roles: ['ADMIN', 'CREATOR', 'INFLUENCER']
  },
  {
    name: 'Admin',
    href: '/admin',
    roles: ['ADMIN']
  }
]

interface DashboardNavProps {
  user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-card border-r border-border text-card-foreground p-4 h-screen sticky top-0">
      <div className="space-y-6">
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            SoundSync
          </h1>
        </div>
        <div className="space-y-1">
          {navigation
            .filter(item => item.roles.includes(user.role))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
        </div>
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
              {user.name?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate max-w-[140px]">
                {user.name || user.email}
              </p>
              <Link
                href="/settings"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                View profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}