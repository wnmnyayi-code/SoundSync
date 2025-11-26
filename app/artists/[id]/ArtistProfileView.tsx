'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Play, Calendar, Clock, Lock, MessageCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { ShareButton } from '@/components/ShareButton'
import { FollowButton } from '@/components/FollowButton'
import { useSession } from 'next-auth/react'

interface ArtistProfileViewProps {
    artist: any
    userRsvps: string[]
    currentUserId?: string
}

export default function ArtistProfileView({ artist, userRsvps, currentUserId }: ArtistProfileViewProps) {
    const { data: session } = useSession()
    const [playingTrack, setPlayingTrack] = useState<string | null>(null)
    const { toast } = useToast()

    const handlePlay = (trackId: string) => {
        // TODO: Implement global audio player context
        setPlayingTrack(playingTrack === trackId ? null : trackId)
        toast({
            title: "Playing Track",
            description: "Global player integration coming soon.",
        })
    }

    return (
        <div className="min-h-screen bg-dark-900 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-6 bg-dark-800 p-8 rounded-xl border border-primary-800/50">
                    <Avatar className="w-32 h-32 border-4 border-primary-600">
                        <AvatarImage src={artist.image || ''} />
                        <AvatarFallback className="text-4xl bg-primary-900 text-primary-200">
                            {artist.artistName?.[0] || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{artist.artistName || 'Unknown Artist'}</h1>
                                <p className="text-gray-400 max-w-xl">{artist.bio || 'No bio available.'}</p>
                            </div>
                            <div className="flex gap-2">
                                <FollowButton targetUserId={artist.id} />
                                {session && session.user.id !== artist.id && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/messages?userId=${artist.id}`}>
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Message
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <ShareButton
                                title={`Check out ${artist.artistName} on SoundSync`}
                                url={`/artists/${artist.id}`}
                                description={artist.bio || `Listen to ${artist.artistName}'s latest tracks and join their live sessions.`}
                            />
                        </div>
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Calendar className="mr-2 text-primary-500" /> Upcoming Live Sessions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {artist.sessions.length > 0 ? artist.sessions.map((session: any) => (
                            <Card key={session.id} className="bg-dark-800 border-primary-800">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white flex justify-between items-center">
                                        <span>Live Session</span>
                                        <span className="text-sm font-normal text-primary-400">
                                            {session.rsvpPriceCoins === 0 ? 'FREE' : `${session.rsvpPriceCoins} Coins`}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <Clock className="mr-2 w-4 h-4" />
                                            {new Date(session.scheduledAt).toLocaleString()}
                                        </div>
                                        {userRsvps.includes(session.id) ? (
                                            <Link href={`/live/${session.id}`} className="block">
                                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                                    <Play className="mr-2 w-4 h-4" /> Join Room
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href={`/live/${session.id}`} className="block">
                                                <Button className="w-full bg-primary-600 hover:bg-primary-700">
                                                    <Lock className="mr-2 w-4 h-4" /> RSVP
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <p className="text-gray-500 italic">No upcoming sessions scheduled.</p>
                        )}
                    </div>
                </section>

                {/* Tracks */}
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Play className="mr-2 text-primary-500" /> Latest Tracks
                    </h2>
                    <div className="space-y-2">
                        {artist.tracks.length > 0 ? artist.tracks.map((track: any) => (
                            <div key={track.id} className="flex items-center justify-between bg-dark-800 p-4 rounded-lg hover:bg-dark-700 transition-colors group">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-primary-400 hover:text-primary-300 hover:bg-primary-900/20"
                                        onClick={() => handlePlay(track.id)}
                                    >
                                        {playingTrack === track.id ? <div className="w-4 h-4 bg-primary-500 animate-pulse rounded-full" /> : <Play className="w-5 h-5" />}
                                    </Button>
                                    <div>
                                        <p className="font-medium text-white">{track.originalName.replace(/\.[^/.]+$/, "")}</p>
                                        <p className="text-xs text-gray-500">{Math.floor(track.duration / 60)}:{(Math.floor(track.duration % 60)).toString().padStart(2, '0')}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {/* Placeholder for plays/likes if added later */}
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic">No tracks uploaded yet.</p>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}
