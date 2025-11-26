'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Music, CheckCircle, AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function PlaylistUploadPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const playlistId = searchParams.get('playlistId')
    const { toast } = useToast()

    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadedTrack, setUploadedTrack] = useState<any>(null)
    const [metadata, setMetadata] = useState({
        title: '',
        artist: '',
        genre: '',
        allowDownload: false,
        isPublic: true,
        price: '0'
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) {
            if (!selected.type.startsWith('audio/')) {
                toast({
                    title: 'Invalid file',
                    description: 'Please select an audio file',
                    variant: 'destructive'
                })
                return
            }
            setFile(selected)
            setUploadedTrack(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        if (playlistId) {
            formData.append('playlistId', playlistId)
        }
        formData.append('title', metadata.title)
        formData.append('artist', metadata.artist)
        formData.append('genre', metadata.genre)
        formData.append('allowDownload', String(metadata.allowDownload))
        formData.append('isPublic', String(metadata.isPublic))
        formData.append('price', metadata.price)

        try {
            const res = await fetch('/api/creator/playlists/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            setUploadedTrack(data.track)
            toast({
                title: 'Success',
                description: 'Track uploaded and processed successfully',
            })
            setFile(null)
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Upload failed',
                variant: 'destructive'
            })
        } finally {
            setUploading(false)
        }
    }

    if (!session) {
        return <div className="p-8 text-center">Please log in to upload tracks.</div>
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-md mx-auto">
                <Card className="bg-card border-border shadow-card">
                    <CardHeader>
                        <CardTitle>Upload to Playlist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/50 transition-colors">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="audio-upload"
                            />

                            {!file && !uploadedTrack && (
                                <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                                    <span className="text-foreground font-medium">Click to select audio</span>
                                    <span className="text-xs text-muted-foreground mt-2">MP3, M4A, WAV supported</span>
                                </label>
                            )}

                            {file && (
                                <div className="flex flex-col items-center">
                                    <Music className="w-12 h-12 text-primary mb-4" />
                                    <span className="text-foreground font-medium">{file.name}</span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-4 text-destructive hover:text-destructive"
                                        onClick={() => setFile(null)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>

                        {uploadedTrack && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="font-medium text-green-500">Upload Complete</span>
                                </div>
                                <div className="text-sm space-y-1 text-muted-foreground">
                                    <p>Quality: {uploadedTrack.bitrate / 1000}kbps / {uploadedTrack.sampleRate}Hz</p>
                                    <p>Duration: {uploadedTrack.duration.toFixed(1)}s</p>
                                    <p>Format: {uploadedTrack.audioFormat}</p>
                                </div>
                                <Button
                                    className="w-full mt-4"
                                    variant="outline"
                                    onClick={() => setUploadedTrack(null)}
                                >
                                    Upload Another
                                </Button>
                            </div>
                        )}

                        {file && !uploading && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            placeholder="Track Title"
                                            value={metadata.title}
                                            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                            className="bg-dark-900 border-primary-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Artist</Label>
                                        <Input
                                            placeholder="Artist Name"
                                            value={metadata.artist}
                                            onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
                                            className="bg-dark-900 border-primary-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Genre</Label>
                                    <Input
                                        placeholder="Genre (e.g. Hip Hop, Amapiano)"
                                        value={metadata.genre}
                                        onChange={(e) => setMetadata({ ...metadata, genre: e.target.value })}
                                        className="bg-dark-900 border-primary-800"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg border border-primary-800">
                                    <div className="space-y-0.5">
                                        <Label>Allow Download</Label>
                                        <p className="text-xs text-gray-500">Fans can download this track</p>
                                    </div>
                                    <Switch
                                        checked={metadata.allowDownload}
                                        onCheckedChange={(checked) => setMetadata({ ...metadata, allowDownload: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg border border-primary-800">
                                    <div className="space-y-0.5">
                                        <Label>Publicly Visible</Label>
                                        <p className="text-xs text-gray-500">Show on your profile and search</p>
                                    </div>
                                    <Switch
                                        checked={metadata.isPublic}
                                        onCheckedChange={(checked) => setMetadata({ ...metadata, isPublic: checked })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Price (Coins)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0 for free"
                                        value={metadata.price}
                                        onChange={(e) => setMetadata({ ...metadata, price: e.target.value })}
                                        className="bg-dark-900 border-primary-800"
                                    />
                                    <p className="text-xs text-gray-500">Set to 0 for free streaming</p>
                                </div>

                                <Button className="w-full" onClick={handleUpload}>
                                    Upload Track
                                </Button>
                            </div>
                        )}

                        {uploading && (
                            <div className="text-center py-4">
                                <Spinner className="mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Processing audio...</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
