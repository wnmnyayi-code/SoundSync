import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">🎧 SoundSync</h1>
        <p className="text-xl text-gray-300 mb-8">Connect. Create. Experience.</p>
        <div className="space-x-4">
          <Link href="/register">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
              Get Started
            </Button>
          </Link>
          <Link href="/discover">
            <Button size="lg" variant="outline">
              Discover Artists
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}