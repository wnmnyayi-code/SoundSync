'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, User, Gift } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

interface ChatMessage {
    id: string
    user: {
        name: string
        image?: string
    }
    content: string
    timestamp: number
}

export function LiveChat({ sessionId }: { sessionId: string }) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    // Mock WebSocket connection
    useEffect(() => {
        // In a real app, connect to WebSocket here
        const interval = setInterval(() => {
            // Simulate receiving messages
            if (Math.random() > 0.8) {
                const mockMsg: ChatMessage = {
                    id: Date.now().toString(),
                    user: {
                        name: 'Fan ' + Math.floor(Math.random() * 100),
                    },
                    content: ['Amazing!', 'Love this track!', '🔥', 'When is the next song?', 'SoundSync is awesome!'][Math.floor(Math.random() * 5)],
                    timestamp: Date.now()
                }
                setMessages(prev => [...prev, mockMsg])
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [sessionId])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !session) return

        const msg: ChatMessage = {
            id: Date.now().toString(),
            user: {
                name: session.user.name || 'Me',
                image: session.user.image || undefined
            },
            content: newMessage,
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, msg])
        setNewMessage('')
        // In a real app, emit WebSocket event here
    }

    const [showGifts, setShowGifts] = useState(false)
    const { toast } = useToast()

    const GIFTS = [
        { id: 'heart', icon: '❤️', price: 5, name: 'Heart' },
        { id: 'fire', icon: '🔥', price: 10, name: 'Fire' },
        { id: 'party', icon: '🎉', price: 20, name: 'Party' },
        { id: 'rocket', icon: '🚀', price: 50, name: 'Rocket' },
    ]

    const handleSendGift = async (gift: typeof GIFTS[0]) => {
        if (!session) return

        try {
            const res = await fetch('/api/live/gift', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    giftType: gift.name,
                    amount: gift.price
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to send gift')
            }

            // Add gift message to chat
            const msg: ChatMessage = {
                id: Date.now().toString(),
                user: {
                    name: session.user.name || 'Me',
                    image: session.user.image || undefined
                },
                content: `Sent a ${gift.name} ${gift.icon}`,
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, msg])
            setShowGifts(false)
            toast({
                title: 'Gift Sent!',
                description: `You sent a ${gift.name} for ${gift.price} coins.`
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to send gift',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="flex flex-col h-[500px] bg-card border border-border rounded-lg shadow-card">
            <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="font-semibold flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Live Chat
                </h3>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={msg.user.image} />
                                <AvatarFallback>
                                    <User className="w-4 h-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-sm font-semibold text-foreground">{msg.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No messages yet. Be the first to say hi!
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/20 space-y-4">
                {showGifts && (
                    <div className="flex gap-2 overflow-x-auto pb-2 animate-in slide-in-from-bottom-2">
                        {GIFTS.map((gift) => (
                            <Button
                                key={gift.id}
                                variant="outline"
                                className="flex flex-col items-center h-auto py-2 px-3 space-y-1 min-w-[80px]"
                                onClick={() => handleSendGift(gift)}
                            >
                                <span className="text-2xl">{gift.icon}</span>
                                <span className="text-xs font-medium">{gift.name}</span>
                                <span className="text-xs text-muted-foreground">{gift.price}c</span>
                            </Button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Button
                        type="button"
                        variant={showGifts ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setShowGifts(!showGifts)}
                        className="shrink-0"
                    >
                        <Gift className="w-5 h-5 text-primary" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Say something..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()} className="gradient-primary">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
