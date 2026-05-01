import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'Signed in successfully' },
      { status: 200 }
    );

    // TODO: Set session cookie after authentication
    // await setSession({
    //   id: user._id.toString(),
    //   email: user.email,
    //   name: user.name,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt,
    // });

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signin' },
      { status: 500 }
    );
  }
}
