'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/50 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="section-max px-6 md:px-12 h-24 flex items-center justify-between">
          <div className="text-2xl font-serif italic text-on-surface tracking-tight">
            ForeverStory
          </div>
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </a>
            <a href="#pricing" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface-variant hover:text-on-surface transition-colors">
              Pricing
            </a>
            <a href="/auth/signin" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface-variant hover:text-on-surface transition-colors">
              Sign In
            </a>
          </div>
          {/* <Link href="/auth/signup">
            <Button variant="gold" size="pill">
              Start Free
            </Button>
          </Link> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pb-32">
        <div className="section-max px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              <h1 className="heading-1 text-primary">
                Every Love Story <span className="italic text-gradient">Deserves to Be</span> Remembered
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
                Create stunning wedding websites, manage RSVPs, and preserve your most precious memories with ForeverStory. Where romance meets elegance.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/auth/signup">
                  <Button variant="gold" size="lg">
                    Create Your Story
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  See Examples
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-8 border-t border-primary/20 flex gap-12">
                <div>
                  <p className="text-3xl font-serif font-bold text-primary">2,500+</p>
                  <p className="text-sm text-on-surface-variant">Couples</p>
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-primary">50K+</p>
                  <p className="text-sm text-on-surface-variant">Stories</p>
                </div>
                <div>
                  <p className="text-3xl font-serif font-bold text-primary">500K+</p>
                  <p className="text-sm text-on-surface-variant">Guests</p>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative hidden md:block">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary-container to-primary overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=750&fit=crop"
                  alt="Couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Glass Card Overlay */}
              <div className="glass-card absolute -bottom-12 -right-8 w-72 p-8">
                <p className="text-sm text-on-surface-variant mb-4">
                  "ForeverStory made our wedding planning so beautifully simple."
                </p>
                <p className="font-serif font-bold text-on-surface">Sarah & Michael</p>
                <p className="text-xs text-on-surface-variant">June 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-surface-container-low">
        <div className="section-max px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-sm uppercase tracking-widest text-on-surface-variant mb-4">Our Features</p>
            <h2 className="heading-2 mb-6">Everything You Need</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Everything for your perfect wedding website and guest management
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-12">
            {[
              { icon: '💍', title: 'Stunning Websites', desc: 'Beautiful, mobile-responsive wedding pages' },
              { icon: '📸', title: 'Photo Gallery', desc: 'Share memories with your guests' },
              { icon: '🗺️', title: 'Google Maps', desc: 'Open venue location on Google Maps' },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.069.4-2.824 1.158-.755.759-1.171 1.777-1.171 2.833 0 1.062.415 2.083 1.172 2.844.755.758 1.77 1.17 2.826 1.17 1.056 0 2.072-.412 2.828-1.16.753-.754 1.169-1.774 1.169-2.855 0-1.062-.415-2.08-1.171-2.837-.756-.76-1.772-1.153-2.827-1.153M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Z" fill="#25D366"/>
                  </svg>
                ),
                title: 'WhatsApp Share',
                desc: 'Share with pre-filled messages'
              },
              { icon: '🔗', title: 'Custom URL', desc: 'varunwedspriya.foreverstory.in' },
              { icon: '⏱️', title: 'Countdown Timer', desc: 'Days left until wedding' },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.069.4-2.824 1.158-.755.759-1.171 1.777-1.171 2.833 0 1.062.415 2.083 1.172 2.844.755.758 1.77 1.17 2.826 1.17 1.056 0 2.072-.412 2.828-1.16.753-.754 1.169-1.774 1.169-2.855 0-1.062-.415-2.08-1.171-2.837-.756-.76-1.772-1.153-2.827-1.153M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Z" fill="#25D366"/>
                  </svg>
                ),
                title: 'WhatsApp Broadcast',
                desc: 'One-click invite broadcast'
              },
              { icon: '🏨', title: 'Travel Info', desc: 'Hotels, parking & directions' },
            ].map((feature) => (
              <div key={feature.title} className="group text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-container transition-colors duration-500">
                  {typeof feature.icon === 'string' ? (
                    <span className="text-4xl">{feature.icon}</span>
                  ) : (
                    feature.icon
                  )}
                </div>
                <h3 className="heading-5 mb-3 text-on-surface">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-on-surface text-surface">
        <div className="section-max px-6 md:px-12">
          <div className="text-center mb-20">
            <h2 className="heading-2 mb-6 text-surface">How It Works</h2>
            <p className="text-lg text-surface/80 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { num: '01', title: 'Create', desc: 'Start with your story and photos' },
              { num: '02', title: 'Invite', desc: 'Share with family and friends' },
              { num: '03', title: 'Remember', desc: 'Preserve your memories forever' },
            ].map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="text-[120px] font-serif italic text-white/10 leading-none absolute -top-16 -left-12">
                  {step.num}
                </div>
                <div className="w-16 h-16 rounded-full border border-secondary flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="heading-5 mb-3">{step.title}</h3>
                <p className="text-sm text-surface/80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 md:py-32 bg-surface">
        <div className="section-max px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-sm uppercase tracking-widest text-on-surface-variant mb-4">Templates</p>
            <h2 className="heading-2 mb-6">Choose Your Style</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Modern Elegance', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop' },
              { name: 'Romantic Bliss', image: 'https://images.unsplash.com/photo-1469924935806-f2f038369e73?w=400&h=500&fit=crop' },
              { name: 'Classic Grace', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop' },
            ].map((template) => (
              <div key={template.name} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 group-hover:shadow-2xl group-hover:border-primary-container transition-all duration-500">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="heading-5 text-center mt-6 text-on-surface">{template.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-surface-container-low">
        <div className="section-max px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-sm uppercase tracking-widest text-on-surface-variant mb-4">Pricing</p>
            <h2 className="heading-2 mb-6">Simple, Transparent Pricing</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Card */}
            <div className="card-base p-12 flex flex-col">
              <h3 className="heading-5 mb-4 text-primary">The Heirloom</h3>
              <p className="mb-8">
                <span className="text-4xl font-h3 text-on-surface">$49</span>
                <span className="text-on-surface-variant ml-2 font-body-md">/per wedding</span>
              </p>
              <ul className="space-y-6 mb-12 flex-1">
                {['Beautiful website', 'RSVP management', 'Photo gallery', 'Guest list'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    <span className="text-on-surface">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="lg" className="w-full">
                Get Started
              </Button>
            </div>

            {/* Premium Card */}
            <div className="card-base p-12 flex flex-col border-2 border-secondary-fixed relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-6 py-1 rounded-full text-[10px] font-label-caps tracking-widest uppercase">
                Most Popular
              </div>
              <h3 className="heading-5 mb-4 text-secondary">The Legacy</h3>
              <p className="mb-8">
                <span className="text-4xl font-h3 text-on-surface">$129</span>
                <span className="text-on-surface-variant ml-2 font-body-md">/per wedding</span>
              </p>
              <ul className="space-y-6 mb-12 flex-1">
                {['Everything in Heirloom', 'Custom domain', 'Email invitations', 'Premium templates', 'Analytics & insights'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    <span className="text-on-surface font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="gold" size="lg" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* View Examples Section */}
      <section className="py-20 md:py-32 bg-surface-container-low">
        <div className="section-max px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4 text-on-surface">See Examples</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Explore beautiful wedding websites created with ForeverStory
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Example 1 - Elegant */}
            <Link href="/weddings/sarah-michael" className="group cursor-pointer">
              <div className="card-base overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"
                    alt="Sarah & Michael"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-1 text-xs font-label-caps rounded-full mb-4 w-fit">
                    Elegant
                  </div>
                  <h3 className="heading-5 text-on-surface mb-2">Sarah & Michael</h3>
                  <p className="text-sm text-on-surface-variant mb-auto">June 15, 2024 • Bali</p>
                  <p className="text-xs text-on-surface-variant mt-4">✨ Beautiful photography gallery, guest RSVPs, venue details</p>
                </div>
              </div>
            </Link>

            {/* Example 2 - Modern */}
            <Link href="/weddings/emma-james" className="group cursor-pointer">
              <div className="card-base overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/30 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop"
                    alt="Emma & James"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-1 text-xs font-label-caps rounded-full mb-4 w-fit">
                    Modern
                  </div>
                  <h3 className="heading-5 text-on-surface mb-2">Emma & James</h3>
                  <p className="text-sm text-on-surface-variant mb-auto">August 22, 2024 • NYC</p>
                  <p className="text-xs text-on-surface-variant mt-4">🎉 Timeline, seating chart, gift registry, travel info</p>
                </div>
              </div>
            </Link>

            {/* Example 3 - Romantic */}
            <Link href="/weddings/sophia-david" className="group cursor-pointer">
              <div className="card-base overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="h-48 bg-gradient-to-br from-secondary/20 to-primary/20 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1525772764200-be829c8c4a80?w=600&h=400&fit=crop"
                    alt="Sophia & David"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-1 text-xs font-label-caps rounded-full mb-4 w-fit">
                    Romantic
                  </div>
                  <h3 className="heading-5 text-on-surface mb-2">Sophia & David</h3>
                  <p className="text-sm text-on-surface-variant mb-auto">September 10, 2024 • Paris</p>
                  <p className="text-xs text-on-surface-variant mt-4">💕 Love story, couple photos, guest book, music playlist</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <p className="text-on-surface-variant mb-6">
              These are live examples. Click any wedding to see how it looks on the public web.
            </p>
            <Link href="/auth/signup">
              <Button variant="gold" size="lg">
                Create Your Own
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-32 h-32 border-2 border-secondary-fixed rounded-full" />
          <div className="absolute bottom-20 left-10 w-48 h-48 border-2 border-primary rounded-full" />
        </div>

        <div className="section-max px-6 md:px-12 text-center relative z-10">
          <h2 className="heading-2 mb-6">Ready to Remember?</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Start building your ForeverStory today and create a digital heirloom that lasts forever.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button variant="gold" size="lg">
                Create Your Story
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 py-12">
        <div className="section-max px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-serif italic text-on-surface">ForeverStory</div>
            <div className="flex gap-8 text-sm text-on-surface-variant">
              <a href="#" className="hover:text-on-surface transition-colors">Privacy</a>
              <a href="#" className="hover:text-on-surface transition-colors">Terms</a>
              <a href="#" className="hover:text-on-surface transition-colors">Contact</a>
            </div>
            <p className="text-sm text-on-surface-variant">
              © 2024 ForeverStory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
