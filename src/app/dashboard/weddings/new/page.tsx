import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import WeddingBuilder from '@/components/WeddingBuilder';

export const metadata = {
  title: 'Create Wedding - ForeverStory',
  description: 'Create and customize your wedding page',
};

export default async function NewWeddingPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <WeddingBuilder />;
}
