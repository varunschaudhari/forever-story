import { dbConnect } from '@/lib/mongodb';
import { getRSVPsByWedding, createRSVP, getRSVPByEmailAndWedding } from '@/lib/db';
import { apiResponse, apiError, AppError, validateRequired, validateEmail } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getSession();
    if (!session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getRSVPsByWedding(new Types.ObjectId(params.id), page, limit);
    return apiResponse(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();

    validateRequired(body.guestEmail, 'Guest email');
    validateRequired(body.guestName, 'Guest name');
    validateEmail(body.guestEmail);

    // Check if RSVP already exists
    const weddingId = new Types.ObjectId(params.id);
    const existingRSVP = await getRSVPByEmailAndWedding(body.guestEmail, weddingId);
    if (existingRSVP) {
      throw new AppError(
        'RSVP already exists for this email',
        409,
        'DUPLICATE_RSVP'
      );
    }

    // Get session for invitedBy field
    const session = await getSession();
    const invitedBy = session?.id ? new Types.ObjectId(session.id) : undefined;

    const rsvp = await createRSVP({
      wedding: weddingId,
      guestEmail: body.guestEmail.toLowerCase(),
      guestName: body.guestName,
      status: body.status || 'pending',
      totalGuests: body.totalGuests || 1,
      additionalGuests: body.additionalGuests,
      dietaryRestrictions: body.dietaryRestrictions,
      mealPreference: body.mealPreference,
      comments: body.comments,
      invitedBy: invitedBy,
    });

    return apiResponse(rsvp, 201);
  } catch (error) {
    return apiError(error);
  }
}
