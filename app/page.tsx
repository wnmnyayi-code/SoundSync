'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Music, Users, ShoppingBag, TrendingUp, Coins, Radio, Shield, CreditCard, Zap, Award, Globe, DollarSign, Smartphone, Download, Apple } from 'lucide-react'

export default function Home() {
  const roles = [
    {
      icon: Music,
      title: 'Artists',
      description: 'Live stream your music, build your fanbase, and earn revenue',
      features: ['Live listening parties', 'Playlist creation', 'Merchandise store'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Fans',
      description: 'Discover music, attend live sessions, support your favorite artists',
      features: ['Buy SoundSync coins', 'Tip artists', 'Join live parties', 'Create playlists'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShoppingBag,
      title: 'Merchants',
      description: 'Sell music tools, equipment, and digital products',
      features: ['Digital downloads', 'Physical products', 'Set delivery radius', '10% commission'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Influencers',
      description: 'Promote artists and earn commissions on referrals',
      features: ['Referral tracking', 'Earn 10% commission', 'Analytics dashboard', 'R1000 min withdrawal'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const features = [
    { icon: CreditCard, title: 'Secure Payments', description: 'Stripe integration for secure transactions' },
    { icon: Zap, title: 'Live Streaming', description: 'Stream music directly from your phone storage' },
    { icon: Award, title: 'Fair Revenue', description: '60% to artists, transparent splits' },
    { icon: Globe, title: 'Global Access', description: 'Available worldwide with ZAR pricing' },
    { icon: DollarSign, title: 'Coin Economy', description: 'R10 = 200 coins, R50 = 1000 coins' }
  ]

  const subscriptionTiers = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Access one role',
      features: ['1 user role', 'Basic features', 'Community support']
    },
    {
      name: 'Standard',
      price: 'R99/mo',
      description: 'Access two roles',
      features: ['2 user roles', 'Advanced features', 'Priority support', 'Analytics'],
      popular: true
    },
    {
      name: 'Premium',
      price: 'R199/mo',
      description: 'Access all roles',
      features: ['All 4 roles', 'Premium features', 'VIP support', 'Advanced analytics', 'Early access']
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 hero-bg-enhanced">
        <div className="absolute inset-0 gradient-glow opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Live Now: 1,234 Artists Streaming</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-glow">
              Welcome to <span className="gradient-primary bg-clip-text text-transparent">SoundSync</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The premier music platform connecting artists, fans, merchants, and influencers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
                <Link href="/register">
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-card">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Global Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground text-lg">Join as an artist, fan, merchant, or influencer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon
              return (
                <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{role.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{role.description}</p>
                    <ul className="space-y-2">
                      {role.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Zap className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why SoundSync?</h2>
            <p className="text-muted-foreground text-lg">Built for music creators and fans worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground text-lg">Flexible pricing for every creator and fan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionTiers.map((tier, index) => (
              <Card key={index} className={`bg-card border-border shadow-card ${tier.popular ? 'ring-2 ring-primary shadow-glow' : ''} relative`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{tier.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-foreground">
                        <Zap className="w-4 h-4 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.popular ? 'gradient-primary text-white' : 'border-border'}`} variant={tier.popular ? 'default' : 'outline'} asChild>
                    <Link href="/register">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Fair Revenue Distribution</h2>
            <p className="text-muted-foreground text-lg">Transparent splits for every transaction</p>
          </div>

          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <p className="text-muted-foreground mb-2">Example: R100 spent by fan</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Music className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-foreground">Artist</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">R60 (60%)</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-accent" />
                    <span className="font-semibold text-foreground">Influencer</span>
                  </div>
                  <span className="text-2xl font-bold text-accent">R10 (10%)</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-secondary" />
                    <span className="font-semibold text-foreground">SoundSync Platform</span>
                  </div>
                  <span className="text-2xl font-bold text-secondary">R15 (15%)</span>
                </div>
                
              </div>

              <div className="mt-8 p-4 bg-muted/10 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Minimum withdrawal:</strong> R1000 for artists, influencers, and merchants
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mobile Apps Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Smartphone className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-foreground mb-4">Download Our Mobile Apps</h2>
            <p className="text-muted-foreground text-lg">
              Take SoundSync with you wherever you go. Available on iOS and Android.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* iOS App */}
            <Card className="bg-card border-border shadow-card hover:shadow-glow transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <Apple className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center mb-2">iOS App</h3>
                <p className="text-muted-foreground text-center mb-6">
                  For iPhone and iPad
                </p>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Optimized for iOS 15+</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Native performance</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Offline playback support</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Background audio streaming</span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <Button asChild className="w-full gradient-primary text-white hover:opacity-90" disabled>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <Apple className="w-5 h-5 mr-2" />
                      Coming Soon - App Store
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-card">
                    <a href="/downloads/SoundSync-iOS.ipa" download>
                      <Download className="w-5 h-5 mr-2" />
                      Direct Download (.ipa)
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Version 1.0.0 • 45.2 MB • Requires iOS 15.0 or later
                </p>
              </CardContent>
            </Card>

            {/* Android App */}
            <Card className="bg-card border-border shadow-card hover:shadow-glow transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground text-center mb-2">Android App</h3>
                <p className="text-muted-foreground text-center mb-6">
                  For Android devices
                </p>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Optimized for Android 8.0+</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Material Design UI</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Offline playback support</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-accent mr-2" />
                    <span>Background audio streaming</span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <Button asChild className="w-full gradient-primary text-white hover:opacity-90" disabled>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      Coming Soon - Google Play
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-card">
                    <a href="/downloads/SoundSync-Android.apk" download>
                      <Download className="w-5 h-5 mr-2" />
                      Direct Download (.apk)
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Version 1.0.0 • 38.5 MB • Requires Android 8.0 or later
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Radio className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Live Streaming</h4>
              <p className="text-sm text-muted-foreground">Join live sessions on the go</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Offline Mode</h4>
              <p className="text-sm text-muted-foreground">Download and listen offline</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Secure</h4>
              <p className="text-sm text-muted-foreground">DRM protected content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Fast & Smooth</h4>
              <p className="text-sm text-muted-foreground">Optimized performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-12 border border-primary/30">
            <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Join SoundSync?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your journey as an artist, fan, merchant, or influencer today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
                <Link href="/register">
                  Create Free Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-card">
                <Link href="/coins">
                  <Coins className="w-5 h-5 mr-2" />
                  Buy Coins
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}