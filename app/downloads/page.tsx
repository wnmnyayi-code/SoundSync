'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Smartphone, Apple, Shield, Zap, Radio, Globe, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function DownloadsPage() {
  const features = [
    { icon: Radio, title: 'Live Streaming', description: 'Join live music sessions in real-time' },
    { icon: Shield, title: 'DRM Protected', description: 'Secure content protection' },
    { icon: Zap, title: 'Fast Performance', description: 'Optimized for smooth playback' },
    { icon: Globe, title: 'Global Platform', description: 'Built for artists and fans worldwide' },
    { icon: CheckCircle2, title: 'Regular Updates', description: 'Continuous improvements and features' }
  ]

  const androidFeatures = [
    'Material Design UI',
    'Android 8.0+ support',
    'Background playback',
    'Widget support',
    'Chromecast integration',
    'Android Auto compatible'
  ]

  const iosFeatures = [
    'Native iOS design',
    'iOS 15.0+ support',
    'Background playback',
    'Widget support',
    'AirPlay integration',
    'CarPlay compatible'
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Smartphone className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-foreground mb-4">Download SoundSync</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take the premier music platform with you. Available on iOS and Android.
          </p>
        </div>

        {/* App Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* iOS App */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <Apple className="w-10 h-10 text-white" />
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  v1.0.0
                </span>
              </div>
              <CardTitle className="text-2xl">SoundSync for iOS</CardTitle>
              <CardDescription>For iPhone and iPad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Features:</h4>
                <ul className="space-y-2">
                  {iosFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Requirements:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• iOS 15.0 or later</li>
                  <li>• 150 MB free storage</li>
                  <li>• Internet connection</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full gradient-primary text-white hover:opacity-90" disabled>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Apple className="w-5 h-5 mr-2" />
                    Coming Soon - App Store
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full border-border">
                  <a href="/downloads/SoundSync-iOS.ipa" download>
                    <Download className="w-5 h-5 mr-2" />
                    Direct Download (45.2 MB)
                  </a>
                </Button>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Direct IPA installation requires a developer certificate or jailbroken device.
                    We recommend using the App Store for easy installation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Android App */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  v1.0.0
                </span>
              </div>
              <CardTitle className="text-2xl">SoundSync for Android</CardTitle>
              <CardDescription>For Android devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Features:</h4>
                <ul className="space-y-2">
                  {androidFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Requirements:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Android 8.0 or later</li>
                  <li>• 100 MB free storage</li>
                  <li>• Internet connection</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full gradient-primary text-white hover:opacity-90" disabled>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    Coming Soon - Google Play
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full border-border">
                  <a href="/downloads/SoundSync-Android.apk" download>
                    <Download className="w-5 h-5 mr-2" />
                    Direct Download (38.5 MB)
                  </a>
                </Button>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Enable "Install from Unknown Sources" in Settings to install APK files.
                    We recommend using Google Play for automatic updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Why Choose SoundSync Mobile?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Installation Help */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle>Installation Help</CardTitle>
            <CardDescription>Need help installing the app?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Android Installation:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Download the APK file to your device</li>
                <li>Go to Settings → Security → Enable "Unknown Sources"</li>
                <li>Open the downloaded APK file</li>
                <li>Tap "Install" and follow the prompts</li>
                <li>Launch SoundSync from your app drawer</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">iOS Installation:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Open the App Store on your iOS device</li>
                <li>Search for "SoundSync"</li>
                <li>Tap "Get" to download and install</li>
                <li>Open the app and sign in</li>
              </ol>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Still having issues? Contact our support team at{' '}
                <a href="mailto:support@soundsync.co.za" className="text-accent hover:underline">
                  support@soundsync.co.za
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="gradient-primary text-white hover:opacity-90">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}