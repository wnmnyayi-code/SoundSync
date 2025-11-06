'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function UploadPage() {
  const { data: session } = useSession()
  const [uploading, setUploading] = useState(false)

  if (!session || session.user.role !== 'CREATOR') {
    redirect('/login')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('track', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      alert('Track uploaded successfully!')
    } else {
      alert('Upload failed')
    }
    setUploading(false)
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-primary">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-dark-800 border-primary-700">
          <CardHeader>
            <CardTitle className="text-white">Upload Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-primary-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                Upload music you own. Files are temporary and auto-deleted after 24h.
              </p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button as="span" className="bg-primary-600 hover:bg-primary-700">
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}