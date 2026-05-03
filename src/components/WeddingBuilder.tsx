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

interface MultiLangString {
  en: string;
  mr: string;
  hi: string;
}

interface WeddingFormData {
  groomName: MultiLangString;
  brideName: MultiLangString;
  title: MultiLangString;
  description: string;
  slug: string;
  storyType: 'wedding' | 'engagement' | 'bridal_shower';
  photos: { cover: string; groom: string; bride: string; couple: string };
  groomParents: { fatherName: string; motherName: string };
  brideParents: { fatherName: string; motherName: string };
  date: string;
  venue: { name: string; address: string; city: string; state: string; zipCode: string; country: string };
  ceremonies: Array<{
    name: 'Sakarpuda' | 'Haldi' | 'Mehendi' | 'Vivah';
    enabled: boolean;
    date: string;
    startTime: string;
    endTime: string;
    address: string;
    city: string;
  }>;
  galleryAlbums: Array<{ albumName: string; photos: string[] }>;
  socialLinks: { whatsapp: string; facebook: string; instagram: string; twitter: string; youtube: string };
  theme: { themeId: string; fontStyle: string };
  events: Array<{ name: string; type: string; date: string; time: string; location: string; description: string }>;
  contacts: Array<{ name: string; phone: string; email: string; relationship: string }>;
  guestCount: number;
  isPublic: boolean;
}

const SECTIONS = [
  { id: 'couple', label: 'Couple', icon: '♡' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'gallery', label: 'Gallery', icon: '📷' },
  { id: 'social', label: 'Social', icon: '🔗' },
  { id: 'theme', label: 'Theme', icon: '🎨' },
  { id: 'publish', label: 'Publish', icon: '✦' },
];

const PREDEFINED_CEREMONIES = [
  { name: 'Sakarpuda' as const, icon: '💍', description: 'Engagement ceremony' },
  { name: 'Haldi' as const, icon: '🌸', description: 'Turmeric ceremony' },
  { name: 'Mehendi' as const, icon: '🌿', description: 'Henna ceremony' },
  { name: 'Vivah' as const, icon: '🔥', description: 'Wedding ceremony' },
];

const PREDEFINED_THEMES = [
  { id: 'traditional', label: 'Traditional', colors: ['#8B1A1A', '#D4AF37'] },
  { id: 'modern', label: 'Modern', colors: ['#1A1A2E', '#E94560'] },
  { id: 'gold', label: 'Gold', colors: ['#B8860B', '#FFF8DC'] },
  { id: 'rose', label: 'Rose', colors: ['#FF69B4', '#FFF0F5'] },
];

const FONT_STYLES = [
  { id: 'serif', label: 'Traditional Serif' },
  { id: 'sans', label: 'Modern Sans-serif' },
];

const normalizeFormData = (data?: Partial<IWedding>): WeddingFormData => {
  if (!data) {
    return {
      groomName: { en: '', mr: '', hi: '' },
      brideName: { en: '', mr: '', hi: '' },
      title: { en: '', mr: '', hi: '' },
      description: '',
      slug: '',
      storyType: 'wedding',
      photos: { cover: '', groom: '', bride: '', couple: '' },
      groomParents: { fatherName: '', motherName: '' },
      brideParents: { fatherName: '', motherName: '' },
      date: new Date().toISOString().slice(0, 10),
      venue: { name: '', address: '', city: '', state: '', zipCode: '', country: '' },
      ceremonies: PREDEFINED_CEREMONIES.map(c => ({
        name: c.name,
        enabled: false,
        date: '',
        startTime: '',
        endTime: '',
        address: '',
        city: '',
      })),
      galleryAlbums: [
        { albumName: 'Captured Moments', photos: [] },
        { albumName: 'Memories', photos: [] },
      ],
      socialLinks: { whatsapp: '', facebook: '', instagram: '', twitter: '', youtube: '' },
      theme: { themeId: 'traditional', fontStyle: 'serif' },
      events: [],
      contacts: [],
      guestCount: 0,
      isPublic: false,
    };
  }

  const dateStr =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : typeof data.date === 'string'
      ? (data.date as string).slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  return {
    groomName: data.groomName || { en: '', mr: '', hi: '' },
    brideName: data.brideName || { en: '', mr: '', hi: '' },
    title: data.title || { en: '', mr: '', hi: '' },
    description: data.description || '',
    slug: data.slug || '',
    storyType: (data.storyType as any) || 'wedding',
    photos: data.photos || { cover: '', groom: '', bride: '', couple: '' },
    groomParents: data.groomParents || { fatherName: '', motherName: '' },
    brideParents: data.brideParents || { fatherName: '', motherName: '' },
    date: dateStr,
    venue: data.venue || { name: '', address: '', city: '', state: '', zipCode: '', country: '' },
    ceremonies:
      data.ceremonies?.length
        ? data.ceremonies
        : PREDEFINED_CEREMONIES.map(c => ({
            name: c.name,
            enabled: false,
            date: '',
            startTime: '',
            endTime: '',
            address: '',
            city: '',
          })),
    galleryAlbums: data.galleryAlbums?.length
      ? data.galleryAlbums
      : [
          { albumName: 'Captured Moments', photos: [] },
          { albumName: 'Memories', photos: [] },
        ],
    socialLinks: data.socialLinks || { whatsapp: '', facebook: '', instagram: '', twitter: '', youtube: '' },
    theme: data.theme || { themeId: 'traditional', fontStyle: 'serif' },
    events: data.events || [],
    contacts: data.contacts || [],
    guestCount: data.guestCount || 0,
    isPublic: data.isPublic || false,
  };
};

