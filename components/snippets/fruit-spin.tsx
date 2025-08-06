'use client';

import { useRef, useState, useEffect, useMemo, useCallback, memo, JSX } from 'react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { motion, useAnimation } from 'motion/react';
import { usePrevious } from '@/hooks/use-previous';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Fruit {
  emoji: string;
  color: string;
}

const baseFruits: Fruit[] = [
  {
    emoji: '🍒',
    color: '#00BC7D',
  },
  {
    emoji: '🍌',
    color: '#615FFF',
  },
  {
    emoji: '🫐',
    color: '#FE9A00',
  },
  {
    emoji: '🍇',
    color: '#FFDF20',
  },
  {
    emoji: '🥝',
    color: '#FB2C36',
  },
];

const SPIN_CYCLES = 24;
const PADDING_CYCLES = 2;
const TOTAL_CYCLES = SPIN_CYCLES + PADDING_CYCLES;
const extendedFruits = Array.from({ length: TOTAL_CYCLES }, () => baseFruits).flat();

const FRUIT_STYLE = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
  transform: 'translateZ(0)',
} as const;

const BUTTON_STYLES = {
  spinning: { backgroundColor: '#b3b3b3', color: '#ffffff' },
  atEnd: { backgroundColor: '#2DA9FF', color: '#ffffff' },
  default: { backgroundColor: '#ffffff', color: '#2DA9FF' },
} as const;

const DEFAULT_BORDER_COLORS = ['#eaeaea', '#eaeaea', '#eaeaea'];

