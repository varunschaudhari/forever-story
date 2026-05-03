import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Commission } from '@/models/Commission';
import { Wedding } from '@/models/Wedding';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Partner Dashboard - ForeverStory',
};

export default async function PartnerDashboardPage() {
  const session = await auth();
  await dbConnect();

  // Fetch data
  const referredCustomers = (await User.find({ referredBy: session?.user?.id }).lean()) as any[];
  const createdWeddings = (await Wedding.find({ createdBy: session?.user?.id }).lean()) as any[];
  const commissions = (await Commission.find({ partner: session?.user?.id }).lean()) as any[];

  // Calculate earnings
  const totalEarned = commissions.reduce((sum, c) => sum + c.totalAmount, 0);
  const directCommissions = commissions.filter((c) => c.type === 'direct');
  const referralCommissions = commissions.filter((c) => c.type === 'referral');
  const directEarned = directCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
  const referralEarned = referralCommissions.reduce((sum, c) => sum + c.totalAmount, 0);

  // This month earnings
  const now = new Date();
  const thisMonthCommissions = commissions.filter((c) => {
    const d = new Date(c.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthEarnings = thisMonthCommissions.reduce((sum, c) => sum + c.totalAmount, 0);

  // Calculate averages
  const avgEarningPerCustomer = referredCustomers.length > 0 ? totalEarned / referredCustomers.length : 0;
  const avgEarningPerWedding = createdWeddings.length > 0 ? totalEarned / createdWeddings.length : 0;

  return (
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">Partner Dashboard</h1>
          <p className="text-lg text-secondary font-semibold">
            ₹{thisMonthEarnings.toFixed(0)} this month • ₹{totalEarned.toFixed(0)} all time
          </p>
        </div>
        <Button variant="gold" size="lg" className="text-sm lg:text-base">
          📤 Share Partner Link
        </Button>
      </div>

      {/* Primary Stats (Earnings Focus) */}
      <section className="mb-12">
        <div className="grid md:grid-cols-4 gap-4 md:gap-6">
          {/* Total Earned */}
          <div className="card-base p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-transparent">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Total Earned</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-2">
              ₹{totalEarned.toFixed(0)}
            </p>
            <p className="text-xs text-on-surface-variant">{commissions.length} commissions</p>
          </div>

          {/* This Month */}
          <div className="card-base p-6 md:p-8 bg-gradient-to-br from-blue-500/5 to-transparent">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">This Month</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-blue-600 mb-2">
              ₹{thisMonthEarnings.toFixed(0)}
            </p>
            <p className="text-xs text-on-surface-variant">{thisMonthCommissions.length} commissions</p>
          </div>

          {/* Direct Earnings */}
          <div className="card-base p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Direct</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-green-600 mb-2">
              ₹{directEarned.toFixed(0)}
            </p>
            <p className="text-xs text-on-surface-variant">{directCommissions.length} from weddings</p>
          </div>

          {/* Referral Earnings */}
          <div className="card-base p-6 md:p-8 bg-gradient-to-br from-purple-500/5 to-transparent">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Referral</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-purple-600 mb-2">
              ₹{referralEarned.toFixed(0)}
            </p>
            <p className="text-xs text-on-surface-variant">{referralCommissions.length} from referrals</p>
          </div>
        </div>
      </section>

      {/* Secondary Stats */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Customers */}
          <div className="card-base p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Active Customers</p>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-serif font-bold text-primary mb-2">{referredCustomers.length}</p>
            <p className="text-xs text-on-surface-variant">Avg: ₹{avgEarningPerCustomer.toFixed(0)}/customer</p>
          </div>

          {/* Stories Created */}
          <div className="card-base p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Stories Created</p>
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-3xl font-serif font-bold text-orange-600 mb-2">{createdWeddings.length}</p>
            <p className="text-xs text-on-surface-variant">Avg: ₹{avgEarningPerWedding.toFixed(0)}/story</p>
          </div>

          {/* Conversion Rate */}
          <div className="card-base p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Conversion</p>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-serif font-bold text-teal-600 mb-2">
              {referredCustomers.length > 0
                ? ((createdWeddings.length / referredCustomers.length) * 100).toFixed(0)
                : 0}
              %
            </p>
            <p className="text-xs text-on-surface-variant">
              {createdWeddings.length} of {referredCustomers.length} created
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Quick Access</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/partner/stories" className="card-base p-6 hover:shadow-lg transition-all group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📖</div>
            <h3 className="font-serif text-on-surface mb-2">View Stories</h3>
            <p className="text-xs text-on-surface-variant">See all weddings you created</p>
          </Link>

          <Link href="/partner/customers" className="card-base p-6 hover:shadow-lg transition-all group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-serif text-on-surface mb-2">Manage Customers</h3>
            <p className="text-xs text-on-surface-variant">View customer details</p>
          </Link>

          <button className="card-base p-6 hover:shadow-lg transition-all group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💰</div>
            <h3 className="font-serif text-on-surface mb-2">Earnings Details</h3>
            <p className="text-xs text-on-surface-variant">Breakdown by commission type</p>
          </button>
        </div>
      </section>

      {/* Earnings Breakdown */}
      <section>
        <h2 className="text-2xl font-serif text-on-surface mb-6">Earnings Breakdown</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-base p-8">
            <h3 className="text-lg font-serif text-on-surface mb-6">Commission Type</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-on-surface-variant">Direct Commissions</span>
                  <span className="font-semibold text-green-600">
                    {((directEarned / (totalEarned || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(directEarned / (totalEarned || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-on-surface-variant">Referral Commissions</span>
                  <span className="font-semibold text-purple-600">
                    {((referralEarned / (totalEarned || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(referralEarned / (totalEarned || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-base p-8">
            <h3 className="text-lg font-serif text-on-surface mb-6">Monthly Trend</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">This Month</span>
                <span className="font-semibold text-secondary">₹{thisMonthEarnings.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Last Month (est.)</span>
                <span className="font-semibold text-on-surface">₹{(totalEarned / 3).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Average/Month</span>
                <span className="font-semibold text-on-surface">₹{(totalEarned / 3).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
