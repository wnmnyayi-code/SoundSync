import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { tmpdir } from 'os';

// Configure ffmpeg path
if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}

export interface AudioMetadata {
    duration: number;
    bitrate: number;
    sampleRate: number;
    channels: number;
    format: string;
    lufsLevel?: number;
}

export interface ProcessedAudio {
    filePath: string;
    duration: number;
    bitrate: number;
    sampleRate: number;
    format: string;
    filename: string;
}

export interface ProcessingOptions {
    targetLUFS?: number; // Default: -14 LUFS
    preset?: 'gentle' | 'moderate' | 'aggressive';
    outputFormat?: 'm4a' | 'mp3';
    outputBitrate?: number; // For MP3: 320kbps default, AAC: 128k default
}

/**
 * Get audio metadata using ffprobe
 */
export async function getAudioMetadata(filePath: string): Promise<AudioMetadata> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
                return;
            }

            const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
            if (!audioStream) {
                reject(new Error('No audio stream found'));
                return;
            }

            resolve({
                duration: metadata.format.duration ? parseFloat(metadata.format.duration) : 0,
                bitrate: metadata.format.bit_rate ? parseInt(String(metadata.format.bit_rate)) : 0,
                sampleRate: audioStream.sample_rate ? parseInt(String(audioStream.sample_rate)) : 44100,
                channels: audioStream.channels || 2,
                format: metadata.format.format_name || 'unknown'
            });
        });
    });
}

/**
 * Measure LUFS (Loudness Units Full Scale) using EBU R128 standard
 */
