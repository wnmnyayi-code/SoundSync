'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Store, ShieldCheck, FileText } from 'lucide-react'

export function StoreApplicationForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [storeType, setStoreType] = useState<'RENTED' | 'PERMANENT'>('RENTED')
    const [ficaFile, setFicaFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!ficaFile) {
            toast({
                title: "Missing Documents",
                description: "Please upload your FICA documents to proceed.",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)

        try {
            // 1. Upload file (mock for now, would use S3/UploadThing)
            // const formData = new FormData()
            // formData.append('file', ficaFile)
            // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
            // const { url } = await uploadRes.json()
            const mockUrl = `https://example.com/fica/${ficaFile.name}`

            // 2. Submit application
            const res = await fetch('/api/store/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeType,
                    ficaDocumentUrl: mockUrl
                })
            })

            if (!res.ok) throw new Error('Application failed')

            toast({
                title: "Application Submitted",
                description: "Your store application is now under review.",
            })

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

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Open Your Music Store</h1>
                <p className="text-muted-foreground">Start selling your gear, software, and merchandise on SoundSync.</p>
            </div>

            <div className="grid gap-8">
                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <Store className="w-8 h-8 mb-2 text-primary" />
                            <CardTitle className="text-lg">Sell Anything</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">List physical gear, digital downloads, software, and merch.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <ShieldCheck className="w-8 h-8 mb-2 text-primary" />
                            <CardTitle className="text-lg">Secure & Verified</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">FICA verification ensures a safe marketplace for all users.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <FileText className="w-8 h-8 mb-2 text-primary" />
                            <CardTitle className="text-lg">Easy Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Track inventory, sales, and delivery radius from one dashboard.</p>
                        </CardContent>
                    </Card>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Application</CardTitle>
                            <CardDescription>Choose your plan and verify your identity.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Plan Selection */}
                            <div className="space-y-3">
                                <Label className="text-base">Select Store Plan</Label>
                                <RadioGroup
                                    defaultValue="RENTED"
                                    onValueChange={(val: string) => setStoreType(val as 'RENTED' | 'PERMANENT')}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <RadioGroupItem value="RENTED" id="rented" className="peer sr-only" />
                                        <Label
                                            htmlFor="rented"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <span className="text-xl font-bold mb-2">Rented Store</span>
                                            <span className="text-2xl font-bold">R99<span className="text-sm font-normal text-muted-foreground">/month</span></span>
                                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground text-left w-full">
                                                <li>• List up to 50 products</li>
                                                <li>• Standard support</li>
                                                <li>• 5% transaction fee</li>
                                            </ul>
                                        </Label>
                                    </div>

                                    <div>
                                        <RadioGroupItem value="PERMANENT" id="permanent" className="peer sr-only" />
                                        <Label
                                            htmlFor="permanent"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <span className="text-xl font-bold mb-2">Permanent Store</span>
                                            <span className="text-2xl font-bold">R1000<span className="text-sm font-normal text-muted-foreground">/year</span></span>
                                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground text-left w-full">
                                                <li>• Unlimited products</li>
                                                <li>• Priority support</li>
                                                <li>• 2% transaction fee</li>
                                                <li>• Verified Seller Badge</li>
                                            </ul>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Separator />

                            {/* FICA Upload */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-base">FICA Verification</Label>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        To protect our buyers, we require all store owners to be FICA verified.
                                        Please upload a clear copy of your ID and proof of address (not older than 3 months).
                                    </p>
                                </div>

                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setFicaFile(e.target.files?.[0] || null)}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        {ficaFile ? (
                                            <div className="text-primary font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                {ficaFile.name}
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-medium">Click to upload documents</p>
                                                <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max 10MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}
