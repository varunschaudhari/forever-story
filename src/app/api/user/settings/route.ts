import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { apiError } from '@/lib/api';
import { updateUser } from '@/lib/db';
import { Types } from 'mongoose';

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return apiError('Unauthorized', 401);
    }

    await dbConnect();

    const body = await req.json();
    const { isProfilePublic, allowViewWeddingStories } = body;

    const userId = new Types.ObjectId(session.user.id);

    const updatedUser = await updateUser(userId, {
      isProfilePublic: isProfilePublic !== undefined ? isProfilePublic : undefined,
      allowViewWeddingStories: allowViewWeddingStories !== undefined ? allowViewWeddingStories : undefined,
    });

    if (!updatedUser) {
      return apiError('User not found', 404);
    }

    return Response.json({
      success: true,
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        isProfilePublic: updatedUser.isProfilePublic,
        allowViewWeddingStories: updatedUser.allowViewWeddingStories,
      },
    });
  } catch (error) {
    console.error('User settings update error:', error);
    return apiError('Failed to update user settings', 500);
  }
}
