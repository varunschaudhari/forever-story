import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-6">
        <Link href="/dashboard" className="text-2xl font-bold mb-8 block">
          ForeverStory
        </Link>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/stories"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            My Stories
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-3">Logged in as</p>
            <p className="font-medium mb-4">{session.name}</p>
            <Link
              href="/api/auth/logout"
              className="w-full block text-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
