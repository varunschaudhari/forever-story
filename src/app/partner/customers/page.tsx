import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import { Commission } from '@/models/Commission';

export const metadata = {
  title: 'My Customers - Partner Dashboard - ForeverStory',
};

export default async function CustomersPage() {
  const session = await auth();

  await dbConnect();

  // Get referred customers
  const referredCustomers = (await User.find({ referredBy: session.user?.id }).lean()) as any[];

  // Get customers for weddings created by partner
  const weddingsCreated = (await Wedding.find({ createdBy: session.user?.id }).lean()) as any[];
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
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">My Customers</h1>
        <p className="text-lg text-secondary font-semibold">{uniqueCustomers.length} total customers</p>
      </div>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Total Customers</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">{uniqueCustomers.length}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Total Weddings</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-orange-600 mb-2">
              {customerStats.reduce((sum, c) => sum + c.weddingCount, 0)}
            </p>
          </div>

          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Total Earned</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-green-600 mb-2">
              ₹{customerStats.reduce((sum, c) => sum + c.totalEarned, 0).toFixed(0)}
            </p>
          </div>
        </div>
      </section>

      {/* Customers Table */}
      <section>
        <h2 className="text-2xl font-serif text-on-surface mb-6">Customer List</h2>
        {customerStats.length === 0 ? (
          <div className="card-base p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-on-surface-variant mb-4">No customers yet. Share your partner link or create weddings for customers to earn commissions!</p>
          </div>
        ) : (
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-highest">
                  <tr className="border-b border-outline-variant">
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
                <tbody className="divide-y divide-outline-variant">
                  {customerStats.map((customer) => (
                    <tr key={customer._id.toString()} className="hover:bg-surface-container/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {customer.image ? (
                            <img
                              src={customer.image}
                              alt={customer.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-sm font-bold">
                              {customer.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="font-semibold text-on-surface">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{customer.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {customer.weddingCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-on-surface">{customer.commissionCount}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ₹{customer.totalEarned.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Referral Info */}
      <section className="mt-12 card-base p-8 bg-purple-50/50 border border-purple-200/30">
        <h3 className="text-2xl font-serif text-purple-900 mb-4">Share Your Partner Link</h3>
        <p className="text-purple-800 mb-4 text-sm">
          Invite customers to sign up with your referral link and earn commissions on all their future weddings!
        </p>
        <div className="bg-white border border-purple-200/50 rounded-lg p-4 font-mono text-xs text-on-surface break-all overflow-hidden">
          {`${process.env.NEXT_PUBLIC_APP_URL || 'https://foreverstory.com'}/auth/signup?referredBy=${session.user?.id}`}
        </div>
      </section>
    </div>
  );
}
