import { FamilyStyleOTP, FruitSpin, ImagePreview, MultiStep } from '@/components/snippets';
import { ComponentContainer } from '../ui/component-container';

interface ComponentContainerProps {
  name: string;
  description: React.JSX.Element;
  tags: string[];
  source: string;
  children: React.ReactNode;
}

const components: ComponentContainerProps[] = [
  {
    name: 'Image preview',
    description: <>Interaction built using shared layout animations and Radix dialog primitive.</>,
    tags: ['react', 'radix', 'motion', 'tailwind'],
    source: 'https://github.com/Smintfy/ui-snippet/blob/main/components/snippets/image-preview.tsx',
    children: <ImagePreview />,
  },
  {
    name: 'Multi-step flow',
    description: (
      <>This is a multi-step component guiding users through a process or for an onboarding.</>
    ),
    tags: ['react', 'motion', 'tailwind'],
    source: 'https://github.com/Smintfy/ui-snippet/blob/main/components/snippets/multi-step.tsx',
    children: <MultiStep />,
  },
  {
    name: 'Family style OTP',
    description: (
      <>
        Recreating OTP component from{' '}
        <a
          href="https://x.com/benjitaylor/status/1900685689400029562"
          target="_blank"
          className="hover:text-primary underline"
        >
          Family
        </a>{' '}
        built on top of{' '}
        <a
          href="https://input-otp.rodz.dev"
          target="_blank"
          className="hover:text-primary underline"
        >
          otp-input
        </a>{' '}
        by guilhermerodz. And by the way, the correct code is {'"'}123456{'"'}.
      </>
    ),
    tags: ['react', 'motion', 'tailwind'],
    source:
      'https://github.com/Smintfy/ui-snippet/blob/main/components/snippets/family-style-otp.tsx',
    children: <FamilyStyleOTP />,
  },
  {
    name: 'Fruit spin',
    description: (
      <>
        A playful fruit spin game component inspired by{' '}
        <a href="https://honk.me/" target="_blank" className="hover:text-primary underline">
          Honk
        </a>
        . And by the way, please don&apos;t gamble.
      </>
    ),
    tags: ['react', 'motion', 'tailwind'],
    source: 'https://github.com/Smintfy/ui-snippet/blob/main/components/snippets/fruit-spin.tsx',
    children: <FruitSpin />,
  },
];

export default function Showcase() {
  return (
    <div className="relative mb-32 flex flex-col gap-24">
      {components.map((component) => (
        <ComponentContainer
          key={component.name}
          name={component.name}
          description={component.description}
          tags={component.tags}
          source={component.source}
        >
          {component.children}
        </ComponentContainer>
      ))}
    </div>
  );
}
