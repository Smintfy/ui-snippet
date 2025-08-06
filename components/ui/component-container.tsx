interface ComponentContainerProps {
  name: string;
  description: React.JSX.Element;
  tags: string[];
  source: string;
  children: React.ReactNode;
}

export function ComponentContainer({
  name,
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
      <div className="relative mt-6 flex items-center justify-center rounded-2xl border px-6 py-16 md:px-0">
        {children}
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
