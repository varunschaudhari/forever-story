'use client';

import Link from 'next/link';
import { useState } from 'react';

interface WeddingData {
  slug: string;
  groomName: string;
  brideName: string;
  title: string;
  description?: string;
  date: Date;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  events?: Array<{
    name: string;
    type: string;
    date: Date;
    time: string;
    location?: string;
    description?: string;
  }>;
  gallery?: string[];
  contacts?: Array<{
    name: string;
    relationship?: string;
    email?: string;
    phone?: string;
  }>;
  coverImage?: string;
}

interface WeddingTemplateProps {
  wedding: WeddingData;
}

export default function WeddingTemplate({ wedding }: WeddingTemplateProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formattedDate = new Date(wedding.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif italic text-on-surface">Forever</div>
          <div className="flex gap-8 items-center">
            <a href="#story" className="text-sm font-label-caps text-on-surface hover:text-primary">Our Story</a>
            <a href="#gallery" className="text-sm font-label-caps text-on-surface hover:text-primary">Gallery</a>
            <a href="#contact" className="text-sm font-label-caps text-on-surface hover:text-primary">Contact</a>
            <Link href="/auth/signin" className="px-6 py-2 rounded-full bg-secondary text-on-secondary text-xs font-label-caps hover:scale-105 transition-transform">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-surface-container-lowest">
        {/* Background */}
        {wedding.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${wedding.coverImage})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {!wedding.coverImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-surface to-surface" />
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-xs font-label-caps text-on-surface-variant mb-8 tracking-wider">
            SAVE THE DATE
          </p>

          <h1 className="heading-1 text-on-surface mb-4">
            {wedding.groomName}
          </h1>

          <div className="text-4xl sm:text-5xl text-on-surface-variant font-serif font-light mb-4">&</div>

          <h2 className="heading-1 text-on-surface mb-8">
            {wedding.brideName}
          </h2>

          {wedding.title && (
            <p className="body-lg text-on-surface-variant mb-12">
              {wedding.title}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/weddings/${wedding.slug}/rsvp`}
              className="px-8 py-4 rounded-full bg-secondary text-on-secondary text-xs font-label-caps hover:scale-105 active:scale-95 transition-transform"
            >
              RSVP
            </Link>
            <a
              href="#story"
              className="px-8 py-4 rounded-full border-2 border-on-surface text-on-surface text-xs font-label-caps hover:scale-105 active:scale-95 transition-transform"
            >
              OUR STORY
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <p className="text-xs font-label-caps text-on-surface-variant">Scroll</p>
            <svg
              className="w-5 h-5 text-on-surface"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Save the Date Section */}
      <section className="py-20 px-4 sm:px-6 bg-surface-container-lowest">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-label-caps text-on-surface-variant mb-6 tracking-wider">DATE & LOCATION</p>
          <h3 className="heading-2 text-on-surface mb-6">
            {formattedDate}
          </h3>
          <p className="body-lg text-on-surface-variant">
            {wedding.venue.name}
            <br />
            {wedding.venue.address}
            <br />
            {wedding.venue.city}, {wedding.venue.state}, {wedding.venue.country}
          </p>
        </div>
      </section>

      {/* Story Section */}
      {wedding.description && (
        <section id="story" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-xs font-label-caps text-on-surface-variant mb-4 tracking-wider">OUR STORY</p>
              <p className="body-lg text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                {wedding.description}
              </p>
            </div>
            {wedding.coverImage && (
              <div className="order-1 md:order-2 card-base p-6">
                <img
                  src={wedding.coverImage}
                  alt="Our Story"
                  className="w-full aspect-square object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Events Timeline */}
      {wedding.events && wedding.events.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-surface-container-lowest">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-label-caps text-on-surface-variant mb-12 tracking-wider text-center">
              EVENTS & TIMELINE
            </p>

            <div className="relative">
              {/* Central timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-secondary/40" />

              <div className="space-y-12">
                {wedding.events.map((event, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      {/* Timeline dot */}
                      <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-surface-container-lowest mt-4`} />

                      <div className="card-base p-6">
                        <p className="text-xs font-label-caps text-secondary mb-2 tracking-wider uppercase">
                          {event.type}
                        </p>
                        <h4 className="heading-4 text-on-surface mb-3">
                          {event.name}
                        </h4>
                        <div className="text-on-surface-variant text-sm mb-3">
                          <p className="font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {' • '}
                            {event.time}
                          </p>
                          {event.location && <p className="mt-1">{event.location}</p>}
                        </div>
                        {event.description && (
                          <p className="text-on-surface-variant text-sm">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {wedding.gallery && wedding.gallery.length > 0 && (
        <section id="gallery" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <p className="text-xs font-label-caps text-on-surface-variant mb-12 tracking-wider">
            GALLERY
          </p>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {wedding.gallery.map((image, index) => (
              <div key={index} className="break-inside-avoid mb-8">
                <div className="card-base p-6 overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contacts Section */}
      {wedding.contacts && wedding.contacts.length > 0 && (
        <section id="contact" className="py-20 px-4 sm:px-6 bg-surface-container-lowest">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-label-caps text-on-surface-variant mb-12 tracking-wider text-center">
              GET IN TOUCH
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              {wedding.contacts.map((contact, index) => (
                <div key={index} className="card-base p-8 text-center">
                  <h4 className="heading-4 text-on-surface mb-2">
                    {contact.name}
                  </h4>
                  {contact.relationship && (
                    <p className="text-xs font-label-caps text-on-surface-variant mb-6 capitalize tracking-wider">
                      {contact.relationship}
                    </p>
                  )}

                  <div className="space-y-3">
                    {contact.email && (
                      <p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="body-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                          {contact.email}
                        </a>
                      </p>
                    )}
                    {contact.phone && (
                      <p>
                        <a
                          href={`tel:${contact.phone}`}
                          className="body-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share CTA */}
      <section className="py-20 px-4 sm:px-6 bg-primary-container text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="heading-2 text-on-surface mb-4">Share the joy</h3>
          <p className="body-lg text-on-surface-variant mb-8">
            Tell your friends and family about our wedding
          </p>
          <a
            href={`https://wa.me/?text=Join%20us%20for%20the%20wedding%20of%20${wedding.groomName}%20and%20${wedding.brideName}%20on%20${formattedDate}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white text-xs font-label-caps hover:scale-105 transition-transform"
          >
            Share on WhatsApp
          </a>
        </div>
      </section>

      {/* RSVP CTA */}
      <section className="py-20 px-4 sm:px-6 bg-on-surface text-surface text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="heading-2 text-surface mb-4">Will you celebrate with us?</h3>
          <p className="body-lg text-surface-variant mb-8">
            Please RSVP to confirm your attendance
          </p>
          <Link
            href={`/weddings/${wedding.slug}/rsvp`}
            className="inline-block px-8 py-4 rounded-full bg-secondary text-on-secondary text-xs font-label-caps hover:scale-105 active:scale-95 transition-transform"
          >
            RSVP NOW
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-surface border-t border-outline-variant">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs text-on-surface-variant font-label-caps">
          <p>ForeverStory © 2024</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
