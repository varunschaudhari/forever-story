import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import WeddingBuilder from '@/components/WeddingBuilder';

interface EditWeddingPageProps {
  params: {
    id: string;
  };
}

export default async function EditWeddingPage({ params }: EditWeddingPageProps) {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin');
  }

  await dbConnect();
  const wedding = (await Wedding.findById(params.id).lean()) as any;

  if (!wedding) {
    notFound();
  }

  const isOrganizer = wedding.organizers.some(
    (org: any) => org.toString() === session.user!.id
  );

  if (!isOrganizer) {
    notFound();
  }

  return <WeddingBuilder weddingId={params.id} initialData={JSON.parse(JSON.stringify(wedding))} />;
}
