import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SoundSync - Empowering Artists, Connecting Fans',
  description: 'A comprehensive music platform connecting artists, fans, merchants, and influencers. Upload music, host live sessions, and monetize your creativity.',
  keywords: ['music platform', 'artist monetization', 'live listening parties', 'music streaming', 'South African music'],
  authors: [{ name: 'SoundSync' }],
  openGraph: {
    title: 'SoundSync - Empowering Artists, Connecting Fans',
    description: 'Upload music, host live sessions, and connect with fans',
    type: 'website',
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoundSync',
    description: 'Empowering Artists, Connecting Fans',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#9333ea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(270 25% 12%)',
                color: 'hsl(270 10% 98%)',
                border: '1px solid hsl(270 20% 25%)',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(140 60% 50%)',
                  secondary: 'hsl(270 10% 98%)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(0 70% 55%)',
                  secondary: 'hsl(270 10% 98%)',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
