import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from './env'
import { normalizeAudio, type ProcessingOptions, type ProcessingResult } from './audioProcessor'
import prisma from './prisma'

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export interface AudioProcessingJob {
  trackId: string
  originalFileKey: string
  userId: string
  options?: ProcessingOptions
}

export interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  error?: string
  result?: ProcessingResult
}

/**
 * Process audio file: download from S3, normalize, upload back to S3
 */
export async function processAudioFile(job: AudioProcessingJob): Promise<ProcessingStatus> {
  try {
    // Update status to processing
    await updateTrackStatus(job.trackId, 'processing', 0)

    // Download original file from S3
    const originalBuffer = await downloadFromS3(job.originalFileKey)
    await updateTrackStatus(job.trackId, 'processing', 25)

    // Process audio (normalize and master)
    const result = await normalizeAudio(originalBuffer, job.options)
    await updateTrackStatus(job.trackId, 'processing', 75)

    // Upload processed file to S3
    const processedFileKey = job.originalFileKey.replace('temp-streams/', 'processed-streams/')
    await uploadToS3(processedFileKey, result.processedBuffer, 'audio/mpeg')
    await updateTrackStatus(job.trackId, 'processing', 90)

    // Update track in database with processing results
    await prisma.track.update({
      where: { id: job.trackId },
      data: {
        processedFileKey,
        processingStatus: 'completed',
        lufsLevel: result.metadata.lufsLevel,
        duration: result.metadata.duration,
        bitrate: result.metadata.bitrate,
        sampleRate: result.metadata.sampleRate,
        audioFormat: result.metadata.format,
        originalLufsLevel: result.originalMetadata.lufsLevel,
      }
    })

    await updateTrackStatus(job.trackId, 'completed', 100)

    return {
      status: 'completed',
      progress: 100,
      result
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.track.update({
      where: { id: job.trackId },
      data: {
        processingStatus: 'failed',
        processingError: errorMessage
      }
    })

    return {
      status: 'failed',
      error: errorMessage
    }
  }
}

/**
 * Download file from S3
 */
async function downloadFromS3(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
  })

  const response = await s3.send(command)

  if (!response.Body) {
    throw new Error('No data received from S3')
  }

  // Convert stream to buffer
  const chunks: Uint8Array[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const chunk of response.Body as any) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

/**
 * Upload file to S3
 */
async function uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await s3.send(command)
}

/**
 * Update track processing status
 */
async function updateTrackStatus(
  trackId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  progress: number
): Promise<void> {
  await prisma.track.update({
    where: { id: trackId },
    data: {
      processingStatus: status,
      processingProgress: progress,
    }
  })
}

/**
 * Queue audio processing job (in-memory queue for now, can be replaced with Redis/Bull)
 */
const processingQueue: AudioProcessingJob[] = []
let isProcessing = false

export async function queueAudioProcessing(job: AudioProcessingJob): Promise<void> {
  processingQueue.push(job)

  // Start processing if not already running
  if (!isProcessing) {
    processQueue()
  }
}

/**
 * Process jobs from queue sequentially
 */
async function processQueue(): Promise<void> {
  if (processingQueue.length === 0) {
    isProcessing = false
    return
  }

  isProcessing = true
  const job = processingQueue.shift()

  if (job) {
    try {
      await processAudioFile(job)
    } catch (error) {
      console.error('Error processing audio job:', error)
    }
  }

  // Process next job
  setTimeout(() => processQueue(), 100)
}

/**
 * Get processing status for a track
 */
export async function getProcessingStatus(trackId: string): Promise<ProcessingStatus | null> {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: {
      processingStatus: true,
      processingProgress: true,
      processingError: true,
    }
  })

  if (!track) {
    return null
  }

  return {
    status: track.processingStatus as ProcessingStatus['status'],
    progress: track.processingProgress || 0,
    error: track.processingError || undefined,
  }
}