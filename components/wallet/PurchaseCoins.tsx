'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Coins, Calculator } from 'lucide-react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const COINS_PER_ZAR = 20 // R1 = 20 coins
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"; // Use "test" for sandbox if env not set

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

interface PurchaseCoinsProps {
  isOpen: boolean
  onClose: () => void
}

export default function PurchaseCoins({ isOpen, onClose }: PurchaseCoinsProps) {
  const [selectedPackage, setSelectedPackage] = useState(COIN_PACKAGES[1])
  const [customAmount, setCustomAmount] = useState<string>('')
  const [useCustom, setUseCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'paypal'>('payfast')

  const customAmountNum = parseFloat(customAmount) || 0
  const customCoins = calculateCoins(customAmountNum)
  const isValidCustom = customAmountNum >= 5 && customAmountNum <= 10000

  const activePackage = useCustom && isValidCustom
    ? { zar: customAmountNum, coins: customCoins, bonus: customCoins - (customAmountNum * COINS_PER_ZAR) }
    : selectedPackage

  const handlePayFast = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payfast/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: activePackage.zar,
          itemName: `${activePackage.coins} SoundSync Coins`,
        }),
      });

      const data = await response.json();

      // Create a form and submit it
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;

      for (const key in data) {
        if (key !== 'action') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data[key];
          form.appendChild(input);
        }
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error initiating PayFast payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg max-w-md w-full border border-border max-h-[90vh] overflow-y-auto">
        <h2 className="text-foreground text-xl font-bold mb-4">Purchase Coins</h2>

        {/* Custom Amount Input */}
        <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center space-x-2 mb-3">
            <Calculator className="w-4 h-4 text-primary" />
            <label className="text-foreground text-sm font-semibold">Custom Amount</label>
          </div>
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
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
              className="pl-8 bg-background border-input text-foreground"
            />
          </div>
          {customAmount && (
            <div className="text-center p-2 bg-background rounded">
              <p className="text-sm text-muted-foreground">You&apos;ll receive</p>
              <p className="text-xl font-bold text-primary">
                {customCoins.toLocaleString()} coins
              </p>
              {activePackage.bonus > 0 && (
                <p className="text-xs text-green-500">+{activePackage.bonus} bonus</p>
              )}
            </div>
          )}
        </div>

        {/* Quick Select Packages */}
        <p className="text-sm text-muted-foreground mb-2">Or quick select:</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {COIN_PACKAGES.map(pkg => (
            <button
              key={pkg.zar}
              onClick={() => {
                setSelectedPackage(pkg)
                setUseCustom(false)
                setCustomAmount('')
              }}
              className={`p-3 rounded-lg border transition-all ${!useCustom && selectedPackage.zar === pkg.zar
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
                }`}
            >
              <Coins className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="text-foreground font-bold">{pkg.coins}</p>
              <p className="text-muted-foreground text-sm">R{pkg.zar}</p>
              {pkg.bonus > 0 && (
                <p className="text-green-500 text-xs">+{pkg.bonus}</p>
              )}
            </button>
          ))}
        </div>

        {/* Payment Method Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={paymentMethod === 'payfast' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('payfast')}
            className="flex-1"
          >
            PayFast
          </Button>
          <Button
            variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('paypal')}
            className="flex-1"
          >
            PayPal
          </Button>
        </div>

        {paymentMethod === 'payfast' ? (
          <Button
            onClick={handlePayFast}
            disabled={loading}
            className="w-full mt-4 bg-primary hover:bg-primary/90"
          >
            {loading ? 'Processing...' : `Pay R${activePackage.zar} with PayFast`}
          </Button>
        ) : (
          <div className="mt-4">
            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data: any, actions: any) => {
                  // Convert ZAR to USD (approximate or fetch real rate)
                  const usdAmount = (activePackage.zar / 18).toFixed(2);
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: usdAmount,
                        },
                        description: `${activePackage.coins} SoundSync Coins`,
                      },
                    ],
                  });
                }}
                onApprove={async (data: any, actions: any) => {
                  if (actions.order) {
                    const details = await actions.order.capture();
                    alert(`Transaction completed by ${details.payer?.name?.given_name}`);
                    // Here you would call your backend to credit coins
                    // await fetch('/api/wallet/credit', { ... })
                    onClose();
                  }
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-3 text-muted-foreground hover:text-foreground text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}