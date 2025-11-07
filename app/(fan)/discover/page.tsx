'use client'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Radio, Search, Users, Calendar, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Artist, LiveSession } from '@/types/discover'

function formatDateShort(iso?: string) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export default function DiscoverPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [liveArtists, setLiveArtists] = useState<Artist[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [artistsRes, sessionsRes] = await Promise.all([
        fetch('/api/artists/live'),
        fetch('/api/live/upcoming')
      ])

      if (!artistsRes.ok || !sessionsRes.ok) {
        throw new Error('Failed to load discover data')
      }

      const artistsData = await artistsRes.json()
      const sessionsData = await sessionsRes.json()

      setLiveArtists(artistsData.artists ?? [])
      setUpcomingSessions(sessionsData.sessions ?? [])
    } catch (err) {
      console.error('Discover error', err)
      toast({ title: 'Error', description: 'Failed to load discover page', className: 'bg-destructive' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRSVP = async (sessionId: string) => {
    if (!session?.user?.id) {
      toast({ title: 'Sign in', description: 'You must be signed in to RSVP' })
      router.push('/login')
      return
    }
    setRsvpLoading(sessionId)
    try {
      const res = await fetch('/api/live/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) })
      if (!res.ok) throw new Error('RSVP failed')
      toast({ title: 'RSVP confirmed', description: 'You are registered for this session', className: 'bg-success' })
      fetchData()
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'RSVP failed', className: 'bg-destructive' })
    } finally { setRsvpLoading(null) }
  }

  const filteredArtists = liveArtists.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || (a.artistName ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredSessions = upcomingSessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artistName.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary"><Spinner size="lg" /></div>
  )

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-primary">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Discover</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" placeholder="Search artists or sessions" />
          </div>
        </div>

        <section>
          <h2 className="text-xl text-white mb-4 flex items-center gap-2"><Radio className="w-5 h-5 text-primary-500" /> Live Now</h2>
          {filteredArtists.length === 0 ? (
            <Card className="bg-dark-800 border-primary-700"><CardContent className="p-6 text-gray-400">No live artists</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtists.map(artist => (
                <Card key={artist.id} className="bg-dark-800 border-primary-700">
                  <CardContent className="p-6 flex items-center gap-4">
                    {artist.profileImage ? <Image src={artist.profileImage} alt={artist.name} width={64} height={64} className="rounded-full" /> : <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center"><Music className="w-8 h-8 text-white" /></div>}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{artist.name}</h3>
                      <p className="text-gray-400 text-sm">{artist.artistName}</p>
                      <div className="text-sm text-gray-400 mt-2"><Users size={14} /> {artist.fans.toLocaleString()} fans</div>
                    </div>
                    <Button onClick={() => router.push(`/fan/artist/${artist.id}`)}>View</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" /> Upcoming Sessions</h2>
          {filteredSessions.length === 0 ? (
            <Card className="bg-dark-800 border-primary-700"><CardContent className="p-6 text-gray-400">No upcoming sessions</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSessions.map(s => (
                <Card key={s.id} className="bg-dark-800 border-primary-700">
                  <CardContent className="p-6 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{s.title}</h3>
                      <p className="text-primary-400">by {s.artistName}</p>
                      <p className="text-gray-400 text-sm mt-2">{formatDateShort(s.scheduledAt)}</p>
                      <div className="flex items-center gap-4 mt-4 text-gray-400"><Users size={14} /> {s.currentAttendees}/{s.maxAttendees}</div>
                    </div>
                    <Button disabled={rsvpLoading === s.id} onClick={() => handleRSVP(s.id)}>
                      {rsvpLoading === s.id ? 'RSVPing...' : `RSVP ${s.rsvpPrice} coins`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}