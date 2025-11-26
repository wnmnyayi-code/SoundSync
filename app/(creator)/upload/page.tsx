'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Music } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { uploadSchema, type UploadFormData } from '@/types/upload'

// Extend UploadFormData to include isExplicit if not already there
// We might need to update the zod schema in types/upload as well, but for now we'll just add the input.


export default function UploadPage() {
  const { data: session } = useSession()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      isPublic: true,
      drmEnabled: false,
      price: 0
    }
  })

  if (!session || session.user.role !== 'CREATOR') {
    redirect('/login')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 100MB',
        variant: 'destructive'
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an audio file',
        variant: 'destructive'
      })
      return
    }

    setSelectedFile(file)
    form.setValue('file', file)
  }

  const handleSubmit = async (data: UploadFormData) => {
    if (!selectedFile) return

    setUploading(true)
    try {
      // Get presigned URL
      const presignRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type
        })
      })

      if (!presignRes.ok) throw new Error('Failed to get upload URL')
      const { url, fields } = await presignRes.json()

      // Upload to S3
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append('file', selectedFile)

      const uploadRes = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      // Create track record
      const trackRes = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          fileKey: fields.key,
          fileUrl: `${url}/${fields.key}`
        })
      })

      if (!trackRes.ok) throw new Error('Failed to save track')

      const trackData = await trackRes.json()
      const trackId = trackData.data?.id

      // Trigger audio processing
      if (trackId) {
        await fetch('/api/process-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackId })
        })
      }

      toast({
        title: 'Upload successful',
        description: 'Your track has been uploaded and is being processed for optimal quality'
      })

      // Reset form
      form.reset()
      setSelectedFile(null)
      setUploadProgress(0)
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Failed to upload track',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-primary">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-dark-800 border-primary-700">
          <CardHeader>
            <CardTitle className="text-white">Upload Track</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="border-2 border-dashed border-primary-600 rounded-lg p-8 text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <Music className="w-12 h-12 text-primary-400 mx-auto" />
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {Math.round(selectedFile.size / 1024 / 1024)}MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        form.setValue('file', undefined)
                      }}
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">
                      Upload music you own. Supports MP3, WAV, FLAC up to 100MB.
                    </p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition">
                        Choose File
                      </span>
                    </label>
                  </>
                )}
              </div>

              {selectedFile && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300">Title</label>
                    <Input
                      {...form.register('title')}
                      className="mt-1"
                      error={form.formState.errors.title?.message}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300">Description</label>
                    <Input
                      {...form.register('description')}
                      className="mt-1"
                      error={form.formState.errors.description?.message}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300">Genre</label>
                      <Input
                        {...form.register('genre')}
                        className="mt-1"
                        error={form.formState.errors.genre?.message}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">BPM (optional)</label>
                      <Input
                        type="number"
                        {...form.register('bpm', { valueAsNumber: true })}
                        className="mt-1"
                        error={form.formState.errors.bpm?.message}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register('isExplicit')}
                      id="isExplicit"
                      className="w-4 h-4"
                    />
                    <label htmlFor="isExplicit" className="text-gray-300">
                      Explicit Content
                    </label>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300">Price in coins</label>
                    <Input
                      type="number"
                      {...form.register('price', { valueAsNumber: true })}
                      className="mt-1"
                      error={form.formState.errors.price?.message}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register('isPublic')}
                      id="isPublic"
                      className="w-4 h-4"
                    />
                    <label htmlFor="isPublic" className="text-gray-300">
                      Make this track public
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register('drmEnabled')}
                      id="drmEnabled"
                      className="w-4 h-4"
                    />
                    <label htmlFor="drmEnabled" className="text-gray-300">
                      Enable DRM protection
                    </label>
                  </div>

                  {uploading ? (
                    <div className="text-center py-4">
                      <Spinner />
                      <p className="text-gray-400 mt-2">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      disabled={!form.formState.isValid}
                    >
                      Upload Track
                    </Button>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}