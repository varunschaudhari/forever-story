import { dbConnect } from '@/lib/mongodb';
import { getWeddingStats, getWeddingById } from '@/lib/db';
import { apiResponse, apiError, AppError, validateId } from '@/lib/api';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    validateId(params.id);

    const wedding = await getWeddingById(params.id);
    if (!wedding) {
      throw new AppError('Wedding not found', 404, 'NOT_FOUND');
    }

    const stats = await getWeddingStats(params.id);

    return apiResponse({
      weddingId: params.id,
      weddingTitle: wedding.title,
      weddingDate: wedding.date,
      ...stats,
    });
  } catch (error) {
    return apiError(error);
  }
}
