'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Coins } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const COIN_PACKAGES = [
  { zar: 10, coins: 200, bonus: 0 },
  { zar: 25, coins: 500, bonus: 50 },
  { zar: 50, coins: 1000, bonus: 200 },
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

  return (
    <Elements stripe={stripePromise} options={{ 
      mode: 'payment',
      currency: 'zar',
      amount: selectedPackage.zar * 100,
    }}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-dark-800 p-6 rounded-lg max-w-md w-full border border-primary-700">
          <h2 className="text-white text-xl font-bold mb-4">Purchase Coins</h2>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {COIN_PACKAGES.map(pkg => (
              <button
                key={pkg.zar}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-3 rounded-lg border ${
                  selectedPackage.zar === pkg.zar 
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
            selectedPackage={selectedPackage} 
            onSuccess={(coins: number) => {
              alert(`Successfully purchased ${coins} coins!`)
              onClose()
            }}
          />
        </div>
      </div>
    </Elements>
  )
}