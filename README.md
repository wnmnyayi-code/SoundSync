# 🎵 SoundSync

**Advanced Music Streaming Platform with Live Sessions, Commerce & Social Features**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-ISC-green?style=flat-square)](LICENSE)

> A comprehensive music streaming platform built for creators, fans, merchants, and influencers. Stream music, host live sessions, sell merchandise, and build your community.

---

## ✨ Features

### 🎤 For Creators
- **Audio Upload & Streaming** - Upload tracks with automatic FFmpeg normalization and mastering
- **Live Streaming** - Host real-time audio sessions with Socket.io/MediaSoup
- **Monetization** - Earn from tips, merchandise sales, and live session gifts
- **Analytics Dashboard** - Track plays, earnings, followers, and engagement
- **Playlist Management** - Create public/private playlists with cover art

### 🛍️ For Merchants
- **Merchandise Store** - Sell physical and digital products
- **FICA Verification** - Secure seller verification workflow
- **Inventory Management** - Track stock and manage orders
- **Sales Analytics** - Monitor revenue and popular products

### 💰 For Influencers
- **Referral System** - Unique referral codes with tracking
- **Commission Earnings** - 10% commission on referred user spending
- **Performance Dashboard** - Track referrals, earnings, and conversion rates

### 👥 For Fans
- **Music Discovery** - Browse, search, and filter tracks by genre
- **Social Features** - Follow artists, send messages, join live chats
- **Virtual Gifts** - Send gifts during live sessions
- **Playlists** - Create and share custom playlists

### 🔧 Platform Features
- **Multi-Role System** - Admin, Creator, Merchant, Influencer, Fan
- **Coin Economy** - In-app currency for tips and purchases
- **Stripe Integration** - Secure payment processing
- **AWS S3 Storage** - Scalable file storage for audio and images
- **Email Notifications** - Verification, password reset, and updates
- **Real-time Notifications** - In-app notification system
- **Responsive Design** - Optimized for desktop and mobile
- **Dark Mode** - Eye-friendly interface

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js 4
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19
- **Real-time**: Socket.io 4.8
- **Streaming**: MediaSoup 3.19

### Infrastructure
- **File Storage**: AWS S3
- **Payments**: Stripe
- **Email**: SMTP (SendGrid/Gmail)
- **Audio Processing**: FFmpeg
- **Deployment**: Vercel

---

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database (or Supabase account)
- **Stripe** account for payments
- **AWS** account for S3 storage (optional for development)
- **SMTP** server for emails (optional for development)

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/soundsync.git
cd soundsync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET_NAME="your-bucket"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run generate:prod

# Run migrations
npm run migrate:dev:prod

# Seed database (creates admin user)
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

Run the feature test suite:

```bash
npx tsx scripts/test-features.ts
```

This tests:
- ✅ Database connection
- ✅ S3 upload functionality
- ✅ Email system
- ✅ Audio processing
- ✅ Stripe integration
- ✅ Environment variables

---

## 📚 Documentation

- **[Setup Guide](SETUP_COMPLETE.md)** - Comprehensive setup instructions
- **[GitHub Setup](GITHUB_SETUP.md)** - Repository setup guide
- **[Implementation Status](IMPLEMENTATION_COMPLETE.md)** - Feature completion report
- **[Migration Guide](MIGRATION_GUIDE.md)** - Database migration instructions

---

## 🏗️ Project Structure

```
soundsync/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── creator/           # Creator dashboard
│   ├── merchant/          # Merchant dashboard
│   └── influencer/        # Influencer dashboard
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── prisma.ts         # Database client
│   ├── s3.ts             # S3 integration
│   ├── mailer.ts         # Email system
│   ├── errors.ts         # Error handling
│   └── audioProcessor.ts # Audio processing
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── scripts/              # Utility scripts
└── types/                # TypeScript types
```

---

## 🔑 Default Admin Credentials

After seeding the database:

- **Email**: Value from `DEFAULT_ADMIN_EMAIL` in `.env`
- **Password**: Value from `DEFAULT_ADMIN_PASSWORD` in `.env`

**⚠️ Change these immediately after first login!**

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Stripe](https://stripe.com/) - Payment processing
- [MediaSoup](https://mediasoup.org/) - Real-time streaming
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Support

For issues or questions:
- Open an [issue](https://github.com/YOUR_USERNAME/soundsync/issues)
- Check the [documentation](SETUP_COMPLETE.md)
- Review [implementation status](IMPLEMENTATION_COMPLETE.md)

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Creator payout system
- [ ] Advanced analytics
- [ ] Collaborative playlists
- [ ] Track comments
- [ ] CDN integration
- [ ] Redis caching
- [ ] Unit & E2E tests

---

**Built with ❤️ for the music community**

🎵 **SoundSync** - Where music meets community
