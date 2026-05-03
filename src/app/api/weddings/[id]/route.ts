import { dbConnect } from '@/lib/mongodb';
import { getWeddingById, updateWedding, deleteWedding } from '@/lib/db';
import { apiResponse, apiError, AppError, validateId } from '@/lib/api';
import { auth } from '@/auth';
import { weddingUpdateSchema } from '@/lib/validation';
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

    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    validateId(params.id);

    const wedding = await getWeddingById(params.id);
    if (!wedding) {
      throw new AppError('Wedding not found', 404, 'NOT_FOUND');
    }

    // Check if user is an organizer or the partner who created it
    const isOrganizer = wedding.organizers.some((id: any) => id.toString() === session.user!.id);
    const isCreator = wedding.createdBy?.toString() === session.user!.id;

    if (!isOrganizer && !isCreator) {
      throw new AppError('Not authorized to update this story', 403, 'FORBIDDEN');
    }

    const body = await request.json();
    const validData = weddingUpdateSchema.parse(body);

    // Handle date conversion if provided
    const updateData = {
      ...validData,
      ...(validData.date && { date: new Date(validData.date) }),
      ...(validData.events && {
        events: validData.events.map((event: any) => ({
          ...event,
          date: event.date ? new Date(event.date) : undefined,
        })),
      }),
    } as any;

    const updated = await updateWedding(params.id, updateData);

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

    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    validateId(params.id);

    const wedding = await getWeddingById(params.id);
    if (!wedding) {
      throw new AppError('Wedding not found', 404, 'NOT_FOUND');
    }

    // Check if user is an organizer or the partner who created it
    const isOrganizer = wedding.organizers.some((id: any) => id.toString() === session.user!.id);
    const isCreator = wedding.createdBy?.toString() === session.user!.id;

    if (!isOrganizer && !isCreator) {
      throw new AppError('Not authorized to delete this story', 403, 'FORBIDDEN');
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
