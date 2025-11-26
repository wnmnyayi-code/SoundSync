'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Music, Upload, Play, XCircle } from 'lucide-react'

interface Playlist {
    id: string
    name: string
    trackCount: number
    totalDuration: number
    isActive: boolean
    createdAt: string
}

export default function PlaylistsPage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState('')
    const [isLiveOnly, setIsLiveOnly] = useState(false)
    const [isEphemeral, setIsEphemeral] = useState(false)
    const [coverImage, setCoverImage] = useState('')

    useEffect(() => {
        fetchPlaylists()
    }, [])

    const fetchPlaylists = async () => {
        try {
            const res = await fetch('/api/creator/playlists')
            if (!res.ok) throw new Error('Failed to fetch playlists')
            const data = await res.json()
            setPlaylists(data)
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Failed to load playlists',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const [isUploading, setIsUploading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            // Get presigned URL
            const presignRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            })

            if (!presignRes.ok) throw new Error('Failed to get upload URL')
            const { url, fields } = await presignRes.json()

            // Upload to S3
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string)
            })
            formData.append('file', file)

            const uploadRes = await fetch(url, {
                method: 'POST',
                body: formData
            })

            if (!uploadRes.ok) throw new Error('Upload failed')

            const fileUrl = `${url}/${fields.key}`
            setCoverImage(fileUrl)
            toast({
                title: 'Success',
                description: 'Cover image uploaded'
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Failed to upload image',
                variant: 'destructive'
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleCreatePlaylist = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPlaylistName.trim()) return

        setIsCreating(true)
        try {
            const res = await fetch('/api/creator/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newPlaylistName,
                    isLiveOnly,
                    isEphemeral,
                    coverImage
                })
            })

            if (!res.ok) throw new Error('Failed to create playlist')

            const newPlaylist = await res.json()
            setPlaylists([...playlists, { ...newPlaylist, trackCount: 0, totalDuration: 0 }])
            setNewPlaylistName('')
            toast({
                title: 'Success',
                description: 'Playlist created successfully'
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Failed to create playlist',
                variant: 'destructive'
            })
        } finally {
            setIsCreating(false)
        }
    }

    if (!session) return null

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">My Playlists</h1>
            </div>

            <Card className="bg-card border-border shadow-card">
                <CardHeader>
                    <CardTitle>Create New Playlist</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreatePlaylist} className="flex gap-4">
                        <div className="flex-1 space-y-4">
                            <Input
                                placeholder="Playlist Name"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isLiveOnly"
                                        checked={isLiveOnly}
                                        onChange={(e) => setIsLiveOnly(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isLiveOnly" className="text-sm text-muted-foreground">Live Only</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isEphemeral"
                                        checked={isEphemeral}
                                        onChange={(e) => setIsEphemeral(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isEphemeral" className="text-sm text-muted-foreground">Ephemeral (24h)</label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Cover Image</label>
                                <div className="flex items-center gap-4">
                                    {coverImage ? (
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setCoverImage('')}
                                                className="absolute top-0 right-0 bg-black/50 p-1 hover:bg-black/70"
                                            >
                                                <XCircle className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                            {isUploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button type="submit" disabled={isCreating || !newPlaylistName.trim()}>
                            {isCreating ? <Spinner className="mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                            Create Playlist
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : playlists.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Music className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No playlists found. Create one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => (
                        <Card key={playlist.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                                <CardTitle className="text-xl font-semibold truncate pr-4">
                                    {playlist.name}
                                </CardTitle>
                                <Music className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        <p>{playlist.trackCount} tracks</p>
                                        <p>{(playlist.totalDuration / 60).toFixed(1)} minutes</p>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/playlists/upload?playlistId=${playlist.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="flex-1">
                                            <Play className="mr-2 h-4 w-4" />
                                            Play
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
