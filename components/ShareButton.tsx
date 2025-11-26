'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Share2, Link as LinkIcon, Facebook, Twitter } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ShareButtonProps {
    title: string
    url: string
    description?: string
}

export function ShareButton({ title, url, description }: ShareButtonProps) {
    const { toast } = useToast()
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullUrl)
        toast({
            title: "Link copied",
            description: "The link has been copied to your clipboard.",
        })
    }

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url: fullUrl,
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        } else {
            copyToClipboard()
        }
    }

    const shareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank')
    }

    const shareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`, '_blank')
    }

    const shareWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`, '_blank')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyToClipboard}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareFacebook}>
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareTwitter}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareWhatsApp}>
                    <Share2 className="mr-2 h-4 w-4" />
                    WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareNative}>
                    <Share2 className="mr-2 h-4 w-4" />
                    More...
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
