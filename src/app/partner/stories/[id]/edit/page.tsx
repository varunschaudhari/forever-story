import { auth } from '@/auth';
import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { notFound } from 'next/navigation';
import WeddingBuilder from '@/components/WeddingBuilder';

export const metadata = {
  title: 'Edit Story - ForeverStory',
};

export default async function EditStoryPage({ params }: { params: { id: string } }) {
  const session = await auth();
  await dbConnect();

  const wedding = await Wedding.findById(params.id).lean();

  if (!wedding) {
    notFound();
  }

  const isOrganizer = (wedding.organizers as any[]).some(
    (id: any) => id.toString() === session?.user?.id
  );
  const isCreator = (wedding.createdBy as any)?.toString() === session?.user?.id;

  if (!isOrganizer && !isCreator) {
    notFound();
  }

  const serialized = {
    ...wedding,
    _id: (wedding._id as any).toString(),
    createdBy: (wedding.createdBy as any)?.toString(),
    organizers: (wedding.organizers as any[]).map((id: any) => id.toString()),
    date: (wedding.date as Date)?.toISOString(),
    events: (wedding.events as any[])?.map((event: any) => ({
      ...event,
      date: (event.date as Date)?.toISOString(),
    })),
  };

  return <WeddingBuilder weddingId={params.id} initialData={serialized} />;
}
