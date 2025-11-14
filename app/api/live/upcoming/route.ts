import { NextResponse } from 'next/server'

export async function GET() {
  // Mock upcoming sessions for demo
  const mockSessions = {
    sessions: [
      {
        id: '1',
        artistId: '1',
        artistName: 'DJ Maphorisa',
        title: 'Amapiano Friday Night',
        description: 'Join us for an exclusive amapiano session',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        rsvpPrice: 100,
        maxAttendees: 500,
        currentAttendees: 234,
        status: 'SCHEDULED' as const
      },
      {
        id: '2',
        artistId: '2',
        artistName: 'Kabza De Small',
        title: 'Piano Hub Live',
        description: 'Experience the best of South African piano',
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        rsvpPrice: 150,
        maxAttendees: 1000,
        currentAttendees: 567,
        status: 'SCHEDULED' as const
      }
    ],
    totalCount: 2
  }

  return NextResponse.json(mockSessions)
}