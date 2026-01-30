import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatCoins(coins: number): string {
  return `${coins.toLocaleString()} coins`
}

export function coinsToZAR(coins: number): number {
  const COIN_RATE = 0.05
  return coins * COIN_RATE
}

export function zarToCoins(zar: number): number {
  const COIN_RATE = 0.05
  return Math.floor(zar / COIN_RATE)
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function calculateRevenueShare(amount: number, hasReferral: boolean = false) {
  const ARTIST_PERCENTAGE = 0.60
  const INFLUENCER_PERCENTAGE = 0.10
  const PLATFORM_PERCENTAGE = 0.15
  
  if (hasReferral) {
    return {
      artist: amount * ARTIST_PERCENTAGE,
      influencer: amount * INFLUENCER_PERCENTAGE,
      platform: amount * PLATFORM_PERCENTAGE,
      vat: 0, // Currently disabled
    }
  }
  
  return {
    artist: amount * ARTIST_PERCENTAGE,
    influencer: 0,
    platform: amount * (PLATFORM_PERCENTAGE + INFLUENCER_PERCENTAGE),
    vat: 0, // Currently disabled
  }
}

export function getMerchantShare(amount: number) {
  const MERCHANT_PERCENTAGE = 0.90
  const PLATFORM_PERCENTAGE = 0.10
  
  return {
    merchant: amount * MERCHANT_PERCENTAGE,
    platform: amount * PLATFORM_PERCENTAGE,
  }
}
