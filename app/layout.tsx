import { Inter } from 'next/font/google';

import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const openRunde = localFont({
  src: [
    {
      path: './fonts/OpenRunde-Medium.woff2',
      weight: '500',
    },
    {
      path: './fonts/OpenRunde-Semibold.woff2',
      weight: '600',
    },
    {
      path: './fonts/OpenRunde-Bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-open-runde',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'uisnippet',
  description: 'Collections of ui components made by smintfy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, openRunde.variable, 'antialiased')}>{children}</body>
    </html>
  );
}
