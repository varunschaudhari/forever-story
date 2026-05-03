import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const admin = await User.findById(session.user.id);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const wedding = (await Wedding.findById(params.id).lean()) as any;
    if (!wedding) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(wedding);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const admin = await User.findById(session.user.id);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, description, isPublic } = await request.json();

    const wedding = await Wedding.findByIdAndUpdate(
      params.id,
      { title, description, isPublic },
      { new: true, runValidators: true }
    );

    if (!wedding) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(wedding);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const admin = await User.findById(session.user.id);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const wedding = await Wedding.findByIdAndDelete(params.id);
    if (!wedding) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
