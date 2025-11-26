'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCategory, ProductCondition } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShoppingCart, MapPin, CheckCircle2, Package, ArrowLeft } from 'lucide-react'
import { useCart } from '@/components/commerce/CartProvider'
import { useToast } from '@/components/ui/use-toast'
import { ShareButton } from '@/components/ShareButton'

type Product = {
    id: string
    title: string
    description: string | null
    price: number
    category: ProductCategory
    condition: ProductCondition
    imageUrl: string | null
    images: string[]
    inventory: number
    deliveryRadius: number | null
    sellerId: string
    seller: {
        id: string
        name: string | null
        image: string | null
        role: string
        storeType: string
        ficaVerified: boolean
        bio: string | null
    }
}

type RelatedProduct = {
    id: string
    title: string
    price: number
    imageUrl: string | null
    images: string[]
    category: ProductCategory
    condition: ProductCondition
    inventory: number
    deliveryRadius: number | null
    seller: {
        name: string | null
        ficaVerified: boolean
    }
}

export function ProductDetailView({
    product,
    relatedProducts
}: {
    product: Product
    relatedProducts: RelatedProduct[]
}) {
    const { addItem } = useCart()
    const { toast } = useToast()
    const [selectedImage, setSelectedImage] = useState<string>(
        product.imageUrl || (product.images && product.images[0]) || ''
    )

    const allImages = [
        ...(product.imageUrl ? [product.imageUrl] : []),
        ...(product.images || [])
    ].filter(Boolean)

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: selectedImage,
            quantity: 1,
            sellerId: product.seller.name || 'Unknown',
            sellerName: product.seller.name || 'Unknown',
            category: product.category,
            deliveryRadius: product.deliveryRadius
        })

        toast({
            title: "Added to cart",
            description: `${product.title} has been added to your cart.`,
        })
    }

    const isDigital = product.category === 'DIGITAL' || product.category === 'SOFTWARE'
    const isOutOfStock = product.inventory <= 0 && !isDigital

    return (
        <div className="container mx-auto py-8 px-4">
            <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-0">
                <Link href="/merchandise" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border">
                        {selectedImage ? (
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <Package className="w-16 h-16 opacity-20" />
                            </div>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${selectedImage === img ? 'border-primary' : 'border-transparent'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.title} view ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <Badge variant={product.condition === 'NEW' ? 'default' : 'secondary'}>
                                {product.condition}
                            </Badge>
                            {isDigital && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                    Instant Download
                                </Badge>
                            )}
                        </div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                            <ShareButton
                                title={product.title}
                                url={`/merchandise/${product.id}`}
                                description={product.description || `Check out ${product.title} on SoundSync`}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                            <span>Sold by</span>
                            <Link href={`/artists/${product.sellerId}`} className="font-medium text-foreground hover:underline flex items-center gap-1">
                                {product.seller.name}
                                {product.seller.ficaVerified && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">R {product.price.toFixed(2)}</span>
                    </div>

                    {!isDigital && product.deliveryRadius && (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>
                                Delivery available within <strong>{product.deliveryRadius}km</strong> of seller location
                            </span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="w-full md:w-auto min-w-[200px]"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>

                        {!isDigital && (
                            <p className={`text-sm ${product.inventory < 5 ? 'text-orange-500 font-medium' : 'text-muted-foreground'}`}>
                                {product.inventory} units available
                            </p>
                        )}
                    </div>

                    <Separator />

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                            {product.description || 'No description available.'}
                        </p>
                    </div>

                    {/* Seller Bio */}
                    {product.seller.bio && (
                        <div className="bg-muted/30 p-4 rounded-lg mt-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar>
                                    <AvatarImage src={product.seller.image || undefined} />
                                    <AvatarFallback>{product.seller.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">About the Seller</p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.seller.role === 'ADMIN' ? 'Official Store' :
                                            product.seller.storeType === 'PERMANENT' ? 'Permanent Store' : 'Rented Store'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{product.seller.bio}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">More from {product.seller.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((item) => (
                            <Link key={item.id} href={`/merchandise/${item.id}`}>
                                <Card className="h-full hover:shadow-md transition-shadow">
                                    <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
                                        {item.imageUrl || (item.images && item.images[0]) ? (
                                            <Image
                                                src={item.imageUrl || item.images[0]}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                <Package className="w-8 h-8 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-medium line-clamp-1 mb-1">{item.title}</h3>
                                        <p className="font-bold">R {item.price.toFixed(2)}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
