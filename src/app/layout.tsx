import type { Metadata } from 'next';
import { Noto_Serif, Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ForeverStory - Capture Your Wedding Story',
  description:
    'Create beautiful wedding websites, manage RSVPs, and capture your love story with ForeverStory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${inter.variable}`}>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
