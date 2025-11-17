'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Volume2, Sparkles, Zap } from 'lucide-react'

type MasteringPreset = 'gentle' | 'moderate' | 'aggressive'

export default function AudioSettingsPage() {
  const [preset, setPreset] = useState<MasteringPreset>('moderate')
  const [targetLUFS, setTargetLUFS] = useState(-14)
  const [enableNormalization, setEnableNormalization] = useState(true)
  const [enableMastering, setEnableMastering] = useState(true)
  const [outputFormat, setOutputFormat] = useState<'mp3' | 'flac'>('mp3')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const presets = [
    {
      id: 'gentle' as const,
      name: 'Gentle',
      icon: Sparkles,
      description: 'Subtle enhancement, preserves original character',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'moderate' as const,
      name: 'Moderate',
      icon: Volume2,
      description: 'Balanced mastering for most genres',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'aggressive' as const,
      name: 'Aggressive',
      icon: Zap,
      description: 'Maximum loudness and punch',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/audio-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset,
          targetLUFS,
          enableNormalization,
          enableMastering,
          outputFormat
        })
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings saved',
        description: 'Your audio processing preferences have been updated'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-dark">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audio Processing Settings</h1>
            <p className="text-muted-foreground">Configure how your uploads are processed</p>
          </div>
        </div>

        {/* Mastering Presets */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Mastering Preset</CardTitle>
            <CardDescription>Choose how aggressively to process your audio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {presets.map((p) => {
                const Icon = p.icon
                return (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      preset === p.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Loudness Target */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Target Loudness (LUFS)</CardTitle>
            <CardDescription>
              Industry standard is -14 LUFS for streaming platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Target LUFS</Label>
                <span className="text-2xl font-bold text-primary">{targetLUFS} LUFS</span>
              </div>
              <Slider
                value={[targetLUFS]}
                onValueChange={(value) => setTargetLUFS(value[0])}
                min={-18}
                max={-10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Quieter (-18)</span>
                <span>Louder (-10)</span>
              </div>
            </div>

            <div className="p-4 bg-muted/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Recommended values:</strong>
                <br />
                • Spotify, Apple Music: -14 LUFS
                <br />
                • YouTube: -13 to -15 LUFS
                <br />
                • SoundCloud: -8 to -13 LUFS
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Processing Options */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Processing Options</CardTitle>
            <CardDescription>Enable or disable specific processing steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/5 rounded-lg">
              <div>
                <Label className="text-foreground font-semibold">Loudness Normalization</Label>
                <p className="text-sm text-muted-foreground">
                  Ensure consistent volume across all tracks
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableNormalization}
                onChange={(e) => setEnableNormalization(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/5 rounded-lg">
              <div>
                <Label className="text-foreground font-semibold">Audio Mastering</Label>
                <p className="text-sm text-muted-foreground">
                  Apply EQ, compression, and limiting
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableMastering}
                onChange={(e) => setEnableMastering(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/5 rounded-lg">
              <div>
                <Label className="text-foreground font-semibold">Output Format</Label>
                <p className="text-sm text-muted-foreground">
                  Choose between MP3 (320kbps) or FLAC (lossless)
                </p>
              </div>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'mp3' | 'flac')}
                className="px-4 py-2 bg-input border border-border rounded-lg text-foreground"
              >
                <option value="mp3">MP3 (320kbps)</option>
                <option value="flac">FLAC (Lossless)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gradient-primary text-white px-8"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}