function MultiLangInput({
  fieldName,
  value,
  onUpdate,
  maxLength = 100,
}: {
  fieldName: string;
  value: MultiLangString;
  onUpdate: (lang: 'en' | 'mr' | 'hi', val: string) => void;
  maxLength?: number;
}) {
  const [activeTab, setActiveTab] = useState<'en' | 'mr' | 'hi'>('en');

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-on-surface mb-2 capitalize">{fieldName}</label>
      <div className="flex gap-2 mb-2 border-b border-outline-variant">
        {(['en', 'mr', 'hi'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === lang
                ? 'text-secondary border-b-2 border-secondary -mb-0.5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {lang === 'en' ? 'EN' : lang === 'mr' ? 'मर' : 'हि'}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={value[activeTab]}
        onChange={(e) => onUpdate(activeTab, e.target.value.slice(0, maxLength))}
        placeholder={`${fieldName} in ${activeTab === 'en' ? 'English' : activeTab === 'mr' ? 'Marathi' : 'Hindi'}`}
        maxLength={maxLength}
        className="input-field w-full"
      />
      <p className="text-xs text-on-surface-variant mt-1">
        {value[activeTab].length} / {maxLength}
      </p>
    </div>
  );
}

function PhotoUploadSlot({
  label,
  value,
  onUpload,
  uploading,
}: {
  label: string;
  value: string;
  onUpload: (url: string) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.urls) {
        onUpload(data.urls[0]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full aspect-square bg-stone-50 border-2 border-dashed border-outline-variant rounded-lg hover:border-secondary transition-colors disabled:opacity-50 flex items-center justify-center flex-col gap-2"
      >
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpload('');
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </>
        ) : uploading ? (
          <>
            <span className="animate-spin">⟳</span>
            <span className="text-xs text-on-surface-variant">Uploading...</span>
          </>
        ) : (
          <>
            <span className="text-3xl">📸</span>
            <span className="text-xs font-medium text-on-surface-variant text-center px-2">{label}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function WeddingBuilder({ weddingId, initialData }: WeddingBuilderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<WeddingFormData>(normalizeFormData(initialData));
  const [activeSection, setActiveSection] = useState('couple');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState<Record<string, boolean>>({});
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

  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  const updateMultiLangField = (
    field: 'groomName' | 'brideName' | 'title',
    lang: 'en' | 'mr' | 'hi',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateVenue = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      venue: { ...prev.venue, [field]: value },
    }));
  };

  const updateCeremony = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      ceremonies: prev.ceremonies.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  };

  const updateGalleryAlbum = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }));
  };

  const updateSocialLinks = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const updateTheme = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }));
  };

  const uploadPhotoToAlbum = async (albumIndex: number, file: File) => {
    setUploadingPhotos((prev) => ({ ...prev, [`album-${albumIndex}`]: true }));
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.urls) {
        updateGalleryAlbum(albumIndex, 'photos', [
          ...formData.galleryAlbums[albumIndex].photos,
          data.urls[0],
        ]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingPhotos((prev) => ({ ...prev, [`album-${albumIndex}`]: false }));
    }
  };

  const handleSave = useCallback(
    async (publish = false) => {
      try {
        setSaving(true);
        setError(null);

        const slug = formData.slug || `${formData.groomName.en}-${formData.brideName.en}`
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        const finalSlug = `${slug}-${Date.now().toString(36)}`;

        const payload = {
          ...formData,
          slug: weddingId ? formData.slug : finalSlug,
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
            throw new Error(data.message || 'Failed to save');
          }

          setSaving(false);
        } else {
          const res = await fetch('/api/weddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to create');
          }

          const data = await res.json();
          router.push(`/partner/stories/${data.data._id}/edit`);
          return;
        }
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
      return Object.values(v).some((val) => (typeof val === 'string' ? val.trim() : val));
    }
    return false;
  }).length;
  const totalFields = Object.keys(formData).length;
  const progress = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col overflow-hidden">
      <header className="h-16 border-b border-outline-variant flex items-center justify-between px-6 bg-white">
        <button
          onClick={() => router.back()}
          className="text-on-surface-variant hover:text-on-surface transition-colors mr-4"
        >
          ← Back
        </button>
        <div className="text-2xl font-serif italic text-on-surface">ForeverStory</div>
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
            <h3 className="heading-5 text-on-surface mb-2">Progress</h3>
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
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-secondary text-white'
                    : 'text-on-surface hover:bg-stone-100'
                }`}
              >
                <span className="mr-2">{section.icon}</span> {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Couple Section */}
            <section
              ref={(el) => {
                if (el) sectionRefs.current['couple'] = el;
              }}
              id="couple"
              className="mb-12"
            >
              <h2 className="heading-3 text-on-surface mb-6">♡ Couple Details</h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-3">Story Type</label>
                <div className="flex gap-3">
                  {[
                    { value: 'wedding', label: '💍 Wedding' },
                    { value: 'engagement', label: '💎 Engagement' },
                    { value: 'bridal_shower', label: '🎉 Bridal Shower' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateField('storyType', type.value)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                        formData.storyType === type.value
                          ? 'bg-secondary text-white'
                          : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <MultiLangInput
                fieldName="Groom Name"
                value={formData.groomName}
                onUpdate={(lang, val) => updateMultiLangField('groomName', lang, val)}
              />

              <MultiLangInput
                fieldName="Bride Name"
                value={formData.brideName}
                onUpdate={(lang, val) => updateMultiLangField('brideName', lang, val)}
              />

              <MultiLangInput
                fieldName="Story Title"
                value={formData.title}
                onUpdate={(lang, val) => updateMultiLangField('title', lang, val)}
                maxLength={200}
              />

              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-4">Photos</label>
                <div className="grid grid-cols-1 gap-4">
                  <PhotoUploadSlot
                    label="Cover Image"
                    value={formData.photos.cover}
                    onUpload={(url) => updateField('photos', { ...formData.photos, cover: url })}
                    uploading={uploadingPhotos['cover'] || false}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <PhotoUploadSlot
                      label="Groom"
                      value={formData.photos.groom}
                      onUpload={(url) => updateField('photos', { ...formData.photos, groom: url })}
                      uploading={uploadingPhotos['groom'] || false}
                    />
                    <PhotoUploadSlot
                      label="Bride"
                      value={formData.photos.bride}
                      onUpload={(url) => updateField('photos', { ...formData.photos, bride: url })}
                      uploading={uploadingPhotos['bride'] || false}
                    />
                    <PhotoUploadSlot
                      label="Couple"
                      value={formData.photos.couple}
                      onUpload={(url) => updateField('photos', { ...formData.photos, couple: url })}
                      uploading={uploadingPhotos['couple'] || false}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-2">Story Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Tell the story of your celebration..."
                  className="input-field w-full h-32"
                />
              </div>
            </section>

            {/* Family Section */}
            <section
              ref={(el) => {
                if (el) sectionRefs.current['family'] = el;
              }}
              id="family"
              className="mb-12"
            >
              <h2 className="heading-3 text-on-surface mb-6">👨‍👩‍👧 Family & Venue</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="card-base p-4">
                  <h3 className="font-semibold text-on-surface mb-3">Groom's Family</h3>
                  <div className="mb-3">
                    <label className="text-sm text-on-surface-variant">Father's Name</label>
                    <input
                      type="text"
                      value={formData.groomParents.fatherName}
                      onChange={(e) =>
                        updateField('groomParents', {
                          ...formData.groomParents,
                          fatherName: e.target.value,
                        })
                      }
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-on-surface-variant">Mother's Name</label>
                    <input
                      type="text"
                      value={formData.groomParents.motherName}
                      onChange={(e) =>
                        updateField('groomParents', {
                          ...formData.groomParents,
                          motherName: e.target.value,
                        })
                      }
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div className="card-base p-4">
                  <h3 className="font-semibold text-on-surface mb-3">Bride's Family</h3>
                  <div className="mb-3">
                    <label className="text-sm text-on-surface-variant">Father's Name</label>
                    <input
                      type="text"
                      value={formData.brideParents.fatherName}
                      onChange={(e) =>
                        updateField('brideParents', {
                          ...formData.brideParents,
                          fatherName: e.target.value,
                        })
                      }
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-on-surface-variant">Mother's Name</label>
                    <input
                      type="text"
                      value={formData.brideParents.motherName}
                      onChange={(e) =>
                        updateField('brideParents', {
                          ...formData.brideParents,
                          motherName: e.target.value,
                        })
                      }
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="card-base p-4">
                <h3 className="font-semibold text-on-surface mb-4">Venue & Guest Count</h3>
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={formData.venue.name}
                  onChange={(e) => updateVenue('name', e.target.value)}
                  className="input-field w-full mb-3"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.venue.address}
                  onChange={(e) => updateVenue('address', e.target.value)}
                  className="input-field w-full mb-3"
                />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.venue.city}
                    onChange={(e) => updateVenue('city', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.venue.state}
                    onChange={(e) => updateVenue('state', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={formData.venue.zipCode}
                    onChange={(e) => updateVenue('zipCode', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.venue.country}
                    onChange={(e) => updateVenue('country', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="mt-4">
                  <label className="text-sm font-semibold text-on-surface">Expected Guests</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.guestCount}
                    onChange={(e) => updateField('guestCount', parseInt(e.target.value) || 0)}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </section>

            {/* Events Section - Only for Wedding Story Type */}
            {formData.storyType === 'wedding' && (
              <section
                ref={(el) => {
                  if (el) sectionRefs.current['events'] = el;
                }}
                id="events"
                className="mb-12"
              >
                <h2 className="heading-3 text-on-surface mb-6">📅 Wedding Ceremonies</h2>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-on-surface mb-2">Wedding Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div className="space-y-4">
                  {formData.ceremonies.map((ceremony, idx) => (
                    <div key={ceremony.name} className="card-base p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{PREDEFINED_CEREMONIES[idx].icon}</span>
                          <div>
                            <h3 className="font-semibold text-on-surface">{ceremony.name}</h3>
                            <p className="text-sm text-on-surface-variant">
                              {PREDEFINED_CEREMONIES[idx].description}
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ceremony.enabled}
                            onChange={(e) => updateCeremony(idx, 'enabled', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">Enable</span>
                        </label>
                      </div>

                      {ceremony.enabled && (
                        <div className="space-y-3 pt-4 border-t border-outline-variant">
                          <input
                            type="date"
                            value={ceremony.date}
                            onChange={(e) => updateCeremony(idx, 'date', e.target.value)}
                            className="input-field w-full"
                            placeholder="Date"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="time"
                              value={ceremony.startTime}
                              onChange={(e) => updateCeremony(idx, 'startTime', e.target.value)}
                              className="input-field"
                              placeholder="Start Time"
                            />
                            <input
                              type="time"
                              value={ceremony.endTime}
                              onChange={(e) => updateCeremony(idx, 'endTime', e.target.value)}
                              className="input-field"
                              placeholder="End Time"
                            />
                          </div>
                          <input
                            type="text"
                            value={ceremony.address}
                            onChange={(e) => updateCeremony(idx, 'address', e.target.value)}
                            placeholder="Address"
                            className="input-field w-full"
                          />
                          <input
                            type="text"
                            value={ceremony.city}
                            onChange={(e) => updateCeremony(idx, 'city', e.target.value)}
                            placeholder="City"
                            className="input-field w-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Section */}
            <section
              ref={(el) => {
                if (el) sectionRefs.current['gallery'] = el;
              }}
              id="gallery"
              className="mb-12"
            >
              <h2 className="heading-3 text-on-surface mb-6">📷 Photo Gallery</h2>

              {formData.galleryAlbums.map((album, albumIdx) => (
                <div key={albumIdx} className="mb-8 card-base p-4">
                  <h3 className="font-semibold text-on-surface mb-4">{album.albumName}</h3>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {album.photos.map((photo, photoIdx) => (
                      <div key={photoIdx} className="relative">
                        <img
                          src={photo}
                          alt={`${album.albumName} - ${photoIdx}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            updateGalleryAlbum(albumIdx, 'photos', album.photos.filter((_, i) => i !== photoIdx));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPhotoToAlbum(albumIdx, file);
                      }}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-outline-variant rounded-lg p-4 text-center cursor-pointer hover:bg-surface-container transition-colors">
                      <span className="text-2xl">+</span>
                      <p className="text-sm text-on-surface-variant">Add photos</p>
                    </div>
                  </label>
                </div>
              ))}
            </section>

            {/* Social Section */}
            <section
              ref={(el) => {
                if (el) sectionRefs.current['social'] = el;
              }}
              id="social"
              className="mb-12"
            >
              <h2 className="heading-3 text-on-surface mb-6">🔗 Social Links</h2>

              <div className="space-y-4">
                {[
                  { key: 'whatsapp', icon: '📱', label: 'WhatsApp' },
                  { key: 'facebook', icon: '📘', label: 'Facebook' },
                  { key: 'instagram', icon: '📷', label: 'Instagram' },
                  { key: 'twitter', icon: '🐦', label: 'Twitter/X' },
                  { key: 'youtube', icon: '▶️', label: 'YouTube' },
                ].map(({ key, icon, label }) => (
                  <div key={key}>
                    <label className="text-sm font-semibold text-on-surface">
                      {icon} {label}
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks[key as keyof typeof formData.socialLinks]}
                      onChange={(e) => updateSocialLinks(key, e.target.value)}
                      placeholder={`Your ${label} ${key === 'whatsapp' ? 'number' : 'handle or URL'}`}
                      className="input-field w-full"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Theme Section */}
            <section
              ref={(el) => {
                if (el) sectionRefs.current['theme'] = el;
              }}
              id="theme"
              className="mb-12"
            >
              <h2 className="heading-3 text-on-surface mb-6">🎨 Theme & Design</h2>

              <div className="mb-8">
                <h3 className="font-semibold text-on-surface mb-4">Select Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                  {PREDEFINED_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateTheme('themeId', theme.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.theme.themeId === theme.id
                          ? 'border-secondary bg-stone-50'
                          : 'border-outline-variant hover:border-secondary'
                      }`}
                    >
                      <div className="flex gap-2 mb-2">
                        {theme.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-lg"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="font-medium text-on-surface text-sm">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-on-surface mb-4">Font Style</h3>
                <div className="grid grid-cols-2 gap-4">
                  {FONT_STYLES.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => updateTheme('fontStyle', font.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.theme.fontStyle === font.id
                          ? 'border-secondary bg-stone-50'
                          : 'border-outline-variant hover:border-secondary'
                      }`}
                    >
                      <p
                        className={`text-2xl font-bold text-on-surface mb-2 ${
                          font.id === 'serif' ? 'font-serif' : 'font-sans'
                        }`}
                      >
                        Aa
                      </p>
                      <p className="text-sm text-on-surface">{font.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Publish Section */}
            <section
              ref={(el) => {
                if (el) sectionRefs.current['publish'] = el;
              }}
              id="publish"
              className="mb-12"
            >
              <h2 className="heading-3 text-on-surface mb-6">✦ Publish</h2>

              <div className="card-base p-6 mb-6">
                <div className="mb-6">
                  <label className="text-sm font-semibold text-on-surface">Website Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value.toLowerCase())}
                    className="input-field w-full"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">
                    Website URL will be: /weddings/{formData.slug || 'your-story-slug'}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-on-surface">Make this story public?</p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.isPublic ? 'Story is published' : 'Story is private (draft)'}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => updateField('isPublic', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </label>
                </div>

                <div className="mt-6 p-4 bg-surface-container rounded-lg">
                  <p className="text-sm font-semibold text-on-surface mb-3">Story Summary</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-on-surface-variant">Photos</p>
                      <p className="font-bold text-on-surface">
                        {Object.values(formData.photos).filter(Boolean).length} / 4
                      </p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant">Ceremonies</p>
                      <p className="font-bold text-on-surface">
                        {formData.ceremonies.filter((c) => c.enabled).length} / 4
                      </p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant">Gallery Photos</p>
                      <p className="font-bold text-on-surface">
                        {formData.galleryAlbums.reduce((sum, a) => sum + a.photos.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="pb-20" />
          </div>
        </main>
      </div>
    </div>
  );
}
