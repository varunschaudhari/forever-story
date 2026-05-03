import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Commission } from '@/models/Commission';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Partners - ForeverStory Admin',
};

export default async function AdminPartnersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const admin = await User.findById(session.user.id);

  if (!admin || admin.role !== 'admin') {
    redirect('/');
  }

  // Get all partners
  const partners = (await User.find({ role: 'partner' })
    .sort({ totalEarnings: -1 })
    .lean()) as any[];

  // Get stats for each partner
  const partnerStats = await Promise.all(
    partners.map(async (partner) => {
      const commissions = await Commission.find({ partner: partner._id });
      const pending = commissions.filter((c) => c.status === 'pending');
      const paid = commissions.filter((c) => c.status === 'paid');

      return {
        ...partner,
        totalCommissions: commissions.length,
        pendingAmount: pending.reduce((sum, c) => sum + c.totalAmount, 0),
        paidAmount: paid.reduce((sum, c) => sum + c.totalAmount, 0),
      };
    })
  );

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
        <h1 className="heading-2 mb-4 text-on-surface">Manage Partners</h1>
        <p className="text-lg text-on-surface-variant mb-12">View all partners and their earnings</p>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Partners</p>
            <p className="heading-3 text-primary">{partnerStats.length}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Paid Out</p>
            <p className="heading-3 text-green-600">
              ${partnerStats.reduce((sum, p) => sum + p.paidAmount, 0).toFixed(2)}
            </p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Pending Payouts</p>
            <p className="heading-3 text-yellow-600">
              ${partnerStats.reduce((sum, p) => sum + p.pendingAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Partners Table */}
        <div className="card-base overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
            <h2 className="heading-5 text-on-surface">All Partners</h2>
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
                    Total Commissions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Pending
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Paid Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Lifetime Earned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {partnerStats.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                      No partners yet
                    </td>
                  </tr>
                ) : (
                  partnerStats.map((partner) => (
                    <tr key={partner._id.toString()} className="hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm font-medium text-on-surface">{partner.name}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{partner.email}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {new Date(partner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {partner.totalCommissions}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-yellow-600">
                        ${partner.pendingAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ${partner.paidAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        ${(partner.totalEarnings || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
