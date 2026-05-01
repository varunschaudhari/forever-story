import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { apiResponse, apiError, AppError } from '@/lib/api';
import { userSignupSchema } from '@/lib/validation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate input
    const validData = userSignupSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validData.email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    // Create new user
    const user = new User({
      email: validData.email.toLowerCase(),
      password: validData.password,
      name: validData.name,
    });

    await user.save();

    // Return success without exposing password
    return apiResponse(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        message: 'User created successfully. You can now sign in.',
      },
      201
    );
  } catch (error) {
    return apiError(error);
  }
}
