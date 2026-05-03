import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Manage Users - ForeverStory Admin',
};

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const admin = await User.findById(session.user.id);

  if (!admin || admin.role !== 'admin') {
    redirect('/');
  }

  const users = (await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .lean()) as any[];

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === 'customer').length,
    partners: users.filter((u) => u.role === 'partner').length,
    admins: users.filter((u) => u.role === 'admin').length,
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
        <h1 className="heading-2 mb-4 text-on-surface">Manage Users</h1>
        <p className="text-lg text-on-surface-variant mb-12">View and manage all users in the system</p>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Total Users</p>
            <p className="heading-3 text-primary">{stats.total}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Customers</p>
            <p className="heading-3 text-blue-600">{stats.customers}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Partners</p>
            <p className="heading-3 text-green-600">{stats.partners}</p>
          </div>

          <div className="card-base p-8">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Admins</p>
            <p className="heading-3 text-purple-600">{stats.admins}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="card-base overflow-hidden">
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
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {users.map((user) => (
                  <tr key={user._id.toString()} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'partner'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : user.role === 'partner' ? 'Partner' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/admin/users/${user._id.toString()}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
