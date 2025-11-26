# 🚀 SoundSync - Complete Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Stripe account for payments
- AWS account for S3 storage (optional but recommended)
- SMTP server for emails (optional)

## 1. Environment Configuration

Copy `.env.example` to `.env` and configure the following:

### Database
```env
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true&sslmode=require"
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### NextAuth
```env
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### Admin Account
```env
DEFAULT_ADMIN_EMAIL="admin@soundsync.co.za"
DEFAULT_ADMIN_PASSWORD="your-secure-password"
ADMIN_NAME="SoundSync Administrator"
```

### Stripe (Required for payments)
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONNECTED_ACCOUNT_ID="acct_..."
```

### AWS S3 (Required for production file uploads)
```env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="soundsync-streams"
AWS_REGION="af-south-1"
```

### Email (Optional - for verification & notifications)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="no-reply@soundsync.co.za"
```

### JWT
```env
JWT_SECRET="generate-with: openssl rand -base64 32"
JWT_EXPIRES_IN="7d"
```

## 2. Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run generate:prod

# Run database migrations
npm run migrate:dev:prod

# Seed the database (creates admin user)
npm run db:seed
```

## 3. AWS S3 Setup (Production)

### Create S3 Bucket
1. Go to AWS Console → S3
2. Create bucket with name from `AWS_S3_BUCKET_NAME`
3. Enable versioning (recommended)
4. Set CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Create IAM User
1. Go to IAM → Users → Create User
2. Attach policy: `AmazonS3FullAccess` (or create custom policy)
3. Generate access keys
4. Add keys to `.env`

### Lifecycle Policy (Optional)
Apply the lifecycle policy from `s3-lifecycle.json` to automatically delete old files.

## 4. Stripe Setup

### Create Stripe Account
1. Sign up at https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Add to `.env`

### Setup Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

## 5. Email Setup (Optional)

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: Account → Security → App passwords
3. Use app password in `SMTP_PASS`

### SendGrid (Recommended for production)
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

## 6. Running the Application

### Development
```bash
npm run dev
```
Visit http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## 7. Default Admin Login

After seeding the database:
- Email: Value from `DEFAULT_ADMIN_EMAIL`
- Password: Value from `DEFAULT_ADMIN_PASSWORD`

**⚠️ Change the admin password immediately after first login!**

## 8. Feature Flags

### Without SMTP
- Email verification will be logged to console
- Users can still register and login
- No email notifications sent

### Without AWS S3
- Files stored locally in `public/uploads`
- Not recommended for production
- Limited scalability

### Without Stripe
- Payment features disabled
- Coin purchases won't work
- Merchandise checkout disabled

## 9. Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull
```

### Prisma Issues
```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npm run generate:prod
```

### Port Already in Use
```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

## 10. Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Vercel
- Add all `.env` variables in Vercel dashboard
- Update `NEXTAUTH_URL` to production domain
- Update Stripe webhook endpoint

### Database Migration
```bash
# On first deploy
npx prisma migrate deploy
npx prisma db seed
```

## 11. Security Checklist

- [ ] Change default admin password
- [ ] Use strong `NEXTAUTH_SECRET` and `JWT_SECRET`
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly
- [ ] Rotate AWS credentials regularly
- [ ] Enable Stripe webhook signature verification
- [ ] Set up rate limiting
- [ ] Enable database backups

## 12. Monitoring & Logging

### Recommended Services
- **Error Tracking**: Sentry
- **Analytics**: PostHog or Mixpanel
- **Logging**: Datadog or LogRocket
- **Uptime**: UptimeRobot

## 13. Next Steps

1. Configure all environment variables
2. Test email sending
3. Test file uploads to S3
4. Test Stripe payments in test mode
5. Create test users for each role
6. Test live streaming functionality
7. Review security settings
8. Set up monitoring
9. Deploy to staging
10. Deploy to production

## Support

For issues or questions:
- Check documentation in `SoundSyncAdditionalFiles/`
- Review API routes in `app/api/`
- Check Prisma schema in `prisma/schema.prisma`

---

**🎵 Ready to launch SoundSync!**