export async function measureLUFS(filePath: string): Promise<number> {
    const tempOutput = path.join(tmpdir(), `audio-${Date.now()}-lufs.txt`);

    try {
        return new Promise((resolve, reject) => {
            ffmpeg(filePath)
                .audioFilters('loudnorm=print_format=json')
                .output(tempOutput)
                .on('end', async () => {
                    try {
                        const output = await fsPromises.readFile(tempOutput, 'utf-8');
                        // Parse loudnorm output to extract integrated loudness
                        const match = output.match(/"input_i"\s*:\s*"(-?\d+\.?\d*)"/i);
                        if (match) {
                            resolve(parseFloat(match[1]));
                        } else {
                            resolve(-14); // Default fallback
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                .on('error', reject)
                .run();
        });
    } finally {
        await fsPromises.unlink(tempOutput).catch(() => { });
    }
}

/**
 * Build audio filter chain based on preset and target LUFS
 */
function buildFilterChain(
    preset: 'gentle' | 'moderate' | 'aggressive',
    targetLUFS: number
): string[] {
    const filters: string[] = [];

    // Loudness normalization (EBU R128)
    filters.push(`loudnorm=I=${targetLUFS}:TP=-1.5:LRA=11`);

    // Add mastering effects based on preset
    switch (preset) {
        case 'gentle':
            // Subtle enhancement
            filters.push('equalizer=f=100:width_type=o:width=2:g=1'); // Bass boost
            filters.push('equalizer=f=8000:width_type=o:width=2:g=0.5'); // Treble enhance
            filters.push('acompressor=threshold=-20dB:ratio=2:attack=5:release=50'); // Light compression
            break;

        case 'moderate':
            // Balanced mastering
            filters.push('equalizer=f=80:width_type=o:width=2:g=1.5'); // Bass boost
            filters.push('equalizer=f=200:width_type=o:width=1:g=-0.5'); // Reduce muddiness
            filters.push('equalizer=f=3000:width_type=o:width=2:g=1'); // Presence boost
            filters.push('equalizer=f=10000:width_type=o:width=2:g=1'); // Air/sparkle
            filters.push('acompressor=threshold=-18dB:ratio=3:attack=5:release=50'); // Moderate compression
            filters.push('alimiter=limit=0.95:attack=5:release=50'); // Soft limiting
            break;

        case 'aggressive':
            // Maximum loudness and punch
            filters.push('equalizer=f=60:width_type=o:width=2:g=2'); // Deep bass
            filters.push('equalizer=f=150:width_type=o:width=1:g=-1'); // Reduce muddiness
            filters.push('equalizer=f=2500:width_type=o:width=2:g=1.5'); // Presence
            filters.push('equalizer=f=8000:width_type=o:width=2:g=1.5'); // Brightness
            filters.push('acompressor=threshold=-16dB:ratio=4:attack=3:release=40'); // Heavy compression
            filters.push('alimiter=limit=0.98:attack=3:release=40'); // Hard limiting
            break;
    }

    return filters;
}

/**
 * Main processing function used by the API
 */
export async function processAudio(
    inputPath: string,
    options: ProcessingOptions = {}
): Promise<ProcessedAudio> {
    const {
        targetLUFS = -14,
        preset = 'moderate',
        outputFormat = 'm4a'
    } = options;

    const outputFilename = `${uuidv4()}.${outputFormat}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const outputPath = path.join(uploadDir, outputFilename);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
        // Measure original LUFS (optional, but good for logging/analytics if needed)
        // const originalLUFS = await measureLUFS(inputPath);

        // Build filters
        const filters = buildFilterChain(preset, targetLUFS);

        return new Promise((resolve, reject) => {
            const command = ffmpeg(inputPath)
                .audioFilters(filters)
                .audioChannels(2)
                .audioFrequency(44100);

            if (outputFormat === 'm4a') {
                command
                    .toFormat('m4a')
                    .audioCodec('aac')
                    .audioBitrate('128k');
            } else {
                command
                    .toFormat('mp3')
                    .audioCodec('libmp3lame')
                    .audioBitrate('320k');
            }

            command
                .on('end', async () => {
                    try {
                        const metadata = await getAudioMetadata(outputPath);
                        resolve({
                            filePath: outputPath,
                            filename: outputFilename,
                            duration: metadata.duration,
                            bitrate: metadata.bitrate,
                            sampleRate: metadata.sampleRate,
                            format: outputFormat
                        });
                    } catch (err) {
                        reject(err);
                    }
                })
                .on('error', (err) => {
                    console.error('FFmpeg processing error:', err);
                    reject(err);
                })
                .save(outputPath);
        });
    } catch (error) {
        console.error('Audio processing failed:', error);
        throw error;
    }
}

/**
 * Normalize audio from buffer (for S3/cloud processing)
 */
export interface ProcessingResult {
    processedBuffer: Buffer;
    metadata: AudioMetadata;
    originalMetadata: AudioMetadata;
}

export async function normalizeAudio(
    buffer: Buffer,
    options: ProcessingOptions = {}
): Promise<ProcessingResult> {
    const {
        targetLUFS = -14,
        preset = 'moderate',
        outputFormat = 'mp3'
    } = options;

    const tempInput = path.join(tmpdir(), `audio-${Date.now()}-input`);
    const tempOutput = path.join(tmpdir(), `audio-${Date.now()}-output.${outputFormat}`);

    try {
        // Write buffer to temp file
        await fsPromises.writeFile(tempInput, buffer);

        // Get original metadata
        const originalMetadata = await getAudioMetadata(tempInput);

        // Measure original LUFS
        const originalLUFS = await measureLUFS(tempInput);

        // Build filters
        const filters = buildFilterChain(preset, targetLUFS);

        // Process audio
        await new Promise<void>((resolve, reject) => {
            const command = ffmpeg(tempInput)
                .audioFilters(filters)
                .audioChannels(2)
                .audioFrequency(48000);

            if (outputFormat === 'mp3') {
                command
                    .toFormat('mp3')
                    .audioCodec('libmp3lame')
                    .audioBitrate('320k');
            } else {
                command
                    .toFormat('m4a')
                    .audioCodec('aac')
                    .audioBitrate('128k');
            }

            command
                .output(tempOutput)
                .on('end', () => resolve())
                .on('error', reject)
                .run();
        });

        // Read processed file
        const processedBuffer = await fsPromises.readFile(tempOutput);

        // Get processed metadata
        const processedMetadata = await getAudioMetadata(tempOutput);
        processedMetadata.lufsLevel = targetLUFS;

        return {
            processedBuffer,
            metadata: processedMetadata,
            originalMetadata: {
                ...originalMetadata,
                lufsLevel: originalLUFS
            }
        };
    } finally {
        // Cleanup temp files
        await fsPromises.unlink(tempInput).catch(() => { });
        await fsPromises.unlink(tempOutput).catch(() => { });
    }
}


