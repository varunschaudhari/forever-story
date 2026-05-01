import { dbConnect } from '@/lib/mongodb';
import { getWeddingsByUser, createWedding, getPublicWeddings } from '@/lib/db';
import { apiResponse, apiError, AppError, validateRequired } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isPublic = searchParams.get('public') === 'true';
    const city = searchParams.get('city');
    const tags = searchParams.get('tags')?.split(',');

    if (isPublic) {
      const result = await getPublicWeddings(page, limit, { city, tags });
      return apiResponse(result);
    }

    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const result = await getWeddingsByUser(session.id, page, limit);
    return apiResponse(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();

    validateRequired(body.title, 'Title');
    validateRequired(body.date, 'Date');
    validateRequired(body.venue, 'Venue');

    const wedding = await createWedding({
      ...body,
      organizers: [session.id],
    });

    return apiResponse(wedding, 201);
  } catch (error) {
    return apiError(error);
  }
}
