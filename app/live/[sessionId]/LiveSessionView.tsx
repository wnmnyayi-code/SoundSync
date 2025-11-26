'use client'

import { LiveChat } from '@/components/LiveChat'

// ... imports

export default function LiveSessionView({ session, hasRsvp: initialHasRsvp, userCoinBalance, userId }: LiveSessionViewProps) {
    // ... state

    return (
        <div className="min-h-screen bg-dark-900 text-white p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start justify-center">
            <div className="max-w-md w-full bg-dark-800 p-8 rounded-xl border border-primary-800 text-center relative flex-shrink-0">
                <div className="absolute top-4 right-4">
                    <ShareButton
                        title={`Join ${session.creator.artistName}'s Live Session`}
                        url={`/live/${session.id}`}
                        description="Join me on SoundSync for a live audio session!"
                    />
                </div>
                <h1 className="text-3xl font-bold mb-2">{session.creator.artistName}</h1>
                <p className="text-gray-400 mb-6">Live Session</p>

                <div className="mb-8">
                    <div className="text-4xl font-bold text-primary-400 mb-2">
                        {session.rsvpPriceCoins === 0 ? 'FREE' : `${session.rsvpPriceCoins} Coins`}
                    </div>
                    <p className="text-sm text-gray-500">Entry Fee</p>
                </div>

                {!hasRsvp ? (
                    <Button
                        onClick={handleRsvp}
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-lg py-6"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Lock className="mr-2 w-5 h-5" />}
                        RSVP to Join
                    </Button>
                ) : (
                    !joined ? (
                        <div className="space-y-4">
                            <Button
                                onClick={joinSession}
                                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                            >
                                <Play className="mr-2 w-5 h-5" />
                                Join Live Room
                            </Button>
                            <Button variant="outline" onClick={() => setIsGifting(!isGifting)} className="w-full">
                                Gift Ticket to Friend
                            </Button>
                            {isGifting && (
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-dark-900 border border-primary-800 rounded px-3 py-2"
                                        placeholder="Friend's Email"
                                        value={giftEmail}
                                        onChange={e => setGiftEmail(e.target.value)}
                                    />
                                    <Button onClick={handleGiftRsvp} disabled={loading}>Gift</Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-black/30 rounded-lg animate-pulse">
                                <p className="text-green-400 font-mono">● Live Audio Connected</p>
                            </div>
                            <audio ref={audioRef} controls className="w-full" />
                        </div>
                    )
                )}
            </div>

            {/* Live Chat Section - Only show when joined */}
            {joined && (
                <div className="w-full max-w-md flex-shrink-0">
                    <LiveChat sessionId={session.id} />
                </div>
            )}
        </div>
    )
}
