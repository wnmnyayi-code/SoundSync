'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const PACKAGES = [
    { amount: 200, price: 10, label: 'Starter' },
    { amount: 500, price: 25, label: 'Popular' },
    { amount: 1000, price: 50, label: 'Pro' },
    { amount: 5000, price: 200, label: 'Whale' },
]

export default function CoinPackages() {
    const [loading, setLoading] = useState<number | null>(null)
    const { toast } = useToast()

    const handlePurchase = async (pkg: typeof PACKAGES[0]) => {
        setLoading(pkg.amount)
        try {
            // Mock purchase for now
            // In real app, this would redirect to payment gateway or open modal
            const res = await fetch('/api/wallet/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: pkg.amount, price: pkg.price })
            })

            if (!res.ok) throw new Error('Purchase failed')

            toast({
                title: "Coins Purchased!",
                description: `Successfully added ${pkg.amount} coins to your wallet.`,
            })

            // Refresh page to update balance (or use context)
            window.location.reload()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process purchase. Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PACKAGES.map((pkg) => (
                <Card key={pkg.amount} className="bg-dark-800 border-primary-800 hover:border-primary-500 transition-all relative overflow-hidden">
                    {pkg.label === 'Popular' && (
                        <div className="absolute top-0 right-0 bg-primary-600 text-xs px-2 py-1 rounded-bl-lg font-bold">
                            BEST VALUE
                        </div>
                    )}
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-primary-900/50 p-3 rounded-full mb-2">
                            <Coins className="w-8 h-8 text-primary-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">{pkg.amount} Coins</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-3xl font-bold text-primary-400 mb-4">R{pkg.price}</p>
                        <Button
                            onClick={() => handlePurchase(pkg)}
                            disabled={loading !== null}
                            className="w-full bg-primary-600 hover:bg-primary-700"
                        >
                            {loading === pkg.amount ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Buy Now'}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
