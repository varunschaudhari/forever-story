import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import PartnerSidebar from '@/components/PartnerSidebar';

export const metadata = {
  title: 'Partner Dashboard - ForeverStory',
};

export default async function PartnerLayout({
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
    <div className="min-h-screen bg-surface">
      <PartnerSidebar />

      {/* Main Content with margin to account for fixed sidebar - always reserve space for collapsed width */}
      <main className="ml-20 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
