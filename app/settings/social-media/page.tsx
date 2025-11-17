'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Share2, Facebook, Twitter, Instagram, Youtube, MessageCircle, CheckCircle2, XCircle, Link as LinkIcon, Users } from 'lucide-react'

interface SocialAccount {
  platform: string
  username?: string
  followers: number
  isActive: boolean
  accountId?: string
}

export default function SocialMediaSettingsPage() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [socialLinks, setSocialLinks] = useState({
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    whatsappNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      urlField: 'facebookUrl',
      placeholder: 'https://facebook.com/yourprofile',
      description: 'Share tracks and connect with friends'
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: Twitter,
      color: 'from-sky-500 to-sky-600',
      urlField: 'twitterUrl',
      placeholder: 'https://twitter.com/yourusername',
      description: 'Tweet about your favorite music'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      urlField: 'instagramUrl',
      placeholder: 'https://instagram.com/yourusername',
      description: 'Share to your stories and feed'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      color: 'from-black to-gray-800',
      urlField: 'tiktokUrl',
      placeholder: 'https://tiktok.com/@yourusername',
      description: 'Create music content and trends'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'from-red-600 to-red-700',
      urlField: 'youtubeUrl',
      placeholder: 'https://youtube.com/@yourchannel',
      description: 'Share playlists and music videos'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      urlField: 'whatsappNumber',
      placeholder: '+27 XX XXX XXXX',
      description: 'Share music with friends and groups'
    }
  ]

  useEffect(() => {
    fetchSocialAccounts()
  }, [])

  const fetchSocialAccounts = async () => {
    try {
      const response = await fetch('/api/social-accounts')
      if (response.ok) {
        const data = await response.json()
        setSocialAccounts(data.accounts || [])
        setSocialLinks(data.links || socialLinks)
      }
    } catch (error) {
      console.error('Error fetching social accounts:', error)
    }
  }

  const handleSaveLinks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/social-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: socialLinks })
      })

      if (!response.ok) throw new Error('Failed to save links')

      toast({
        title: 'Links saved',
        description: 'Your social media links have been updated'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save social media links',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnectPlatform = async (platform: string) => {
    // OAuth flow would be implemented here
    toast({
      title: 'Coming soon',
      description: `OAuth connection for ${platform} will be available soon`
    })
  }

  const getAccountStatus = (platformId: string) => {
    return socialAccounts.find(acc => acc.platform === platformId)
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-dark">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Share2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Social Media & Sharing</h1>
            <p className="text-muted-foreground">Connect your accounts and share your favorite music</p>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Share SoundSync with Everyone</h3>
                <p className="text-sm text-muted-foreground">
                  Link your social media accounts to easily share tracks, playlists, and live sessions with your friends and followers. 
                  Use WhatsApp to share music directly with your contacts and groups.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Link your social media for easy sharing and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon
                const account = getAccountStatus(platform.id)
                const isConnected = account?.isActive

                return (
                  <div
                    key={platform.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {isConnected ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{platform.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{platform.description}</p>
                    {isConnected ? (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">@{account.username}</p>
                        {account.followers > 0 && (
                          <p className="text-xs text-muted-foreground">{account.followers.toLocaleString()} followers</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-3">Not connected</p>
                    )}
                    <Button
                      size="sm"
                      variant={isConnected ? 'outline' : 'default'}
                      className="w-full mt-2"
                      onClick={() => handleConnectPlatform(platform.name)}
                    >
                      {isConnected ? 'Reconnect' : 'Connect'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Manual Links */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Social Media Profiles</CardTitle>
            <CardDescription>Add your social media profile URLs to share with others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.id} className="space-y-2">
                <Label className="flex items-center space-x-2">
                  {React.createElement(platform.icon, { className: "w-4 h-4" })}
                  <span>{platform.name}</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={platform.id === 'whatsapp' ? 'tel' : 'url'}
                      placeholder={platform.placeholder}
                      value={socialLinks[platform.urlField as keyof typeof socialLinks]}
                      onChange={(e) => setSocialLinks({
                        ...socialLinks,
                        [platform.urlField]: e.target.value
                      })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={handleSaveLinks}
              disabled={loading}
              className="w-full gradient-primary text-white"
            >
              {loading ? 'Saving...' : 'Save Profile Links'}
            </Button>
          </CardContent>
        </Card>

        {/* Browser Extension */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Browser Extension</CardTitle>
            <CardDescription>Share SoundSync music directly from any website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Install our browser extension to share tracks, playlists, and live sessions on social media with one click.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <a href="/extensions/soundsync-chrome.zip" download>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                  </svg>
                  Chrome Extension
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <a href="/extensions/soundsync-firefox.xpi" download>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/>
                  </svg>
                  Firefox Extension
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Sharing */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>WhatsApp Sharing</CardTitle>
            <CardDescription>Share your favorite music on WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use WhatsApp to share tracks, playlists, and live sessions with your friends, family, and groups.
            </p>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Share tracks and playlists instantly</li>
                    <li>• Send to individual contacts or groups</li>
                    <li>• Get notifications for live sessions</li>
                    <li>• Discover music shared by friends</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Your WhatsApp Number</p>
                <p className="text-sm text-muted-foreground">
                  {socialLinks.whatsappNumber || 'Not set'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Update Number
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sharing Tips */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Sharing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">📱 Mobile Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  Use the share button on any track or playlist to send directly to your social apps.
                </p>
              </div>
              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">🔗 Quick Links</h4>
                <p className="text-sm text-muted-foreground">
                  Copy and paste SoundSync links anywhere - they work on all platforms.
                </p>
              </div>
              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">🎵 Discover Together</h4>
                <p className="text-sm text-muted-foreground">
                  Share your favorite finds and discover what your friends are listening to.
                </p>
              </div>
              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">📢 Live Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Invite friends to live sessions and enjoy music together in real-time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}