// types/user.ts
export type UserRole = 'ADMIN' | 'CREATOR' | 'FAN' | 'MERCHANT' | 'INFLUENCER'

export interface User {
  id: string
  email: string
  role: UserRole
  artistName?: string
  coinBalance: number
  selectedRoles?: string[]
}