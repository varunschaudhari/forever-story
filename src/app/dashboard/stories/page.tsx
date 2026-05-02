import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getWeddingsByUser, getRSVPsByWedding } from '@/lib/db';
import { Types } from 'mongoose';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';

export default async function StoriesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  let weddings: any[] = [];
  let totalWeddings = 0;
  let weddingStats: { [key: string]: number } = {};

  try {
    await dbConnect();
    const userId = new Types.ObjectId(session.user.id);
    const result = await getWeddingsByUser(userId, 1, 12);
    weddings = result.data;
    totalWeddings = result.total;

    // Fetch RSVP counts for all weddings
    for (const wedding of weddings) {
      const rsvps = await getRSVPsByWedding(wedding._id, 1, 100);
      weddingStats[wedding._id.toString()] = rsvps.data.filter((r) => r.status === 'accepted').length;
    }
  } catch (error) {
    console.error('Failed to fetch weddings:', error);
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="p-6 md:p-12 lg:p-20">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="heading-2 mb-2">My Stories</h1>
          <p className="text-lg text-on-surface-variant">
            {totalWeddings > 0 ? `You have ${totalWeddings} wedding ${totalWeddings === 1 ? 'story' : 'stories'}` : 'Create and manage your beautiful wedding stories'}
          </p>
        </div>
        <Link href="/dashboard/weddings/new">
          <Button variant="gold" size="lg">
            Create New Story
          </Button>
        </Link>
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {weddings.length > 0 ? (
          weddings.map((wedding) => (
            <div
              key={wedding._id.toString()}
              className="card-base overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              {/* Hero Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={
                    wedding.coverImage ||
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop'
                  }
                  alt={wedding.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-secondary-fixed text-on-secondary-fixed rounded-full px-3 py-1 text-[10px] font-label-caps tracking-widest uppercase">
                    {wedding.isPublic ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="heading-5 mb-1 text-on-surface">{wedding.title}</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  {formatDate(wedding.date)} • {wedding.venue?.city || 'TBD'}
                </p>

                {/* Stats */}
                <div className="flex justify-between items-center text-sm mb-6 pb-6 border-b border-stone-200">
                  <span className="text-on-surface-variant">{wedding.guestCount} Guests</span>
                  <span className="text-on-surface-variant">{weddingStats[wedding._id.toString()] || 0} RSVPs</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/weddings/${wedding._id.toString()}/edit`}
                    className="flex-1"
                  >
                    <Button variant="gold" size="md" className="w-full font-label-caps text-xs">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/weddings/${wedding.slug}`} className="flex-1">
                    <Button variant="outline" size="md" className="w-full font-label-caps text-xs">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="col-span-full">
            <div className="card-base p-16 text-center">
              <p className="text-6xl mb-4">💍</p>
              <h3 className="heading-3 mb-3 text-on-surface">No Stories Yet</h3>
              <p className="text-lg text-on-surface-variant mb-10 max-w-md mx-auto">
                Begin your ForeverStory journey by creating your first wedding story. Share your love story
                with the world.
              </p>
              <Link href="/dashboard/weddings/new">
                <Button variant="gold" size="pill">
                  Create Your First Story
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
