// lib/env.ts
import { z } from 'zod'

const base = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') ?? 'development',
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z.string().optional(),

  // NextAuth / app
  NEXTAUTH_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // JWT for custom endpoints
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().optional(),

  // Bcrypt rounds
  BCRYPT_SALT_ROUNDS: z.string().optional(),

  // Default admin for local seeding
  DEFAULT_ADMIN_EMAIL: z.string().email().optional(),
  DEFAULT_ADMIN_PASSWORD: z.string().optional(),

  // Stripe (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_CONNECTED_ACCOUNT_ID: z.string().optional(),

  // Optional other vars
  EXCHANGE_RATE_API_URL: z.string().optional(),
  NEXT_PUBLIC_EXCHANGE_RATE_API_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
})

const parsed = envSchema.parse(process.env)

export const env = {
  ...parsed,
  // sensible dev defaults
  DATABASE_URL: parsed.DATABASE_URL ?? (parsed.NODE_ENV === 'development' ? 'file:./dev.db' : undefined),
  NEXTAUTH_URL: parsed.NEXTAUTH_URL ?? (parsed.NODE_ENV === 'development' ? 'http://localhost:3008' : undefined),
  NEXTAUTH_SECRET: parsed.NEXTAUTH_SECRET ?? (parsed.NODE_ENV === 'development' ? 'dev-nextauth-secret' : undefined),
  JWT_SECRET: parsed.JWT_SECRET ?? (parsed.NODE_ENV === 'development' ? 'dev-jwt-secret' : undefined),
  JWT_EXPIRES_IN: parsed.JWT_EXPIRES_IN ?? '7d',
  BCRYPT_SALT_ROUNDS: parsed.BCRYPT_SALT_ROUNDS ?? '12',
  DEFAULT_ADMIN_EMAIL: parsed.DEFAULT_ADMIN_EMAIL ?? 'admin@soundsync.co.za',
  DEFAULT_ADMIN_PASSWORD: parsed.DEFAULT_ADMIN_PASSWORD ?? 'SoundSync@Admin2025!',
}

export type Env = typeof env
