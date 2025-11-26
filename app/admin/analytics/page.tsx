'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Music, Radio, TrendingUp } from 'lucide-react'

interface AnalyticsData {
    stats: {
        totalUsers: number
        totalCreators: number
        totalTracks: number
        totalSessions: number
    }
    recentUsers: Array<{
        id: string
        email: string
        role: string
        createdAt: string
        subscriptionTier: string
    }>
}

export default function AdminAnalytics() {
    const { data: session, status } = useSession()
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'authenticated' && session?.user.role === 'ADMIN') {
            fetch('/api/admin/analytics')
                .then(res => res.json())
                .then(data => {
                    setData(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }, [status, session])

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading analytics...</p>
            </div>
        )
    }

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Platform usage overview</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-card border-border shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">{data?.stats.totalUsers}</div>
                            <div className="text-sm font-semibold text-foreground">Total Users</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">{data?.stats.totalCreators}</div>
                            <div className="text-sm font-semibold text-foreground">Creators</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Music className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">{data?.stats.totalTracks}</div>
                            <div className="text-sm font-semibold text-foreground">Tracks Uploaded</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Radio className="w-8 h-8 text-red-400" />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">{data?.stats.totalSessions}</div>
                            <div className="text-sm font-semibold text-foreground">Sessions Created</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Signups */}
                <Card className="bg-card border-border shadow-card">
                    <CardHeader>
                        <CardTitle>Recent Signups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 font-semibold text-foreground">Email</th>
                                        <th className="pb-3 font-semibold text-foreground">Role</th>
                                        <th className="pb-3 font-semibold text-foreground">Tier</th>
                                        <th className="pb-3 font-semibold text-foreground">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recentUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-border/50 last:border-0">
                                            <td className="py-3 text-foreground">{user.email}</td>
                                            <td className="py-3 text-muted-foreground">{user.role}</td>
                                            <td className="py-3 text-muted-foreground">{user.subscriptionTier}</td>
                                            <td className="py-3 text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
