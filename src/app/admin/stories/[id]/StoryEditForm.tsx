'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Story {
  _id: string;
  title: string;
  description: string;
  isPublic: boolean;
}

export default function StoryEditForm({ story }: { story: Story }) {
  const router = useRouter();
  const [title, setTitle] = useState(story.title || '');
  const [description, setDescription] = useState(story.description || '');
  const [isPublic, setIsPublic] = useState(story.isPublic || false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/stories/${story._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, isPublic }),
      });

      if (res.ok) {
        setMessage('Story updated successfully');
        setTimeout(() => router.push('/admin/stories'), 2000);
      } else {
        setMessage('Error updating story');
      }
    } catch (error) {
      setMessage('Error updating story');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/admin/stories/${story._id}`, { method: 'DELETE' });
        if (res.ok) {
          setMessage('Story deleted successfully');
          setTimeout(() => router.push('/admin/stories'), 2000);
        } else {
          setMessage('Error deleting story');
        }
      } catch (error) {
        setMessage('Error deleting story');
      }
    }
  };

  return (
    <div>
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="card-base p-8 space-y-6">
        <div>
          <label className="label-caps">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="label-caps">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field w-full min-h-32"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-on-surface">
            Published (visible to public)
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            variant="gold"
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDelete}
          >
            Delete Story
          </Button>
        </div>
      </div>
    </div>
  );
}
