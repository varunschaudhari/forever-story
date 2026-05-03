import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export const metadata = {
  title: 'Dashboard - ForeverStory',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar (fixed width) */}
      <div className="w-16 md:w-64">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
