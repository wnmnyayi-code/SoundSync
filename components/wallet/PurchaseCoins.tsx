'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Coins, Calculator } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const COINS_PER_ZAR = 20 // R1 = 20 coins

const calculateCoins = (zarAmount: number): number => {
  const baseCoins = zarAmount * COINS_PER_ZAR
  
  // Bonus tiers
  let bonus = 0
  if (zarAmount >= 200) {
    bonus = Math.floor(baseCoins * 0.25) // 25% bonus
  } else if (zarAmount >= 100) {
    bonus = Math.floor(baseCoins * 0.15) // 15% bonus
  } else if (zarAmount >= 50) {
    bonus = Math.floor(baseCoins * 0.10) // 10% bonus
  } else if (zarAmount >= 25) {
    bonus = Math.floor(baseCoins * 0.05) // 5% bonus
  }
  
  return baseCoins + bonus
}

const COIN_PACKAGES = [
  { zar: 10, coins: calculateCoins(10), bonus: 0 },
  { zar: 25, coins: calculateCoins(25), bonus: Math.floor(calculateCoins(25) - 25 * COINS_PER_ZAR) },
  { zar: 50, coins: calculateCoins(50), bonus: Math.floor(calculateCoins(50) - 50 * COINS_PER_ZAR) },
]

function PurchaseForm({ selectedPackage, onSuccess }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setLoading(false)
      return
    }

    // Create PaymentIntent
    const res = await fetch('/api/wallet/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountZar: selectedPackage.zar,
        paymentMethodId: elements.getElement('payment')?.id
      })
    })

    const data = await res.json()
    
    if (data.success) {
      onSuccess(data.coins)
    } else {
      alert(data.error)
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} className="w-full mt-4 bg-primary-600">
        {loading ? 'Processing...' : `Buy ${selectedPackage.coins} Coins`}
      </Button>
    </form>
  )
}

export default function PurchaseCoins({ isOpen, onClose }: any) {
  const [selectedPackage, setSelectedPackage] = useState(COIN_PACKAGES[1])
  const [customAmount, setCustomAmount] = useState<string>('')
  const [useCustom, setUseCustom] = useState(false)

  const customAmountNum = parseFloat(customAmount) || 0
  const customCoins = calculateCoins(customAmountNum)
  const isValidCustom = customAmountNum >= 5 && customAmountNum <= 10000

  const activePackage = useCustom && isValidCustom 
    ? { zar: customAmountNum, coins: customCoins, bonus: customCoins - (customAmountNum * COINS_PER_ZAR) }
    : selectedPackage

  return (
    <Elements stripe={stripePromise} options={{ 
      mode: 'payment',
      currency: 'zar',
      amount: activePackage.zar * 100,
    }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full border border-primary-700 max-h-[90vh] overflow-y-auto">
          <h2 className="text-white text-xl font-bold mb-4">Purchase Coins</h2>
          
          {/* Custom Amount Input */}
          <div className="mb-4 p-4 bg-primary-900/20 rounded-lg border border-primary-700">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="w-4 h-4 text-primary-400" />
              <label className="text-white text-sm font-semibold">Custom Amount</label>
            </div>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R</span>
              <Input
                type="number"
                min="5"
                max="10000"
                step="0.01"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setUseCustom(true)
                }}
                placeholder="Enter amount (R5 - R10,000)"
                className="pl-8 bg-dark-700 border-primary-700 text-white"
              />
            </div>
            {customAmount && (
              <div className="text-center p-2 bg-dark-700 rounded">
                <p className="text-sm text-gray-400">You'll receive</p>
                <p className="text-xl font-bold text-primary-400">
                  {customCoins.toLocaleString()} coins
                </p>
                {activePackage.bonus > 0 && (
                  <p className="text-xs text-green-400">+{activePackage.bonus} bonus</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Select Packages */}
          <p className="text-sm text-gray-400 mb-2">Or quick select:</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {COIN_PACKAGES.map(pkg => (
              <button
                key={pkg.zar}
                onClick={() => {
                  setSelectedPackage(pkg)
                  setUseCustom(false)
                  setCustomAmount('')
                }}
                className={`p-3 rounded-lg border ${
                  !useCustom && selectedPackage.zar === pkg.zar 
                    ? 'border-primary-600 bg-primary-900/50' 
                    : 'border-primary-700'
                }`}
              >
                <Coins className="w-5 h-5 mx-auto text-primary-400 mb-1" />
                <p className="text-white font-bold">{pkg.coins}</p>
                <p className="text-gray-400 text-sm">R{pkg.zar}</p>
                {pkg.bonus > 0 && (
                  <p className="text-green-400 text-xs">+{pkg.bonus}</p>
                )}
              </button>
            ))}
          </div>

          <PurchaseForm 
            selectedPackage={activePackage} 
            onSuccess={(coins: number) => {
              alert(`Successfully purchased ${coins} coins!`)
              onClose()
            }}
          />
          
          <button 
            onClick={onClose}
            className="w-full mt-3 text-gray-400 hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Elements>
  )
}