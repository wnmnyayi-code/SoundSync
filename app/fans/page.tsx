'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Radio, Coins, Music, Heart, Star, Zap, TrendingUp } from 'lucide-react'

export default function FansPage() {
  const features = [
    {
      icon: Radio,
      title: 'Live Listening Parties',
      description: 'Join exclusive live sessions with your favorite artists'
    },
    {
      icon: Coins,
      title: 'SoundSync Coins',
      description: 'Buy coins to tip artists and purchase merchandise'
    },
    {
      icon: Music,
      title: 'Create Playlists',
      description: 'Build custom playlists with licensed music (fee applies)'
    },
    {
      icon: Heart,
      title: 'Support Artists',
      description: 'Directly support creators through tips and purchases'
    },
    {
      icon: Star,
      title: 'Follow Artists',
      description: 'Get updates when your favorite artists go live'
    },
    {
      icon: TrendingUp,
      title: 'Upgrade to Creator',
      description: 'Request to become an artist (pending admin approval)'
    }
  ]

  const coinPackages = [
    { coins: 200, price: 10 },
    { coins: 1000, price: 50, popular: true },
    { coins: 2500, price: 120 }
  ]

  const benefits = [
    'Access to exclusive live sessions',
    'Direct interaction with artists',
    'Early access to new releases',
    'Custom playlist creation',
    'Priority support',
    'Upgrade path to creator'
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            For Fans
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover amazing artists, attend live sessions, and support the music you love
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
              <Link href="/register">
                Join as Fan
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/discover">
                Discover Artists
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Fan Features</h2>
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

        {/* Coin Packages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">SoundSync Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {coinPackages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`bg-card border-border ${pkg.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-card'} relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {pkg.coins.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">coins</div>
                  <div className="text-2xl font-bold text-primary mb-4">R{pkg.price}</div>
                  <Button asChild className={pkg.popular ? 'gradient-primary text-white w-full' : 'w-full'} variant={pkg.popular ? 'default' : 'outline'}>
                    <Link href="/coins">Purchase</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Fan Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>How to Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Create Account</p>
                  <p className="text-sm text-muted-foreground">Sign up as a fan - it's free!</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Buy Coins</p>
                  <p className="text-sm text-muted-foreground">Purchase SoundSync coins to support artists</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Discover Music</p>
                  <p className="text-sm text-muted-foreground">Find and follow your favorite artists</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Join Live Sessions</p>
                  <p className="text-sm text-muted-foreground">Attend exclusive listening parties</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Discover Amazing Music?</h2>
              <p className="text-muted-foreground mb-6">
                Join the SoundSync community and support artists
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
                  <Link href="/register">
                    Join Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/coins">
                    <Coins className="w-5 h-5 mr-2" />
                    Buy Coins
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}