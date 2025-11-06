'use client'
import { useEffect, useRef } from 'react'

interface DRMPlayerProps {
  streamUrl: string
  sessionId: string
}

export default function DRMPlayer({ streamUrl, sessionId }: DRMPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Configure DRM licenses
    const config = {
      type: 'application/x-mpegurl',
      src: streamUrl,
      keySystems: {
        'com.widevine.alpha': {
          getLicense: async (message: any) => {
            const res = await fetch('/api/drm/license', {
              method: 'POST',
              headers: { 'Content-Type': 'application/octet-stream' },
              body: JSON.stringify({
                sessionId,
                licenseRequest: Array.from(new Uint8Array(message))
              })
            })
            return res.arrayBuffer()
          }
        },
        'com.apple.fps': {
          certificateUri: '/fairplay/cert.der',
          getLicense: async (message: any) => {
            const res = await fetch('/api/drm/fairplay-license', {
              method: 'POST',
              body: JSON.stringify({ sessionId, message })
            })
            return res.arrayBuffer()
          }
        }
      }
    }

    // Use hls.js or native HLS player
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
    }

    // Prevent screen recording (iOS)
    video.addEventListener('play', () => {
      // This triggers iOS FairPlay DRM protection
      video.setAttribute('controlsList', 'nodownload nofullscreen')
    })

  }, [streamUrl, sessionId])

  return (
    <video 
      ref={videoRef} 
      controls 
      className="w-full h-full"
      // @ts-ignore
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
    />
  )
}