import { dbConnect } from '@/lib/mongodb';
import { Wedding } from '@/models/Wedding';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FaWhatsapp } from 'react-icons/fa';
import mongoose from 'mongoose';

const buildQuery = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { slug: id }] };
  }
  return { slug: id };
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const wedding = (await Wedding.findOne(buildQuery(params.id)).lean()) as any;

    if (!wedding) {
      return {
        title: 'Wedding Story - ForeverStory',
      };
    }

    return {
      title: `${wedding.title || 'Wedding'} - ForeverStory`,
      description: wedding.description,
    };
  } catch {
    return {
      title: 'Wedding Story - ForeverStory',
    };
  }
}

export default async function WeddingViewPage({ params }: { params: { id: string } }) {
  await dbConnect();
  const wedding = (await Wedding.findOne(buildQuery(params.id))
    .populate('organizers', 'name email')
    .lean()) as any;

  if (!wedding || !wedding.isPublic) {
    notFound();
  }

  const organizer = Array.isArray(wedding.organizers) ? wedding.organizers[0] : null;
  const weddingDate = wedding.date ? new Date(wedding.date) : null;
  const whatsappMessage = encodeURIComponent(
    `I'm attending ${wedding.title}! Check it out: ${process.env.NEXT_PUBLIC_APP_URL}/weddings/${params.id}`
  );

  return (
    <div className="bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="section-max px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            ForeverStory
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          {wedding.coverImage ? (
            <img
              src={wedding.coverImage}
              alt="Wedding cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-container to-primary" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="section-max px-6 md:px-12 relative z-10 text-center text-white">
          <p className="text-sm uppercase tracking-widest mb-4 text-white/80">Save The Date</p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            {wedding.groomName && wedding.brideName
              ? `${wedding.groomName} & ${wedding.brideName}`
              : wedding.title}
          </h1>
          {weddingDate && (
            <p className="text-2xl md:text-3xl font-serif italic text-white/90">
              {weddingDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </section>

      {/* Story Section */}
      {wedding.description && (
        <section className="py-20 md:py-32 bg-surface-container-low">
          <div className="section-max px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
              <div>
                <h2 className="heading-2 mb-8 text-on-surface">Our Story</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {wedding.description}
                </p>
              </div>
              {wedding.coverImage && (
                <div className="hidden md:block">
                  <div className="photo-frame">
                    <img
                      src={wedding.coverImage}
                      alt={`${wedding.groomName} and ${wedding.brideName}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {wedding.events && wedding.events.length > 0 && (
        <section className="py-20 md:py-32 bg-surface">
          <div className="section-max px-6 md:px-12">
            <h2 className="heading-2 mb-16 text-center text-on-surface">The Celebration</h2>
            <div className="max-w-3xl mx-auto">
              {wedding.events.map((event: any, idx: number) => (
                <div key={idx} className="mb-12 flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-secondary mt-2 mb-4" />
                    {idx < wedding.events.length - 1 && (
                      <div className="w-1 h-24 bg-secondary/20" />
                    )}
                  </div>
                  <div className="pb-12">
                    <h3 className="heading-5 mb-2 text-on-surface">{event.name}</h3>
                    {event.time && (
                      <p className="text-sm text-on-surface-variant mb-2">
                        ⏰ {event.time}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-on-surface-variant mb-4">
                        📍 {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-on-surface">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue Section */}
      {wedding.venue && (
        <section className="py-20 md:py-32 bg-surface-container-low">
          <div className="section-max px-6 md:px-12">
            <h2 className="heading-2 mb-12 text-center text-on-surface">The Venue</h2>
            <div className="max-w-3xl mx-auto card-base p-8 md:p-12">
              <h3 className="heading-4 mb-4 text-on-surface">{wedding.venue.name}</h3>
              <div className="space-y-3 text-on-surface-variant mb-8">
                <p className="flex gap-3">
                  <span>📍</span>
                  <span>
                    {wedding.venue.address}, {wedding.venue.city}, {wedding.venue.state}{' '}
                    {wedding.venue.zipCode}
                  </span>
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  wedding.venue.name + ', ' + wedding.venue.city
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="md">
                  View on Google Maps
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {wedding.gallery && wedding.gallery.length > 0 && (
        <section className="py-20 md:py-32 bg-surface">
          <div className="section-max px-6 md:px-12">
            <h2 className="heading-2 mb-16 text-center text-on-surface">Moments Captured</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
              {wedding.gallery.map((image: string, idx: number) => (
                <div key={idx} className="break-inside-avoid mb-8">
                  <div className="photo-frame overflow-hidden">
                    <img
                      src={image}
                      alt={`Gallery image ${idx + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share Section */}
      <section className="py-20 md:py-32 bg-primary-container">
        <div className="section-max px-6 md:px-12 text-center">
          <h2 className="heading-2 mb-8 text-on-surface">Share the Joy</h2>
          <p className="text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Help us celebrate by sharing this special moment with friends and family
          </p>
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="gold" size="lg" className="inline-flex items-center gap-2">
              <FaWhatsapp size={20} />
              Share on WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Contact Section */}
      {organizer && (
        <section className="py-20 md:py-32 bg-surface">
          <div className="section-max px-6 md:px-12">
            <h2 className="heading-2 mb-12 text-center text-on-surface">Get In Touch</h2>
            <div className="max-w-md mx-auto card-base p-8 text-center">
              <p className="text-on-surface-variant mb-6">
                Have questions? Contact us directly:
              </p>
              {organizer.email && (
                <a
                  href={`mailto:${organizer.email}`}
                  className="inline-block mb-4 text-primary hover:underline font-medium"
                >
                  {organizer.email}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 py-12">
        <div className="section-max px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-serif italic text-on-surface">ForeverStory</div>
            <p className="text-sm text-on-surface-variant">
              © 2024 ForeverStory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
