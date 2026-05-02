'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event, Contact } from '@/lib/validation';

interface WeddingFormData {
  slug: string;
  groomName: string;
  brideName: string;
  title: string;
  description: string;
  date: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  guestCount: number;
  events: Event[];
  contacts: Contact[];
  gallery: string[];
  coverImage?: string;
  isPublic: boolean;
}

const initialFormData: WeddingFormData = {
  slug: '',
  groomName: '',
  brideName: '',
  title: '',
  description: '',
  date: '',
  venue: {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  guestCount: 0,
  events: [],
  contacts: [],
  gallery: [],
  coverImage: undefined,
  isPublic: false,
};

export default function WeddingBuilder() {
  const router = useRouter();
  const [formData, setFormData] = useState<WeddingFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'venue' | 'events' | 'contacts' | 'gallery'>('basic');
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      venue: { ...prev.venue, [name]: value },
    }));
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [...prev.events, { name: '', type: 'ceremony', date: '', time: '' }],
    }));
  };

  const updateEvent = (index: number, field: keyof Event, value: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((event, i) =>
        i === index ? { ...event, [field]: value } : event
      ),
    }));
  };

  const removeEvent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', email: '', phone: '' }],
    }));
  };

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload images');
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...data.urls],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required venue fields
      const { name, address, city, state, zipCode, country } = formData.venue;
      if (!name || !address || !city || !state || !zipCode || !country) {
        setError('Please fill in all required venue fields');
        setLoading(false);
        setActiveTab('venue');
        return;
      }

      // Convert datetime-local to ISO 8601 format
      const dateObj = new Date(formData.date);
      const isoDate = dateObj.toISOString();

      // Format events - only include if they have required fields
      const formattedEvents = formData.events
        .filter((event) => event.name && event.date && event.time)
        .map((event) => ({
          ...event,
          date: new Date(`${event.date}T${event.time}`).toISOString(),
          time: event.time, // Keep HH:mm format for the time field
        }));

      const response = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug,
          groomName: formData.groomName,
          brideName: formData.brideName,
          title: formData.title,
          description: formData.description || undefined,
          date: isoDate,
          venue: formData.venue,
          coverImage: formData.coverImage || undefined,
          events: formattedEvents.length > 0 ? formattedEvents : undefined,
          contacts: formData.contacts.filter(c => c.name).length > 0 ? formData.contacts.filter(c => c.name) : undefined,
          gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
          guestCount: parseInt(formData.guestCount.toString()),
          isPublic: formData.isPublic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create wedding');
      }

      setSuccess('Wedding created successfully!');
      setTimeout(() => {
        router.push(`/dashboard/weddings/${data.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card-base">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-12 sm:px-8">
            <h1 className="text-3xl font-serif font-bold text-white">Create Your Wedding</h1>
            <p className="text-primary-container/90 mt-2 font-light">Build your perfect wedding page with all the details</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-outline-variant">
            <div className="flex flex-wrap sm:flex-nowrap">
              {(['basic', 'venue', 'events', 'contacts', 'gallery'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center transition font-label-caps ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
            )}

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-caps">
                      Groom Name *
                    </label>
                    <input
                      type="text"
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Enter groom's name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-caps">
                      Bride Name *
                    </label>
                    <input
                      type="text"
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Enter bride's name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label-caps">
                    Wedding Slug * <span className="text-on-surface-variant text-xs">(unique URL identifier)</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="john-sarah-2024"
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    required
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Letters, numbers, and hyphens only</p>
                </div>

                <div>
                  <label className="label-caps">
                    Wedding Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g., John & Sarah's Wedding"
                    required
                  />
                </div>

                <div>
                  <label className="label-caps">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleBasicChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Tell your love story..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-caps">
                      Wedding Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-caps">
                      Expected Guest Count
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleBasicChange}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-on-surface">Make wedding public</span>
                  </label>
                </div>
              </div>
            )}

            {/* Venue Tab */}
            {activeTab === 'venue' && (
              <div className="space-y-6">
                <div>
                  <label className="label-caps">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.venue.name}
                    onChange={handleVenueChange}
                    className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <label className="label-caps">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.venue.address}
                    onChange={handleVenueChange}
                    className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-caps">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.venue.city}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-caps">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.venue.state}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="State/Province"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-caps">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.venue.zipCode}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Zip code"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-caps">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.venue.country}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-on-surface">Wedding Events</h3>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity"
                  >
                    + Add Event
                  </button>
                </div>

                {formData.events.length === 0 ? (
                  <p className="text-center py-8 text-on-surface-variant">No events added yet</p>
                ) : (
                  <div className="space-y-4">
                    {formData.events.map((event, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="label-caps">
                              Event Name
                            </label>
                            <input
                              type="text"
                              value={event.name}
                              onChange={(e) => updateEvent(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="e.g., Ceremony"
                            />
                          </div>
                          <div>
                            <label className="label-caps">
                              Event Type
                            </label>
                            <select
                              value={event.type}
                              onChange={(e) => updateEvent(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option>ceremony</option>
                              <option>reception</option>
                              <option>dinner</option>
                              <option>party</option>
                              <option>custom</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="label-caps">
                              Date
                            </label>
                            <input
                              type="date"
                              value={event.date}
                              onChange={(e) => updateEvent(index, 'date', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="label-caps">
                              Time (HH:mm)
                            </label>
                            <input
                              type="time"
                              value={event.time}
                              onChange={(e) => updateEvent(index, 'time', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="label-caps">
                            Location
                          </label>
                          <input
                            type="text"
                            value={event.location || ''}
                            onChange={(e) => updateEvent(index, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Event location"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEvent(index)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove Event
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-on-surface">Contacts</h3>
                  <button
                    type="button"
                    onClick={addContact}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity"
                  >
                    + Add Contact
                  </button>
                </div>

                {formData.contacts.length === 0 ? (
                  <p className="text-center py-8 text-on-surface-variant">No contacts added yet</p>
                ) : (
                  <div className="space-y-4">
                    {formData.contacts.map((contact, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="label-caps">
                              Name
                            </label>
                            <input
                              type="text"
                              value={contact.name}
                              onChange={(e) => updateContact(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Contact name"
                            />
                          </div>
                          <div>
                            <label className="label-caps">
                              Relationship
                            </label>
                            <select
                              value={contact.relationship || ''}
                              onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="">Select...</option>
                              <option>groom</option>
                              <option>bride</option>
                              <option>family</option>
                              <option>friend</option>
                              <option>vendor</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="label-caps">
                              Email
                            </label>
                            <input
                              type="email"
                              value={contact.email || ''}
                              onChange={(e) => updateContact(index, 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="email@example.com"
                            />
                          </div>
                          <div>
                            <label className="label-caps">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={contact.phone || ''}
                              onChange={(e) => updateContact(index, 'phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="+1-555-0000"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove Contact
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                {/* Upload Guidelines */}
                <div className="bg-primary-container/20 border border-primary-container rounded-xl p-6">
                  <h3 className="heading-5 mb-4 text-on-surface">📸 Photo Upload Guide</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="font-medium text-on-surface mb-2">✓ Recommended Photos:</p>
                      <ul className="space-y-1 text-on-surface-variant">
                        <li>• Couple portrait (for cover)</li>
                        <li>• Ceremony moments</li>
                        <li>• Reception highlights</li>
                        <li>• Venue shots</li>
                        <li>• Detail shots (decorations)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface mb-2">📋 File Requirements:</p>
                      <ul className="space-y-1 text-on-surface-variant">
                        <li>• Format: JPG, PNG, WebP</li>
                        <li>• Size: 2-10 MB per image</li>
                        <li>• Recommended: 1200x800px+</li>
                        <li>• Min 4-6 photos for gallery</li>
                        <li>• 1 cover photo (landscape)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Cover Photo */}
                <div>
                  <label className="label-caps mb-4">Cover Photo (Hero Image)</label>
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData((prev) => ({
                              ...prev,
                              coverImage: event.target?.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      disabled={uploadingImages}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer block">
                      {formData.coverImage ? (
                        <div>
                          <img src={formData.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg mb-4" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData((prev) => ({ ...prev, coverImage: undefined }));
                            }}
                            className="text-sm text-error hover:text-error/80 font-medium"
                          >
                            Change Cover Photo
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-5xl mb-4">🎞️</p>
                          <p className="text-sm font-medium text-on-surface mb-2">
                            Select your best couple photo
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            This will be shown on your wedding page hero section
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Gallery Photos */}
                <div>
                  <label className="label-caps mb-4">Gallery Photos</label>
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label htmlFor="gallery-upload" className="cursor-pointer block">
                      <p className="text-5xl mb-4">📸</p>
                      <p className="text-sm font-medium text-on-surface mb-2">
                        {uploadingImages ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Add 4-10 photos to create a beautiful gallery
                      </p>
                    </label>
                  </div>
                </div>

                {/* Gallery Grid */}
                {formData.gallery.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-on-surface mb-4">
                      Gallery ({formData.gallery.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.gallery.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-2 right-2 bg-error text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    {formData.gallery.length < 4 && (
                      <p className="text-xs text-on-surface-variant mt-4">
                        💡 Tip: Upload at least 4 photos for a complete gallery
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg"
              >
                {loading ? 'Creating Wedding...' : 'Create Wedding'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
