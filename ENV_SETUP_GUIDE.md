# Environment Variables Setup Guide

## Quick Reference for Lines 38-44

These lines in your `.env.local` file are for **optional** variables:

```env
# Line 38-39: Vercel Token (Optional - only if deploying to Vercel)
VERCEL_TOKEN=your_vercel_token_here

# Note: No user limits - registration is open to everyone!

# Line 44: Redis URL (Optional - for rate limiting)
REDIS_URL=redis://localhost:6379
```

## Required Variables (Must Have)

For your site to launch today, you **MUST** have these:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_URL=http://localhost:3008
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Stripe (Required for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Optional Variables (Can add later)

These can be added later if needed:

- `VERCEL_TOKEN` - Only if deploying to Vercel
- No user limits - everyone can register immediately
- `REDIS_URL` - For advanced rate limiting
- `AWS_*` - For file storage (S3)
- `SENDGRID_API_KEY` - For email sending
- `DRM_*` - For content protection

## Admin Credentials

To seed your admin account, you can add:

```env
ADMIN_EMAIL=admin@soundsync.co.za
ADMIN_PASSWORD=SoundSync@Admin2025!
ADMIN_NAME=SoundSync Administrator
```

Then run: `npm run db:seed`

## Quick Setup Commands

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Test your .env.local setup
node -e "require('./lib/env.ts')"
```

## Notes

- Lines 38-44 are all **optional** - you can leave them empty or comment them out
- Registration is completely open - no limits
- `REDIS_URL` must be a valid Redis connection URL
- `VERCEL_TOKEN` is only needed if deploying to Vercel

