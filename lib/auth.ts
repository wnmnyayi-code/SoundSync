// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { verifyPassword } from "@/lib/password"
import prisma from "@/lib/prisma"

// Extend the User type to include your custom fields
declare module "next-auth" {
  interface User {
    id: string
    email: string
    role: "FAN" | "CREATOR" | "ADMIN" | "MERCHANT" | "INFLUENCER"
    artistName?: string
    coinBalance: number
    selectedRoles?: string[]
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT extends User { }
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
            coinBalance: true,
            selectedRoles: true
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
          artistName: user.artistName ?? undefined,
          coinBalance: user.coinBalance,
          selectedRoles: user.selectedRoles as string[] | undefined
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : [])
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.artistName = user.artistName
        token.coinBalance = user.coinBalance
        token.selectedRoles = user.selectedRoles
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.artistName = token.artistName
        session.user.coinBalance = token.coinBalance
        session.user.selectedRoles = token.selectedRoles as string[] | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  }
}