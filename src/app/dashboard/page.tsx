import { auth } from '@/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600">Manage your weddings and track RSVPs all in one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Weddings', value: '0', icon: '💍' },
          { label: 'Total Guests', value: '0', icon: '👥' },
          { label: 'RSVPs Received', value: '0', icon: '✉️' },
          { label: 'Response Rate', value: '0%', icon: '📊' },
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
          <Link href="/dashboard/weddings/new" className="btn btn-primary">
            + Create Wedding
          </Link>
          <Link href="/dashboard/weddings" className="btn btn-secondary">
            View All Weddings
          </Link>
          <Link href="/dashboard/settings" className="btn btn-secondary">
            Settings
          </Link>
        </div>
      </div>

      {/* Recent Weddings */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Weddings</h2>
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No weddings yet</p>
          <Link href="/dashboard/weddings/new" className="btn btn-primary">
            Create Your First Wedding
          </Link>
        </div>
      </div>
    </div>
  );
}
