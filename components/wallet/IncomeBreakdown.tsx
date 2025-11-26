'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowDownLeft, ArrowUpRight, Gift, Heart, ShoppingBag, Users } from 'lucide-react'

interface Transaction {
    id: string
    type: string
    amount: number
    zarAmount: number
    createdAt: string
    relatedId?: string
}

interface IncomeBreakdownProps {
    transactions: Transaction[]
}

export function IncomeBreakdown({ transactions }: IncomeBreakdownProps) {
    // Filter income transactions (positive amount or specific types)
    const income = transactions.filter(t => t.amount > 0 || t.type === 'COMMISSION')

    const incomeByType = income.reduce((acc, t) => {
        const type = t.type
        if (!acc[type]) acc[type] = 0
        acc[type] += t.amount
        return acc
    }, {} as Record<string, number>)

    const totalIncome = Object.values(incomeByType).reduce((a, b) => a + b, 0)

    const getIcon = (type: string) => {
        switch (type) {
            case 'TIP_RECEIVED': return <Heart className="w-4 h-4 text-pink-500" />
            case 'GIFT_RECEIVED': return <Gift className="w-4 h-4 text-purple-500" />
            case 'COMMISSION': return <Users className="w-4 h-4 text-blue-500" />
            case 'PURCHASE': return <ShoppingBag className="w-4 h-4 text-green-500" /> // If we track sales here
            default: return <ArrowDownLeft className="w-4 h-4 text-green-500" />
        }
    }

    const getLabel = (type: string) => {
        switch (type) {
            case 'TIP_RECEIVED': return 'Tips'
            case 'GIFT_RECEIVED': return 'Gifts'
            case 'COMMISSION': return 'Referral Commissions'
            case 'PURCHASE': return 'Coin Purchases' // Or Sales
            default: return type.replace('_', ' ')
        }
    }

    return (
        <Card className="bg-card border-border shadow-card">
            <CardHeader>
                <CardTitle>Income Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(incomeByType).map(([type, amount]) => (
                        <div key={type} className="bg-muted/20 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-card rounded-full border border-border">
                                    {getIcon(type)}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{getLabel(type)}</p>
                                    <p className="text-lg font-bold text-foreground">{amount.toLocaleString()} c</p>
                                </div>
                            </div>
                            <div className="text-xs text-accent font-medium">
                                {((amount / totalIncome) * 100).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Income</h3>
                <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                        {income.slice(0, 20).map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 hover:bg-muted/20 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-muted/30 rounded-full">
                                        {getIcon(t.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{getLabel(t.type)}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-500">+{t.amount.toLocaleString()}</p>
                                    {t.zarAmount > 0 && (
                                        <p className="text-xs text-muted-foreground">R{t.zarAmount.toFixed(2)}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {income.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No income transactions yet.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
