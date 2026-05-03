'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') || 'customer') as 'customer' | 'partner';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      setSuccess('Account created successfully! Redirecting to sign in...');

      setTimeout(() => {
        router.push('/auth/signin');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center overflow-hidden">
      <div className="w-full flex min-h-screen">
        {/* Left Panel - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-end justify-end overflow-hidden relative p-12">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10 text-white text-center w-full">
            <p className="text-4xl mb-6">✨</p>
            <h2 className="text-4xl font-serif font-normal mb-4">Your Love Awaits</h2>
            <p className="text-lg font-light opacity-90 italic max-w-sm mx-auto">
              "Every couple deserves a legacy that breathes as beautifully as the day it began."
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-6 lg:px-8 lg:py-0 min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden">
          <div className="w-full max-w-md my-auto py-6 lg:py-0">
            {/* Brand */}
            <Link href="/" className="text-3xl font-serif italic text-primary block mb-6 lg:mb-8 text-center lg:text-left">
              ForeverStory
            </Link>

            {/* Header */}
            <h1 className="text-2xl lg:text-3xl font-serif text-on-surface mb-1 text-center lg:text-left">Create Account</h1>
            <p className="text-xs lg:text-sm text-on-surface-variant mb-4 lg:mb-6 text-center lg:text-left">
              {role === 'partner' ? 'Start earning commissions' : 'Begin your wedding story'}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs lg:text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-3 p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs lg:text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
              <div>
                <label className="label-caps text-xs">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                  className="form-input-minimal text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="label-caps text-xs">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="form-input-minimal text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="label-caps text-xs">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="form-input-minimal text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="label-caps text-xs">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="form-input-minimal text-sm lg:text-base"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="form"
                disabled={loading}
                className="w-full mt-4 lg:mt-5 py-2.5 lg:py-3"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-4 lg:my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-xs text-on-surface-variant font-label-caps tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/weddings/new' })}
              className="w-full border border-outline-variant bg-white text-on-surface py-2.5 rounded-lg uppercase tracking-widest font-semibold text-xs hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign Up with Google
            </button>

            {/* Footer */}
            <p className="mt-3 lg:mt-4 text-center text-on-surface-variant text-xs lg:text-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
