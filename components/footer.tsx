import Link from 'next/link'
import { Music } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/20 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold gradient-text mb-4">
              <Music className="w-6 h-6" />
              SoundSync
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering artists, connecting fans, and building the future of music.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/for-artists" className="hover:text-foreground transition">
                  For Artists
                </Link>
              </li>
              <li>
                <Link href="/for-fans" className="hover:text-foreground transition">
                  For Fans
                </Link>
              </li>
              <li>
                <Link href="/for-merchants" className="hover:text-foreground transition">
                  For Merchants
                </Link>
              </li>
              <li>
                <Link href="/for-influencers" className="hover:text-foreground transition">
                  For Influencers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-foreground transition">
                  API
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-foreground transition">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SoundSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
