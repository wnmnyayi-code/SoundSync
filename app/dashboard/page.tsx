'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Users, ShoppingBag, TrendingUp, Coins, Radio, DollarSign, Award, ArrowRight } from 'lucide-react'

interface UserData {
  id: string
  email: string
  primaryRole: string
  roles: string[]
  subscriptionTier: string
  artistName?: string
  coins: number
  verified: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user data from localStorage (demo)
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const roleCards = [
    {
      role: 'ARTIST',
      icon: Music,
      title: 'Artist Dashboard',
      description: 'Manage your music, playlists, and live sessions',
      href: '/artist/dashboard',
      color: 'from-purple-500 to-pink-500',
      stats: [
        { label: 'Live Sessions', value: '0' },
        { label: 'Followers', value: '0' },
        { label: 'Revenue', value: 'R0' }
      ]
    },
    {
      role: 'FAN',
      icon: Users,
      title: 'Fan Hub',
      description: 'Discover artists, attend live parties, and support creators',
      href: '/fans',
      color: 'from-blue-500 to-cyan-500',
      stats: [
        { label: 'Following', value: '0' },
        { label: 'Playlists', value: '0' },
        { label: 'Coins', value: user.coins.toString() }
      ]
    },
    {
      role: 'MERCHANT',
      icon: ShoppingBag,
      title: 'Merchant Store',
      description: 'Sell music tools, equipment, and digital products',
      href: '/merchant/dashboard',
      color: 'from-green-500 to-emerald-500',
      stats: [
        { label: 'Products', value: '0' },
        { label: 'Sales', value: '0' },
        { label: 'Revenue', value: 'R0' }
      ]
    },
    {
      role: 'INFLUENCER',
      icon: TrendingUp,
      title: 'Influencer Dashboard',
      description: 'Track referrals and earn commissions',
      href: '/influencer/dashboard',
      color: 'from-orange-500 to-red-500',
      stats: [
        { label: 'Referrals', value: '0' },
        { label: 'Earnings', value: 'R0' },
        { label: 'Commission', value: '10%' }
      ]
    }
  ]

  const quickActions = [
    { icon: Coins, label: 'Buy Coins', href: '/coins', color: 'text-yellow-400' },
    { icon: Radio, label: 'Live Sessions', href: '/live', color: 'text-red-400' },
    { icon: Music, label: 'Discover Music', href: '/discover', color: 'text-purple-400' },
    { icon: DollarSign, label: 'Withdraw Funds', href: '/withdraw', color: 'text-green-400' }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back{user.artistName ? `, ${user.artistName}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            {user.email} • {user.subscriptionTier} Plan
          </p>
        </div>

        {/* Verification Alert */}
        {!user.verified && (
          <Card className="mb-8 bg-accent/10 border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Complete Your Verification</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Verify your account to unlock all features and start earning
                  </p>
                  <Button size="sm" className="gradient-primary text-white">
                    Verify Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <Card className="bg-card border-border hover:shadow-glow transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Role Dashboards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleCards.map((card, index) => {
              const Icon = card.icon
              const hasRole = user.roles.includes(card.role)
              
              return (
                <Card key={index} className={`bg-card border-border ${hasRole ? 'shadow-card hover:shadow-glow' : 'opacity-50'} transition-all`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{card.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {hasRole ? (
                      <>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {card.stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                              <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                        <Button asChild className="w-full gradient-primary text-white hover:opacity-90">
                          <Link href={card.href}>
                            Open Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Upgrade your plan to access this role
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/upgrade">Upgrade Plan</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Subscription Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">{user.subscriptionTier} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {user.roles.length} role{user.roles.length !== 1 ? 's' : ''} active
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/upgrade">Upgrade Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}