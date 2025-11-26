import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default async function BrowseArtistsPage() {
  const artists = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: {
      id: true,
      artistName: true,
      image: true,
      bio: true,
      _count: {
        select: { tracks: true, sessions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Browse Artists</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search artists..." className="pl-8 bg-dark-800 border-primary-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Link href={`/artists/${artist.id}`} key={artist.id}>
              <Card className="bg-dark-800 border-primary-800 hover:border-primary-500 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-primary-500">
                    <AvatarImage src={artist.image || ''} />
                    <AvatarFallback className="text-2xl bg-primary-900 text-primary-200">
                      {artist.artistName?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mb-2">{artist.artistName || 'Unknown Artist'}</h2>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                    {artist.bio || 'No bio available.'}
                  </p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{artist._count.tracks} Tracks</span>
                    <span>{artist._count.sessions} Sessions</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {artists.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-12">No artists found.</p>
          )}
        </div>
      </div>
    </div>
  )
}