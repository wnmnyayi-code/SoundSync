import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'af-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'soundsync-streams-nhlakanipho';

export interface UploadOptions {
  folder?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

/**
 * Upload a file buffer to S3
 */
export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folder = 'uploads', contentType = 'application/octet-stream', metadata = {} } = options;

  // Generate unique key
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${uuidv4()}-${sanitizedFilename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    await s3Client.send(command);

    return {
      key,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      bucket: BUCKET_NAME,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload a file from local path to S3
 */
export async function uploadFileToS3(
  filePath: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const fs = await import('fs');
  const path = await import('path');
  
  const buffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  
  return uploadToS3(buffer, filename, options);
}

/**
 * Get a presigned URL for downloading a file
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

/**
 * Get a presigned URL for uploading a file (client-side upload)
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string = 'uploads',
  expiresIn: number = 3600
): Promise<{ url: string; key: string }> {
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${uuidv4()}-${sanitizedFilename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return { url, key };
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw new Error('Failed to generate presigned upload URL');
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete from S3');
  }
}

/**
 * Check if a file exists in S3
 */
export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get file metadata from S3
 */
export async function getFileMetadata(key: string): Promise<{
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  metadata?: Record<string, string>;
}> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Failed to get file metadata');
  }
}

/**
 * Upload audio file with processing
 */
export async function uploadAudioToS3(
  buffer: Buffer,
  filename: string,
  metadata: {
    userId: string;
    trackId?: string;
    duration?: number;
    bitrate?: number;
    format?: string;
  }
): Promise<UploadResult> {
  return uploadToS3(buffer, filename, {
    folder: 'audio',
    contentType: getAudioContentType(filename),
    metadata: {
      userId: metadata.userId,
      trackId: metadata.trackId || '',
      duration: metadata.duration?.toString() || '',
      bitrate: metadata.bitrate?.toString() || '',
      format: metadata.format || '',
    },
  });
}

/**
 * Upload image file
 */
export async function uploadImageToS3(
  buffer: Buffer,
  filename: string,
  userId: string
): Promise<UploadResult> {
  return uploadToS3(buffer, filename, {
    folder: 'images',
    contentType: getImageContentType(filename),
    metadata: { userId },
  });
}

/**
 * Helper to determine audio content type
 */
function getAudioContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a':
      return 'audio/mp4';
    case 'wav':
      return 'audio/wav';
    case 'flac':
      return 'audio/flac';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'audio/mpeg';
  }
}

/**
 * Helper to determine image content type
 */
function getImageContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}
