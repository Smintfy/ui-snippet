import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

interface ComponentContainerProps {
  name: string;
  link: string;
  description: React.JSX.Element;
  tags: string[];
  source: string;
  children: React.ReactNode;
}

export function ComponentContainer({
  name,
  link,
  description,
  tags,
  source,
  children,
}: ComponentContainerProps) {
  return (
    <div className="flex flex-col text-sm">
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">{name}</h2>
        <p className="text-tertiary">
          {description}{' '}
          <a className="hover:text-primary underline" target="_blank" href={`${source}`}>
            View source
          </a>
        </p>
      </div>
      <div className="mt-6 flex flex-col items-center justify-center overflow-clip rounded-2xl border px-6 md:px-0">
        <div className="flex w-full border-b bg-neutral-50 px-3 py-2">
          <div>
            <Link
              href={`/${link}`}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <SquareArrowOutUpRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="relative flex w-full justify-center py-16">{children}</div>
      </div>
      <div className="mt-4 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-secondary flex h-[20px] items-center rounded-full border px-[6px] text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
