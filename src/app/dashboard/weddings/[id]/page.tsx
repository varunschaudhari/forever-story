import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { dbConnect } from '@/lib/mongodb';
import { getWeddingById } from '@/lib/db';
import { Types } from 'mongoose';

export const metadata = {
  title: 'Wedding Details - ForeverStory',
};

export default async function WeddingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  await dbConnect();

  let wedding;
  try {
    wedding = await getWeddingById(new Types.ObjectId(params.id));
  } catch (error) {
    console.error('Failed to fetch wedding:', error);
  }

  if (!wedding) {
    redirect('/dashboard');
  }

  // Check if user is organizer
  const isOrganizer = wedding.organizers.some(
    (organizer: any) => organizer._id.toString() === session.user?.id
  );

  if (!isOrganizer) {
    redirect('/dashboard');
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="p-6 md:p-12 lg:p-20">
      {/* Header */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="heading-1 mb-2 text-on-surface">{wedding.title}</h1>
          <p className="text-lg text-tertiary font-body-lg">
            {wedding.groomName} & {wedding.brideName}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="md" className="font-label-caps text-xs">
              Back
            </Button>
          </Link>
          <Link href={`/dashboard/weddings/${params.id}/edit`}>
            <Button variant="gold" size="md" className="font-label-caps text-xs">
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Wedding Details Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Basic Info */}
        <div className="card-base p-8">
          <h2 className="heading-4 mb-6 text-on-surface">Details</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-label-caps uppercase text-tertiary">Date</dt>
              <dd className="text-on-surface font-medium">{formatDate(wedding.date)}</dd>
            </div>
            <div>
              <dt className="text-xs font-label-caps uppercase text-tertiary">Guest Count</dt>
              <dd className="text-on-surface font-medium">{wedding.guestCount}</dd>
            </div>
            <div>
              <dt className="text-xs font-label-caps uppercase text-tertiary">Status</dt>
              <dd className="text-on-surface font-medium">
                {wedding.isPublic ? (
                  <span className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-1 text-xs font-label-caps rounded-full">
                    Published
                  </span>
                ) : (
                  <span className="inline-block bg-outline-variant text-on-surface-variant px-3 py-1 text-xs font-label-caps rounded-full">
                    Draft
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Venue Info */}
        <div className="card-base p-8">
          <h2 className="heading-4 mb-6 text-on-surface">Venue</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-label-caps uppercase text-tertiary">Name</dt>
              <dd className="text-on-surface font-medium">{wedding.venue.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-label-caps uppercase text-tertiary">Address</dt>
              <dd className="text-on-surface font-medium">
                {wedding.venue.address}, {wedding.venue.city}, {wedding.venue.state} {wedding.venue.zipCode}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-label-caps uppercase text-tertiary">Country</dt>
              <dd className="text-on-surface font-medium">{wedding.venue.country}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Description */}
      {wedding.description && (
        <div className="card-base p-8 mb-12">
          <h2 className="heading-4 mb-4 text-on-surface">Story</h2>
          <p className="text-on-surface-variant whitespace-pre-wrap">{wedding.description}</p>
        </div>
      )}

      {/* Cover Image */}
      {wedding.coverImage && (
        <div className="card-base p-8 mb-12">
          <h2 className="heading-4 mb-4 text-on-surface">Cover Photo</h2>
          <img
            src={wedding.coverImage}
            alt="Cover"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Gallery */}
      {wedding.gallery && wedding.gallery.length > 0 && (
        <div className="card-base p-8 mb-12">
          <h2 className="heading-4 mb-6 text-on-surface">Gallery ({wedding.gallery.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wedding.gallery.map((imageUrl: string, idx: number) => (
              <img
                key={idx}
                src={imageUrl}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="card-base p-8">
        <h2 className="heading-4 mb-6 text-on-surface">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href={`/dashboard/weddings/${params.id}/edit`}>
            <Button variant="gold" size="md" className="font-label-caps text-xs">
              Edit Wedding
            </Button>
          </Link>
          <Link href={`/weddings/${wedding.slug}`}>
            <Button variant="outline" size="md" className="font-label-caps text-xs">
              View Public Page
            </Button>
          </Link>
          <Link href={`/dashboard/weddings/${params.id}/guests`}>
            <Button variant="outline" size="md" className="font-label-caps text-xs">
              Manage RSVPs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
