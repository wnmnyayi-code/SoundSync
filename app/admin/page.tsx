// app/admin/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Music, Activity, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { Icons } from "@/components/icons"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      description: "+20.1% from last month",
      change: "positive"
    },
    {
      title: "Total Songs",
      value: "5,678",
      icon: Music,
      description: "+12.3% from last month",
      change: "positive"
    },
    {
      title: "Active Users",
      value: "892",
      icon: Activity,
      description: "+5.2% from last month",
      change: "positive"
    },
    {
      title: "Revenue",
      value: "R45,231.89",
      icon: DollarSign,
      description: "+19% from last month",
      change: "positive"
    }
  ]

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent w-fit">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Overview of platform performance and management.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              System Alerts
            </CardTitle>
            <CardDescription>Critical updates and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-full flex items-center justify-center p-6 border border-dashed border-muted-foreground/20 rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}