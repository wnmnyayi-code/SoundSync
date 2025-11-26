'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/components/commerce/CartProvider'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        if (sessionId) {
            clearCart()
        }
    }, [sessionId, clearCart])

    return (
        <div className="container mx-auto py-24 px-4 text-center max-w-lg">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
                Thank you for your purchase. You will receive an email confirmation shortly.
                For digital items, check your email for download links.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                    <Link href="/merchandise">
                        Continue Shopping
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/dashboard">
                        View Orders
                    </Link>
                </Button>
            </div>
        </div>
    )
}
