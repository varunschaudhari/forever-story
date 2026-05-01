import { getSession } from '@/lib/auth';

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {[
              { label: 'Account', href: '#account' },
              { label: 'Privacy', href: '#privacy' },
              { label: 'Notifications', href: '#notifications' },
              { label: 'Billing', href: '#billing' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Settings */}
          <div id="account" className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={session.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={session.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div id="privacy" className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-gray-700">Make my profile public</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-gray-700">Allow others to share my stories</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 text-red-700">Danger Zone</h2>
            <button className="btn bg-red-600 text-white hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
