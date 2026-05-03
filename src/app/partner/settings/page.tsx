import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Settings - Partner Dashboard - ForeverStory',
};

export default async function PartnerSettingsPage() {
  const session = await auth();

  await dbConnect();
  const partner = (await User.findById(session?.user?.id).lean()) as any;

  return (
    <div className="p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-2">Settings</h1>
        <p className="text-lg text-secondary font-semibold">Manage your partner account</p>
      </div>

      {/* Profile Information */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Profile Information</h2>
        <div className="card-base p-8 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
            <p className="text-lg font-semibold text-on-surface">{partner?.name || 'Not set'}</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
            <p className="text-lg text-on-surface">{partner?.email || 'Not set'}</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Partner Since</label>
            <p className="text-lg text-on-surface">
              {partner?.createdAt
                ? new Date(partner.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Not set'}
            </p>
          </div>

          <Button variant="gold" size="lg">
            Edit Profile
          </Button>
        </div>
      </section>

      {/* Commission Settings */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Commission Settings</h2>
        <div className="card-base p-8 space-y-6">
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
            <h3 className="font-semibold text-on-surface mb-2">Direct Commission Rate</h3>
            <p className="text-lg font-serif font-bold text-secondary">15%</p>
            <p className="text-xs text-on-surface-variant mt-2">Earned on each wedding you create for customers</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-on-surface mb-2">Referral Commission Rate</h3>
            <p className="text-lg font-serif font-bold text-purple-600">10%</p>
            <p className="text-xs text-on-surface-variant mt-2">Earned when referred customers create weddings</p>
          </div>

          <p className="text-sm text-on-surface-variant">Commission rates are automatically calculated and credited to your account after each transaction is completed.</p>
        </div>
      </section>

      {/* Payment Information */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Payment Information</h2>
        <div className="card-base p-8 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Bank Account</label>
            <p className="text-on-surface-variant">Not configured</p>
          </div>

          <Button variant="outline" size="lg">
            Add Bank Account
          </Button>

          <p className="text-sm text-on-surface-variant">Your earnings will be transferred to your bank account automatically.</p>
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Preferences</h2>
        <div className="card-base p-8 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-outline-variant">
            <div>
              <h3 className="font-semibold text-on-surface">Email Notifications</h3>
              <p className="text-xs text-on-surface-variant">Receive updates about earnings and new customers</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-outline-variant">
            <div>
              <h3 className="font-semibold text-on-surface">Commission Reminders</h3>
              <p className="text-xs text-on-surface-variant">Weekly summary of commission earnings</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-on-surface">Marketing Communications</h3>
              <p className="text-xs text-on-surface-variant">Tips to grow your partner business</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-2xl font-serif text-red-600 mb-6">Danger Zone</h2>
        <div className="card-base p-8 bg-red-50 border border-red-200">
          <h3 className="font-semibold text-on-surface mb-2">Delete Account</h3>
          <p className="text-on-surface-variant mb-6 text-sm">
            Permanently delete your partner account and all associated data. This action cannot be undone.
          </p>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
