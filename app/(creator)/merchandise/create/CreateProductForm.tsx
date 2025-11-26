'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

export function CreateProductForm({ ficaVerified }: { ficaVerified: boolean }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] = useState<string>('')
    const [images, setImages] = useState<File[]>([])
    const [digitalFile, setDigitalFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title')
        const price = formData.get('price')
        const description = formData.get('description')
        const condition = formData.get('condition')
        const inventory = formData.get('inventory')
        const deliveryRadius = formData.get('deliveryRadius')

        // Validation
        if (category === 'PHYSICAL' || category === 'HARDWARE') {
            if (!ficaVerified) {
                toast({
                    title: "Verification Required",
                    description: "You must be FICA verified to sell physical items.",
                    variant: "destructive"
                })
                return
            }
            if (!deliveryRadius) {
                toast({
                    title: "Missing Field",
                    description: "Delivery radius is required for physical items.",
                    variant: "destructive"
                })
                return
            }
        }

        setIsLoading(true)

        try {
            // Mock file uploads
            const imageUrls = images.map(file => `https://example.com/images/${file.name}`)
            const fileUrl = digitalFile ? `https://example.com/files/${digitalFile.name}` : null

            const res = await fetch('/api/merchandise/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    price: parseFloat(price as string),
                    category,
                    condition: condition || 'NEW',
                    inventory: parseInt(inventory as string),
                    deliveryRadius: deliveryRadius ? parseFloat(deliveryRadius as string) : null,
                    images: imageUrls,
                    imageUrl: imageUrls[0] || null,
                    fileUrl
                })
            })

            if (!res.ok) throw new Error('Failed to create product')

            toast({
                title: "Product Created",
                description: "Your product has been listed successfully.",
            })

            router.push('/merchandise')
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const isPhysical = category === 'PHYSICAL' || category === 'HARDWARE'
    const isDigital = category === 'DIGITAL' || category === 'SOFTWARE'

    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>List New Product</CardTitle>
                    <CardDescription>Add a new item to your store.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">

                        {/* FICA Warning */}
                        {!ficaVerified && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Verification Required</AlertTitle>
                                <AlertDescription>
                                    You are not FICA verified yet. You can only list digital products or software.
                                    Physical items and hardware require verification.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title">Product Title</Label>
                            <Input id="title" name="title" required placeholder="e.g. Professional Studio Microphone" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select onValueChange={setCategory} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PHYSICAL" disabled={!ficaVerified}>Physical Item</SelectItem>
                                        <SelectItem value="HARDWARE" disabled={!ficaVerified}>Music Hardware</SelectItem>
                                        <SelectItem value="DIGITAL">Digital Download</SelectItem>
                                        <SelectItem value="SOFTWARE">Music Software</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Condition</Label>
                                <Select name="condition" defaultValue="NEW" disabled={isDigital}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NEW">New</SelectItem>
                                        <SelectItem value="USED">Used</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (R)</Label>
                                <Input id="price" name="price" type="number" min="0" step="0.01" required placeholder="0.00" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="inventory">Inventory</Label>
                                <Input id="inventory" name="inventory" type="number" min="0" required defaultValue="1" />
                            </div>
                        </div>

                        {isPhysical && (
                            <div className="space-y-2">
                                <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                                <Input
                                    id="deliveryRadius"
                                    name="deliveryRadius"
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="e.g. 50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maximum distance you are willing to deliver this item.
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Describe your product..."
                                className="min-h-[120px]"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Product Images</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    {images.length > 0 ? (
                                        <div className="text-primary font-medium">
                                            {images.length} image(s) selected
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-medium">Click to upload images</p>
                                            <p className="text-xs text-muted-foreground">JPG or PNG (max 5MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Digital File Upload */}
                        {isDigital && (
                            <div className="space-y-2">
                                <Label>Digital File</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".zip,.pdf,.mp3,.wav"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setDigitalFile(e.target.files?.[0] || null)}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        {digitalFile ? (
                                            <div className="text-primary font-medium">
                                                {digitalFile.name}
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-medium">Click to upload product file</p>
                                                <p className="text-xs text-muted-foreground">ZIP, PDF, MP3 or WAV</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? <Spinner className="mr-2" /> : null}
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
