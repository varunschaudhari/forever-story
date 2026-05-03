import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Commission } from '@/models/Commission';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Partner Dashboard - ForeverStory',
  description: 'Track your earnings and manage your wedding creations',
};

export default async function PartnerDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const partner = await User.findById(session.user.id);

  if (!partner || partner.role !== 'partner') {
    redirect('/weddings/new');
  }

  // Get stats
  const pendingCommissions = await Commission.find({
    partner: session.user.id,
    status: 'pending',
  });

  const paidCommissions = await Commission.find({
    partner: session.user.id,
    status: 'paid',
  });

  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
  const totalPaid = paidCommissions.reduce((sum, c) => sum + c.totalAmount, 0);

  const referredCustomers = await User.countDocuments({
    referredBy: session.user.id,
  });

  const totalCommissions = await Commission.countDocuments({
    partner: session.user.id,
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            ForeverStory
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant">
              {partner.name}
            </span>
            <Link href="/auth/signout">
              <Button variant="outline" size="md">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="heading-2 mb-2 text-on-surface">Welcome, {partner.name}! 💰</h1>
          <p className="text-lg text-on-surface-variant">Track your earnings and manage your partnerships</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Earnings</p>
            <p className="heading-3 text-primary">${(partner.totalEarnings || 0).toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">Lifetime commissions</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Pending</p>
            <p className="heading-3 text-secondary">${totalPending.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{pendingCommissions.length} commissions</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Paid Out</p>
            <p className="heading-3 text-green-600">${totalPaid.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{paidCommissions.length} commissions</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Referrals</p>
            <p className="heading-3 text-on-surface">{referredCustomers}</p>
            <p className="text-xs text-on-surface-variant mt-3">customers referred</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/partner/earnings" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">View Earnings</h3>
              <p className="text-sm text-on-surface-variant">Track all your commissions and payouts</p>
            </div>
          </Link>

          <Link href="/partner/customers" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">My Customers</h3>
              <p className="text-sm text-on-surface-variant">View your referred customers and their weddings</p>
            </div>
          </Link>

          <Link href="/weddings/new" className="group">
            <div className="card-base p-8 hover:shadow-lg transition-shadow h-full">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="heading-5 mb-2 group-hover:text-primary transition-colors">Create Wedding</h3>
              <p className="text-sm text-on-surface-variant">Create a new wedding for yourself or a customer</p>
            </div>
          </Link>
        </div>

        {/* Recent Commissions */}
        {pendingCommissions.length > 0 && (
          <div className="mt-12">
            <h2 className="heading-5 mb-6 text-on-surface">Recent Pending Commissions</h2>
            <div className="card-base overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {pendingCommissions.slice(0, 5).map((commission) => (
                      <tr key={commission._id.toString()} className="hover:bg-stone-50">
                        <td className="px-6 py-4 text-sm text-on-surface">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface capitalize">
                          {commission.type}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-primary">
                          ${commission.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Pending
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
