import { auth } from '@/auth';
import { apiError, apiResponse } from '@/lib/api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401);
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return apiError('No files provided', 400);
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // For now, convert to base64 and create a data URL
      // In production, use S3, Cloudinary, or similar service
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      uploadedUrls.push(dataUrl);
    }

    return apiResponse({
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return apiError('Failed to upload images', 500);
  }
}
