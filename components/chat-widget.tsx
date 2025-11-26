'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim()) {
            // TODO: Implement chat functionality
            console.log('Message:', message)
            setMessage('')
        }
    }

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                        <CardTitle className="text-lg">Chat with us</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-4">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                                <p className="text-sm">Hi! How can we help you today?</p>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled
                            />
                            <Button
                                onClick={handleSend}
                                size="sm"
                                className="px-3"
                                disabled
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Chat feature coming soon
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
