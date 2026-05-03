import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Manage Stories - ForeverStory Admin',
};

export default async function AdminStoriesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const admin = await User.findById(session.user.id);

  if (!admin || admin.role !== 'admin') {
    redirect('/');
  }

  const weddings = (await Wedding.find()
    .populate('organizers', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean()) as any[];

  const stats = {
    total: weddings.length,
    published: weddings.filter((w) => w.isPublic).length,
    draft: weddings.filter((w) => !w.isPublic).length,
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            ForeverStory
          </Link>
          <Link href="/admin/dashboard" className="text-sm text-on-surface-variant hover:text-on-surface">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h1 className="heading-2 mb-4 text-on-surface">Manage Stories</h1>
        <p className="text-lg text-on-surface-variant mb-12">View and manage all wedding stories</p>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Stories</p>
            <p className="heading-3 text-primary">{stats.total}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Published</p>
            <p className="heading-3 text-green-600">{stats.published}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Drafts</p>
            <p className="heading-3 text-yellow-600">{stats.draft}</p>
          </div>
        </div>

        {/* Stories Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Organizer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {weddings.map((wedding) => (
                  <tr key={wedding._id.toString()} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{wedding.title || 'Untitled'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {Array.isArray(wedding.organizers) && wedding.organizers.length > 0
                        ? (wedding.organizers[0] as any)?.name || 'Unknown'
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {wedding.createdBy ? (wedding.createdBy as any)?.name || 'Unknown' : 'Customer'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          wedding.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {wedding.isPublic ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {wedding.date ? new Date(wedding.date).toLocaleDateString() : 'TBD'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/admin/stories/${wedding._id.toString()}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
