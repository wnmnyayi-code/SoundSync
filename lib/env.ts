// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Prisma / Database
  DATABASE_URL: z.string().url(),

  // NextAuth / app
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),

  // Stripe (Required for payments)
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required').optional(),
  STRIPE_CONNECTED_ACCOUNT_ID: z.string().optional(),

  // AWS S3 (Optional but recommended for file storage)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),
  AWS_BUCKET_NAME: z.string().optional(),

  // Email (Optional)
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // DRM (Optional)
  DRM_LICENSE_SERVER: z.string().url().optional(),
  DRM_API_KEY: z.string().optional(),

  // Exchange Rates (Optional)
  EXCHANGE_RATE_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_EXCHANGE_RATE_API_URL: z.string().url().optional(),

  // Optional tokens
  VERCEL_TOKEN: z.string().optional(),

  // Rate limiter redis url (optional)
  REDIS_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)

export type Env = typeof env
