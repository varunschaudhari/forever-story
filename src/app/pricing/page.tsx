import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Pricing - ForeverStory',
  description: 'Simple, transparent pricing for your wedding website',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: 'one-time',
      description: 'Perfect for small weddings',
      features: [
        'Basic wedding website',
        'Up to 100 guests',
        'Photo gallery',
        'RSVP management',
        'Email notifications',
        'Basic customization',
      ],
      cta: 'Get Started',
      variant: 'outline',
    },
    {
      name: 'Premium',
      price: '$129',
      period: 'one-time',
      description: 'For unforgettable weddings',
      features: [
        'Everything in Starter',
        'Up to 500 guests',
        'Advanced customization',
        'Timeline & timeline',
        'Guest book',
        'Seating charts',
        'Gift registry integration',
        'Priority support',
        'Custom domain',
      ],
      cta: 'Start Premium',
      variant: 'gold',
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            ForeverStory
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/" className="font-serif text-sm tracking-[0.15em] uppercase text-on-surface hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="md" className="font-label-caps text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="gold" size="pill" className="font-label-caps text-xs hidden sm:block">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="py-20 px-6 md:px-12 lg:px-20 text-center">
        <h1 className="heading-1 mb-4 text-on-surface max-w-2xl mx-auto">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-4">
          One-time payment. No hidden fees. No subscriptions.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative card-base p-12 ${
                plan.popular
                  ? 'border-2 border-secondary-fixed md:scale-105 md:shadow-2xl'
                  : 'border border-stone-100'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-secondary-fixed text-on-secondary-fixed px-4 py-1 text-xs font-label-caps tracking-widest uppercase rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <h3 className="heading-4 mb-2 text-on-surface">{plan.name}</h3>
              <p className="text-sm text-on-surface-variant mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-h3 text-primary">{plan.price}</span>
                <span className="text-sm text-on-surface-variant font-label-caps ml-2">
                  {plan.period}
                </span>
              </div>

              {/* CTA */}
              <Link href="/auth/signup" className="block w-full mb-8">
                <Button
                  variant={plan.variant as 'gold' | 'outline'}
                  size="form"
                  className="w-full font-label-caps text-xs"
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features */}
              <div className="border-t border-stone-200 pt-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <span className="text-lg">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-surface-container-low">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="photo-frame">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"
              alt="Trust"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          {/* Stats */}
          <div className="space-y-8">
            <div>
              <p className="text-5xl font-h3 text-primary mb-2">2,500+</p>
              <p className="text-on-surface-variant">Couples who trusted ForeverStory</p>
            </div>
            <div>
              <p className="text-5xl font-h3 text-primary mb-2">50K+</p>
              <p className="text-on-surface-variant">Beautiful wedding stories created</p>
            </div>
            <div>
              <p className="text-5xl font-h3 text-primary mb-2">500K+</p>
              <p className="text-on-surface-variant">Guests welcomed worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-2 mb-12 text-on-surface text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade after purchase?",
                a: "Yes! You can upgrade from Starter to Premium anytime. We will credit your existing payment toward the upgrade.",
              },
              {
                q: "Is there a refund policy?",
                a: "We offer a 30-day money-back guarantee if you are not satisfied with your wedding website.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Since it is a one-time payment, there is nothing to cancel. Your website stays live as long as you want.",
              },
              {
                q: "Do you offer discounts for group bookings?",
                a: "Contact our support team for volume discounts for wedding planners and coordinators.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="card-base p-6">
                <h3 className="heading-5 mb-2 text-on-surface">{faq.q}</h3>
                <p className="text-on-surface-variant">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-12 lg:px-20 py-20 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-primary-container opacity-30" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-secondary-container opacity-30" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="heading-2 mb-4 text-on-surface">Ready to share your story?</h2>
          <p className="text-xl text-on-surface-variant mb-8">
            Create your beautiful wedding website in minutes
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="gold" size="pill" className="font-label-caps text-xs px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="pill" className="font-label-caps text-xs px-8">
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-serif uppercase tracking-widest text-on-surface-variant">
            © 2024 ForeverStory. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-serif uppercase tracking-widest text-on-surface-variant">
            <Link href="#" className="hover:text-on-surface transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-on-surface transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-on-surface transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
