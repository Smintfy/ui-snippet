'use client';

import Showcase from '@/components/sections/showcase';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <div className={cn('relative mx-auto flex max-w-[720px] flex-col px-4 md:px-0')}>
      <Toaster duration={6000} />
      <Header />
      <Showcase />
      <Footer />
    </div>
  );
}
