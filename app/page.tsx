'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Music, Users, ShoppingBag, TrendingUp, CreditCard, Zap, Award, Globe, DollarSign, Check } from 'lucide-react'

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
      name: 'Free',
      price: 'R0',
      period: '/month',
      description: 'For new artists and casual listeners',
      features: [
        'Basic streaming',
        'Create playlists',
        'Follow artists',
        'Limited ads'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: 'R99',
      period: '/month',
      description: 'For serious music creators and fans',
      features: [
        'Ad-free listening',
        'High quality audio',
        'Download for offline',
        'Exclusive content',
        'Early access to releases'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For businesses and professionals',
      features: [
        'All Pro features',
        'Custom integrations',
        'Priority support',
        'Analytics dashboard',
        'Dedicated account manager'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 hero-bg-enhanced">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6 text-glow">
              Welcome to SoundSync
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your All-in-One Music Platform for Artists, Fans, and Industry Professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow">
                <Link href="/register">
                  Get Started - It's Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Choose Your Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Why Choose SoundSync?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Select the perfect tier for your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-glow ${tier.popular
                    ? 'border-primary shadow-glow scale-105'
                    : 'border-primary/20 hover:border-primary/50'
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      {tier.price}
                    </span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${tier.popular
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                      }`}
                  >
                    <Link href="/register">
                      {tier.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of artists and fans already using SoundSync
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow">
            <Link href="/register">
              Create Your Free Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}