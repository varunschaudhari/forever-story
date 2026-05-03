import Link from 'next/link';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Commission } from '@/models/Commission';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Partner Dashboard - ForeverStory',
};

export default async function PartnerDashboardPage() {
  const session = await auth();
  await dbConnect();

  const referredCustomers = (await User.find({ referredBy: session?.user?.id }).lean()) as any[];
  const commissions = (await Commission.find({ partner: session?.user?.id }).lean()) as any[];

  const totalEarned = commissions.reduce((sum, c) => sum + c.totalAmount, 0);
  const thisMonthEarnings = commissions.filter(c => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, c) => sum + c.totalAmount, 0);

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">Partner Dashboard</h1>
          <p className="text-lg text-secondary font-semibold">₹{thisMonthEarnings.toFixed(0)} earned this month</p>
        </div>
        <Button variant="gold" size="lg">Share Partner Link</Button>
      </div>

      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Total Earned</p>
            <p className="text-4xl font-serif font-bold text-secondary">₹{totalEarned.toFixed(0)}</p>
          </div>
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">This Month</p>
            <p className="text-4xl font-serif font-bold text-on-surface">₹{thisMonthEarnings.toFixed(0)}</p>
          </div>
          <div className="card-base p-8">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Active Customers</p>
            <p className="text-4xl font-serif font-bold text-primary">{referredCustomers.length}</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Your Customers</h2>
        <div className="card-base p-12 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="text-xl font-serif text-on-surface mb-2">Dashboard Coming Soon</h3>
          <p className="text-on-surface-variant">Partner dashboard with customers, earnings, and payouts</p>
        </div>
      </section>
    </div>
  );
}
