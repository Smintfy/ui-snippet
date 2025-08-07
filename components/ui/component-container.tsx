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
      <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border">
        <div className="flex w-full items-center justify-between rounded-t-2xl border-b bg-neutral-50 px-3 py-2">
          <p className="text-tertiary font-mono text-xs">{link}.tsx</p>
          <Link
            href={`/${link}`}
            className="text-tertiary hover:text-primary flex size-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-neutral-100"
          >
            <SquareArrowOutUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="relative flex w-full justify-center px-6 py-16 md:px-0">{children}</div>
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
