import { dbConnect } from '@/lib/mongodb';
import { getWeddingsByUser, createWedding, getPublicWeddings } from '@/lib/db';
import { apiResponse, apiError, AppError } from '@/lib/api';
import { weddingCreateSchema } from '@/lib/validation';
import { auth } from '@/auth';
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

    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const result = await getWeddingsByUser(session.user.id, page, limit);
    return apiResponse(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();

    // Validate request body
    const validData = weddingCreateSchema.parse(body);

    // Check if slug already exists
    const { Wedding } = await import('@/models/Wedding');
    const existingWedding = await Wedding.findOne({ slug: validData.slug });
    if (existingWedding) {
      throw new AppError('Wedding slug already exists', 409, 'DUPLICATE_SLUG');
    }

    // Create wedding
    const wedding = await createWedding({
      ...validData,
      organizers: [session.user.id],
    });

    return apiResponse(
      {
        _id: wedding._id,
        ...wedding.toObject(),
      },
      201
    );
  } catch (error) {
    return apiError(error);
  }
}
