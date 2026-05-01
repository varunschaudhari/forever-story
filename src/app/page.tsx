import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="container-custom py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">ForeverStory</div>
        <div className="flex gap-4">
          <Link href="/auth/signin" className="btn btn-secondary">
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Preserve Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Stories Forever
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your memories, connect with loved ones, and create a lasting legacy.
            ForeverStory makes it easy to capture and preserve the moments that matter.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup" className="btn btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <button className="btn btn-secondary text-lg px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-20 bg-white rounded-2xl shadow-sm">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose ForeverStory?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Secure Storage',
              description: 'Your stories are encrypted and securely stored in the cloud.',
            },
            {
              title: 'Easy Sharing',
              description: 'Share memories with family and friends with customizable permissions.',
            },
            {
              title: 'Permanent Archive',
              description: 'Your legacy is preserved forever, accessible to future generations.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to share your story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users preserving their memories with ForeverStory.
          </p>
          <Link href="/auth/signup" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-custom py-8 border-t border-gray-200 mt-20">
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <p>&copy; 2024 ForeverStory. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
