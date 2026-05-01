import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {session.name}!</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening in your ForeverStory account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Stories', value: '0', icon: '📖' },
          { label: 'Total Views', value: '0', icon: '👁️' },
          { label: 'Shared With', value: '0', icon: '👥' },
          { label: 'Storage Used', value: '0 MB', icon: '💾' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="#"
            className="btn btn-primary"
          >
            + New Story
          </Link>
          <Link
            href="/dashboard/stories"
            className="btn btn-secondary"
          >
            View All Stories
          </Link>
          <Link
            href="/dashboard/settings"
            className="btn btn-secondary"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Recent Stories */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Stories</h2>
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No stories yet</p>
          <Link href="#" className="btn btn-primary">
            Create Your First Story
          </Link>
        </div>
      </div>
    </div>
  );
}
