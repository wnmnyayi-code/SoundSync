'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { Coins, CreditCard, Zap, Shield, Check, Calculator } from 'lucide-react'

export default function CoinsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [useCustomAmount, setUseCustomAmount] = useState(false)

  // Conversion rate: R10 = 200 coins, so 20 coins per R1
  const COINS_PER_ZAR = 20
  const MIN_PURCHASE = 5 // Minimum R5
  const MAX_PURCHASE = 10000 // Maximum R10,000

  const calculateCoins = (zarAmount: number): number => {
    const baseCoins = zarAmount * COINS_PER_ZAR

    // Bonus tiers
    let bonus = 0
    if (zarAmount >= 200) {
      bonus = Math.floor(baseCoins * 0.25) // 25% bonus for R200+
    } else if (zarAmount >= 100) {
      bonus = Math.floor(baseCoins * 0.15) // 15% bonus for R100+
    } else if (zarAmount >= 50) {
      bonus = Math.floor(baseCoins * 0.10) // 10% bonus for R50+
    } else if (zarAmount >= 25) {
      bonus = Math.floor(baseCoins * 0.05) // 5% bonus for R25+
    }

    return baseCoins + bonus
  }

  const getBonusPercentage = (zarAmount: number): number => {
    if (zarAmount >= 200) return 25
    if (zarAmount >= 100) return 15
    if (zarAmount >= 50) return 10
    if (zarAmount >= 25) return 5
    return 0
  }

  const customAmountNum = parseFloat(customAmount) || 0
  const calculatedCoins = calculateCoins(customAmountNum)
  const bonusPercentage = getBonusPercentage(customAmountNum)
  const isValidCustomAmount = customAmountNum >= MIN_PURCHASE && customAmountNum <= MAX_PURCHASE

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

  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (packageId: string, type: 'coins' | 'shelf_space' = 'coins', price?: number) => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please login to purchase coins',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      const purchasePrice = price || coinPackages.find(p => p.id === packageId)?.price || 0

      // In a real app, we would get a paymentMethodId from Stripe Elements
      // For this demo/dev, we'll simulate it
      const paymentMethodId = 'pm_card_visa'

      const res = await fetch('/api/wallet/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: purchasePrice,
          paymentMethodId,
          type
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Purchase failed')
      }

      toast({
        title: 'Purchase Successful!',
        description: type === 'shelf_space'
          ? 'Your shelf space has been expanded!'
          : `Successfully purchased ${data.data.coins} coins!`
      })

    } catch (error) {
      console.error(error)
      toast({
        title: 'Purchase Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
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

        {/* Shelf Space Special */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-primary/50 shadow-glow mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-64 h-64 text-white" />
          </div>
          <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Creator Shelf Space</h2>
              <p className="text-blue-100 text-lg mb-4">Expand your creative potential. Get more room for your music.</p>
              <ul className="space-y-2 text-blue-200">
                <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-green-400" /> +5 Playlists</li>
                <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-green-400" /> +50 Tracks Upload Limit</li>
              </ul>
            </div>
            <div className="text-center bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-4xl font-bold text-white mb-1">R99</div>
              <div className="text-sm text-blue-200 mb-4">One-time purchase</div>
              <Button
                size="lg"
                className="w-full gradient-primary text-white shadow-lg hover:shadow-primary/50 transition-all"
                onClick={() => handlePurchase('shelf_space', 'shelf_space', 99)}
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                Expand Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Amount Calculator */}
        <Card className="bg-card border-border shadow-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-6 h-6 text-primary" />
              <span>Custom Amount</span>
            </CardTitle>
            <CardDescription>
              Enter any amount from R{MIN_PURCHASE} to R{MAX_PURCHASE.toLocaleString()} and see how many coins you'll receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Amount in ZAR
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R
                  </span>
                  <Input
                    type="number"
                    min={MIN_PURCHASE}
                    max={MAX_PURCHASE}
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`${MIN_PURCHASE} - ${MAX_PURCHASE.toLocaleString()}`}
                    className="pl-8 text-lg font-semibold"
                  />
                </div>
                {customAmount && !isValidCustomAmount && (
                  <p className="text-sm text-destructive mt-2">
                    Amount must be between R{MIN_PURCHASE} and R{MAX_PURCHASE.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">You will receive</p>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Coins className="w-8 h-8 text-yellow-400" />
                    <span className="text-4xl font-bold text-foreground">
                      {customAmount ? calculatedCoins.toLocaleString() : '0'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">coins</p>

                  {bonusPercentage > 0 && customAmount && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-accent font-semibold">
                        🎉 +{bonusPercentage}% Bonus Applied!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Base: {(customAmountNum * COINS_PER_ZAR).toLocaleString()} + Bonus: {(calculatedCoins - customAmountNum * COINS_PER_ZAR).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                <strong className="text-foreground">Conversion Rate:</strong> R1 = {COINS_PER_ZAR} coins
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-card/50 p-2 rounded">
                  <p className="text-muted-foreground">R25+</p>
                  <p className="text-accent font-semibold">+5% bonus</p>
                </div>
                <div className="bg-card/50 p-2 rounded">
                  <p className="text-muted-foreground">R50+</p>
                  <p className="text-accent font-semibold">+10% bonus</p>
                </div>
                <div className="bg-card/50 p-2 rounded">
                  <p className="text-muted-foreground">R100+</p>
                  <p className="text-accent font-semibold">+15% bonus</p>
                </div>
                <div className="bg-card/50 p-2 rounded">
                  <p className="text-muted-foreground">R200+</p>
                  <p className="text-accent font-semibold">+25% bonus</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                if (isValidCustomAmount) {
                  handlePurchase('custom', 'coins', customAmountNum)
                  setUseCustomAmount(true)
                }
              }}
              disabled={!isValidCustomAmount || isLoading}
              className="w-full mt-4 gradient-primary text-white"
              size="lg"
            >
              {isLoading ? <Spinner className="mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
              Purchase {customAmount ? calculatedCoins.toLocaleString() : '0'} Coins for R{customAmount || '0'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Select Packages */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Select Packages</h2>
          <p className="text-muted-foreground mb-4">Or choose from our popular preset packages</p>
        </div>

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
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handlePurchase(pkg.id, 'coins', pkg.price)}
                  className={`w-full ${pkg.popular ? 'gradient-primary text-white' : ''}`}
                  variant={pkg.popular ? 'default' : 'outline'}
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner className="mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}