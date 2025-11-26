import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, ArrowRightLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { IncomeBreakdown } from '@/components/wallet/IncomeBreakdown'

export default async function WalletPage() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coinBalance: true }
    })

    const transactions = await prisma.coinTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 100
    })

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50 shadow-glow md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Coins className="w-6 h-6 text-yellow-400" />
                            <span>Current Balance</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-bold text-foreground">{user?.coinBalance.toLocaleString()}</span>
                            <span className="text-xl text-muted-foreground">coins</span>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <Button asChild className="gradient-primary text-white">
                                <Link href="/coins">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Buy Coins
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/wallet/transfer">
                                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                                    Transfer
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats or Actions */}
                <Card className="bg-card border-border shadow-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/merchandise">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Browse Merch
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/artists">
                                <Coins className="w-4 h-4 mr-2" />
                                Tip Artists
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Income Analysis */}
            <div className="mb-8">
                <IncomeBreakdown transactions={transactions.map(t => ({
                    ...t,
                    zarAmount: t.zarAmount ?? 0,
                    createdAt: t.createdAt.toISOString()
                }))} />
            </div>
        </div>
    )
}
