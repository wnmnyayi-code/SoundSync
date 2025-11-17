import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { promisify } from 'util'
import { writeFile, unlink, readFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

// Set ffmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic)
}

export interface AudioMetadata {
  duration: number
  bitrate: number
  sampleRate: number
  channels: number
  format: string
  lufsLevel?: number
}

export interface ProcessingOptions {
  targetLUFS?: number // Default: -14 LUFS
  preset?: 'gentle' | 'moderate' | 'aggressive'
  outputFormat?: 'mp3' | 'flac'
  outputBitrate?: number // For MP3: 320kbps default
}

export interface ProcessingResult {
  processedBuffer: Buffer
  metadata: AudioMetadata
  originalMetadata: AudioMetadata
}

/**
 * Get audio metadata using ffprobe
 */
export async function getAudioMetadata(buffer: Buffer): Promise<AudioMetadata> {
  const tempInput = join(tmpdir(), `audio-${Date.now()}-input`)
  
  try {
    await writeFile(tempInput, buffer)
    
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(tempInput, (err, metadata) => {
        if (err) {
          reject(err)
          return
        }
        
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio')
        if (!audioStream) {
          reject(new Error('No audio stream found'))
          return
        }
        
        resolve({
          duration: metadata.format.duration || 0,
          bitrate: metadata.format.bit_rate ? parseInt(String(metadata.format.bit_rate)) : 0,
          sampleRate: audioStream.sample_rate ? parseInt(String(audioStream.sample_rate)) : 44100,
          channels: audioStream.channels || 2,
          format: metadata.format.format_name || 'unknown'
        })
      })
    })
  } finally {
    await unlink(tempInput).catch(() => {})
  }
}

/**
 * Measure LUFS (Loudness Units Full Scale) using EBU R128 standard
 */
export async function measureLUFS(buffer: Buffer): Promise<number> {
  const tempInput = join(tmpdir(), `audio-${Date.now()}-lufs`)
  const tempOutput = join(tmpdir(), `audio-${Date.now()}-lufs.txt`)
  
  try {
    await writeFile(tempInput, buffer)
    
    return new Promise((resolve, reject) => {
      ffmpeg(tempInput)
        .audioFilters('loudnorm=print_format=json')
        .output(tempOutput)
        .on('end', async () => {
          try {
            const output = await readFile(tempOutput, 'utf-8')
            // Parse loudnorm output to extract integrated loudness
            const match = output.match(/"input_i"\s*:\s*"(-?\d+\.?\d*)"/i)
            if (match) {
              resolve(parseFloat(match[1]))
            } else {
              resolve(-14) // Default fallback
            }
          } catch (e) {
            reject(e)
          }
        })
        .on('error', reject)
        .run()
    })
  } finally {
    await unlink(tempInput).catch(() => {})
    await unlink(tempOutput).catch(() => {})
  }
}

/**
 * Normalize audio to target LUFS level
 */
export async function normalizeAudio(
  buffer: Buffer,
  options: ProcessingOptions = {}
): Promise<ProcessingResult> {
  const {
    targetLUFS = -14,
    preset = 'moderate',
    outputFormat = 'mp3',
    outputBitrate = 320
  } = options
  
  const tempInput = join(tmpdir(), `audio-${Date.now()}-input`)
  const tempOutput = join(tmpdir(), `audio-${Date.now()}-output.${outputFormat}`)
  
  try {
    // Write input buffer to temp file
    await writeFile(tempInput, buffer)
    
    // Get original metadata
    const originalMetadata = await getAudioMetadata(buffer)
    
    // Measure original LUFS
    const originalLUFS = await measureLUFS(buffer)
    
    // Build audio filter chain based on preset
    const filters = buildFilterChain(preset, targetLUFS, originalLUFS)
    
    // Process audio
    await new Promise<void>((resolve, reject) => {
      const command = ffmpeg(tempInput)
        .audioFilters(filters)
        .audioCodec(outputFormat === 'mp3' ? 'libmp3lame' : 'flac')
        .audioChannels(2)
        .audioFrequency(48000) // High quality sample rate
      
      if (outputFormat === 'mp3') {
        command.audioBitrate(outputBitrate)
      }
      
      command
        .output(tempOutput)
        .on('end', () => resolve())
        .on('error', reject)
        .run()
    })
    
    // Read processed file
    const processedBuffer = await readFile(tempOutput)
    
    // Get processed metadata
    const processedMetadata = await getAudioMetadata(processedBuffer)
    processedMetadata.lufsLevel = targetLUFS
    
    return {
      processedBuffer,
      metadata: processedMetadata,
      originalMetadata: {
        ...originalMetadata,
        lufsLevel: originalLUFS
      }
    }
  } finally {
    // Cleanup temp files
    await unlink(tempInput).catch(() => {})
    await unlink(tempOutput).catch(() => {})
  }
}

