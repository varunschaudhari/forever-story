import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';

export async function GET() {
  try {
    await dbConnect();
    const wedding = await Wedding.findOne({ slug: 'sarah-michael' });

    if (!wedding) {
      return Response.json({ success: false, message: 'Wedding not found', found: false });
    }

    return Response.json({
      success: true,
      wedding: {
        slug: wedding.slug,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        title: wedding.title,
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? error.stack : String(error)
    }, { status: 500 });
  }
}
