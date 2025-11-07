export type Role = 'FAN' | 'CREATOR' | 'ADMIN'
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type StoreType = 'NONE' | 'RENTED' | 'PERMANENT'

// Auth
export interface Session {
  user: {
    id: string
    email: string
    role: Role
    artistName?: string
    coinBalance: number
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
  role: Role
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
  bonus: number
}

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