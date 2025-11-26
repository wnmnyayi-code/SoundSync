'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface Message {
    id: string
    content: string
    createdAt: string
    sender: {
        id: string
        artistName: string | null
        image: string | null
    }
    recipient: {
        id: string
        artistName: string | null
        image: string | null
    }
}

export default function MessagesPage() {
    const { data: session } = useSession()
    const [conversations, setConversations] = useState<Message[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (session) {
            loadConversations()
        }
    }, [session])

    useEffect(() => {
        if (selectedUserId) {
            loadMessages(selectedUserId)
        }
    }, [selectedUserId])

    const loadConversations = async () => {
        try {
            const res = await fetch('/api/messages')
            const data = await res.json()
            if (data.success) {
                setConversations(data.data)
            }
        } catch (error) {
            console.error('Failed to load conversations:', error)
        }
    }

    const loadMessages = async (userId: string) => {
        try {
            const res = await fetch(`/api/messages?userId=${userId}`)
            const data = await res.json()
            if (data.success) {
                setMessages(data.data)
            }
        } catch (error) {
            console.error('Failed to load messages:', error)
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedUserId) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: selectedUserId,
                    content: newMessage
                })
            })

            const data = await res.json()
            if (data.success) {
                setMessages([...messages, data.data])
                setNewMessage('')
                toast.success('Message sent')
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsLoading(false)
        }
    }

    // Get unique conversations
    const uniqueConversations = conversations.reduce((acc, msg) => {
        const otherUser = msg.sender.id === session?.user.id ? msg.recipient : msg.sender
        if (!acc.find(u => u.id === otherUser.id)) {
            acc.push(otherUser)
        }
        return acc
    }, [] as Array<{ id: string; artistName: string | null; image: string | null }>)

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-8 h-8 text-primary" />
                Messages
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Conversations List */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {uniqueConversations.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No conversations yet</p>
                        ) : (
                            uniqueConversations.map((user) => (
                                <Button
                                    key={user.id}
                                    variant={selectedUserId === user.id ? 'default' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedUserId(user.id)}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    {user.artistName || 'Unknown User'}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Messages */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            {selectedUserId
                                ? uniqueConversations.find(u => u.id === selectedUserId)?.artistName || 'Chat'
                                : 'Select a conversation'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedUserId ? (
                            <>
                                <div className="h-96 overflow-y-auto mb-4 space-y-3 p-4 bg-muted/20 rounded-lg">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender.id === session?.user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs p-3 rounded-lg ${msg.sender.id === session?.user.id
                                                        ? 'bg-primary text-white'
                                                        : 'bg-card border border-border'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.content}</p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <Textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1"
                                        rows={2}
                                    />
                                    <Button type="submit" disabled={isLoading || !newMessage.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-muted-foreground">
                                Select a conversation to start messaging
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
