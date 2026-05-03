import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { Commission } from '@/models/Commission';
import { User } from '@/models/User';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Commissions - ForeverStory Admin',
};

export default async function AdminCommissionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const admin = await User.findById(session.user.id);

  if (!admin || admin.role !== 'admin') {
    redirect('/');
  }

  // Get all commissions
  const commissions = (await Commission.find()
    .populate('partner', 'name email')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 })
    .lean()) as any[];

  const byStatus = {
    pending: commissions.filter((c) => c.status === 'pending'),
    paid: commissions.filter((c) => c.status === 'paid'),
    cancelled: commissions.filter((c) => c.status === 'cancelled'),
  };

  const totals = {
    pending: byStatus.pending.reduce((sum, c) => sum + c.totalAmount, 0),
    paid: byStatus.paid.reduce((sum, c) => sum + c.totalAmount, 0),
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
        <h1 className="heading-2 mb-4 text-on-surface">Manage Commissions</h1>
        <p className="text-lg text-on-surface-variant mb-12">View and manage all partner commissions</p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Commissions</p>
            <p className="heading-3 text-primary">{commissions.length}</p>
          </div>

          <div className="card-base p-8 border-l-4 border-yellow-500">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Pending Payout</p>
            <p className="heading-3 text-yellow-600">${totals.pending.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{byStatus.pending.length} commissions</p>
          </div>

          <div className="card-base p-8 border-l-4 border-green-500">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Paid</p>
            <p className="heading-3 text-green-600">${totals.paid.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{byStatus.paid.length} commissions</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Cancelled</p>
            <p className="heading-3 text-red-600">{byStatus.cancelled.length}</p>
          </div>
        </div>

        {/* Pending Commissions Section */}
        <div className="mb-12">
          <h2 className="heading-4 mb-6 text-on-surface">Pending Payouts ({byStatus.pending.length})</h2>
          {byStatus.pending.length === 0 ? (
            <div className="card-base p-12 text-center text-on-surface-variant">
              No pending commissions
            </div>
          ) : (
            <div className="card-base overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-yellow-50 border-b border-yellow-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-yellow-900">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-yellow-900">
                        Partner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-yellow-900">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-yellow-900">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-yellow-900">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {byStatus.pending.map((commission) => (
                      <tr key={commission._id.toString()} className="hover:bg-stone-50">
                        <td className="px-6 py-4 text-sm text-on-surface">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-on-surface">
                          {(commission.partner as any)?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {(commission.customer as any)?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm capitalize">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {commission.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-yellow-600">
                          ${commission.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* All Commissions Section */}
        <div>
          <h2 className="heading-4 mb-6 text-on-surface">All Commissions ({commissions.length})</h2>
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      Partner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {commissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                        No commissions yet
                      </td>
                    </tr>
                  ) : (
                    commissions.map((commission) => (
                      <tr key={commission._id.toString()} className="hover:bg-stone-50">
                        <td className="px-6 py-4 text-sm text-on-surface">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-on-surface">
                          {(commission.partner as any)?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {(commission.customer as any)?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm capitalize">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {commission.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-primary">
                          ${commission.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              commission.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : commission.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {commission.status === 'paid'
                              ? 'Paid'
                              : commission.status === 'pending'
                              ? 'Pending'
                              : 'Cancelled'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="heading-5 mb-4 text-blue-900">Commission Management</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Commissions are generated when partners create or refer weddings</li>
            <li>• Direct commissions: $5 fixed + 15% of wedding price</li>
            <li>• Referral commissions: $5 fixed + 15% for each referred customer's wedding</li>
            <li>• Mark commissions as paid via API (payment system integration coming)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
