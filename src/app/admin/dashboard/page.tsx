import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import { Commission } from '@/models/Commission';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Admin Dashboard - ForeverStory',
};

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const admin = await User.findById(session.user.id);

  if (!admin || admin.role !== 'admin') {
    redirect('/');
  }

  // Get stats
  const totalUsers = await User.countDocuments();
  const totalPartners = await User.countDocuments({ role: 'partner' });
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalWeddings = await Wedding.countDocuments();

  const allCommissions = await Commission.find();
  const pendingCommissions = allCommissions.filter((c) => c.status === 'pending');
  const paidCommissions = allCommissions.filter((c) => c.status === 'paid');

  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
  const totalPaid = paidCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
  const totalCommissions = allCommissions.length;

  // Recent partners
  const recentPartners = (await User.find({ role: 'partner' })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()) as any[];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            ForeverStory
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant">Admin Panel</span>
            <Link href="/auth/signout">
              <Button variant="outline" size="md">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="heading-2 mb-2 text-on-surface">Admin Dashboard</h1>
          <p className="text-lg text-on-surface-variant">Manage partners, customers, and commissions</p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Users</p>
            <p className="heading-3 text-primary">{totalUsers}</p>
            <p className="text-xs text-on-surface-variant mt-3">{totalPartners} partners, {totalCustomers} customers</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Weddings</p>
            <p className="heading-3 text-on-surface">{totalWeddings}</p>
            <p className="text-xs text-on-surface-variant mt-3">All created weddings</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Pending Payouts</p>
            <p className="heading-3 text-yellow-600">${totalPending.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{pendingCommissions.length} commissions</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Paid Out</p>
            <p className="heading-3 text-green-600">${totalPaid.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{paidCommissions.length} commissions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <Link href="/admin/users" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">Manage Users</h3>
              <p className="text-sm text-on-surface-variant">{totalUsers} total users</p>
            </div>
          </Link>

          <Link href="/admin/stories" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">Manage Stories</h3>
              <p className="text-sm text-on-surface-variant">{totalWeddings} total stories</p>
            </div>
          </Link>

          <Link href="/admin/partners" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">Manage Partners</h3>
              <p className="text-sm text-on-surface-variant">{totalPartners} active partners</p>
            </div>
          </Link>

          <Link href="/admin/commissions" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">Manage Commissions</h3>
              <p className="text-sm text-on-surface-variant">{totalCommissions} total commissions</p>
            </div>
          </Link>

          <div className="card-base p-8 bg-blue-50 border-l-4 border-blue-500">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="heading-5 mb-2 text-on-surface">System Stats</h3>
            <p className="text-sm text-on-surface-variant">Revenue: ${(totalPending + totalPaid).toFixed(2)}</p>
          </div>
        </div>

        {/* Recent Partners */}
        <div className="card-base overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex justify-between items-center">
            <h2 className="heading-5 text-on-surface">Recent Partners</h2>
            <Link href="/admin/partners">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Total Earned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {recentPartners.map((partner) => (
                  <tr key={partner._id.toString()} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{partner.name}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{partner.email}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {new Date(partner.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      ${(partner.totalEarnings || 0).toFixed(2)}
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
