import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'My Stories - Partner Dashboard - ForeverStory',
};

const STORY_TYPES = [
  { value: 'all', label: 'All Stories' },
  { value: 'wedding', label: '💍 Weddings' },
  { value: 'engagement', label: '💎 Engagements' },
  { value: 'bridal_shower', label: '🎉 Bridal Showers' },
];

export default async function PartnerStoriesPage({ searchParams }: { searchParams: { type?: string } }) {
  const session = await auth();
  await dbConnect();

  const filterType = searchParams.type || 'all';
  const query: any = { createdBy: session?.user?.id };

  if (filterType !== 'all') {
    query.storyType = filterType;
  }

  const stories = (await Wedding.find(query).sort({ createdAt: -1 }).lean()) as any[];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">My Stories</h1>
        <p className="text-lg text-secondary font-semibold">{stories.length} {filterType === 'all' ? 'total' : filterType.replace('_', ' ')} stories</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        {STORY_TYPES.map((type) => (
          <Link
            key={type.value}
            href={type.value === 'all' ? '/partner/stories' : `/partner/stories?type=${type.value}`}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filterType === type.value
                ? 'bg-secondary text-white'
                : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container/80'
            }`}
          >
            {type.label}
          </Link>
        ))}
      </div>

      {stories.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-serif text-on-surface mb-2">No Stories Yet</h2>
          <p className="text-on-surface-variant mb-8">Create your first wedding story to get started</p>
          <Link href="/dashboard/weddings/new">
            <Button variant="gold" size="lg">
              Create Your First Story
            </Button>
          </Link>
        </div>
      ) : (
        /* Stories List */
        <div className="space-y-4">
          {stories.map((story) => (
            <div
              key={story._id.toString()}
              className="card-base p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <div className="md:w-48 flex-shrink-0">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-32 md:h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 md:h-48 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">💍</span>
                  </div>
                )}
              </div>

              {/* Story Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-2xl font-serif text-on-surface mb-1">{story.title}</h3>
                    <p className="text-sm text-on-surface-variant">
                      {story.groomName} & {story.brideName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {story.isPublic ? (
                      <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 md:gap-6 mb-6 text-sm text-on-surface-variant">
                  <div>
                    <span className="font-semibold text-on-surface">📅 </span>
                    {formatDate(story.date)}
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">📍 </span>
                    {story.venue.city}, {story.venue.state}
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">👥 </span>
                    {story.guestCount} guests
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link href={`/dashboard/weddings/${story._id}/edit`}>
                    <Button variant="gold" size="sm">
                      Edit
                    </Button>
                  </Link>
                  {story.isPublic && (
                    <Link href={`/weddings/${story.slug}`}>
                      <Button variant="outline" size="sm">
                        View Website
                      </Button>
                    </Link>
                  )}
                  <button className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
