'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPartner = role === 'partner';
  const callbackUrl = isPartner ? '/partner/dashboard' : '/weddings/new';

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

  if (isPartner) {
    return (
      <main className="min-h-screen bg-surface flex flex-col lg:flex-row">
        {/* Left Side - Hero Section */}
        <div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-8 xl:p-12"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&h=1200&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-secondary/70"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-5 py-1.5 mb-6 border border-white/30">
              <span className="text-xs font-semibold tracking-widest uppercase">Partner Program</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif text-white mb-4 leading-tight">
              Grow Your <span className="italic">Earnings</span>
            </h2>
            <p className="text-base text-white/90 max-w-sm leading-relaxed">
              Join our partner network and earn substantial commissions while helping couples create their perfect wedding stories.
            </p>
          </div>

          {/* Bottom Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl lg:text-3xl font-serif font-bold text-white mb-1">₹50K+</p>
              <p className="text-xs text-white/80">Top earners</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-serif font-bold text-white mb-1">15%</p>
              <p className="text-xs text-white/80">Commission</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-serif font-bold text-white mb-1">500+</p>
              <p className="text-xs text-white/80">Partners</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 lg:px-8 lg:py-0 min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden">
          <div className="w-full max-w-sm my-auto py-6 lg:py-0">
            {/* Header */}
            <div className="mb-4 lg:mb-8">
              <Link href="/" className="inline-block mb-3 lg:mb-4">
                <div className="text-2xl lg:text-3xl font-serif italic text-primary">ForeverStory</div>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-serif text-on-surface mb-1">Welcome Back</h1>
              <p className="text-xs lg:text-base text-on-surface-variant">Partner Login</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs lg:text-sm animate-pulse">
                <p className="font-medium mb-0.5">Sign in failed</p>
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 mb-4 lg:mb-8">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                  required
                  className="w-full px-0 py-2 border-0 border-b-2 border-outline-variant bg-transparent focus:border-primary focus:outline-none transition-all duration-300 text-sm lg:text-base text-on-surface placeholder-on-surface-variant/50"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-0 py-2 border-0 border-b-2 border-outline-variant bg-transparent focus:border-primary focus:outline-none transition-all duration-300 text-sm lg:text-base text-on-surface placeholder-on-surface-variant/50"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <Link href="/auth/forgot-password" className="text-xs lg:text-sm text-primary hover:text-primary-container transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                variant="gold"
                size="lg"
                type="submit"
                disabled={loading}
                className="w-full mt-4 lg:mt-6 shadow-lg hover:shadow-xl transition-all text-xs lg:text-base py-2.5 lg:py-3"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Signing in...
                  </>
                ) : (
                  'Sign In as Partner'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-4 lg:my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant/50" />
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">OR</span>
              <div className="flex-1 h-px bg-outline-variant/50" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-all duration-300 flex items-center justify-center gap-2 font-medium text-xs lg:text-sm text-on-surface group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs lg:text-sm text-on-surface-variant mt-3 lg:mt-4">
              Don't have a partner account?{' '}
              <Link href="/auth/signup?role=partner" className="text-secondary font-semibold hover:text-secondary-container transition-colors">
                Apply to join
              </Link>
            </p>

            {/* Switch to Customer */}
            <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-outline-variant/50 text-center">
              <p className="text-xs lg:text-sm text-on-surface-variant mb-2">
                Looking to create a wedding story?
              </p>
              <Link href="/auth/signin?role=customer">
                <Button variant="outline" size="md" className="w-full text-xs lg:text-sm py-2">
                  Sign in as Customer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Customer Version
  return (
    <main className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-8 xl:p-12"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&h=1200&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/95 via-primary/85 to-secondary/70"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-12 left-8 text-4xl opacity-10 font-serif">💍</div>
        <div className="absolute bottom-20 right-12 text-5xl opacity-10 font-serif">✦</div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-5 py-1.5 mb-6 border border-white/30">
            <span className="text-xs font-semibold tracking-widest uppercase">Your Love Story</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif text-white mb-4 leading-tight">
            Capture Your <span className="italic">Forever</span>
          </h2>
          <p className="text-base text-white/90 max-w-sm leading-relaxed">
            Create a beautiful wedding website, share your story with guests, and preserve your most precious memories all in one elegant platform.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 lg:px-8 lg:py-0 min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-sm my-auto py-6 lg:py-0">
          {/* Header */}
          <div className="mb-4 lg:mb-8">
            <Link href="/" className="inline-block mb-3 lg:mb-4">
              <div className="text-2xl lg:text-3xl font-serif italic text-primary">ForeverStory</div>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-serif text-on-surface mb-1">Welcome Back</h1>
            <p className="text-xs lg:text-base text-on-surface-variant">Sign in to your wedding story</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs lg:text-sm animate-pulse">
              <p className="font-medium mb-0.5">Sign in failed</p>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 mb-4 lg:mb-8">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-0 py-2 border-0 border-b-2 border-outline-variant bg-transparent focus:border-primary focus:outline-none transition-all duration-300 text-sm lg:text-base text-on-surface placeholder-on-surface-variant/50"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-0 py-2 border-0 border-b-2 border-outline-variant bg-transparent focus:border-primary focus:outline-none transition-all duration-300 text-sm lg:text-base text-on-surface placeholder-on-surface-variant/50"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <Link href="/auth/forgot-password" className="text-xs lg:text-sm text-primary hover:text-primary-container transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              variant="gold"
              size="lg"
              type="submit"
              disabled={loading}
              className="w-full mt-4 lg:mt-6 shadow-lg hover:shadow-xl transition-all text-xs lg:text-base py-2.5 lg:py-3"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-4 lg:my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant/50" />
            <span className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">OR</span>
            <div className="flex-1 h-px bg-outline-variant/50" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-all duration-300 flex items-center justify-center gap-2 font-medium text-xs lg:text-sm text-on-surface group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-xs lg:text-sm text-on-surface-variant mt-3 lg:mt-4">
            Don't have an account?{' '}
            <Link href="/auth/signup-choice" className="text-primary font-semibold hover:text-primary-container transition-colors">
              Create one free
            </Link>
          </p>

          {/* Switch to Partner */}
          <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-outline-variant/50 text-center">
            <p className="text-xs lg:text-sm text-on-surface-variant mb-2">
              Are you a wedding partner?
            </p>
            <Link href="/auth/signin?role=partner">
              <Button variant="outline" size="md" className="w-full text-xs lg:text-sm py-2">
                Sign in as Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
