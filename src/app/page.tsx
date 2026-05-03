'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState<'customer' | 'partner'>('customer');

  const packages = [
    {
      name: 'Legacy',
      price: '₹500',
      description: 'Perfect for simple, elegant weddings',
      features: [
        'Beautiful wedding website',
        'Basic photo gallery (50 photos)',
        'RSVP management',
        'Guest list export',
        'WhatsApp sharing',
        'Basic templates',
      ],
      examples: ['sarah-michael', 'emma-james', 'sophia-david'],
      tier: 'legacy',
      cta: 'Start with Legacy',
    },
    {
      name: 'Premium',
      price: '₹1,000',
      description: 'For weddings with rich media',
      features: [
        'Everything in Legacy',
        'Unlimited photo gallery',
        'Video uploads & playback',
        'Custom music playlist',
        'Timeline & events',
        'Premium templates',
        'Guest book feature',
        'Countdown timer',
      ],
      examples: ['sarah-michael', 'emma-james', 'sophia-david', 'olivia-chris-beach'],
      tier: 'premium',
      cta: 'Upgrade to Premium',
      badge: 'Most Popular',
    },
    {
      name: 'Platinum',
      price: '₹5,000+',
      description: 'Fully customized experience',
      features: [
        'Everything in Premium',
        'Custom domain name',
        'Dedicated support',
        'Custom color schemes',
        'Analytics & insights',
        'Priority design revisions',
        'Seating chart planner',
        'Gift registry integration',
        'Live streaming setup',
        'VIP guest management',
      ],
      examples: ['isabella-ryan-mountain', 'garden-wedding-2024'],
      tier: 'platinum',
      cta: 'Get Platinum',
    },
  ];

  const partnerBenefits = [
    {
      icon: '💰',
      title: 'Earn Commissions',
      desc: '$5 fixed + 15% of wedding price',
    },
    {
      icon: '🔗',
      title: 'Referral Earnings',
      desc: 'Earn from every customer you refer',
    },
    {
      icon: '📊',
      title: 'Earnings Dashboard',
      desc: 'Track all your commissions in real-time',
    },
    {
      icon: '👥',
      title: 'Manage Customers',
      desc: 'See all your referred customers',
    },
    {
      icon: '📈',
      title: 'Growth Potential',
      desc: 'Scale your earnings with more referrals',
    },
    {
      icon: '🎯',
      title: 'Partner Support',
      desc: 'Dedicated support & resources',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Story',
      desc: 'Sign up and choose your wedding template. Customize colors, fonts, and layout to match your style.',
      icon: '✦',
    },
    {
      number: '02',
      title: 'Share with Guests',
      desc: 'Send your unique wedding link to guests via WhatsApp, email, or social media. Track RSVPs in real-time.',
      icon: '📱',
    },
    {
      number: '03',
      title: 'Preserve Forever',
      desc: 'Upload photos, videos, and memories. Your wedding story is preserved as a digital heirloom forever.',
      icon: '💍',
    },
  ];

  return (
    <div className="bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/50 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="section-max px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif italic text-on-surface tracking-tight">
            ForeverStory
          </div>
          <div className="hidden md:flex items-center gap-12">
            <a href="#how-it-works" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface-variant hover:text-on-surface transition-colors">
              How It Works
            </a>
            <a href="#features" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </a>
            <a href="#packages" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface-variant hover:text-on-surface transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin?role=customer">
              <Button variant="outline" size="md" className="text-xs lg:text-sm py-2">
                Customer Login
              </Button>
            </Link>
            <Link href="/auth/signin?role=partner">
              <Button variant="outline" size="md" className="text-xs lg:text-sm py-2">
                Partner Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Role Toggle - Mobile */}
      <div className="fixed top-24 right-6 z-40 flex gap-2 bg-white rounded-full p-1 shadow-lg md:hidden">
        <button
          onClick={() => setActiveRole('customer')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeRole === 'customer'
              ? 'bg-primary text-white'
              : 'bg-transparent text-on-surface-variant'
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setActiveRole('partner')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeRole === 'partner'
              ? 'bg-primary text-white'
              : 'bg-transparent text-on-surface-variant'
          }`}
        >
          Partner
        </button>
      </div>

      {/* CUSTOMER VIEW */}
      {activeRole === 'customer' && (
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pb-32">
            <div className="section-max px-6 md:px-12">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className="flex flex-col gap-6 md:gap-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-on-surface leading-tight">
                    Every Love Story <span className="italic text-primary">Deserves</span> to Be Remembered
                  </h1>
                  <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                    Create stunning wedding websites, manage RSVPs, and preserve your most precious memories with ForeverStory. Where romance meets elegance.
                  </p>
                  <div className="flex gap-4 flex-wrap pt-2">
                    <Link href="/auth/signup-choice">
                      <Button variant="gold" size="lg" className="text-sm lg:text-base">
                        Create Your Story
                      </Button>
                    </Link>
                    <a href="#how-it-works">
                      <Button variant="outline" size="lg" className="text-sm lg:text-base">
                        Learn More
                      </Button>
                    </a>
                  </div>

                  {/* Social Proof */}
                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-primary/20 flex gap-8 md:gap-12">
                    <div>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-primary">2,500+</p>
                      <p className="text-xs md:text-sm text-on-surface-variant">Couples</p>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-primary">50K+</p>
                      <p className="text-xs md:text-sm text-on-surface-variant">Stories</p>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-primary">500K+</p>
                      <p className="text-xs md:text-sm text-on-surface-variant">Guests</p>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative hidden md:block">
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary-container to-primary overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=750&fit=crop"
                      alt="Couple"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="glass-card absolute -bottom-12 -right-8 w-72 p-6">
                    <p className="text-sm text-on-surface-variant mb-3">
                      "ForeverStory made our wedding planning beautifully simple."
                    </p>
                    <p className="font-serif font-bold text-on-surface text-sm">Sarah & Michael</p>
                    <p className="text-xs text-on-surface-variant">June 15, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-on-surface text-surface">
            <div className="section-max px-6 md:px-12">
              <div className="text-center mb-12 md:mb-16 lg:mb-20">
                <p className="text-xs uppercase tracking-widest text-surface/80 mb-3 md:mb-4">Simple Process</p>
                <h2 className="text-4xl md:text-5xl font-serif mb-4 md:mb-6">How It Works</h2>
                <p className="text-lg text-surface/90 max-w-2xl mx-auto">
                  Create your wedding website in three simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
                {steps.map((step, idx) => (
                  <div key={step.number} className="relative">
                    <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold opacity-10 mb-4">
                      {step.number}
                    </div>
                    <div className="mb-4">
                      <div className="text-4xl mb-4">{step.icon}</div>
                      <h3 className="text-xl md:text-2xl font-serif mb-3">{step.title}</h3>
                    </div>
                    <p className="text-base text-surface/90 leading-relaxed mb-6">
                      {step.desc}
                    </p>
                    {idx < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-6 top-20 w-12 h-px bg-surface/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-16 md:py-24 lg:py-32 bg-surface-container-low">
            <div className="section-max px-6 md:px-12">
              <div className="text-center mb-12 md:mb-16 lg:mb-20">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3 md:mb-4">Our Features</p>
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-4 md:mb-6">Everything You Need</h2>
                <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                  Everything for your perfect wedding website and guest management
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: '💍', title: 'Stunning Websites', desc: 'Beautiful pages', color: 'from-pink-100 to-pink-50' },
                  { icon: '📸', title: 'Photo Gallery', desc: 'Share memories', color: 'from-blue-100 to-blue-50' },
                  { icon: '🗺️', title: 'Venue Directions', desc: 'Travel info', color: 'from-green-100 to-green-50' },
                  {
                    icon: <FaWhatsapp size={24} color="#25D366" />,
                    title: 'WhatsApp Share',
                    desc: 'Quick messages',
                    color: 'from-green-100 to-green-50'
                  },
                  { icon: '🔗', title: 'Custom URL', desc: 'Unique website', color: 'from-purple-100 to-purple-50' },
                  { icon: '⏱️', title: 'Countdown Timer', desc: 'Exciting days', color: 'from-yellow-100 to-yellow-50' },
                  {
                    icon: <FaWhatsapp size={24} color="#25D366" />,
                    title: 'Broadcast Invites',
                    desc: 'Send quickly',
                    color: 'from-green-100 to-green-50'
                  },
                  { icon: '✅', title: 'RSVP Tracking', desc: 'Guest responses', color: 'from-emerald-100 to-emerald-50' },
                ].map((feature) => (
                  <div key={feature.title} className="group">
                    <div className={`bg-gradient-to-br ${feature.color} rounded-3xl p-5 md:p-6 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border border-white/60 shadow-sm`}>
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-white">
                        {typeof feature.icon === 'string' ? (
                          <span className="text-2xl">{feature.icon}</span>
                        ) : (
                          feature.icon
                        )}
                      </div>
                      <h3 className="text-base font-serif text-on-surface mb-1.5">{feature.title}</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="packages" className="py-16 md:py-24 lg:py-32 bg-surface">
            <div className="section-max px-6 md:px-12">
              <div className="text-center mb-12 md:mb-16 lg:mb-20">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3 md:mb-4">Choose Your Plan</p>
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-4 md:mb-6">Simple, Transparent Pricing</h2>
                <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                  Select the perfect package for your wedding needs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`card-base p-8 md:p-10 flex flex-col transition-all hover:shadow-xl ${
                      pkg.badge ? 'border-2 border-secondary relative' : ''
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase">
                        {pkg.badge}
                      </div>
                    )}
                    <h3 className={`text-2xl font-serif mb-2 ${pkg.badge ? 'text-secondary' : 'text-primary'}`}>
                      {pkg.name}
                    </h3>
                    <p className="text-3xl lg:text-4xl font-serif font-bold text-on-surface mb-1">{pkg.price}</p>
                    <p className="text-sm text-on-surface-variant mb-6">{pkg.description}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <span className="text-secondary mt-1 font-bold">✓</span>
                          <span className="text-on-surface">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup-choice" className="w-full">
                      <Button
                        variant={pkg.badge ? 'gold' : 'outline'}
                        size="lg"
                        className="w-full text-sm"
                      >
                        {pkg.cta}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-24 lg:py-32 bg-surface relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-20 w-32 h-32 border-2 border-secondary rounded-full" />
              <div className="absolute bottom-20 left-10 w-48 h-48 border-2 border-primary rounded-full" />
            </div>

            <div className="section-max px-6 md:px-12 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-4 md:mb-6">Ready to Remember?</h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 md:mb-12">
                Start building your ForeverStory today and create a digital heirloom that lasts forever.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/auth/signup-choice">
                  <Button variant="gold" size="lg" className="text-sm lg:text-base">
                    Create Your Story
                  </Button>
                </Link>
                <a href="#packages">
                  <Button variant="outline" size="lg" className="text-sm lg:text-base">
                    View Pricing
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </>
      )}

      {/* PARTNER VIEW */}
      {activeRole === 'partner' && (
        <>
          {/* Partner Hero */}
          <section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pb-32">
            <div className="section-max px-6 md:px-12">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className="flex flex-col gap-6 md:gap-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-on-surface leading-tight">
                    Earn While You <span className="italic text-secondary">Build</span> Love Stories
                  </h1>
                  <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                    Join ForeverStory as a partner and earn commissions creating wedding websites for customers. Earn $5 fixed + 15% of every wedding price, plus 15% from referrals!
                  </p>
                  <div className="flex gap-4 flex-wrap pt-2">
                    <Link href="/auth/signup-choice">
                      <Button variant="gold" size="lg" className="text-sm lg:text-base">
                        Become a Partner
                      </Button>
                    </Link>
                    <a href="#partner-benefits">
                      <Button variant="outline" size="lg" className="text-sm lg:text-base">
                        Learn More
                      </Button>
                    </a>
                  </div>

                  {/* Partner Stats */}
                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-secondary/20 flex gap-8 md:gap-12">
                    <div>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-secondary">₹2-4K</p>
                      <p className="text-xs md:text-sm text-on-surface-variant">Monthly Earnings</p>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-secondary">100+</p>
                      <p className="text-xs md:text-sm text-on-surface-variant">Active Partners</p>
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-secondary">15%</p>
                      <p className="text-xs md:text-sm text-on-surface-variant">Commission Rate</p>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative hidden md:block">
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-secondary-container to-secondary overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=750&fit=crop"
                      alt="Partner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="glass-card absolute -bottom-12 -right-8 w-72 p-6">
                    <p className="text-sm text-on-surface-variant mb-3">
                      "I've earned over ₹50,000 in commissions in just 4 months!"
                    </p>
                    <p className="font-serif font-bold text-on-surface text-sm">Raj - Event Coordinator</p>
                    <p className="text-xs text-on-surface-variant">Partner since March 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partner Benefits */}
          <section id="partner-benefits" className="py-16 md:py-24 lg:py-32 bg-surface-container-low">
            <div className="section-max px-6 md:px-12">
              <div className="text-center mb-12 md:mb-16 lg:mb-20">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3 md:mb-4">Why Partner With Us</p>
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-4 md:mb-6">Unlimited Earning Potential</h2>
                <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                  Build wealth while helping couples create their dream wedding websites
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                {partnerBenefits.map((benefit) => (
                  <div key={benefit.title} className="group text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-container transition-colors duration-500">
                      <span className="text-3xl">{benefit.icon}</span>
                    </div>
                    <h3 className="text-lg font-serif text-on-surface mb-2">{benefit.title}</h3>
                    <p className="text-sm text-on-surface-variant">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Commission Structure */}
          <section className="py-16 md:py-24 lg:py-32 bg-surface">
            <div className="section-max px-6 md:px-12">
              <div className="text-center mb-12 md:mb-16 lg:mb-20">
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-4 md:mb-6">How You Earn</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
                <div className="card-base p-8 md:p-10 bg-blue-50 border-l-4 border-blue-500">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-serif mb-4 text-blue-900">Direct Commission</h3>
                  <p className="text-blue-800 mb-6 text-sm">
                    When you create a wedding for a customer:
                  </p>
                  <div className="space-y-3 text-blue-800 text-sm">
                    <div className="flex gap-3">
                      <span className="font-bold">$5</span>
                      <span>Fixed amount</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold">+ 15%</span>
                      <span>Of the wedding price</span>
                    </div>
                    <div className="border-t border-blue-200 pt-3 mt-3">
                      <p className="font-bold">Example: $1,000 wedding = $5 + $150 = $155</p>
                    </div>
                  </div>
                </div>

                <div className="card-base p-8 md:p-10 bg-green-50 border-l-4 border-green-500">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="text-xl font-serif mb-4 text-green-900">Referral Commission</h3>
                  <p className="text-green-800 mb-6 text-sm">
                    When a customer you referred creates a wedding:
                  </p>
                  <div className="space-y-3 text-green-800 text-sm">
                    <div className="flex gap-3">
                      <span className="font-bold">$5</span>
                      <span>Fixed amount</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold">+ 15%</span>
                      <span>Of each their wedding</span>
                    </div>
                    <div className="border-t border-green-200 pt-3 mt-3">
                      <p className="font-bold">Unlimited earnings from referrals!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partner CTA */}
          <section className="py-16 md:py-24 lg:py-32 bg-primary-container relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-20 w-32 h-32 border-2 border-primary rounded-full" />
              <div className="absolute bottom-20 left-10 w-48 h-48 border-2 border-secondary rounded-full" />
            </div>

            <div className="section-max px-6 md:px-12 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4 md:mb-6">Ready to Start Earning?</h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 md:mb-12">
                Join hundreds of partners earning steady income by helping couples create beautiful wedding websites.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/auth/signup-choice">
                  <Button variant="gold" size="lg" className="text-sm lg:text-base">
                    Become a Partner Today
                  </Button>
                </Link>
                <a href="#partner-benefits">
                  <Button variant="outline" size="lg" className="text-sm lg:text-base">
                    View Benefits
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 py-8 md:py-12">
        <div className="section-max px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <div className="text-xl font-serif italic text-on-surface">ForeverStory</div>
            <div className="flex gap-6 md:gap-8 text-sm text-on-surface-variant">
              <a href="#" className="hover:text-on-surface transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-on-surface transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-on-surface transition-colors">
                Contact
              </a>
            </div>
            <p className="text-xs md:text-sm text-on-surface-variant">© 2024 ForeverStory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
