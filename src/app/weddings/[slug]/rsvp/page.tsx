import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface RSVPPageProps {
  params: {
    slug: string;
  };
}

export default async function RSVPPage({ params }: RSVPPageProps) {
  try {
    await dbConnect();

    const wedding = await Wedding.findOne({ slug: params.slug }).select('groomName brideName title');

    if (!wedding) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Link href={`/weddings/${params.slug}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
              ← Back to Wedding
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              RSVP for {wedding.groomName} & {wedding.brideName}
            </h1>
          </div>
        </div>

        {/* RSVP Form */}
        <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600 mb-4">RSVP form coming soon</p>
              <p className="text-sm text-gray-500">
                Please check back later or contact the couple directly
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching wedding:', error);
    notFound();
  }
}
