'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface FollowButtonProps {
    targetUserId: string
    initialIsFollowing?: boolean
    onFollowChange?: (isFollowing: boolean) => void
}

export function FollowButton({ targetUserId, initialIsFollowing = false, onFollowChange }: FollowButtonProps) {
    const { data: session } = useSession()
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)

    if (!session || session.user.id === targetUserId) return null

    const handleToggleFollow = async () => {
        setIsLoading(true)
        try {
            if (isFollowing) {
                // Unfollow
                const res = await fetch(`/api/follow?targetUserId=${targetUserId}`, {
                    method: 'DELETE'
                })

                if (!res.ok) throw new Error('Failed to unfollow')

                setIsFollowing(false)
                onFollowChange?.(false)
                toast.success('Unfollowed successfully')
            } else {
                // Follow
                const res = await fetch('/api/follow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUserId })
                })

                if (!res.ok) throw new Error('Failed to follow')

                setIsFollowing(true)
                onFollowChange?.(true)
                toast.success('Following successfully')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Action failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleToggleFollow}
            disabled={isLoading}
            variant={isFollowing ? 'outline' : 'default'}
            className={isFollowing ? '' : 'gradient-primary'}
            size="sm"
        >
            {isFollowing ? (
                <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfollow
                </>
            ) : (
                <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                </>
            )}
        </Button>
    )
}
