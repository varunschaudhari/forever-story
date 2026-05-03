import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';

export const metadata = {
  title: 'Admin Panel - ForeverStory',
  description: 'Manage users and weddings',
};

export default async function AdminPage() {
  const session = await auth();

  // Basic admin check - in production, verify admin role in database
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();

  let stats = {
    totalUsers: 0,
    totalWeddings: 0,
    publishedWeddings: 0,
    totalGuests: 0,
  };

  let recentWeddings: any[] = [];
  let topUsers: any[] = [];

  try {
    // Get statistics
    const [userCount, weddingCount, publishedCount] = await Promise.all([
      User.countDocuments(),
      Wedding.countDocuments(),
      Wedding.countDocuments({ isPublic: true }),
    ]);

    stats.totalUsers = userCount;
    stats.totalWeddings = weddingCount;
    stats.publishedWeddings = publishedCount;

    // Get recent weddings
    recentWeddings = (await Wedding.find()
      .populate('organizers', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()) as any[];

    // Get top users by wedding count
    topUsers = await User.aggregate([
      {
        $lookup: {
          from: 'weddings',
          localField: '_id',
          foreignField: 'organizers',
          as: 'weddings',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          avatar: 1,
          weddingCount: { $size: '$weddings' },
        },
      },
      { $sort: { weddingCount: -1 } },
      { $limit: 5 },
    ]);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar + Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-stone-50 border-r border-stone-200 h-screen sticky top-0">
          <div className="p-6">
            <Link href="/admin" className="text-xl font-serif italic text-on-surface tracking-tight">
              ForeverStory
            </Link>
            <p className="text-sm text-stone-500 font-serif mt-1">Admin Panel</p>

            <nav className="space-y-2 mt-12">
              {[
                { href: '/admin', label: 'Dashboard', icon: '📊' },
                { href: '/admin/users', label: 'Users', icon: '👥' },
                { href: '/admin/weddings', label: 'Weddings', icon: '💍' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-stone-500 rounded-lg font-serif text-sm tracking-widest uppercase hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 lg:p-20">
          {/* Header */}
          <div className="mb-16 md:mb-20 flex justify-between items-start">
            <div>
              <h1 className="heading-1 mb-2 text-on-surface">Admin Panel</h1>
              <p className="text-lg text-tertiary font-body-lg">Manage users and wedding data</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="md" className="font-label-caps text-xs">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'primary' },
              {
                label: 'Total Weddings',
                value: stats.totalWeddings,
                icon: '💍',
                color: 'secondary',
              },
              {
                label: 'Published Weddings',
                value: stats.publishedWeddings,
                icon: '✨',
                color: 'primary',
              },
              { label: 'Total Guests', value: stats.totalGuests, icon: '🎉', color: 'secondary' },
            ].map((stat, idx) => (
              <div key={idx} className="card-base p-8 text-center">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <p className="text-4xl font-h3 text-primary mb-2">{stat.value}</p>
                <p className="text-xs font-label-caps uppercase text-tertiary">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Weddings */}
          <div className="mb-16">
            <h2 className="heading-3 mb-8 text-on-surface">Recent Weddings</h2>
            <div className="card-base overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-container-low border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      Organizer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentWeddings.map((wedding: any) => (
                    <tr
                      key={wedding._id.toString()}
                      className="border-b border-stone-200 hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/weddings/${wedding.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {wedding.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {wedding.organizers?.[0]?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {formatDate(wedding.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-[10px] font-label-caps tracking-widest uppercase rounded-full ${
                            wedding.isPublic
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-outline-variant text-on-surface-variant'
                          }`}
                        >
                          {wedding.isPublic ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Users */}
          <div>
            <h2 className="heading-3 mb-8 text-on-surface">Top Users</h2>
            <div className="card-base overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-container-low border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-tertiary">
                      Weddings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user: any) => (
                    <tr
                      key={user._id.toString()}
                      className="border-b border-stone-200 hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-on-surface">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-primary-container text-on-primary-container px-3 py-1 text-xs font-semibold rounded-full">
                          {user.weddingCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
