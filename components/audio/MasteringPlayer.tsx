'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Pause, Volume2, Activity } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'

interface MasteringPlayerProps {
  originalUrl?: string
  processedUrl?: string
  originalLUFS?: number
  processedLUFS?: number
  showComparison?: boolean
}

export function MasteringPlayer({
  originalUrl,
  processedUrl,
  originalLUFS,
  processedLUFS,
  showComparison = false
}: MasteringPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVersion, setCurrentVersion] = useState<'original' | 'processed'>('processed')
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!waveformRef.current) return

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'hsl(var(--muted))',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'hsl(var(--accent))',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 2,
    })

    wavesurferRef.current = wavesurfer

    // Load audio
    const url = currentVersion === 'original' ? originalUrl : processedUrl
    if (url) {
      wavesurfer.load(url)
    }

    wavesurfer.on('play', () => setIsPlaying(true))
    wavesurfer.on('pause', () => setIsPlaying(false))
    wavesurfer.on('finish', () => setIsPlaying(false))

    return () => {
      wavesurfer.destroy()
    }
  }, [currentVersion, originalUrl, processedUrl])

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }

  const switchVersion = (version: 'original' | 'processed') => {
    if (wavesurferRef.current) {
      wavesurferRef.current.pause()
    }
    setCurrentVersion(version)
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 space-y-4">
        {/* Waveform */}
        <div ref={waveformRef} className="w-full" />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={togglePlayPause}
              size="lg"
              className="gradient-primary text-white"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {showComparison && originalUrl && processedUrl && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={currentVersion === 'original' ? 'default' : 'outline'}
                  onClick={() => switchVersion('original')}
                  size="sm"
                >
                  Original
                </Button>
                <Button
                  variant={currentVersion === 'processed' ? 'default' : 'outline'}
                  onClick={() => switchVersion('processed')}
                  size="sm"
                >
                  Processed
                </Button>
              </div>
            )}
          </div>

          {/* LUFS Meter */}
          <div className="flex items-center space-x-6">
            {originalLUFS !== undefined && (
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Original:</span>
                  <span className="ml-2 font-semibold text-foreground">
                    {originalLUFS.toFixed(1)} LUFS
                  </span>
                </div>
              </div>
            )}

            {processedLUFS !== undefined && (
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Processed:</span>
                  <span className="ml-2 font-semibold text-primary">
                    {processedLUFS.toFixed(1)} LUFS
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quality Metrics */}
        {showComparison && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Original</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Loudness:</span>
                  <span className="text-foreground">{originalLUFS?.toFixed(1)} LUFS</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-primary">Processed</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Loudness:</span>
                  <span className="text-primary">{processedLUFS?.toFixed(1)} LUFS</span>
                </div>
                <div className="flex justify-between">
                  <span>Improvement:</span>
                  <span className="text-accent">
                    {originalLUFS && processedLUFS
                      ? `${Math.abs(processedLUFS - originalLUFS).toFixed(1)} LU`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}