import { type Session } from 'next-auth'

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean
  error?: string
  data?: T
}

// Auth Routes
export interface RegisterRequest {
  email: string
  password: string
  role: 'FAN' | 'CREATOR' | 'ADMIN'
  artistName?: string
}

// DRM Routes
export interface LicenseRequest {
  sessionId: string
  licenseRequest: number[] // ArrayBuffer as JSON
}

export interface FairPlayLicenseRequest {
  sessionId: string
  message: number[] // ArrayBuffer as JSON
}

// Live Routes
export interface CreateSessionRequest {
  scheduledAt: string
  rsvpPriceCoins: number
  maxAttendees: number
}

export interface CreateSessionResponse {
  success: boolean
  sessionId: string
  rtpCapabilities: any // Replace with proper mediasoup types
}

// Upload Routes
export interface UploadResponse {
  uploadUrl: string
  key: string
  instructions: string
}

// Wallet Routes
export interface PurchaseRequest {
  amount: 10 | 25 | 50
  paymentMethodId: string
}

export interface PurchaseResponse {
  coins: number
  paymentIntentId: string
}

// Socket Events
export interface JoinSessionEvent {
  sessionId: string
}

export interface ProduceEvent {
  sessionId: string
  producerId: string
}

// Utility Types
export type WithSession<T = unknown> = T & {
  session: Session
}