import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import PartnerSidebar from '@/components/PartnerSidebar';

export const metadata = {
  title: 'Partner Dashboard - ForeverStory',
};

export default async function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?role=partner');
  }

  await dbConnect();
  const user = await User.findById(session.user?.id);

  if (!user || user.role !== 'partner') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar (fixed width) */}
      <div className="w-16 md:w-64">
        <PartnerSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
