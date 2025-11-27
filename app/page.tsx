'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Music, Users, ShoppingBag, TrendingUp, CreditCard, Zap, Award, Globe, DollarSign, Check, ArrowRight } from 'lucide-react'

export default function Home() {
  const roles = [
    {
      icon: Music,
      title: 'Artists',
      description: 'Live stream your music, build your fanbase, and earn revenue directly.',
      features: ['Live listening parties', 'Direct fan support', 'Merchandise store'],
      color: 'from-purple-500 to-pink-500',
      href: '/register?role=artist',
      cta: 'Join as Artist'
    },
    {
      icon: Users,
      title: 'Fans',
      description: 'Discover music, attend live sessions, and support your favorite artists.',
      features: ['Exclusive content', 'Live interactions', 'Community events'],
      color: 'from-blue-500 to-cyan-500',
      href: '/register?role=fan',
      cta: 'Join as Fan'
    },
    {
      icon: ShoppingBag,
      title: 'Merchants',
      description: 'Sell music tools, equipment, and digital products to a targeted audience.',
      features: ['Digital & Physical goods', 'Targeted reach', 'Low fees'],
      color: 'from-green-500 to-emerald-500',
      href: '/register?role=merchant',
      cta: 'Join as Merchant'
    },
    {
      icon: TrendingUp,
      title: 'Influencers',
      description: 'Promote artists and earn commissions on referrals and growth.',
      features: ['Referral rewards', 'Growth analytics', 'Partnership opportunities'],
      color: 'from-orange-500 to-red-500',
      href: '/register?role=influencer',
      cta: 'Join as Influencer'
    }
  ]

  const features = [
    { icon: CreditCard, title: 'Secure Payments', description: 'Integrated local payments via PayFast & global options.' },
    { icon: Zap, title: 'Live Streaming', description: 'High-quality audio streaming directly from your device.' },
    { icon: Award, title: 'Fair Revenue', description: 'Transparent splits and instant payouts for creators.' },
    { icon: Globe, title: 'Global Reach', description: 'Connect with audiences worldwide, priced locally.' },
    { icon: DollarSign, title: 'Coin Economy', description: 'Seamless micro-transactions for tipping and unlocking content.' }
  ]

  const subscriptionTiers = [
    {
      name: 'Basic',
      price: 'R0',
      period: '/month',
      description: 'Essential features for listeners and new artists.',
      features: [
        'Standard audio quality',
        'Create up to 3 playlists',
        'Follow 5 artists',
        'Ad-supported listening'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Standard',
      price: 'R59',
      period: '/month',
      description: 'Enhanced experience for dedicated fans and creators.',
      features: [
        'High definition audio',
        'Unlimited playlists',
        'Follow unlimited artists',
        'Ad-free experience',
        'Offline mode'
      ],
      popular: true,
      cta: 'Subscribe Now'
    },
    {
      name: 'Premium',
      price: 'R129',
      period: '/month',
      description: 'Ultimate access for professionals and power users.',
      features: [
        'Lossless audio quality',
        'Exclusive artist content',
        'Priority event access',
        'Advanced analytics',
        '0% transaction fees on tips'
      ],
      popular: false,
      cta: 'Go Premium'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
              Welcome to SoundSync
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            The ultimate platform connecting Artists, Fans, Merchants, and Influencers.
            Stream, sell, promote, and earn in one seamless ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
              <Link href="/register">
                Start Your Journey
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/10 transition-all hover:scale-105">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Find Your Rhythm</h2>
            <p className="text-xl text-muted-foreground">Choose the role that fits you best</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    <role.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                    <Link href={role.href} className="flex items-center justify-center gap-2">
                      {role.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Why SoundSync?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Unlock the full potential of SoundSync</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative flex flex-col transition-all duration-300 ${tier.popular
                  ? 'border-primary shadow-2xl scale-105 z-10 bg-card'
                  : 'border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-xl'
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="text-base">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/10 p-1">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-8 pb-8">
                  <Button
                    asChild
                    size="lg"
                    className={`w-full rounded-full ${tier.popular
                      ? 'bg-primary hover:bg-primary/90 shadow-lg'
                      : 'variant-outline'
                      }`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    <Link href="/register">
                      {tier.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Amplify Your Sound?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join the fastest-growing music community in South Africa. Start your journey today.
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-7 rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:scale-105 transition-all">
            <Link href="/register">
              Create Your Free Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}