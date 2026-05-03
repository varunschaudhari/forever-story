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

      {/* Main Content with dynamic margin based on sidebar width */}
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: 'var(--sidebar-width, 80px)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
