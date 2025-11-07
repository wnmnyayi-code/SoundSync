export interface Artist {
  id: string
  name: string
  artistName: string
  profileImage?: string
  fans: number
  price: number
  isLive: boolean
  currentTrack?: string
  lastSeenAt: string
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface LiveSession {
  id: string
  artistId: string
  artistName: string
  title: string
  description?: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  rsvpPrice: number
  maxAttendees: number
  currentAttendees: number
  thumbnail?: string
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED'
}

export interface LiveArtistsResponse {
  artists: Artist[]
  totalCount: number
}

export interface UpcomingSessionsResponse {
  sessions: LiveSession[]
  totalCount: number
}