'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCategory, ProductCondition } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, ShoppingCart, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/commerce/CartProvider'

type Product = {
    id: string
    title: string
    price: number
    category: ProductCategory
    condition: ProductCondition
    imageUrl: string | null
    images: string[]
    inventory: number
    deliveryRadius: number | null
    seller: {
        name: string | null
        image: string | null
        role: string
        storeType: string
        ficaVerified: boolean
    }
}

export function MerchandiseBrowseView({
    products,
    initialFilters
}: {
    products: Product[]
    initialFilters: any
}) {
    const router = useRouter()
    const { addItem } = useCart()
    const [search, setSearch] = useState(initialFilters.search || '')

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search)
        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/merchandise?${params.toString()}`)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        handleFilterChange('search', search)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Music Store</h1>
                    <p className="text-muted-foreground">Browse gear, software, and merchandise from artists and merchants</p>
                </div>

                <div className="flex gap-2">
                    <Link href="/store/apply">
                        <Button variant="outline">Open Your Store</Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border rounded-lg p-4 mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <Select
                        defaultValue={initialFilters.category || 'all'}
                        onValueChange={(val) => handleFilterChange('category', val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="PHYSICAL">Physical</SelectItem>
                            <SelectItem value="DIGITAL">Digital</SelectItem>
                            <SelectItem value="SOFTWARE">Software</SelectItem>
                            <SelectItem value="HARDWARE">Hardware</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        defaultValue={initialFilters.condition || 'all'}
                        onValueChange={(val) => handleFilterChange('condition', val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Condition</SelectItem>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="USED">Used</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        defaultValue={initialFilters.sellerType || 'all'}
                        onValueChange={(val) => handleFilterChange('sellerType', val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seller" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sellers</SelectItem>
                            <SelectItem value="soundsync">SoundSync Official</SelectItem>
                            <SelectItem value="artist">Artists</SelectItem>
                            <SelectItem value="merchant">Merchants</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
                    <Button
                        variant="link"
                        onClick={() => router.push('/merchandise')}
                        className="mt-4"
                    >
                        Clear all filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                            <div className="relative aspect-square bg-muted">
                                {product.imageUrl || (product.images && product.images[0]) ? (
                                    <Image
                                        src={product.imageUrl || product.images[0]}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                    <Badge variant={product.condition === 'NEW' ? 'default' : 'secondary'}>
                                        {product.condition}
                                    </Badge>
                                    {product.category === 'DIGITAL' || product.category === 'SOFTWARE' ? (
                                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                                            Download
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>

                            <CardHeader className="p-4 pb-0">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg line-clamp-1" title={product.title}>
                                        {product.title}
                                    </CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    by {product.seller.name || 'Unknown Seller'}
                                    {product.seller.ficaVerified && (
                                        <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full" title="FICA Verified" />
                                    )}
                                </p>
                            </CardHeader>

                            <CardContent className="p-4 flex-1">
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xl font-bold">R {product.price.toFixed(2)}</span>
                                    {product.deliveryRadius && (
                                        <div className="flex items-center text-xs text-muted-foreground" title={`Delivery within ${product.deliveryRadius}km`}>
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {product.deliveryRadius}km
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <Button
                                    className="w-full"
                                    onClick={() => addItem({
                                        productId: product.id,
                                        title: product.title,
                                        price: product.price,
                                        image: product.imageUrl || product.images[0],
                                        quantity: 1,
                                        sellerId: product.seller.name || 'Unknown', // Using name as ID for now, should be actual ID
                                        sellerName: product.seller.name || 'Unknown',
                                        category: product.category,
                                        deliveryRadius: product.deliveryRadius
                                    })}
                                    disabled={product.inventory <= 0 && product.category !== 'DIGITAL' && product.category !== 'SOFTWARE'}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {product.inventory <= 0 && product.category !== 'DIGITAL' && product.category !== 'SOFTWARE'
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
