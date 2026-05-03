'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'partner' | 'admin';
  totalEarnings?: number;
  createdAt: string;
}

export default function UserEditForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [role, setRole] = useState<'customer' | 'partner' | 'admin'>(user.role);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role }),
      });

      if (res.ok) {
        setMessage('User updated successfully');
        setTimeout(() => router.push('/admin/users'), 2000);
      } else {
        setMessage('Error updating user');
      }
    } catch (error) {
      setMessage('Error updating user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' });
        if (res.ok) {
          setMessage('User deleted successfully');
          setTimeout(() => router.push('/admin/users'), 2000);
        } else {
          setMessage('Error deleting user');
        }
      } catch (error) {
        setMessage('Error deleting user');
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
          <label className="label-caps">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="label-caps">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="label-caps">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="label-caps">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'customer' | 'partner' | 'admin')}
            className="input-field w-full"
          >
            <option value="customer">Customer</option>
            <option value="partner">Partner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {user.role === 'partner' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Total Earnings:</strong> ${(user.totalEarnings || 0).toFixed(2)}
            </p>
          </div>
        )}

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
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}
