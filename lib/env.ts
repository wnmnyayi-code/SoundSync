import { z } from 'zod'

const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  POSTGRES_URL_NON_POOLING: z.string().url(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // AWS S3
  AWS_REGION: z.string().default('af-south-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_BUCKET_NAME: z.string(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  STRIPE_CONNECTED_ACCOUNT_ID: z.string().startsWith('acct_'),

  // DRM
  DRM_LICENSE_SERVER: z.string().url(),
  DRM_API_KEY: z.string(),

  // Vercel
  VERCEL_TOKEN: z.string(),
  
  // Email (SendGrid)
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
})

export const env = envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}