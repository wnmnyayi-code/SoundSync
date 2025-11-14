'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, CreditCard, Zap, Shield, Check } from 'lucide-react'

export default function CoinsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const coinPackages = [
    {
      id: 'starter',
      coins: 200,
      price: 10,
      bonus: 0,
      popular: false
    },
    {
      id: 'popular',
      coins: 1000,
      price: 50,
      bonus: 100,
      popular: true
    },
    {
      id: 'premium',
      coins: 2500,
      price: 120,
      bonus: 500,
      popular: false
    },
    {
      id: 'ultimate',
      coins: 5000,
      price: 230,
      bonus: 1200,
      popular: false
    }
  ]

  const features = [
    'Tip your favorite artists',
    'Buy exclusive merchandise',
    'Access premium content',
    'Support live sessions',
    'Create custom playlists',
    'Priority support'
  ]

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId)
    // Integrate with Stripe here
    alert('Stripe checkout would open here. Package: ' + packageId)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Buy SoundSync Coins
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Support your favorite artists and unlock exclusive features with SoundSync coins
          </p>
        </div>

        {/* Coin Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coinPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`bg-card border-border ${pkg.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-card'} relative hover:shadow-glow transition-all`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Best Value
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-foreground mb-1">
                    {pkg.coins.toLocaleString()}
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="text-sm text-accent font-semibold">
                      +{pkg.bonus} bonus coins
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Total: {(pkg.coins + pkg.bonus).toLocaleString()} coins
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">
                  R{pkg.price}
                </div>
                <p className="text-xs text-muted-foreground">incl. 15% VAT</p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full ${pkg.popular ? 'gradient-primary text-white' : ''}`}
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>What You Can Do With Coins</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Safe & Secure</span>
              </CardTitle>
              <CardDescription>
                Your transactions are protected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Stripe Integration</p>
                  <p className="text-sm text-muted-foreground">
                    Industry-leading payment security
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">SARS Compliant</p>
                  <p className="text-sm text-muted-foreground">
                    All transactions include 15% VAT
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Coins className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Instant Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Coins added to your account immediately
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">How do I use my coins?</h3>
              <p className="text-sm text-muted-foreground">
                Use coins to tip artists during live sessions, purchase merchandise, or unlock premium features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Do coins expire?</h3>
              <p className="text-sm text-muted-foreground">
                No, your SoundSync coins never expire and remain in your account indefinitely.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Can I get a refund?</h3>
              <p className="text-sm text-muted-foreground">
                Coin purchases are final. However, if you experience any issues, please contact our support team.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Is VAT included?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, all prices include 15% VAT as required by South African law.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}