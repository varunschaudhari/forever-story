import Link from 'next/link';
import { auth } from '@/auth';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

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
            href="/dashboard/weddings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            My Weddings
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
            <p className="font-medium mb-4">{session?.user?.name}</p>
            <p className="text-xs text-gray-400 mb-4">{session?.user?.email}</p>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
