'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, X, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

export function SupportChat() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    if (!session) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setIsSending(true)
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            })

            if (!res.ok) throw new Error('Failed to send message')

            toast({
                title: "Message sent!",
                description: "We'll get back to you shortly.",
            })
            setMessage('')
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <>
            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-glow z-50 transition-transform hover:scale-110 ${isOpen ? 'hidden' : 'flex'}`}
                size="icon"
            >
                <MessageCircle className="w-6 h-6" />
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 md:w-96 z-50 animate-in slide-in-from-bottom-10 fade-in">
                    <Card className="border-primary/20 shadow-glow">
                        <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary/10 rounded-t-lg">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-primary" />
                                Support Chat
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground mb-4">
                                    <p>Hi {session.user.name || 'there'}! How can we help you today? Our team will respond to your email shortly.</p>
                                </div>

                                <Textarea
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                    required
                                />

                                <Button type="submit" className="w-full gradient-primary" disabled={isSending}>
                                    {isSending ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
