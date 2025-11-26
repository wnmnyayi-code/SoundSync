'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Copy, Users, DollarSign, Link as LinkIcon, TrendingUp } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function InfluencerDashboardView({ user }: { user: any }) {
    const { toast } = useToast()
    const [referralCode, setReferralCode] = useState(user.referralCode || '')
    const [isLoading, setIsLoading] = useState(false)

    const generateCode = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/influencer/referral-code', { method: 'POST' })
            const data = await res.json()
            setReferralCode(data.code)
            toast({
                title: "Code Generated",
                description: "Your unique referral code is ready to share.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate code.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyLink = () => {
        const link = `${window.location.origin}/register?ref=${referralCode}`
        navigator.clipboard.writeText(link)
        toast({
            title: "Copied!",
            description: "Referral link copied to clipboard.",
        })
    }

    const totalReferrals = user.referrals.length
    const totalEarnings = user.referrals.reduce((acc: number, ref: any) => acc + ref.totalCommission, 0)

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Influencer Dashboard</h1>
                <p className="text-muted-foreground">Track your referrals and earnings.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReferrals}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R {totalEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Available for withdrawal
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0%</div>
                        <p className="text-xs text-muted-foreground">
                            Based on link clicks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Referral Tools */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Referral Tools</CardTitle>
                        <CardDescription>Share your unique link to earn commissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!referralCode ? (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">You haven't generated a referral code yet.</p>
                                <Button onClick={generateCode} disabled={isLoading}>
                                    {isLoading ? 'Generating...' : 'Generate Code'}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Your Unique Code</label>
                                    <div className="flex gap-2">
                                        <Input value={referralCode} readOnly />
                                        <Button variant="outline" size="icon" onClick={() => {
                                            navigator.clipboard.writeText(referralCode)
                                            toast({ title: "Copied code!" })
                                        }}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Referral Link</label>
                                    <div className="flex gap-2">
                                        <Input value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referralCode}`} readOnly />
                                        <Button onClick={copyLink}>
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            Copy Link
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Referrals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Referrals</CardTitle>
                        <CardDescription>Users who signed up using your link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.referrals.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No referrals yet. Start sharing your link!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {user.referrals.map((ref: any) => (
                                    <div key={ref.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                {ref.referredUser.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium">{ref.referredUser.name || 'Anonymous'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(ref.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600">
                                                + R {ref.totalCommission.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {ref.referredUser.subscriptionTier}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
