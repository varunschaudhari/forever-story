import { auth } from '@/auth';
import { apiError, apiResponse } from '@/lib/api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error('[Upload] Unauthorized - no session');
      return apiError('Unauthorized', 401);
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      console.error('[Upload] No files provided');
      return apiError('No files provided', 400);
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        // For now, convert to base64 and create a data URL
        // In production, use S3, Cloudinary, or similar service
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = Buffer.from(binary, 'binary').toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        uploadedUrls.push(dataUrl);
      } catch (fileError) {
        console.error(`[Upload] Error processing file ${file.name}:`, fileError);
        throw fileError;
      }
    }

    return apiResponse({
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    return apiError(error instanceof Error ? error.message : 'Failed to upload images', 500);
  }
}
