import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Settings - ForeverStory',
};

export default async function SettingsPage() {
  const session = await auth();
  await dbConnect();

  const user = await User.findById(session?.user?.id).lean();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-2xl">
      <h1 className="text-4xl font-serif text-on-surface mb-8">Account Settings</h1>

      {/* Profile Section */}
      <div className="card-base p-8 mb-8">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Profile Information</h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              Account Type
            </label>
            <div className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface capitalize">
              {user?.role || 'customer'}
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              Member Since
            </label>
            <div className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </div>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant mt-6">
          To update your profile information, please contact our support team.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="card-base p-8 mb-8">
        <h2 className="text-2xl font-serif text-on-surface mb-6">Preferences</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-outline-variant" defaultChecked />
            <span className="text-sm text-on-surface">Email me about wedding tips and inspiration</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-outline-variant" defaultChecked />
            <span className="text-sm text-on-surface">Send me RSVP reminders</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-outline-variant" />
            <span className="text-sm text-on-surface">Share my profile with other users</span>
          </label>
        </div>

        <div className="flex gap-4 mt-8">
          <Button variant="gold" size="md">
            Save Preferences
          </Button>
          <Button variant="outline" size="md">
            Cancel
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-base p-8 border-2 border-red-200 bg-red-50">
        <h2 className="text-2xl font-serif text-red-900 mb-6">Danger Zone</h2>
        <p className="text-sm text-red-800 mb-6">
          Deleting your account is permanent and will remove all your weddings and data.
        </p>
        <Button variant="outline" size="md" className="text-red-600 border-red-200 hover:bg-red-100">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
