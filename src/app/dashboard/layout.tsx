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
    <div className="min-h-screen bg-surface">
      <DashboardSidebar />

      {/* Main Content with margin to account for fixed sidebar */}
      <main className="ml-20 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
