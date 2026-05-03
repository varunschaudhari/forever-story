import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import Link from 'next/link';
import StoryEditForm from './StoryEditForm';

export const metadata = {
  title: 'Edit Story - ForeverStory Admin',
};

export default async function StoryDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const admin = await User.findById(session.user.id);

  if (!admin || admin.role !== 'admin') {
    redirect('/');
  }

  const story = (await Wedding.findById(params.id).lean()) as any;

  if (!story) {
    redirect('/admin/stories');
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            ForeverStory
          </Link>
          <Link href="/admin/stories" className="text-sm text-on-surface-variant hover:text-on-surface">
            Back to Stories
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <h1 className="heading-2 mb-12 text-on-surface">Edit Story</h1>
        <StoryEditForm story={JSON.parse(JSON.stringify(story))} />
      </main>
    </div>
  );
}
