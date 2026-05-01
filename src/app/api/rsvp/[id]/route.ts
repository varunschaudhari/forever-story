import { dbConnect } from '@/lib/mongodb';
import { getRSVPById, updateRSVPStatus } from '@/lib/db';
import { apiResponse, apiError, AppError, validateId } from '@/lib/api';
import { NextRequest } from 'next/server';
import { RSVPStatus } from '@/models/RSVP';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    validateId(params.id);

    const rsvp = await getRSVPById(params.id);
    if (!rsvp) {
      throw new AppError('RSVP not found', 404, 'NOT_FOUND');
    }

    return apiResponse(rsvp);
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

    validateId(params.id);

    const body = await request.json();

    const rsvp = await getRSVPById(params.id);
    if (!rsvp) {
      throw new AppError('RSVP not found', 404, 'NOT_FOUND');
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses: RSVPStatus[] = ['pending', 'accepted', 'declined', 'maybe'];
      if (!validStatuses.includes(body.status)) {
        throw new AppError('Invalid RSVP status', 400, 'INVALID_STATUS');
      }
    }

    const updates = {
      ...(body.status && { status: body.status }),
      ...(body.totalGuests && { totalGuests: body.totalGuests }),
      ...(body.additionalGuests && { additionalGuests: body.additionalGuests }),
      ...(body.dietaryRestrictions && { dietaryRestrictions: body.dietaryRestrictions }),
      ...(body.mealPreference && { mealPreference: body.mealPreference }),
      ...(body.comments && { comments: body.comments }),
    };

    const updated = await updateRSVPStatus(params.id, body.status || rsvp.status, updates);

    return apiResponse(updated);
  } catch (error) {
    return apiError(error);
  }
}
