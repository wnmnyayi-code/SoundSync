'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, CheckCircle, XCircle, Settings, FileText, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()

  // Protect admin route
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const [statsData, setStatsData] = useState({
    totalUsers: '0',
    pendingApprovals: '0',
    revenue: 'R0',
    verifiedCreators: '0'
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStatsData({
            totalUsers: data.totalUsers.toString(),
            pendingApprovals: data.pendingApprovals.toString(),
            revenue: `R${data.totalRevenue.toLocaleString()}`,
            verifiedCreators: data.verifiedCreators.toString()
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats', error)
      }
    }
    if (session?.user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [session])

  const stats = [
    {
      title: 'Total Users',
      value: statsData.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Pending Approvals',
      value: statsData.pendingApprovals,
      description: 'Awaiting review',
      icon: CheckCircle,
      color: 'text-yellow-400'
    },
    {
      title: 'Platform Revenue',
      value: statsData.revenue,
      description: 'Total coin sales',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Verified Creators',
      value: statsData.verifiedCreators,
      description: 'Approved artists',
      icon: CheckCircle,
      color: 'text-purple-400'
    }
  ]

  const quickActions = [
    {
    },
    {
      title: 'Platform Settings',
      description: 'Configure platform settings',
      href: '/admin/settings',
      icon: Settings,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-card border-border shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {Icon && <Icon className={`w-8 h-8 ${stat.color}`} />}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground mb-1">{stat.title}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href || '#'}>
                  <Card className="bg-card border-border shadow-card hover:shadow-glow transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

