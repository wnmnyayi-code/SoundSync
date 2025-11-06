'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, Users, ShoppingBag } from 'lucide-react'

export default function ArtistPage({ params }: { params: { artistId: string } }) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="min-h-screen p-8 bg-gradient-primary">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
            <Music className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Artist Name</h1>
            <p className="text-gray-400">@{params.artistId}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-300"><Users className="inline w-4 h-4 mr-1" /> 1,245 fans</span>
            </div>
          </div>
          <Button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={isFollowing ? 'bg-gray-600' : 'bg-primary-600'}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Upcoming Sessions</h2>
            <Card className="bg-dark-800 border-primary-700">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold">Live Listening Party</h3>
                <p className="text-gray-400">Tomorrow 8:00 PM</p>
                <p className="text-gray-300 mt-2">Join for an exclusive preview of new tracks</p>
                <Button className="mt-4 bg-primary-600">RSVP for R10</Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Merchandise</h2>
            <Card className="bg-dark-800 border-primary-700">
              <CardContent className="p-6">
                <ShoppingBag className="w-8 h-8 text-primary-400 mb-2" />
                <h3 className="text-white font-semibold">Official Store</h3>
                <p className="text-gray-400 text-sm">T-shirts, hoodies, and more</p>
                <Button className="mt-4 w-full bg-primary-600">Visit Store</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}