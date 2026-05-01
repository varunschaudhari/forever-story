import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    const user = new User({ name, email, password });
    await user.save();

    const response = NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );

    // TODO: Set session cookie after user creation
    // await setSession({
    //   id: user._id.toString(),
    //   email: user.email,
    //   name: user.name,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt,
    // });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
