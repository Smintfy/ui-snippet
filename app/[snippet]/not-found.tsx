'use client';

import { NotFoundDrawing } from './components/not-found-drawing';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="translate-x-6">
          <NotFoundDrawing />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h1>Nothing to see here</h1>
          <Link
            href="/"
            className="transition-color flex w-fit cursor-pointer items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white duration-200 ease-out hover:scale-97 hover:bg-neutral-900/90 active:scale-97"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
