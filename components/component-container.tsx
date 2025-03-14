interface ComponentContainerProps {
  name: string,
  description: string,
  tags: string[],
  source: string,
  children: React.ReactNode,
}

export default function ComponentContainer({
  name,
  description,
  tags,
  source,
  children,
}: ComponentContainerProps) {
  return (
    <div className="text-sm flex flex-col">
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">{name}</h2>
        <p className="text-[#737373]">{description} <a className="underline" target="_blank" href={`${source}`}>View source</a></p>
      </div>
      <div className="flex items-center justify-center mt-6 py-16 md:px-0 px-6 rounded-2xl border-[0.5px] border-black/10">
        {children}
      </div>
      <div className="flex gap-2 mt-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center px-[6px] text-xs h-[20px] border border-black/10 rounded-full text-[#535353]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}