export function ArrowPathRightFilled(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M15.4603 4.41523C14.4833 3.60108 13 4.2958 13 5.56756V8.00004H6C3.79086 8.00004 2 9.7909 2 12C2 14.2092 3.79086 16 6 16H13V18.4325C13 19.7043 14.4833 20.399 15.4603 19.5849L22.2574 13.9206C23.4568 12.9211 23.4568 11.079 22.2574 10.0795L15.4603 4.41523Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SlotReel = memo(
  ({
    fruits,
    isSpinning,
    finalResult,
    initialResult,
    delay,
    borderColor,
    shouldTransitionBorder = true,
  }: {
    fruits: Fruit[];
    isSpinning: boolean;
    finalResult: number;
    initialResult: number;
    delay: number;
    borderColor: string;
    shouldTransitionBorder?: boolean;
  }) => {
    return (
      <motion.div
        className={cn(
          'flex size-24 justify-center overflow-clip rounded-[28px] border-4',
          shouldTransitionBorder && 'transition-colors duration-500',
        )}
        style={{ borderColor }}
      >
        <SmoothSpinningReel
          fruits={fruits}
          isSpinning={isSpinning}
          finalResult={finalResult}
          initialResult={initialResult}
          delay={delay}
        />
      </motion.div>
    );
  },
);

SlotReel.displayName = 'SlotReel';

const SmoothSpinningReel = memo(
  ({
    fruits,
    isSpinning,
    finalResult,
    initialResult,
    delay,
  }: {
    fruits: Fruit[];
    isSpinning: boolean;
    finalResult: number;
    initialResult: number;
    delay: number;
  }) => {
    const fruitHeight = 80;
    const fruitSpacing = 8;
    const totalFruitHeight = fruitHeight + fruitSpacing;

    const positions = useMemo(() => {
      const selectionCycles = 20;
      const lastRepetitionStart = selectionCycles * fruits.length;
      const finalFruitIndex = lastRepetitionStart + finalResult;
      const finalPosition = -(finalFruitIndex * totalFruitHeight);
      const initialPosition = -(initialResult * totalFruitHeight);

      return { initialPosition, finalPosition };
    }, [finalResult, initialResult, fruits.length, totalFruitHeight]);

    if (isSpinning) {
      return (
        <motion.div
          className="space-y-2 pt-1"
          initial={{ y: positions.initialPosition }}
          animate={{ y: positions.finalPosition }}
          transition={{
            ease: [0.77, 0, 0.175, 1],
            duration: 4,
            delay: delay,
          }}
        >
          {extendedFruits.map((fruit, idx) => (
            <motion.div
              className="flex h-[80px] w-[80px] items-center justify-center rounded-[20px] text-3xl"
              style={{
                backgroundColor: fruit.color,
                ...FRUIT_STYLE,
              }}
              key={idx}
            >
              {fruit.emoji}
            </motion.div>
          ))}
        </motion.div>
      );
    }

    const finalFruit = fruits[finalResult];

    return (
      <div className="space-y-2 pt-1">
        <motion.div
          className="flex h-[80px] w-[80px] items-center justify-center rounded-[20px] text-3xl select-none"
          style={{
            backgroundColor: finalFruit.color,
            ...FRUIT_STYLE,
          }}
        >
          {finalFruit.emoji}
        </motion.div>
      </div>
    );
  },
);

SmoothSpinningReel.displayName = 'SmoothSpinningReel';

function FruitSlots({
  finalResults,
  setFinalResults,
}: {
  finalResults: number[];
  setFinalResults: (result: number[]) => void;
}) {
  const [isDragAtEnd, setIsDragAtEnd] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinComplete, setIsSpinComplete] = useState(false);
  const [borderColors, setBorderColors] = useState([...DEFAULT_BORDER_COLORS]);
  const [dragProgress, setDragProgress] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const constraintsRef = useRef(null);
  const dragButtonRef = useRef(null);
  const controls = useAnimation();
  const previousFinalResults = usePrevious(finalResults);

  // Set initial position
  useEffect(() => {
    controls.set({ x: 0 });
  }, [controls]);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setIsSpinComplete(false);
    setBorderColors([...DEFAULT_BORDER_COLORS]);

    const results = Array.from({ length: 3 }, () => Math.floor(Math.random() * baseFruits.length));

    setFinalResults(results);

    setTimeout(() => {
      setIsSpinComplete(true);

      // Update border colors
      results.forEach((resultIndex, slotIndex) => {
        setTimeout(() => {
          setBorderColors((prev) => {
            const newColors = [...prev];
            newColors[slotIndex] = baseFruits[resultIndex].color;
            return newColors;
          });
        }, slotIndex * 300);
      });
    }, 4500);
  }, [isSpinning, setFinalResults]);

  const handleDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (!constraintsRef.current || !dragButtonRef.current) return;

      const container = constraintsRef.current as HTMLElement;
      const button = dragButtonRef.current as HTMLElement;

      const maxOffset = container.offsetWidth - button.offsetWidth;
      const progress = Math.min(Math.max(info.offset.x / maxOffset, 0), 1);
      setDragProgress(progress);

      // Check if the current offset is at or very close to the end (within 5px)
      const isAtEnd = info.offset.x >= maxOffset - 5;

      if (isAtEnd && !isDragAtEnd) {
        setIsDragAtEnd(true);
      } else if (!isAtEnd && isDragAtEnd) {
        setIsDragAtEnd(false);
      }
    },
    [isDragAtEnd],
  );

  const getButtonStyles = useMemo(() => {
    if (isSpinning) return BUTTON_STYLES.spinning;
    if (isDragAtEnd) return BUTTON_STYLES.atEnd;
    return BUTTON_STYLES.default;
  }, [isSpinning, isDragAtEnd]);

  const springTransition = useMemo(
    () => ({
      type: 'spring' as const,
      bounce: 0.2,
      duration: 0.45,
    }),
    [],
  );

  const handleDragEnd = useCallback(() => {
    if (isDragAtEnd) {
      handleSpin();
      // Reset the button position when user releases at the end
      controls.start({
        x: 0,
        transition: springTransition,
      });
      setIsDragAtEnd(false);
      setTimeout(() => setDragProgress(0), 100);
    } else {
      // Reset button position to start when drag doesn't reach the end
      controls.start({
        x: 0,
        transition: springTransition,
      });
      setDragProgress(0);
    }
  }, [isDragAtEnd, handleSpin, controls, springTransition]);

  const handleReset = useCallback(() => {
    setIsResetting(true);
    setIsSpinning(false);
    setIsSpinComplete(false);
    setBorderColors([...DEFAULT_BORDER_COLORS]);
    setDragProgress(0);
    setIsDragAtEnd(false);
    controls.set({ x: 0 });
    setFinalResults([0, 1, 2]);
    setTimeout(() => setIsResetting(false), 50);
  }, [controls, setFinalResults]);

  return (
    <div className="flex w-full flex-col gap-24">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex flex-col items-center gap-6">
              <SlotReel
                key={idx}
                fruits={baseFruits}
                isSpinning={isSpinning}
                finalResult={finalResults[idx]}
                initialResult={previousFinalResults?.[idx] ?? 0}
                delay={idx * 0.2}
                borderColor={borderColors[idx]}
                shouldTransitionBorder={!isResetting}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-full bg-[#f7f7f7] p-1">
        <div ref={constraintsRef} className="relative">
          {!isSpinning && !isSpinComplete && (
            <TextShimmer
              duration={1.5}
              spread={3}
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold select-none',
                'dark:[--base-color:#b3b3b3] dark:[--base-gradient-color:#e0e0e0]',
              )}
            >
              Drag to Spin
            </TextShimmer>
          )}
          <div
            className="absolute top-1/2 h-[32px] -translate-y-1/2 rounded-full bg-[#f7f7f7]"
            style={{
              width: `${dragProgress * 100}%`,
              left: 0,
            }}
          />
          <motion.button
            ref={dragButtonRef}
            drag={isSpinning || isSpinComplete ? false : 'x'}
            dragDirectionLock
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={getButtonStyles}
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full shadow-xs hover:cursor-grab active:cursor-grabbing"
          >
            <ArrowPathRightFilled className="size-5" />
          </motion.button>
        </div>
      </div>
      <button
        onClick={handleReset}
        className={cn(
          'absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg transition-all',
          isSpinComplete
            ? 'cursor-pointer text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
            : 'cursor-not-allowed text-neutral-300 opacity-50',
        )}
        disabled={!isSpinComplete}
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}

export function FruitSpin() {
  const [finalResults, setFinalResults] = useState([0, 1, 2]);

  return (
    <div className="my-8 flex w-[320px]">
      <FruitSlots finalResults={finalResults} setFinalResults={setFinalResults} />
    </div>
  );
}
