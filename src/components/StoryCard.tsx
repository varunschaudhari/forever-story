'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StoryCardProps {
  story: {
    _id: string;
    title: string;
    groomName: string;
    brideName: string;
    slug: string;
    coverImage?: string;
    date: Date | string;
    venue: {
      city: string;
      state: string;
    };
    guestCount: number;
    isPublic: boolean;
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/weddings/${story._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete story. Please try again.');
        setIsDeleting(false);
      }
    } catch (error) {
      alert('Error deleting story. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="card-base p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="md:w-48 flex-shrink-0">
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-32 md:h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-32 md:h-48 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-4xl">💍</span>
          </div>
        )}
      </div>

      {/* Story Info */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
          <div>
            <h3 className="text-2xl font-serif text-on-surface mb-1">{story.title}</h3>
            <p className="text-sm text-on-surface-variant">
              {story.groomName} & {story.brideName}
            </p>
          </div>
          <div className="flex gap-2">
            {story.isPublic ? (
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                Published
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-full">
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 md:gap-6 mb-6 text-sm text-on-surface-variant">
          <div>
            <span className="font-semibold text-on-surface">📅 </span>
            {formatDate(story.date)}
          </div>
          <div>
            <span className="font-semibold text-on-surface">📍 </span>
            {story.venue.city}, {story.venue.state}
          </div>
          <div>
            <span className="font-semibold text-on-surface">👥 </span>
            {story.guestCount} guests
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/partner/stories/${story._id}/edit`}>
            <Button variant="gold" size="sm">
              ✏️ Edit
            </Button>
          </Link>
          {story.isPublic && (
            <Link href={`/weddings/${story.slug}`}>
              <Button variant="outline" size="sm">
                👁️ View Website
              </Button>
            </Link>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
