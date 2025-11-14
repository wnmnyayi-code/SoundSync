'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Radio, DollarSign, Users, Award, Shield, Zap, TrendingUp } from 'lucide-react'

export default function ArtistsPage() {
  const features = [
    {
      icon: Radio,
      title: 'Live Streaming',
      description: 'Stream music directly from your phone storage to fans in real-time'
    },
    {
      icon: Users,
      title: 'Build Your Fanbase',
      description: 'Connect with fans, gain followers, and grow your audience'
    },
    {
      icon: DollarSign,
      title: 'Earn Revenue',
      description: 'Keep 60% of all earnings from tips, merchandise, and music sales'
    },
    {
      icon: Award,
      title: 'SAMBRO Registration',
      description: 'Register your music with SAMBRO directly through SoundSync'
    },
    {
      icon: Shield,
      title: 'SARS Compliant',
      description: 'Fully compliant with South African tax regulations'
    },
    {
      icon: Zap,
      title: 'Professional Tools',
      description: 'Access mixing and mastering services for your tracks'
    }
  ]

  const requirements = [
    'SARS clearance certificate',
    'SAMBRO registration (or apply through us)',
    'Declare sampled music (SA law compliance)',
    'High-resolution profile picture',
    'Choose artist status: Independent, Registered, or Signed'
  ]

  const benefits = [
    { label: 'Revenue Share', value: '60%', description: 'of all earnings' },
    { label: 'Playlist Limit', value: '10 tracks', description: 'for trial accounts' },
    { label: 'Min Withdrawal', value: 'R1000', description: 'withdraw anytime' },
    { label: 'Commission', value: '10%', description: 'on merchandise sales' }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            For Artists
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Share your music, build your fanbase, and earn revenue on South Africa's premier music platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
              <Link href="/register">
                Become an Artist
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Artist Login
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
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Artist Features</h2>
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

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Register as Artist</p>
                  <p className="text-sm text-muted-foreground">Complete verification with SARS and SAMBRO</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Create Your Profile</p>
                  <p className="text-sm text-muted-foreground">Upload photos, create playlists, set up your store</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Go Live</p>
                  <p className="text-sm text-muted-foreground">Stream your music and connect with fans</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Earn Revenue</p>
                  <p className="text-sm text-muted-foreground">Get paid from tips, sales, and merchandise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card className="bg-card border-border shadow-card mb-12">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">You Keep</span>
                </div>
                <span className="text-2xl font-bold text-primary">60%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Example: If a fan spends R100:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Artist (you): R60</li>
                  <li>• Influencer (if referred): R10</li>
                  <li>• SoundSync Platform: R15</li>
                  <li>• SARS (VAT): R15</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Journey?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of South African artists already earning on SoundSync
              </p>
              <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
                <Link href="/register">
                  Register as Artist
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}