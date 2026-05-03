import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Commission } from '@/models/Commission';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'My Earnings - ForeverStory Partner',
};

export default async function EarningsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const partner = await User.findById(session.user.id);

  if (!partner || partner.role !== 'partner') {
    redirect('/weddings/new');
  }

  const commissions = await Commission.find({
    partner: session.user.id,
  })
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });

  const byStatus = {
    pending: commissions.filter((c) => c.status === 'pending'),
    paid: commissions.filter((c) => c.status === 'paid'),
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
          <div className="flex items-center gap-4">
            <Link href="/partner/dashboard" className="text-sm text-on-surface-variant hover:text-on-surface">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h1 className="heading-2 mb-12 text-on-surface">Your Earnings</h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card-base p-8 border-l-4 border-yellow-500">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Pending Payout</p>
            <p className="heading-2 text-yellow-600">${totals.pending.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{byStatus.pending.length} commissions</p>
          </div>

          <div className="card-base p-8 border-l-4 border-green-500">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Paid Out</p>
            <p className="heading-2 text-green-600">${totals.paid.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant mt-3">{byStatus.paid.length} commissions</p>
          </div>
        </div>

        {/* All Commissions Table */}
        <div className="card-base overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
            <h2 className="heading-5 text-on-surface">All Commissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Customer
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
                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                      No commissions yet. <Link href="/weddings/new" className="text-primary hover:underline">Create a wedding</Link> to start earning!
                    </td>
                  </tr>
                ) : (
                  commissions.map((commission) => (
                    <tr key={commission._id.toString()} className="hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface capitalize">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {commission.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {(commission.customer as any)?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        ${commission.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            commission.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {commission.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Breakdown Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="heading-5 mb-4 text-blue-900">How Commissions Work</h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="font-semibold min-w-fit">Direct Commission:</span>
              <span>$5 fixed + 15% of wedding price when you create a wedding</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-fit">Referral Commission:</span>
              <span>$5 fixed + 15% of every wedding created by customers you referred</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold min-w-fit">Payment:</span>
              <span>Commissions are paid out monthly. Contact support for payout details.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
