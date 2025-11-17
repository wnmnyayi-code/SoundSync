'use client'

import Link from 'next/link'
import { Music, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SoundSync</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Premier music platform connecting artists, fans, merchants, and influencers worldwide.
            </p>
          </div>

          {/* User Roles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">User Roles</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/artists" className="hover:text-foreground transition-colors">Artists</Link></li>
              <li><Link href="/fans" className="hover:text-foreground transition-colors">Fans</Link></li>
              <li><Link href="/merchants" className="hover:text-foreground transition-colors">Merchants</Link></li>
              <li><Link href="/influencers" className="hover:text-foreground transition-colors">Influencers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@soundsync.co.za</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+27 80 123 4567</span>
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>VAT No: 1234567890</p>
              <p>SARS Registered</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SoundSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}