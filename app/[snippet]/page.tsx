'use client';

import { FamilyStyleOTP, FruitSpin, ImagePreview, MultiStep } from '@/components/snippets';
import { notFound } from 'next/navigation';
import { use } from 'react';

const snippetComponents = {
  'family-style-otp': {
    component: FamilyStyleOTP,
    title: 'Family Style OTP',
  },
  'fruit-spin': {
    component: FruitSpin,
    title: 'Fruit Spin',
  },
  'image-preview': {
    component: ImagePreview,
    title: 'Image Preview',
  },
  'multi-step': {
    component: MultiStep,
    title: 'Multi-Step Flow',
  },
} as const;

type SnippetName = keyof typeof snippetComponents;

interface PageProps {
  params: Promise<{
    snippet: string;
  }>;
}

export default function SnippetPage({ params }: PageProps) {
  const { snippet } = use(params);
  // const [isCopied, setIsCopied] = useState(false);

  if (!(snippet in snippetComponents)) {
    notFound();
  }

  const snippetData = snippetComponents[snippet as SnippetName];
  const Component = snippetData.component;

  // const handleCopyLink = async () => {
  //   try {
  //     await navigator.clipboard.writeText(window.location.href);
  //     setIsCopied(true);
  //     setTimeout(() => setIsCopied(false), 2000);
  //   } catch (err) {
  //     console.error('Failed to copy link:', err);
  //   }
  // };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center px-4 md:px-0">
      <div className="mx-auto flex w-full flex-col items-center">
        {/* <div className="mb-16 flex w-full items-center justify-between">
          <Link
            href="/"
            className="text-tertiary hover:text-primary flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <button
            onClick={handleCopyLink}
            className="text-tertiary hover:text-primary flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
          >
            {isCopied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
          </button>
        </div> */}
        <Component />
      </div>
    </div>
  );
}
