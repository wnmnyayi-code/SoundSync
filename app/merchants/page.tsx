'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package, Download, MapPin, DollarSign, Shield, Zap, TrendingUp } from 'lucide-react'

export default function MerchantsPage() {
  const features = [
    {
      icon: Package,
      title: 'Physical Products',
      description: 'Sell music equipment, instruments, and merchandise'
    },
    {
      icon: Download,
      title: 'Digital Products',
      description: 'Sell samples, plugins, software, and digital tools'
    },
    {
      icon: MapPin,
      title: 'Delivery Radius',
      description: 'Set custom delivery zones for physical items'
    },
    {
      icon: DollarSign,
      title: 'Fair Commission',
      description: 'Only 10% commission on all sales'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track sales, revenue, and customer insights'
    }
  ]

  const productTypes = [
    'DJ Equipment & Controllers',
    'Audio Interfaces & Mixers',
    'Studio Monitors & Headphones',
    'Microphones & Accessories',
    'VST Plugins & Software',
    'Sample Packs & Loops',
    'MIDI Controllers',
    'Music Production Courses',
    'Sound Effects Libraries',
    'Mixing & Mastering Presets'
  ]

  const benefits = [
    { label: 'Commission', value: '10%', description: 'on all sales' },
    { label: 'Min Withdrawal', value: 'R1000', description: 'withdraw anytime' },
    { label: 'Payment Processing', value: 'Secure', description: 'via Stripe' },
    { label: 'Instant Payouts', value: '24-48h', description: 'after withdrawal' }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            For Merchants
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Sell music tools, equipment, and digital products to the music community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
              <Link href="/register">
                Start Selling
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Merchant Login
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
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Merchant Features</h2>
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

        {/* Product Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>What You Can Sell</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2">
                {productTypes.map((type, index) => (
                  <li key={index} className="flex items-center space-x-3 text-sm">
                    <Zap className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-foreground">{type}</span>
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
                  <p className="font-semibold text-foreground">Register as Merchant</p>
                  <p className="text-sm text-muted-foreground">Provide SARS clearance certificate</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">List Your Products</p>
                  <p className="text-sm text-muted-foreground">Upload items with descriptions and pricing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Set Delivery Options</p>
                  <p className="text-sm text-muted-foreground">Define delivery radius for physical items</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Start Earning</p>
                  <p className="text-sm text-muted-foreground">Receive payments and withdraw funds</p>
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
                <span className="text-2xl font-bold text-primary">90%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                  <span className="font-semibold text-foreground">Platform Commission</span>
                </div>
                <span className="text-2xl font-bold text-muted-foreground">10%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Example: R1000 product sale</p>
                <ul className="space-y-1 ml-4">
                  <li>• Merchant (you): R900</li>
                  <li>• SoundSync Platform: R100</li>
                </ul>
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
                <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">SARS Clearance Certificate</p>
                  <p className="text-sm text-muted-foreground">Required for all merchants selling products</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Product Information</p>
                  <p className="text-sm text-muted-foreground">Clear descriptions, images, and pricing</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Delivery Details</p>
                  <p className="text-sm text-muted-foreground">Set delivery radius for physical items (digital items available nationwide)</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Selling?</h2>
              <p className="text-muted-foreground mb-6">
                Join the premier music marketplace and reach thousands of musicians
              </p>
              <Button size="lg" asChild className="gradient-primary text-white hover:opacity-90 shadow-glow">
                <Link href="/register">
                  Register as Merchant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}