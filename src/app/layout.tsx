import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ForeverStory - Share Your Stories',
  description: 'A SaaS platform to share and preserve your stories for generations to come.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
