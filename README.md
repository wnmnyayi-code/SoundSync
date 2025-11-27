# 🎵 SoundSync

A modern music streaming and marketplace platform built with Next.js, Prisma, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- Stripe account (for payments)
- AWS S3 bucket (for file storage)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local .env
# Edit .env with your actual credentials

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your app.

## 📦 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 7
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Storage**: AWS S3
- **Deployment**: Vercel

## 📁 Project Structure

```
soundsync/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Prisma schema
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
└── SoundSyncAdditionalFiles/  # Documentation and guides
```

## 🔧 Environment Variables

Required environment variables (see `.env.local`):

- `DATABASE_URL` - Supabase database connection string
- `DIRECT_URL` - Supabase direct connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL
- `STRIPE_SECRET_KEY` - Stripe secret key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name

## 📚 Documentation

Additional documentation can be found in the `SoundSyncAdditionalFiles/` directory:

- Setup guides
- Deployment instructions
- Database configuration
- Environment setup
- Production readiness checklist

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

ISC

---

Built with ❤️ by the SoundSync team
