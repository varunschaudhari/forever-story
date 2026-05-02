'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PrivacySettings {
  isProfilePublic: boolean;
  allowViewWeddingStories: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    isProfilePublic: true,
    allowViewWeddingStories: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    // Load user settings from session or API
    if (session?.user) {
      // For now, use defaults. In a real app, fetch from /api/user/settings
      setPrivacySettings({
        isProfilePublic: true,
        allowViewWeddingStories: true,
      });
    }
  }, [session]);

  const handlePrivacyChange = (field: keyof PrivacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setIsSaved(false);
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacySettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully!');
      setIsSaved(true);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 lg:p-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="heading-2 mb-2">Settings</h1>
        <p className="text-lg text-on-surface-variant">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 sticky top-8">
            {[
              { label: 'Account', href: '#account', icon: '👤' },
              { label: 'Privacy', href: '#privacy', icon: '🔒' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-primary-container hover:text-primary rounded-lg transition-all duration-200 group"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium group-hover:text-primary">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Settings */}
          <div id="account" className="card-base p-8">
            <h2 className="heading-4 mb-8">Account Information</h2>
            <form className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                defaultValue={session?.user?.name || ''}
                disabled
              />
              <Input
                label="Email Address"
                type="email"
                defaultValue={session?.user?.email || ''}
                disabled
              />
              <p className="text-sm text-on-surface-variant">
                Contact support to change your account details
              </p>
            </form>
          </div>

          {/* Privacy Settings */}
          <div id="privacy" className="card-base p-8">
            <h2 className="heading-4 mb-2">Privacy & Sharing</h2>
            <p className="text-sm text-on-surface-variant mb-8">
              Control who can see your profile and wedding stories
            </p>

            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={privacySettings.isProfilePublic}
                  onChange={() => handlePrivacyChange('isProfilePublic')}
                  className="w-5 h-5 mt-1 rounded border-2 border-primary text-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium text-on-surface group-hover:text-primary transition-colors">
                    Make my profile public
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Others can discover your wedding stories and profile
                  </p>
                </div>
              </label>

              <div className="h-px bg-outline-variant" />

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={privacySettings.allowViewWeddingStories}
                  onChange={() => handlePrivacyChange('allowViewWeddingStories')}
                  className="w-5 h-5 mt-1 rounded border-2 border-primary text-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium text-on-surface group-hover:text-primary transition-colors">
                    Allow others to view my wedding stories
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Guests can see your wedding pages and RSVPs
                  </p>
                </div>
              </label>

              {!isSaved && (
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="gold"
                    size="md"
                    onClick={handleSave}
                    disabled={loading}
                    className="font-label-caps text-xs"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setPrivacySettings({
                        isProfilePublic: true,
                        allowViewWeddingStories: true,
                      });
                      setIsSaved(true);
                    }}
                    disabled={loading}
                    className="font-label-caps text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-l-4 border-error bg-error/5 p-8 rounded-lg">
            <h2 className="heading-4 mb-4 text-error">Danger Zone</h2>
            <p className="text-on-surface-variant mb-6">
              Deleting your account is permanent and cannot be undone. All your stories and data will be
              lost.
            </p>
            <Button
              variant="outline"
              className="border-error text-error hover:bg-error/10"
              disabled
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
