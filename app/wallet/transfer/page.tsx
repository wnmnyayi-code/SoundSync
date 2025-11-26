'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'

const transferFormSchema = z.object({
    recipientEmail: z.string().email('Invalid email address'),
    amount: z.number().min(1, 'Amount must be at least 1'),
    message: z.string().optional()
})

export default function TransferPage() {
    const { data: session, update } = useSession()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof transferFormSchema>>({
        resolver: zodResolver(transferFormSchema),
        defaultValues: {
            recipientEmail: '',
            amount: 10,
            message: ''
        }
    })

    async function onSubmit(data: z.infer<typeof transferFormSchema>) {
        setIsLoading(true)
        try {
            const res = await fetch('/api/wallet/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.error || 'Transfer failed')
            }

            toast({
                title: 'Transfer Successful',
                description: `Sent ${data.amount} coins to ${data.recipientEmail}`,
            })

            form.reset()
            update() // Update session to reflect new balance (if we stored balance in session, otherwise need to fetch)

        } catch (error) {
            toast({
                title: 'Transfer Failed',
                description: error instanceof Error ? error.message : 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>Send Coins</CardTitle>
                    <CardDescription>Transfer coins to another user instantly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Your Balance</p>
                        <p className="text-3xl font-bold text-primary">{session?.user?.coinBalance || 0} Coins</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="recipientEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="friend@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="100"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="For the pizza!" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Send Coins
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
