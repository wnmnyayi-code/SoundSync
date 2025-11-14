'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, DollarSign, BarChart, Share2, Award, Zap, Target } from 'lucide-react'

export default function InfluencersPage() {
  const features = [
    {
      icon: Share2,
      title: 'Promote Artists',
      description: 'Share and promote your favorite South African artists'
    },
    {
      icon: DollarSign,
      title: 'Earn Commissions',
      description: 'Get 10% commission on all referred user spending'
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Track referrals, conversions, and earnings in real-time'
    },
    {
      icon: Users,
      title: 'Build Network',
      description: 'Grow your influence and connect with artists and fans'
    },
    {
      icon: Award,
      title: 'Performance Bonuses',
      description: 'Earn extra rewards for top-performing campaigns'
    },
    {
      icon: Target,
      title: 'Custom Links',
      description: 'Get unique referral links to track your promotions'
    }
  ]

  const benefits = [
    { label: 'Commission', value: '10%', description: 'on all referrals' },
    { label: 'Min Withdrawal', value: 'R1000', description: 'withdraw anytime' },
    { label: 'Payment Time', value: '24-48h', description: 'after withdrawal' },
    { label: 'Tracking', value: 'Real-time', description: 'live analytics' }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Register as Influencer',
      description: 'Create your influencer account and get verified'
    },
    {
      step: '2',
      title: 'Get Your Links',
      description: 'Receive unique referral links for artists and products'
    },
    {
      step: '3',
      title: 'Promote & Share',
      description: 'Share links on social media, blogs, and with your network'
    },
    {
      step: '4',
      title: 'Earn Commissions',
      description: 'Get 10% of all spending from your referred users'
    }
  ]

  const earningExamples = [
    {
      scenario: 'Fan buys R50 coins',
      yourEarning: 'R5',
      breakdown: 'R50 × 10% = R5'
    },
    {
      scenario: 'Fan spends R100 on artist',
      yourEarning: 'R10',
      breakdown: 'R100 × 10% = R10'
    },
    {
      scenario: 'Merchant sells R1000 product',
      yourEarning: 'R100',
      breakdown: 'R1000 × 10% = R100'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            For Influencers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Promote South African artists and earn commissions on every referral
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
              <Link href="/register">
                Become an Influencer
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Influencer Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-card border-border shadow-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-1">{benefit.value}</div>
                <div className="text-sm font-semibold text-foreground mb-1">{benefit.label}</div>
                <div className="text-xs text-muted-foreground">{benefit.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Influencer Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Card key={index} className="bg-card border-border shadow-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Earning Examples */}
        <Card className="bg-card border-border shadow-card mb-12">
          <CardHeader>
            <CardTitle>Earning Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningExamples.map((example, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{example.scenario}</p>
                    <p className="text-sm text-muted-foreground">{example.breakdown}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{example.yourEarning}</p>
                    <p className="text-xs text-muted-foreground">Your commission</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> You earn 10% commission on all spending from users you refer, including coin purchases, merchandise, and artist tips.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Model */}
        <Card className="bg-card border-border shadow-card mb-12">
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Example: Fan spends R100 on an artist (referred by you)
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-foreground">Artist</span>
                  <span className="font-bold text-primary">R60 (60%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <span className="text-foreground">Influencer (You)</span>
                  <span className="font-bold text-accent">R10 (10%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <span className="text-foreground">SoundSync Platform</span>
                  <span className="font-bold text-secondary">R15 (15%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                  <span className="text-foreground">SARS (VAT)</span>
                  <span className="font-bold text-muted-foreground">R15 (15%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="bg-card border-border shadow-card mb-12">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Active Social Media Presence</p>
                  <p className="text-sm text-muted-foreground">Demonstrate reach and engagement on social platforms</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Minimum Followers</p>
                  <p className="text-sm text-muted-foreground">At least 1,000 combined followers across platforms (recommended)</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Verification</p>
                  <p className="text-sm text-muted-foreground">Complete account verification process</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Minimum Withdrawal</p>
                  <p className="text-sm text-muted-foreground">R1000 minimum balance required for withdrawal</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Earning?</h2>
              <p className="text-muted-foreground mb-6">
                Join SoundSync as an influencer and monetize your social media presence
              </p>
              <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
                <Link href="/register">
                  Register as Influencer
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}