'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SignupChoicePage() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-32 h-32 border-2 border-secondary-fixed rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 border-2 border-primary rounded-full" />
      </div>

      <div className="section-max px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="heading-2 mb-4 text-on-surface">Join ForeverStory</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Choose how you'd like to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div className="card-base p-12 flex flex-col text-center hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-6">💍</div>
            <h2 className="heading-5 mb-3 text-primary">Create Your Wedding</h2>
            <p className="text-on-surface-variant mb-8 flex-1">
              Design your perfect wedding website, manage RSVPs, and share your love story with guests.
            </p>
            <Link href="/auth/signup?role=customer" className="w-full">
              <Button variant="gold" size="lg" className="w-full">
                Sign Up as Customer
              </Button>
            </Link>
          </div>

          {/* Partner Card */}
          <div className="card-base p-12 flex flex-col text-center border-2 border-secondary-fixed hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-fixed text-on-secondary-fixed px-6 py-1 rounded-full text-[10px] font-label-caps tracking-widest uppercase">
              Earn Commissions
            </div>
            <div className="text-6xl mb-6">💰</div>
            <h2 className="heading-5 mb-3 text-secondary">Become a Partner</h2>
            <p className="text-on-surface-variant mb-8 flex-1">
              Help couples create their wedding websites and earn $5 + 15% commission per wedding. Plus earn from referrals!
            </p>
            <Link href="/auth/signup?role=partner" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                Sign Up as Partner
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
