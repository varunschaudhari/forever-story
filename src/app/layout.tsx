import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'ForeverStory - Wedding Management Platform',
  description: 'Manage your weddings and track RSVPs with ForeverStory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
