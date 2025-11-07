import type { Metadata } from 'next'
import { generateCsrfMetaTags } from '@/lib/metadata'
 
export async function generateMetadata(): Promise<Metadata> {
  const csrfTags = await generateCsrfMetaTags()
  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    title: 'SoundSync Login',
    description: 'Sign in to your SoundSync account',
    other: {
      'csrf-token': csrfTags[0].content
    }
  }
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-dark-900">{children}</div>
}