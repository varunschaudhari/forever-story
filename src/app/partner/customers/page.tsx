import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import { Commission } from '@/models/Commission';
import Link from 'next/link';

export const metadata = {
  title: 'My Customers - ForeverStory Partner',
};

export default async function CustomersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const partner = await User.findById(session.user.id);

  if (!partner || partner.role !== 'partner') {
    redirect('/weddings/new');
  }

  // Get referred customers
  const referredCustomers = (await User.find({ referredBy: session.user.id }).lean()) as any[];

  // Get customers for weddings created by partner
  const weddingsCreated = (await Wedding.find({ createdBy: session.user.id }).lean()) as any[];
  const customerIds = [...new Set(weddingsCreated.map((w) => w.organizers[0]?.toString()))].filter(Boolean);
  const directCustomers = (await User.find({ _id: { $in: customerIds } }).lean()) as any[];

  const allCustomers = [...referredCustomers, ...directCustomers];
  const uniqueCustomers = Array.from(
    new Map(allCustomers.map((c) => [c._id.toString(), c])).values()
  );

  // Get wedding count and commission for each customer
  const customerStats = await Promise.all(
    uniqueCustomers.map(async (customer) => {
      const weddingCount = await Wedding.countDocuments({
        organizers: customer._id,
      });

      const customerCommissions = await Commission.find({
        customer: customer._id,
        partner: session.user!.id,
      });

      const totalEarned = customerCommissions.reduce((sum, c) => sum + c.totalAmount, 0);

      return {
        ...customer,
        weddingCount,
        totalEarned,
        commissionCount: customerCommissions.length,
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
          <div className="flex items-center gap-4">
            <Link href="/partner/dashboard" className="text-sm text-on-surface-variant hover:text-on-surface">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h1 className="heading-2 mb-12 text-on-surface">My Customers</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Customers</p>
            <p className="heading-3 text-primary">{uniqueCustomers.length}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Weddings</p>
            <p className="heading-3 text-on-surface">
              {customerStats.reduce((sum, c) => sum + c.weddingCount, 0)}
            </p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Earned</p>
            <p className="heading-3 text-green-600">
              ${customerStats.reduce((sum, c) => sum + c.totalEarned, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Customers Table */}
        <div className="card-base overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
            <h2 className="heading-5 text-on-surface">Customer List</h2>
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
                    Weddings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Commissions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Earned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {customerStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                      No customers yet. Share your partner link or create weddings for customers to earn commissions!
                    </td>
                  </tr>
                ) : (
                  customerStats.map((customer) => (
                    <tr key={customer._id.toString()} className="hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm font-medium text-on-surface">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {customer.weddingCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{customer.commissionCount}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ${customer.totalEarned.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Info */}
        <div className="mt-12 bg-purple-50 border border-purple-200 rounded-lg p-8">
          <h3 className="heading-5 mb-4 text-purple-900">Share Your Partner Link</h3>
          <p className="text-purple-800 mb-4">
            Invite customers to sign up with your referral link and earn commissions on all their future weddings!
          </p>
          <div className="bg-white border border-purple-200 rounded p-4 font-mono text-sm text-on-surface break-all">
            {`${process.env.NEXT_PUBLIC_APP_URL || 'https://foreverstory.com'}/auth/signup?referredBy=${session.user.id}`}
          </div>
        </div>
      </main>
    </div>
  );
}
