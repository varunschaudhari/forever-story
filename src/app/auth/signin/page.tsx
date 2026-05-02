'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || 'Invalid email or password');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center overflow-hidden relative">
      {/* Ambient decoration */}
      <div className="fixed bottom-0 right-0 pointer-events-none hidden lg:block">
        <div className="text-[180px] text-stone-900 opacity-5">✨</div>
      </div>

      <div className="w-full flex min-h-screen">
        {/* Left Panel - Hero Image */}
        <div className="hidden lg:flex lg:w-3/5 flex-col items-center justify-center bg-gradient-to-br from-secondary via-primary-container to-primary-container overflow-hidden relative p-12">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="text-white drop-shadow-lg">
              <p className="text-4xl mb-6">💕</p>
              <h2 className="text-4xl font-serif font-normal mb-4">Welcome Back</h2>
              <p className="text-lg font-light opacity-90 max-w-sm">
                Sign in to continue building your beautiful wedding story
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-24">
          <div className="w-full max-w-md">
            {/* Brand */}
            <Link href="/" className="text-3xl font-serif italic text-primary block mb-12 text-center">
              ForeverStory
            </Link>

            {/* Header */}
            <h1 className="heading-4 text-center mb-2 text-on-surface">Start Your Wedding Story</h1>
            <p className="text-center text-on-surface-variant mb-8">Access your wedding story</p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-caps">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="form-input-minimal"
                />
              </div>

              <div>
                <label className="label-caps">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="form-input-minimal"
                />
              </div>

              <a href="#" className="text-sm text-primary hover:underline block text-right">
                Forgot Password?
              </a>

              <Button
                type="submit"
                variant="gold"
                size="form"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-sm text-on-surface-variant font-label-caps tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full border border-outline-variant bg-white text-on-surface py-4 rounded-xl uppercase tracking-widest font-semibold text-xs hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>

            {/* Footer */}
            <p className="mt-8 text-center text-on-surface-variant text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
