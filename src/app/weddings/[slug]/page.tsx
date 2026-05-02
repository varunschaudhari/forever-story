import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { User } from '@/models/User'; // Import User to register schema for populate
import { notFound } from 'next/navigation';
import WeddingTemplate from '@/components/WeddingTemplate';

export const revalidate = 60; // Revalidate every 60 seconds

interface WeddingPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: WeddingPageProps) {
  try {
    await dbConnect();
    const wedding = await Wedding.findOne({ slug: params.slug }).select(
      'groomName brideName title description'
    );

    if (!wedding) {
      return {
        title: 'Wedding Not Found',
      };
    }

    return {
      title: `${wedding.groomName} & ${wedding.brideName} - ${wedding.title}`,
      description:
        wedding.description || `Join ${wedding.groomName} and ${wedding.brideName} for their wedding`,
      openGraph: {
        title: `${wedding.groomName} & ${wedding.brideName}`,
        description: wedding.description,
      },
    };
  } catch {
    return {
      title: 'Wedding Page',
    };
  }
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  try {
    await dbConnect();

    const wedding = await Wedding.findOne({ slug: params.slug }).populate('organizers', 'name email');

    if (!wedding) {
      notFound();
    }

    return <WeddingTemplate wedding={wedding} />;
  } catch (error) {
    console.error('Error fetching wedding:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    notFound();
  }
}
