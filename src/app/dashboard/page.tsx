import Link from 'next/link';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Dashboard - ForeverStory',
};

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  // Fetch user's weddings
  const weddings = (await Wedding.find({ organizers: session?.user?.id }).lean().sort({
    createdAt: -1,
  })) as any[];

  const activeWedding = weddings[0];
  const totalWeddings = weddings.length;
  const totalGuests = weddings.reduce((sum, w) => sum + (w.guestCount || 0), 0);
  const publishedWeddings = weddings.filter((w) => w.isPublic).length;

  return (
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">
            Your Digital Heirlooms
          </h1>
          <p className="text-on-surface-variant">Manage and share your wedding story</p>
        </div>
        <Link href="/dashboard/weddings/new">
          <Button variant="gold" size="lg" className="text-sm lg:text-base">
            + New Wedding
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <input
          type="search"
          placeholder="Search weddings..."
          className="w-full max-w-md px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
        />
      </div>

      {/* SECTION 1: Active Wedding Card */}
      {activeWedding ? (
        <section className="mb-16">
          <div className="card-base overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Image */}
              <div className="md:col-span-1 h-64 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden relative">
                {activeWedding.coverImage ? (
                  <img
                    src={activeWedding.coverImage}
                    alt={activeWedding.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">💍</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="md:col-span-2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
                        activeWedding.isPublic
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activeWedding.isPublic ? '✓ Published' : 'Draft'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif text-on-surface mb-2">{activeWedding.title}</h2>
                  <p className="text-on-surface-variant mb-6">
                    {activeWedding.date
                      ? new Date(activeWedding.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Date to be announced'}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <p className="text-2xl font-serif font-bold text-primary">
                        {activeWedding.guestCount || 0}
                      </p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest">
                        Guests
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-serif font-bold text-primary">0</p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest">
                        RSVPs
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-serif font-bold text-primary">0%</p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest">
                        Responded
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <Link href={`/dashboard/weddings/${activeWedding._id}`}>
                    <Button variant="gold" size="md" className="text-sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/weddings/${activeWedding._id}`}>
                    <Button variant="outline" size="md" className="text-sm">
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="md" className="text-sm">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-16">
          <div className="card-base p-12 text-center">
            <p className="text-4xl mb-4">💍</p>
            <h2 className="text-2xl font-serif text-on-surface mb-2">No Weddings Yet</h2>
            <p className="text-on-surface-variant mb-6">Create your first wedding story to get started</p>
            <Link href="/dashboard/weddings/new">
              <Button variant="gold" size="lg">
                Create Your First Wedding
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* SECTION 2: Quick Stats */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
              Total Weddings
            </p>
            <p className="text-4xl font-serif font-bold text-primary">{totalWeddings}</p>
          </div>
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
              Total Guests
            </p>
            <p className="text-4xl font-serif font-bold text-on-surface">{totalGuests}</p>
          </div>
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
              Published Sites
            </p>
            <p className="text-4xl font-serif font-bold text-secondary">{publishedWeddings}</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Wedding Grid */}
      {weddings.length > 1 && (
        <section className="mb-16">
          <h2 className="text-2xl font-serif text-on-surface mb-8">All Your Weddings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.slice(1).map((wedding) => (
              <div key={wedding._id} className="card-base overflow-hidden hover:shadow-lg transition-all">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden relative">
                  {wedding.coverImage ? (
                    <img
                      src={wedding.coverImage}
                      alt={wedding.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">💍</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-serif text-on-surface mb-1">{wedding.title}</h3>
                      <p className="text-xs text-on-surface-variant">
                        {wedding.date
                          ? new Date(wedding.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'TBA'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest flex-shrink-0 ${
                        wedding.isPublic
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {wedding.isPublic ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-4">
                    {wedding.guestCount || 0} guests
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/weddings/${wedding._id}`} className="flex-1">
                      <Button variant="gold" size="sm" className="w-full text-xs">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/weddings/${wedding._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: Recent Activity */}
      <section>
        <h2 className="text-2xl font-serif text-on-surface mb-8">Recent Activity</h2>
        <div className="card-base p-8">
          <p className="text-center text-on-surface-variant">No recent activity yet</p>
        </div>
      </section>
    </div>
  );
}
