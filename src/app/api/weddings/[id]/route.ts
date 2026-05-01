import { dbConnect } from '@/lib/mongodb';
import { getWeddingById, updateWedding, deleteWedding } from '@/lib/db';
import { apiResponse, apiError, AppError, validateId } from '@/lib/api';
import { getSession } from '@/lib/auth';
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

    return apiResponse(wedding);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    validateId(params.id);

    const wedding = await getWeddingById(params.id);
    if (!wedding) {
      throw new AppError('Wedding not found', 404, 'NOT_FOUND');
    }

    // Check if user is an organizer
    if (!wedding.organizers.some((id: any) => id.toString() === session.id)) {
      throw new AppError('Not authorized to update this wedding', 403, 'FORBIDDEN');
    }

    const body = await request.json();
    const updated = await updateWedding(params.id, body);

    return apiResponse(updated);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    validateId(params.id);

    const wedding = await getWeddingById(params.id);
    if (!wedding) {
      throw new AppError('Wedding not found', 404, 'NOT_FOUND');
    }

    // Check if user is an organizer
    if (!wedding.organizers.some((id: any) => id.toString() === session.id)) {
      throw new AppError('Not authorized to delete this wedding', 403, 'FORBIDDEN');
    }

    const deleted = await deleteWedding(params.id);

    if (!deleted) {
      throw new AppError('Failed to delete wedding', 500, 'DELETE_FAILED');
    }

    return apiResponse({ success: true }, 200);
  } catch (error) {
    return apiError(error);
  }
}
