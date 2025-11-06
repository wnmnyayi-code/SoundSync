'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Users } from 'lucide-react'

export default function FinancialDashboard() {
  return (
    <div className="min-h-screen p-8 bg-gradient-primary">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Financial Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <DollarSign className="w-8 h-8 text-green-400" />
              <CardTitle className="text-white">Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">R12,450</p>
              <p className="text-gray-400">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">VAT Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">R1,867</p>
              <p className="text-gray-400">15% standard rate</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Users className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">3,842</p>
              <p className="text-gray-400">of 6,000 limit</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <DollarSign className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Creator Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">R28,950</p>
              <p className="text-gray-400">Pending: R8,200</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-dark-800 border-primary-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-dark-700 rounded">
                  <div>
                    <p className="text-white font-semibold">Coin Purchase</p>
                    <p className="text-gray-400 text-sm">user@example.com</p>
                  </div>
                  <p className="text-green-400">+R50</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}