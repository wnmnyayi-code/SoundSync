import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function ArtistDashboardPage() {
    return (
        <div className="container py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent w-fit">
                    Artist Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage your music, analyze your performance, and connect with your fans.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Icons.upload className="h-5 w-5" />
                            Upload Music
                        </CardTitle>
                        <CardDescription>Share your latest tracks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                            Upload New Track
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Icons.barChart className="h-5 w-5" />
                            Analytics
                        </CardTitle>
                        <CardDescription>View your performance stats</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-24 rounded-md bg-muted/50 flex items-center justify-center border border-dashed border-muted-foreground/20">
                            <p className="text-sm text-muted-foreground">No data available yet</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Icons.users className="h-5 w-5" />
                            Fanbase
                        </CardTitle>
                        <CardDescription>Engage with your community</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary">
                            View Community
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
