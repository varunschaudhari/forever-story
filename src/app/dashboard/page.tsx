import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getWeddingsByUser, getWeddingStats } from '@/lib/db';
import { dbConnect } from '@/lib/mongodb';
import { Types } from 'mongoose';

export default async function DashboardPage() {
  const session = await auth();

  let activeWedding = null;
  let stats = null;
  let daysToEvent = 0;
  let weddingCount = 0;

  if (session?.user?.id) {
    try {
      await dbConnect();
      const userId = new Types.ObjectId(session.user.id);
      const weddings = await getWeddingsByUser(userId, 1, 1);

      weddingCount = weddings.total;
      if (weddings.data.length > 0) {
        activeWedding = weddings.data[0];
        stats = await getWeddingStats(activeWedding._id);

        const eventDate = new Date(activeWedding.date);
        const today = new Date();
        const timeDiff = eventDate.getTime() - today.getTime();
        daysToEvent = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
    } catch (error) {
      console.error('Failed to fetch wedding data:', error);
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="p-6 md:p-12 lg:p-20">
      {/* Header */}
      <div className="mb-16 md:mb-20">
        <h1 className="heading-1 mb-2 text-on-surface">Your Digital Heirlooms</h1>
        <p className="text-lg text-tertiary font-body-lg">
          Create and preserve your most precious memories
        </p>
      </div>

      {/* 12 Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {activeWedding ? (
          <>
            {/* Active Wedding Card */}
            <div className="lg:col-span-7 card-base overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
              {/* Hero Image Section */}
              <div className="h-72 overflow-hidden relative">
                <img
                  src={
                    activeWedding.coverImage ||
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop'
                  }
                  alt={activeWedding.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Published Badge */}
                {activeWedding.isPublic && (
                  <div className="absolute top-4 right-4 bg-secondary-fixed text-on-secondary-fixed rounded-full px-4 py-1.5 text-[10px] font-label-caps tracking-widest uppercase">
                    Published
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 relative">
                <h3 className="heading-5 mb-2 text-on-surface">{activeWedding.title}</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  {formatDate(activeWedding.date)} • {activeWedding.venue?.city}
                </p>

                {/* Share Icon */}
                <div className="flex justify-between items-start mb-6">
                  <div />
                  <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
                    <span className="text-xl">↗️</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={`/dashboard/weddings/${activeWedding._id.toString()}/edit`} className="flex-1">
                    <Button variant="gold" size="md" className="w-full font-label-caps text-xs">
                      Edit Project
                    </Button>
                  </Link>
                  <Link href={`/weddings/${activeWedding.slug}`} className="flex-1">
                    <Button variant="outline" size="md" className="w-full font-label-caps text-xs">
                      View Site
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Next Wedding Card or Create Card */}
            {weddingCount > 1 ? (
              <div className="lg:col-span-5 card-base p-10 flex flex-col items-center justify-center text-center min-h-[360px]">
                <div className="mb-6">
                  <p className="text-sm text-on-surface-variant mb-2">MORE WEDDINGS</p>
                  <p className="text-4xl font-h3 text-primary">{weddingCount - 1}</p>
                </div>
                <Link href="/dashboard/weddings">
                  <Button variant="outline" size="md" className="font-label-caps text-xs">
                    View All Stories
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="lg:col-span-5 card-base bg-surface-container-low border-dashed border-2 border-outline-variant p-10 flex flex-col items-center justify-center text-center min-h-[360px]">
                <div className="p-6 bg-primary-container/30 rounded-full mb-6 w-fit">
                  <span className="text-5xl">💍</span>
                </div>
                <h3 className="heading-5 mb-3 text-on-surface">Create Your Next Story</h3>
                <p className="text-sm text-on-surface-variant mb-8 max-w-sm">
                  Start planning your next wedding and share it with the world
                </p>
                <Link href="/dashboard/weddings/new">
                  <Button variant="gold" size="pill">
                    Create New Story
                  </Button>
                </Link>
              </div>
            )}

            {/* Stats Bar */}
            {stats && (
              <div className="lg:col-span-12 card-base p-12 flex items-center justify-between">
                {/* Stat 1 */}
                <div className="text-center">
                  <p className="text-4xl font-h3 text-primary mb-2">{stats.totalGuests}</p>
                  <p className="text-xs font-label-caps uppercase text-tertiary">Total Guests</p>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-stone-200" />

                {/* Stat 2 */}
                <div className="text-center">
                  <p className="text-4xl font-h3 text-primary mb-2">
                    {daysToEvent > 0 ? daysToEvent : 'Today'}
                  </p>
                  <p className="text-xs font-label-caps uppercase text-tertiary">
                    {daysToEvent > 0 ? 'Days to Event' : 'Wedding Day'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-stone-200" />

                {/* Stat 3 */}
                <div className="text-center">
                  <p className="text-4xl font-h3 text-primary mb-2">{stats.respondedPercentage}%</p>
                  <p className="text-xs font-label-caps uppercase text-tertiary">RSVP Response</p>
                </div>

                {/* Avatar Stack - Placeholder */}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full border-2 border-white bg-primary-container/20 text-on-surface-variant flex items-center justify-center text-xs font-semibold shadow-sm"
                      >
                        {i}
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-semibold shadow-sm">
                      +{Math.max(0, stats.accepted - 3)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Empty State - Full Width */}
            <div className="lg:col-span-12 card-base bg-surface-container-low border-dashed border-2 border-outline-variant p-16 flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-primary-container/30 rounded-full mb-6 w-fit">
                <span className="text-6xl">💍</span>
              </div>
              <h3 className="heading-3 mb-3 text-on-surface">No Weddings Yet</h3>
              <p className="text-lg text-on-surface-variant mb-12 max-w-md">
                Start planning your wedding and share it with the world
              </p>
              <Link href="/dashboard/weddings/new">
                <Button variant="gold" size="pill">
                  Create Your First Story
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
