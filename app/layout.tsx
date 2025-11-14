import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/ui/toast-provider'
import { MainNav } from '@/components/navigation/main-nav'
import { Footer } from '@/components/navigation/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SoundSync - South Africa\'s Premier Music Platform',
  description: 'Connect with artists, fans, merchants, and influencers. South Africa only with ZAR pricing and VAT included.',
  keywords: 'music, streaming, South Africa, artists, fans, merchants, influencers, ZAR, VAT',
  authors: [{ name: 'SoundSync' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <MainNav />
                <main className="flex-1 pt-16">
                  {children}
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}