import Link from 'next/link';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'My Weddings - ForeverStory',
};

export default async function WeddingsPage() {
  const session = await auth();
  await dbConnect();

  const weddings = (await Wedding.find({ organizers: session?.user?.id })
    .lean()
    .sort({ createdAt: -1 })) as any[];

  return (
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">My Weddings</h1>
          <p className="text-on-surface-variant">Manage all your wedding stories</p>
        </div>
        <Link href="/dashboard/weddings/new">
          <Button variant="gold" size="lg" className="text-sm lg:text-base">
            + New Wedding
          </Button>
        </Link>
      </div>

      {/* Weddings Grid */}
      {weddings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => (
            <div
              key={wedding._id}
              className="card-base overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="h-56 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden relative">
                {wedding.coverImage ? (
                  <img
                    src={wedding.coverImage}
                    alt={wedding.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">💍</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
                      wedding.isPublic
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {wedding.isPublic ? '✓ Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-serif text-on-surface mb-2">{wedding.title}</h3>
                <p className="text-sm text-on-surface-variant mb-2">
                  {wedding.date
                    ? new Date(wedding.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Date TBA'}
                </p>
                <p className="text-xs text-on-surface-variant mb-6">
                  {wedding.guestCount || 0} guests invited
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
      ) : (
        <div className="card-base p-12 text-center">
          <p className="text-5xl mb-4">💍</p>
          <h2 className="text-2xl font-serif text-on-surface mb-2">No Weddings Yet</h2>
          <p className="text-on-surface-variant mb-8">
            Start creating your digital heirloom today
          </p>
          <Link href="/dashboard/weddings/new">
            <Button variant="gold" size="lg">
              Create Your First Wedding
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
