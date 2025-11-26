// Add this at the top of your route.ts
export const dynamic = 'force-dynamic' // Ensure dynamic handling
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'



// Create NextAuth handler
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
