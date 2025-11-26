import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { saveFile, deleteFile } from '@/lib/storage';
import { processAudio } from '@/lib/audioProcessor';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'CREATOR' && session.user.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const playlistId = formData.get('playlistId') as string;
        const sessionId = formData.get('sessionId') as string;

        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;
        const genre = formData.get('genre') as string;
        const allowDownload = formData.get('allowDownload') === 'true';
        const isPublic = formData.get('isPublic') === 'true';
        const price = parseFloat(formData.get('price') as string || '0');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 1. Save original file temporarily
        const tempFilePath = await saveFile(file, 'temp');

        try {
            // 2. Process audio (convert to m4a, normalize)
            const processed = await processAudio(tempFilePath);

            // 3. Create Track record
            const track = await prisma.track.create({
                data: {
                    filename: processed.filename,
                    originalName: file.name,
                    title: title || file.name.replace(/\.[^/.]+$/, ""),
                    artist: artist || session.user.artistName || 'Unknown Artist',
                    genre,
                    allowDownload,
                    isPublic,
                    price,
                    fileKey: processed.filePath, // In a real app, this would be S3 key
                    processedFileKey: processed.filePath,
                    duration: processed.duration,
                    bitrate: processed.bitrate,
                    sampleRate: processed.sampleRate,
                    audioFormat: processed.format,
                    creatorId: session.user.id,
                    playlistId: playlistId || undefined,
                    sessionId: sessionId || undefined,
                    processingStatus: 'completed',
                    processingProgress: 100
                }
            });

            // 4. Cleanup temp file
            await deleteFile(tempFilePath);

            return NextResponse.json({ success: true, track });
        } catch (processError) {
            console.error('Processing error:', processError);
            await deleteFile(tempFilePath);
            return NextResponse.json({ error: 'Audio processing failed' }, { status: 500 });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
