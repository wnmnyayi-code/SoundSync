'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Users, Coins, Store } from 'lucide-react'
import Link from 'next/link'

export default function CreatorDashboard() {
  const { data: session } = useSession()
  
  if (!session || session.user.role !== 'CREATOR') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
            <p className="text-gray-400">Welcome, {session.user.artistName}</p>
          </div>
          <div className="wallet-gradient px-4 py-2 rounded-lg text-white">
            <Coins className="inline w-4 h-4 mr-2" />
            {session.user.coinBalance} coins
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Music className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">My Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-gray-400">Total uploads</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Users className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Fans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">245</p>
              <p className="text-gray-400">Following you</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Coins className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">R1,240</p>
              <p className="text-gray-400">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Store className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Store</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-white">Rented</p>
              <p className="text-gray-400">Expires in 15 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <CardTitle className="text-white">My Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-dark-700 p-4 rounded-lg mb-4">
                <h3 className="text-white font-semibold">Vibes Playlist</h3>
                <p className="text-gray-400">8 tracks • 32 minutes</p>
                <div className="mt-3 space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" className="bg-primary-600">Go Live</Button>
                </div>
              </div>
              <Button className="w-full bg-primary-600 hover:bg-primary-700">
                + Create New Playlist
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <CardTitle className="text-white">Next Listening Party</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-dark-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold">Tonight 8:00 PM</h3>
                <p className="text-gray-400">Album preview session</p>
                <p className="text-primary-400 mt-2">45 RSVPs • R20 ticket</p>
                <div className="mt-4 space-x-2">
                  <Button size="sm" variant="outline">Cancel</Button>
                  <Button size="sm" className="bg-primary-600">Share Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/upload">
            <Button className="bg-primary-600 hover:bg-primary-700">
              Upload Track
            </Button>
          </Link>
          <Link href="/live/create">
            <Button className="bg-green-600 hover:bg-green-700">
              Start Live Party
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}