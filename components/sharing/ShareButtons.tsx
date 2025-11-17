'use client'

import { Button } from '@/components/ui/button'
import { Facebook, Twitter, Instagram, MessageCircle, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
  imageUrl?: string
  type?: 'track' | 'playlist' | 'live-session' | 'artist'
}

export function ShareButtons({ title, url, description, imageUrl, type = 'track' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const shareText = description 
    ? `🎵 ${title}\n${description}\n\n` 
    : `🎵 Check out "${title}" on SoundSync!\n\n`

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareText)
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}${url}`)
    const shareUrl = `https://wa.me/?text=${text}`
    window.open(shareUrl, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Share it anywhere you like'
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const handleInstagramShare = () => {
    handleCopyLink()
    toast({
      title: 'Link copied!',
      description: 'Paste in Instagram bio, story, or post caption'
    })
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: url
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled')
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Native Share (Mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <Button
          onClick={handleNativeShare}
          size="sm"
          variant="outline"
          className="flex-1 min-w-[120px]"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      )}

      {/* WhatsApp */}
      <Button
        onClick={handleWhatsAppShare}
        size="sm"
        variant="outline"
        className="flex-1 min-w-[120px] hover:bg-green-500/10 hover:border-green-500/50"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>

      {/* Facebook */}
      <Button
        onClick={handleFacebookShare}
        size="sm"
        variant="outline"
        className="flex-1 min-w-[120px] hover:bg-blue-500/10 hover:border-blue-500/50"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>

      {/* Twitter */}
      <Button
        onClick={handleTwitterShare}
        size="sm"
        variant="outline"
        className="flex-1 min-w-[120px] hover:bg-sky-500/10 hover:border-sky-500/50"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>

      {/* Instagram (Copy) */}
      <Button
        onClick={handleInstagramShare}
        size="sm"
        variant="outline"
        className="flex-1 min-w-[120px] hover:bg-pink-500/10 hover:border-pink-500/50"
      >
        <Instagram className="w-4 h-4 mr-2" />
        Instagram
      </Button>

      {/* Copy Link */}
      <Button
        onClick={handleCopyLink}
        size="sm"
        variant="outline"
        className="flex-1 min-w-[120px]"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}