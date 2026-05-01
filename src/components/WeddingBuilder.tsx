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
  budget: string;
  events: Event[];
  contacts: Contact[];
  gallery: string[];
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
  budget: '',
  events: [],
  contacts: [],
  gallery: [],
  isPublic: false,
};

export default function WeddingBuilder() {
  const router = useRouter();
  const [formData, setFormData] = useState<WeddingFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'venue' | 'events' | 'contacts'>('basic');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          guestCount: parseInt(formData.guestCount.toString()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create wedding');
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 sm:px-8">
            <h1 className="text-3xl font-bold text-white">Create Your Wedding</h1>
            <p className="text-blue-100 mt-2">Build your perfect wedding page with all the details</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap sm:flex-nowrap">
              {(['basic', 'venue', 'events', 'contacts'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center transition ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
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
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>
            )}

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Groom Name *
                    </label>
                    <input
                      type="text"
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter groom's name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bride Name *
                    </label>
                    <input
                      type="text"
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bride's name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wedding Slug * <span className="text-gray-500 text-xs">(unique URL identifier)</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john-sarah-2024"
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Letters, numbers, and hyphens only</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wedding Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John & Sarah's Wedding"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleBasicChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell your love story..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wedding Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Guest Count
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="100"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleBasicChange}
                        className="w-4 h-4 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Make wedding public</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Venue Tab */}
            {activeTab === 'venue' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.venue.name}
                    onChange={handleVenueChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.venue.address}
                    onChange={handleVenueChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.venue.city}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.venue.state}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State/Province"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.venue.zipCode}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Zip code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.venue.country}
                      onChange={handleVenueChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <h3 className="text-lg font-semibold text-gray-900">Wedding Events</h3>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="btn btn-primary text-sm"
                  >
                    + Add Event
                  </button>
                </div>

                {formData.events.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No events added yet</p>
                ) : (
                  <div className="space-y-4">
                    {formData.events.map((event, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
                  <button
                    type="button"
                    onClick={addContact}
                    className="btn btn-primary text-sm"
                  >
                    + Add Contact
                  </button>
                </div>

                {formData.contacts.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No contacts added yet</p>
                ) : (
                  <div className="space-y-4">
                    {formData.contacts.map((contact, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Gallery Placeholder */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gallery Upload</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload your wedding photos here (coming soon)
              </p>
              <div className="text-center py-8 bg-white rounded-lg border border-gray-300">
                <p className="text-gray-500 text-sm">Gallery upload feature coming soon</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3"
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
