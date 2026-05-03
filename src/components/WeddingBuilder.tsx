'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { IWedding } from '@/models/Wedding';

interface WeddingBuilderProps {
  weddingId?: string;
  initialData?: Partial<IWedding>;
}

interface WeddingFormData {
  groomName: string;
  brideName: string;
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  date: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  events: Array<{
    name: string;
    type: string;
    date: string;
    time: string;
    location: string;
    description: string;
  }>;
  contacts: Array<{
    name: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
  gallery: string[];
  guestCount: number;
  template: string;
  isPublic: boolean;
}

const SECTIONS = [
  { id: 'couple', label: 'Couple', icon: '♡' },
  { id: 'story', label: 'Story', icon: '✦' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'contacts', label: 'Contacts', icon: '📋' },
  { id: 'gallery', label: 'Gallery', icon: '📷' },
  { id: 'templates', label: 'Templates', icon: '◈' },
];

const TEMPLATES = [
  { id: 'classic', label: 'The Classic', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=400&fit=crop', tags: 'formal · timeless · ornate' },
  { id: 'modern', label: 'Modern Minimal', image: 'https://images.unsplash.com/photo-1469924935806-f2f038369e73?w=300&h=400&fit=crop', tags: 'clean · contemporary · bold' },
];

const normalizeFormData = (data?: Partial<IWedding>): WeddingFormData => {
  if (!data) {
    return {
      groomName: '',
      brideName: '',
      title: '',
      description: '',
      slug: '',
      coverImage: '',
      date: new Date().toISOString().slice(0, 10),
      venue: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      events: [],
      contacts: [],
      gallery: [],
      guestCount: 0,
      template: 'classic',
      isPublic: false,
    };
  }

  const dateStr = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : typeof data.date === 'string' ? (data.date as string).slice(0, 10) : new Date().toISOString().slice(0, 10);

  return {
    groomName: data.groomName || '',
    brideName: data.brideName || '',
    title: data.title || '',
    description: data.description || '',
    slug: data.slug || '',
    coverImage: data.coverImage || '',
    date: dateStr,
    venue: {
      name: data.venue?.name || '',
      address: data.venue?.address || '',
      city: data.venue?.city || '',
      state: data.venue?.state || '',
      zipCode: data.venue?.zipCode || '',
      country: data.venue?.country || '',
    },
    events: (data.events || []).map((e: any) => ({
      name: e.name || '',
      type: e.type || 'reception',
      date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : typeof e.date === 'string' ? e.date.slice(0, 10) : dateStr,
      time: e.time || '18:00',
      location: e.location || '',
      description: e.description || '',
    })),
    contacts: (data.contacts || []).map((c: any) => ({
      name: c.name || '',
      phone: c.phone || '',
      email: c.email || '',
      relationship: c.relationship || '',
    })),
    gallery: data.gallery || [],
    guestCount: data.guestCount || 0,
    template: data.template || 'classic',
    isPublic: data.isPublic || false,
  };
};

export default function WeddingBuilder({ weddingId, initialData }: WeddingBuilderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<WeddingFormData>(normalizeFormData(initialData));

  const [activeSection, setActiveSection] = useState('couple');
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weddingTime, setWeddingTime] = useState('18:00');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const uploadFiles = useCallback(async (files: FileList): Promise<string[]> => {
    const formDataObj = new FormData();
    Array.from(files).forEach((file) => formDataObj.append('files', file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formDataObj,
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.error || `Upload failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data.urls || [];
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  const updateField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateVenue = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        venue: { ...prev.venue, [field]: value },
      }));
    },
    []
  );

  const updateEvent = useCallback(
    (index: number, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        events: prev.events.map((e, i) =>
          i === index ? { ...e, [field]: value } : e
        ),
      }));
    },
    []
  );

  const addEvent = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        { name: '', type: 'reception', date: formData.date, time: '18:00', location: '', description: '' },
      ],
    }));
  }, [formData.date]);

  const removeEvent = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  }, []);

  const updateContact = useCallback(
    (index: number, field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c, i) =>
          i === index ? { ...c, [field]: value } : c
        ),
      }));
    },
    []
  );

  const addContact = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '', relationship: '' }],
    }));
  }, []);

  const removeContact = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  }, []);

  const removeGalleryImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(
    async (publish = false) => {
      try {
        setSaving(true);
        setError(null);

        const payload = {
          ...formData,
          isPublic: publish,
        };

        if (weddingId) {
          const res = await fetch(`/api/weddings/${weddingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to save wedding');
          }
        } else {
          const slug = formData.slug || `${formData.groomName}-${formData.brideName}`
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          const res = await fetch('/api/weddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...payload,
              slug,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to create wedding');
          }

          const data = await res.json();
          router.push(`/weddings/${data.data._id}/edit`);
          return;
        }

        setSaving(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSaving(false);
      }
    },
    [formData, weddingId, router]
  );

  const completedFields = Object.values(formData).filter((v) => {
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'object' && v !== null) {
      if (Array.isArray(v)) return v.length > 0;
      return Object.values(v).some((val) => typeof val === 'string' && val.trim());
    }
    return false;
  }).length;
  const totalFields = Object.keys(formData).length;
  const progress = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col overflow-hidden">
      <header className="h-16 border-b border-outline-variant flex items-center justify-between px-6 bg-white">
        <div className="text-2xl font-serif italic text-on-surface">ForeverStory</div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6">
            <span className="text-sm uppercase tracking-widest text-on-surface font-semibold cursor-pointer">
              Builder
            </span>
            {formData.groomName && formData.brideName && (
              <Link
                href={`/weddings/${formData.slug || `${formData.groomName}-${formData.brideName}`.toLowerCase().replace(/\s+/g, '-')}`}
                target="_blank"
                className="text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Preview
              </Link>
            )}
            <span className="text-sm uppercase tracking-widest text-on-surface-variant cursor-pointer">
              Account
            </span>
          </nav>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="md" onClick={() => handleSave(false)} disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="gold" size="md" onClick={() => handleSave(true)} disabled={saving}>
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-stone-50 border-r border-stone-200 overflow-y-auto flex flex-col p-6">
          <div className="mb-8">
            <h3 className="heading-5 text-on-surface mb-2">The Heirloom</h3>
            <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
              <div
                className="bg-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-on-surface-variant">{progress}% Complete</p>
          </div>

          <nav className="space-y-2 flex-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'bg-primary-container border-l-2 border-secondary text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-stone-100'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm uppercase tracking-widest">{section.label}</span>
              </button>
            ))}
          </nav>

          <Button variant="ghost" size="md" className="w-full justify-center text-sm uppercase tracking-widest">
            Preview Site
          </Button>
        </aside>

        <main className="flex-1 overflow-y-auto px-12 py-16 max-w-5xl mx-auto w-full">
          <h1 className="heading-3 italic text-center mb-20 text-primary">Crafting Your Legacy</h1>

          {error && (
            <div className="mb-8 p-4 bg-error-container border border-error rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <section
            id="couple"
            ref={(el) => {
              if (el) sectionRefs.current['couple'] = el;
            }}
            className="mb-20"
          >
            <h2 className="heading-5 mb-8 flex items-center gap-3">
              <span>♡</span> The Couple
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Input
                label="Groom's Name"
                value={formData.groomName}
                onChange={(e) => updateField('groomName', e.target.value)}
                placeholder="e.g. Julian Montgomery"
              />
              <Input
                label="Bride's Name"
                value={formData.brideName}
                onChange={(e) => updateField('brideName', e.target.value)}
                placeholder="e.g. Elena Vane"
              />
            </div>

            <div className="card-base p-8">
              {formData.coverImage ? (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full aspect-[4/5] object-cover rounded-lg"
                  />
                  <button
                    onClick={() => updateField('coverImage', '')}
                    className="absolute top-2 right-2 bg-error text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-error/90"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-outline-variant rounded-lg p-8 text-center cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="font-semibold text-on-surface mb-1">Upload Couple Photo</p>
                  <p className="text-xs text-on-surface-variant">RECOMMENDED: HIGH RESOLUTION EDITORIAL PORTRAIT</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files?.length) {
                        try {
                          setUploadingCover(true);
                          const urls = await uploadFiles(e.target.files);
                          updateField('coverImage', urls[0]);
                        } catch (err) {
                          setError('Failed to upload photo');
                        } finally {
                          setUploadingCover(false);
                        }
                      }
                    }}
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </div>
          </section>

          <section
            id="story"
            ref={(el) => {
              if (el) sectionRefs.current['story'] = el;
            }}
            className="mb-20"
          >
            <h2 className="heading-5 mb-8 flex items-center gap-3">
              <span>✦</span> Our Story
            </h2>
            <div className="max-w-2xl mx-auto">
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Tell us your love story... How did you meet? What makes your relationship special?"
                className="w-full h-32 p-4 border border-outline-variant rounded-lg focus:border-primary focus:outline-none resize-none italic text-on-surface placeholder-on-surface-variant"
              />
            </div>
          </section>

          <section
            id="events"
            ref={(el) => {
              if (el) sectionRefs.current['events'] = el;
            }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-5 flex items-center gap-3">
                <span>📅</span> The Celebration
              </h2>
              <button
                onClick={addEvent}
                className="text-sm text-secondary font-semibold uppercase tracking-widest hover:text-secondary/80"
              >
                + Add Event
              </button>
            </div>

            <div className="space-y-6">
              <div className="card-base p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-on-surface">The Wedding</h3>
                  <Badge>main</Badge>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Wedding Title"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. The Wedding of Elena & Julian"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                    <Input
                      label="Time"
                      type="time"
                      value={weddingTime}
                      onChange={(e) => setWeddingTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {formData.events.map((event, index) => (
                <div key={index} className="card-base p-8 relative">
                  <button
                    onClick={() => removeEvent(index)}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-error"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <Input
                      label="Event Name"
                      value={event.name}
                      onChange={(e) => updateEvent(index, 'name', e.target.value)}
                      placeholder="e.g. Rehearsal Dinner"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Date"
                        type="date"
                        value={event.date}
                        onChange={(e) => updateEvent(index, 'date', e.target.value)}
                      />
                      <Input
                        label="Time"
                        type="time"
                        value={event.time}
                        onChange={(e) => updateEvent(index, 'time', e.target.value)}
                      />
                    </div>
                    <Input
                      label="Location"
                      value={event.location}
                      onChange={(e) => updateEvent(index, 'location', e.target.value)}
                      placeholder="e.g. Venue Name, City"
                    />
                    <textarea
                      value={event.description}
                      onChange={(e) => updateEvent(index, 'description', e.target.value)}
                      placeholder="Event details..."
                      className="w-full h-20 p-4 border border-outline-variant rounded-lg focus:border-primary focus:outline-none resize-none text-on-surface placeholder-on-surface-variant"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 card-base p-8">
              <h3 className="font-semibold text-on-surface mb-6">Venue Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Venue Name"
                  value={formData.venue.name}
                  onChange={(e) => updateVenue('name', e.target.value)}
                  placeholder="e.g. Grand Ballroom"
                />
                <Input
                  label="Address"
                  value={formData.venue.address}
                  onChange={(e) => updateVenue('address', e.target.value)}
                  placeholder="Street address"
                />
                <Input
                  label="City"
                  value={formData.venue.city}
                  onChange={(e) => updateVenue('city', e.target.value)}
                  placeholder="City"
                />
                <Input
                  label="State"
                  value={formData.venue.state}
                  onChange={(e) => updateVenue('state', e.target.value)}
                  placeholder="State"
                />
                <Input
                  label="Zip Code"
                  value={formData.venue.zipCode}
                  onChange={(e) => updateVenue('zipCode', e.target.value)}
                  placeholder="Zip code"
                />
                <Input
                  label="Country"
                  value={formData.venue.country}
                  onChange={(e) => updateVenue('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </section>

          <section
            id="contacts"
            ref={(el) => {
              if (el) sectionRefs.current['contacts'] = el;
            }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-5 flex items-center gap-3">
                <span>📋</span> RSVP & Contacts
              </h2>
              <button
                onClick={addContact}
                className="text-sm text-secondary font-semibold uppercase tracking-widest hover:text-secondary/80"
              >
                + Add Contact
              </button>
            </div>

            <div className="space-y-6">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="card-base p-8 relative">
                  <button
                    onClick={() => removeContact(index)}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-error"
                  >
                    ×
                  </button>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      placeholder="Contact name"
                    />
                    <Input
                      label="Relationship"
                      value={contact.relationship}
                      onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                      placeholder="e.g. Bridesmaid, Groomsman"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContact(index, 'phone', e.target.value)}
                      placeholder="Phone number"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateContact(index, 'email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 card-base p-8">
              <h3 className="font-semibold text-on-surface mb-4">Guest Count</h3>
              <Input
                label="Total Guests"
                type="number"
                value={formData.guestCount.toString()}
                onChange={(e) => updateField('guestCount', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </section>

          <section
            id="gallery"
            ref={(el) => {
              if (el) sectionRefs.current['gallery'] = el;
            }}
            className="mb-20"
          >
            <h2 className="heading-5 mb-8 flex items-center gap-3">
              <span>📷</span> Moments Captured
            </h2>
            <p className="text-on-surface-variant mb-8 text-sm">Share your favorite moments. Upload high-quality photos to showcase your wedding.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <label className="aspect-square border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors">
                <div className="text-center">
                  <div className="text-3xl mb-2">+</div>
                  <p className="text-xs text-on-surface-variant">Upload</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      try {
                        setUploadingGallery(true);
                        const urls = await uploadFiles(e.target.files);
                        updateField('gallery', [...formData.gallery, ...urls]);
                      } catch (err) {
                        setError('Failed to upload photos');
                      } finally {
                        setUploadingGallery(false);
                      }
                    }
                  }}
                  disabled={uploadingGallery}
                />
              </label>

              {formData.gallery.map((imageUrl, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={imageUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeGalleryImage(index)}
                    className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="text-white text-2xl">×</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section
            id="templates"
            ref={(el) => {
              if (el) sectionRefs.current['templates'] = el;
            }}
            className="mb-20"
          >
            <h2 className="heading-5 italic text-center mb-12">Choose Your Aesthetic</h2>

            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => updateField('template', tmpl.id)}
                  className={`relative overflow-hidden rounded-xl transition-all ${
                    formData.template === tmpl.id ? 'ring-2 ring-secondary' : 'hover:shadow-lg'
                  }`}
                >
                  <img
                    src={tmpl.image}
                    alt={tmpl.label}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                    <h3 className="text-white font-serif text-xl">{tmpl.label}</h3>
                    <p className="text-white/80 text-xs">{tmpl.tags}</p>
                    {formData.template === tmpl.id && (
                      <Badge className="bg-secondary text-white">Selected</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="h-20"></div>
        </main>
      </div>
    </div>
  );
}
