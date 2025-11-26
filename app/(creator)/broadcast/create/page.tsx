'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function CreateLiveSession() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [rsvpPrice, setRsvpPrice] = useState('0')
    const [maxAttendees, setMaxAttendees] = useState('100')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Combine date and time
            const scheduledAt = new Date(`${date}T${time}`)

            const res = await fetch('/api/live/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scheduledAt: scheduledAt.toISOString(),
                    rsvpPriceCoins: parseInt(rsvpPrice),
                    maxAttendees: parseInt(maxAttendees)
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            toast({
                title: "Session Scheduled",
                description: "Your live session has been created successfully.",
            })

            router.push(`/live/${data.sessionId}/host`)
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create session",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card className="bg-dark-800 border-primary-800">
                <CardHeader>
                    <CardTitle className="text-white">Schedule Live Session</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Date</Label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="bg-dark-900 border-primary-800 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Time</Label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    className="bg-dark-900 border-primary-800 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Entry Price (Coins)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={rsvpPrice}
                                onChange={(e) => setRsvpPrice(e.target.value)}
                                className="bg-dark-900 border-primary-800 text-white"
                            />
                            <p className="text-xs text-gray-500">Set to 0 for free entry</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Max Attendees</Label>
                            <Input
                                type="number"
                                min="1"
                                max="10000"
                                value={maxAttendees}
                                onChange={(e) => setMaxAttendees(e.target.value)}
                                className="bg-dark-900 border-primary-800 text-white"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                'Schedule Session'
                            )}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
