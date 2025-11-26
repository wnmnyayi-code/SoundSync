'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Notification {
    id: string
    type: string
    message: string
    read: boolean
    createdAt: string
    relatedId?: string
}

export function NotificationBell() {
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const fetchNotifications = async () => {
        if (!session) return
        try {
            const res = await fetch('/api/notifications')
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications)
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [session])

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open)
        if (open && unreadCount > 0) {
            // Mark all as read locally
            setUnreadCount(0)
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))

            // Mark as read on server
            try {
                await fetch('/api/notifications', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                })
            } catch (error) {
                console.error('Failed to mark notifications as read', error)
            }
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        setIsOpen(false)
        // Navigate based on type
        if (notification.type === 'GIFT' && notification.relatedId) {
            // Maybe navigate to session history or earnings?
            // For now, just do nothing or go to dashboard
            router.push('/dashboard')
        } else if (notification.type === 'FOLLOW') {
            router.push(`/profile/${notification.relatedId}`) // Assuming relatedId is followerId
        }
    }

    if (!session) return null

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-border font-semibold">
                    Notifications
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.read ? 'bg-muted/20' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <p className="text-sm text-foreground">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
