import { Inter } from 'next/font/google';

import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'uisnippet',
  description: 'Collections of ui components made by smintfy.',
  openGraph: {
    url: 'https://www.uisnippet.dev',
    siteName: 'UI Snippet',
    description: 'Collections of ui components made by smintfy.',
    images: [
      {
        url: '/og-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'UI Snippet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@smintfy',
    title: 'UI Snippet',
    description: 'Collections of ui components made by smintfy.',
    images: ['/og-thumbnail.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, 'antialiased')}>{children}</body>
    </html>
  );
}
