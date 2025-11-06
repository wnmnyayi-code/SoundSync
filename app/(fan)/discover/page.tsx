'use client'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Radio } from 'lucide-react'

const LIVE_ARTISTS = [
  { id: '1', name: 'DJ Zinhle', fans: 1245, price: 20 },
  { id: '2', name: 'Sha Sha', fans: 892, price: 10 },
  { id: '3', name: 'Kabza De Small', fans: 2301, price: 15 }
]

export default function Discover() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Discover Artists</h1>

        {/* Live Now Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Radio className="w-5 h-5 mr-2 text-red-500" />
            Live Now 🔴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_ARTISTS.map(artist => (
              <Card key={artist.id} className="bg-dark-800 border-primary-700 hover:border-primary-600 transition">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">{artist.name}</h3>
                      <p className="text-gray-400 text-sm">{artist.fans} fans</p>
                    </div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">Listening Party • 45 min left</p>
                  <Button className="w-full bg-primary-600 hover:bg-primary-700">
                    Join for R{artist.price}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Parties */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Parties</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-dark-800 border-primary-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Tomorrow 7:00 PM</h3>
                      <p className="text-gray-400">@Ami Faku • New single drop</p>
                    </div>
                  </div>
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    RSVP R10
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}