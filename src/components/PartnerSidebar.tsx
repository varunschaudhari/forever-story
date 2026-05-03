'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function PartnerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: '📊', href: '/partner/dashboard' },
    { label: 'Customers', icon: '👥', href: '/partner/customers' },
    { label: 'Earnings', icon: '💰', href: '/partner/earnings' },
    { label: 'Settings', icon: '⚙️', href: '/partner/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 bg-surface-container-lowest border-r border-outline-variant flex flex-col transition-all duration-300 shadow-sm ${
        expanded ? 'w-72' : 'w-20'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo Section */}
      <div className={`flex items-center justify-center py-8 px-4 border-b border-outline-variant transition-all duration-300`}>
        <Link
          href="/partner/dashboard"
          className={`font-serif italic text-secondary transition-all duration-300 ${
            expanded ? 'text-3xl' : 'text-2xl'
          }`}
        >
          {expanded ? 'FS' : 'FS'}
        </Link>
      </div>

      {/* Partner Badge */}
      {expanded && (
        <div className="mx-3 mt-4 px-3 py-2 bg-secondary/10 rounded-lg border border-secondary/20 backdrop-blur-sm">
          <p className="text-xs font-bold text-secondary uppercase tracking-widest text-center">
            Partner
          </p>
        </div>
      )}

      {/* Navigation Section */}
      <nav className={`flex-1 ${expanded ? 'px-3 py-6' : 'px-2 py-8'} space-y-1.5 overflow-y-auto`}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-secondary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container/50'
              }`}
              title={!expanded ? item.label : undefined}
            >
              <span
                className={`text-2xl transition-transform duration-200 ${
                  active ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                {item.icon}
              </span>
              {expanded && (
                <>
                  <span
                    className={`text-sm font-semibold transition-all duration-200 ${
                      active ? 'text-secondary' : 'text-on-surface-variant group-hover:text-on-surface'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-3">
        <div className="h-px bg-outline-variant/30" />
      </div>

      {/* User Section */}
      <div className="p-3 space-y-3">
        {/* User Profile */}
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            expanded ? 'bg-surface-container/50' : ''
          }`}
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-10 h-10 rounded-full ring-2 ring-secondary/20 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-yellow-600 text-white flex items-center justify-center text-sm font-bold ring-2 ring-secondary/20">
              {session?.user?.name?.charAt(0).toUpperCase() || 'P'}
            </div>
          )}
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {session?.user?.email || 'Email'}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
            expanded
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'text-red-600 hover:bg-red-50 justify-center'
          }`}
          title={!expanded ? 'Logout' : undefined}
        >
          <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
          {expanded && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
