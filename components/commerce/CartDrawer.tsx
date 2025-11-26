'use client'

import { useCart } from './CartProvider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function CartDrawer() {
    const { items, removeItem, updateQuantity, cartTotal, isOpen, setIsOpen } = useCart()
    const router = useRouter()

    const handleCheckout = () => {
        setIsOpen(false)
        router.push('/checkout')
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-background border-l border-border">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Your Cart ({items.length})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-hidden py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <ShoppingCart className="w-12 h-12 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                    <Package className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.sellerName}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="font-semibold">R {item.price.toFixed(2)}</p>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive h-8 w-8"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between font-medium">
                            <span>Subtotal</span>
                            <span>R {cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Shipping calculated at checkout
                        </p>
                        <Button className="w-full" size="lg" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
