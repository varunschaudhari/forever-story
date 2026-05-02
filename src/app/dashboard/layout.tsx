'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/SignOutButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-sm text-on-surface hover:bg-surface-container-low transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-stone-50 border-r border-stone-200 flex flex-col p-6 transition-transform duration-300 z-40 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Block */}
        <Link href="/dashboard" className="mb-12">
          <div className="text-xl font-serif italic text-on-surface tracking-tight">
            ForeverStory
          </div>
          <p className="text-sm text-stone-500 font-serif">Managing your heirloom</p>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 mb-12 flex-1">
          {[
            { href: '/dashboard', label: 'Dashboard', icon: '📊' },
            { href: '/dashboard/weddings', label: 'My Stories', icon: '💕' },
            { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-stone-500 rounded-lg font-serif text-sm tracking-widest uppercase hover:bg-stone-100 hover:translate-x-1 hover:text-stone-900 transition-all duration-200 group"
              aria-label={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="group-hover:text-stone-900">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-stone-200 pt-6 space-y-3">
          <Link href="/dashboard/weddings/new">
            <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-label-caps uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
              New Project
            </button>
          </Link>

          <a href="#" className="block text-sm text-stone-500 font-serif hover:text-stone-900 transition-colors px-4 py-2">
            Concierge
          </a>

          <div onClick={() => setSidebarOpen(false)}>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="min-h-screen bg-surface">{children}</div>
      </main>
    </div>
  );
}
