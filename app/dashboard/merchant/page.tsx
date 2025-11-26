import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function MerchantDashboardPage() {
    return (
        <div className="container py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent w-fit">
                    Merchant Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage your store, track orders, and grow your business.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Icons.store className="h-5 w-5" />
                            Store Management
                        </CardTitle>
                        <CardDescription>Manage your products and inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                            Add New Product
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Icons.shoppingBag className="h-5 w-5" />
                            Orders
                        </CardTitle>
                        <CardDescription>Track and fulfill orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-24 rounded-md bg-muted/50 flex items-center justify-center border border-dashed border-muted-foreground/20">
                            <p className="text-sm text-muted-foreground">No pending orders</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Icons.wallet className="h-5 w-5" />
                            Earnings
                        </CardTitle>
                        <CardDescription>View your revenue and payouts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary">
                            View Financials
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
