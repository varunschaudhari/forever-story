import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { Button } from '@/components/ui/Button';
import StoryCard from '@/components/StoryCard';
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

  return (
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">My Stories</h1>
          <p className="text-lg text-secondary font-semibold">{stories.length} {filterType === 'all' ? 'total' : filterType.replace('_', ' ')} stories</p>
        </div>
        <Link href="/partner/stories/new">
          <Button variant="gold" size="lg">
            + Create New Story
          </Button>
        </Link>
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
            <StoryCard
              key={story._id.toString()}
              story={{
                _id: story._id.toString(),
                title: story.title,
                groomName: story.groomName,
                brideName: story.brideName,
                slug: story.slug,
                coverImage: story.coverImage,
                date: story.date,
                venue: story.venue,
                guestCount: story.guestCount,
                isPublic: story.isPublic,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
