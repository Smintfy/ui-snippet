import StickyHeader from './sticky-header';

export default function Header() {
  return (
    <>
      <StickyHeader />
      <p className="text-tertiary mt-3 mb-24 text-sm">
        Collections of ui components built by smintfy. Check out the repository{' '}
        <a
          href="https://github.com/Smintfy/ui-snippet"
          target="_blank"
          className="hover:text-primary underline"
        >
          here
        </a>
        .
      </p>
    </>
  );
}
