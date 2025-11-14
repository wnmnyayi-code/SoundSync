export type Role = 'FAN' | 'ARTIST' | 'MERCHANT' | 'INFLUENCER' | 'ADMIN'
export type SubscriptionTier = 'BASIC' | 'STANDARD' | 'PREMIUM'
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type ArtistStatus = 'INDEPENDENT' | 'SIGNED' | 'REGISTERED'
export type StoreType = 'NONE' | 'RENTED' | 'PERMANENT'

// Auth
export interface Session {
  user: {
    id: string
    email: string
    roles: Role[] // Users can have multiple roles based on subscription
    primaryRole: Role
    subscriptionTier: SubscriptionTier
    artistName?: string
    coinBalance: number
    verified: boolean
  }
}

// Forms
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  artistName?: string
  primaryRole: Role
  subscriptionTier: SubscriptionTier
  artistStatus?: ArtistStatus
  sambro?: string
  sarsNumber?: string
}

// API Responses
export interface ApiResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

// Features
export interface CoinPackage {
  zar: number
  coins: number
  bonus?: number
}

// Standard coin packages as per structure.txt
export const COIN_PACKAGES: CoinPackage[] = [
  { zar: 10, coins: 200 },
  { zar: 25, coins: 500 },
  { zar: 50, coins: 1000 }
]

// Subscription pricing
export interface SubscriptionPlan {
  tier: SubscriptionTier
  name: string
  price: number // in ZAR
  rolesAllowed: number
  features: string[]
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'BASIC',
    name: 'Basic',
    price: 0,
    rolesAllowed: 1,
    features: ['Access one role', 'Basic features']
  },
  {
    tier: 'STANDARD',
    name: 'Standard',
    price: 99,
    rolesAllowed: 2,
    features: ['Access two roles', 'Priority support']
  },
  {
    tier: 'PREMIUM',
    name: 'Premium',
    price: 199,
    rolesAllowed: 4,
    features: ['Access all roles', 'Premium support', 'Advanced analytics']
  }
]

export interface LiveSession {
  id: string
  creatorId: string
  scheduledAt: Date
  rsvpPriceCoins: number
  maxAttendees: number
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED'
  streamUrl?: string
  attendees: number
}

// Components
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered'
}