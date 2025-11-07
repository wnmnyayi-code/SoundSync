import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "@/lib/password"
import prisma from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: "FAN" | "CREATOR" | "ADMIN"
      artistName?: string
      coinBalance: number
    }
  }

  interface User {
    role: "FAN" | "CREATOR" | "ADMIN"
    artistName?: string
    coinBalance: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "FAN" | "CREATOR" | "ADMIN"
    artistName?: string
    coinBalance: number
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            role: true,
            artistName: true,
            coinBalance: true
          }
        })
        
        if (!user) {
          throw new Error("User not found")
        }

        const isValid = await verifyPassword(credentials.password, user.password)
        
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          artistName: user.artistName,
          coinBalance: user.coinBalance
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.artistName = user.artistName
        token.coinBalance = user.coinBalance
      }

      // Handle coinBalance updates
      if (trigger === "update" && session?.coinBalance) {
        token.coinBalance = session.coinBalance
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.artistName = token.artistName
        session.user.coinBalance = token.coinBalance
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
}

import NextAuth from 'next-auth'
export default NextAuth(authOptions)