/**
 * Build audio filter chain based on preset and target LUFS
 */
function buildFilterChain(
  preset: 'gentle' | 'moderate' | 'aggressive',
  targetLUFS: number,
  currentLUFS: number
): string[] {
  const filters: string[] = []
  
  // Loudness normalization (EBU R128)
  filters.push(`loudnorm=I=${targetLUFS}:TP=-1.5:LRA=11`)
  
  // Add mastering effects based on preset
  switch (preset) {
    case 'gentle':
      // Subtle enhancement
      filters.push('equalizer=f=100:width_type=o:width=2:g=1') // Bass boost
      filters.push('equalizer=f=8000:width_type=o:width=2:g=0.5') // Treble enhance
      filters.push('acompressor=threshold=-20dB:ratio=2:attack=5:release=50') // Light compression
      break
      
    case 'moderate':
      // Balanced mastering
      filters.push('equalizer=f=80:width_type=o:width=2:g=1.5') // Bass boost
      filters.push('equalizer=f=200:width_type=o:width=1:g=-0.5') // Reduce muddiness
      filters.push('equalizer=f=3000:width_type=o:width=2:g=1') // Presence boost
      filters.push('equalizer=f=10000:width_type=o:width=2:g=1') // Air/sparkle
      filters.push('acompressor=threshold=-18dB:ratio=3:attack=5:release=50') // Moderate compression
      filters.push('alimiter=limit=0.95:attack=5:release=50') // Soft limiting
      break
      
    case 'aggressive':
      // Maximum loudness and punch
      filters.push('equalizer=f=60:width_type=o:width=2:g=2') // Deep bass
      filters.push('equalizer=f=150:width_type=o:width=1:g=-1') // Reduce muddiness
      filters.push('equalizer=f=2500:width_type=o:width=2:g=1.5') // Presence
      filters.push('equalizer=f=8000:width_type=o:width=2:g=1.5') // Brightness
      filters.push('acompressor=threshold=-16dB:ratio=4:attack=3:release=40') // Heavy compression
      filters.push('alimiter=limit=0.98:attack=3:release=40') // Hard limiting
      break
  }
  
  return filters
}

/**
 * Convert audio to standard format without mastering
 */
export async function convertToStandardFormat(
  buffer: Buffer,
  format: 'mp3' | 'flac' = 'mp3',
  bitrate: number = 320
): Promise<Buffer> {
  const tempInput = join(tmpdir(), `audio-${Date.now()}-convert-input`)
  const tempOutput = join(tmpdir(), `audio-${Date.now()}-convert-output.${format}`)
  
  try {
    await writeFile(tempInput, buffer)
    
    await new Promise<void>((resolve, reject) => {
      const command = ffmpeg(tempInput)
        .audioCodec(format === 'mp3' ? 'libmp3lame' : 'flac')
        .audioChannels(2)
        .audioFrequency(48000)
      
      if (format === 'mp3') {
        command.audioBitrate(bitrate)
      }
      
      command
        .output(tempOutput)
        .on('end', () => resolve())
        .on('error', reject)
        .run()
    })
    
    return await readFile(tempOutput)
  } finally {
    await unlink(tempInput).catch(() => {})
    await unlink(tempOutput).catch(() => {})
  }
}