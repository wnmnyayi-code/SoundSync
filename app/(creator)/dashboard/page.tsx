'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Users, Coins, Store } from 'lucide-react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'

export default function CreatorDashboard() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [upcomingSession, setUpcomingSession] = useState<any>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, playlistsRes, sessionRes] = await Promise.all([
          fetch('/api/creator/stats'),
          fetch('/api/creator/playlists'),
          fetch('/api/creator/upcoming-session')
        ])

        if (!statsRes.ok || !playlistsRes.ok || !sessionRes.ok) {
          throw new Error('Failed to fetch creator data')
        }

        const [statsData, playlistsData, sessionData] = await Promise.all([
          statsRes.json(),
          playlistsRes.json(),
          sessionRes.json()
        ])

        setStats(statsData)
        setPlaylists(playlistsData)
        setUpcomingSession(sessionData)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
        setIsLoading(false)
      }
    }

    if (session?.user.role === 'CREATOR') {
      fetchData()
    }
  }, [session])
  
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  }
  
  if (!session || session.user.role !== 'CREATOR') {
    redirect('/login')
  }

  if (error) {
    return <div className="min-h-screen p-4 md:p-8 bg-destructive/10">
      <div className="max-w-6xl mx-auto text-destructive">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    </div>
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
              <p className="text-2xl font-bold text-white">{stats?.tracks || 0}</p>
              <p className="text-gray-400">Total uploads</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Users className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Fans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{stats?.followers || 0}</p>
              <p className="text-gray-400">Following you</p>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-primary-700">
            <CardHeader>
              <Coins className="w-8 h-8 text-primary-400" />
              <CardTitle className="text-white">Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">R{stats?.monthlyEarnings || 0}</p>
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
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <div key={playlist.id} className="bg-dark-700 p-4 rounded-lg mb-4">
                    <h3 className="text-white font-semibold">{playlist.name}</h3>
                    <p className="text-gray-400">
                      {playlist.trackCount} tracks • {Math.round(playlist.totalDuration / 60)} minutes
                    </p>
                    <div className="mt-3 space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" className="bg-primary-600">Go Live</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center mb-4">No playlists yet</p>
              )}
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
              {upcomingSession ? (
                <div className="bg-dark-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold">
                    {new Date(upcomingSession.startTime).toLocaleString()}
                  </h3>
                  <p className="text-gray-400">{upcomingSession.title}</p>
                  <p className="text-primary-400 mt-2">
                    {upcomingSession.rsvpCount} RSVPs • R{upcomingSession.ticketPrice} ticket
                  </p>
                  <div className="mt-4 space-x-2">
                    <Button size="sm" variant="outline">Cancel</Button>
                    <Button size="sm" className="bg-primary-600">Share Link</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No upcoming sessions</p>
                  <Link href="/live/create">
                    <Button className="bg-primary-600 hover:bg-primary-700">
                      Schedule Session
                    </Button>
                  </Link>
                </div>
              )}
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