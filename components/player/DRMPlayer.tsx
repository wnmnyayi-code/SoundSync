'use client'
import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { toast } from '@/components/ui/use-toast'

interface DRMPlayerProps {
  streamUrl: string
  sessionId: string
}

interface KeySystem {
  getLicense(message: ArrayBuffer): Promise<ArrayBuffer>
  certificateUri?: string
}

interface DRMConfig {
  type: string
  src: string
  keySystems: {
    [key: string]: KeySystem
  }
}

export default function DRMPlayer({ streamUrl, sessionId }: DRMPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Configure DRM licenses
    const config: DRMConfig = {
      type: 'application/x-mpegurl',
      src: streamUrl,
      keySystems: {
        'com.widevine.alpha': {
          getLicense: async (message: ArrayBuffer) => {
            try {
              const res = await fetch('/api/drm/license', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/octet-stream',
                  'x-session-id': sessionId
                },
                body: JSON.stringify({
                  sessionId,
                  licenseRequest: Array.from(new Uint8Array(message))
                })
              })

              if (!res.ok) {
                throw new Error('Failed to get Widevine license')
              }

              return res.arrayBuffer()
            } catch (err) {
              console.error('Widevine license error:', err)
              throw err
            }
          }
        },
        'com.apple.fps': {
          certificateUri: '/fairplay/cert.der',
          getLicense: async (message: ArrayBuffer) => {
            try {
              const res = await fetch('/api/drm/fairplay-license', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-session-id': sessionId
                },
                body: JSON.stringify({ 
                  sessionId, 
                  message: Array.from(new Uint8Array(message))
                })
              })

              if (!res.ok) {
                throw new Error('Failed to get FairPlay license')
              }

              return res.arrayBuffer()
            } catch (err) {
              console.error('FairPlay license error:', err)
              throw err
            }
          }
        }
      }
    }

    try {
      // Use hls.js or native HLS player
      if (Hls.isSupported()) {
        const hls = new Hls({
          debug: process.env.NODE_ENV === 'development',
          enableWorker: true,
          lowLatencyMode: true,
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            const errorMessage = `HLS Error: ${data.type} - ${data.details}`
            console.error(errorMessage, data)
            setError(errorMessage)
            toast({
              title: 'Playback Error',
              description: 'Failed to load stream. Please try again.',
              className: 'bg-destructive'
            })
          }
        })

        hls.loadSource(streamUrl)
        hls.attachMedia(video)
        hlsRef.current = hls
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl
      } else {
        throw new Error('HLS playback not supported')
      }

      // Prevent screen recording (iOS)
      video.addEventListener('play', () => {
        video.setAttribute('controlsList', 'nodownload nofullscreen')
      })

      // Handle playback errors
      video.addEventListener('error', (e) => {
        const errorMessage = `Video Error: ${video.error?.code} - ${video.error?.message}`
        console.error(errorMessage)
        setError(errorMessage)
        toast({
          title: 'Playback Error',
          description: 'An error occurred during playback.',
          className: 'bg-destructive'
        })
      })

    } catch (err) {
      console.error('Player initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize player')
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [streamUrl, sessionId])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-800 text-white p-4">
        <p>Failed to load stream: {error}</p>
      </div>
    )
  }

  return (
    <video 
      ref={videoRef} 
      controls 
      className="w-full h-full"
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      playsInline // Important for iOS
    />
  )
}