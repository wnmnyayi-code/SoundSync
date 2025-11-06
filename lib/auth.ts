import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from "./prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            artistName: user.artistName,
            coinBalance: user.coinBalance
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.artistName = user.artistName
        token.coinBalance = user.coinBalance
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.artistName = token.artistName
      session.user.coinBalance = token.coinBalance
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
}

export default NextAuth(authOptions)