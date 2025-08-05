'use client';

import {
  CentralArrowPathRightFilledOnStroke2Radius3,
  CentralChevronRightSmallFilledOnStroke2Radius3,
  CentralCrossLargeFilledOnStroke2Radius3,
  CentralHistoryFilledOnStroke2Radius3,
} from './components/icons';
import { AnimatePresence, motion, useAnimation } from 'motion/react';
import { Sparkle1, Sparkle2 } from './components/sparkle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TextShimmer } from './components/text-shimmer';
import { CoinShadow } from './components/coin-shadow';
import { Badge } from './components/badge';

// import { CardBackground } from './components/card-bg';
import { useRef, useState, useEffect } from 'react';
import { Coin } from './components/coin';
// import { toast, Toaster } from 'sonner';
import { cn } from '@/lib/utils';

// A utility hook to get the value of a variable from the previous render.
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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

function SlotReel({
  fruits,
  isSpinning,
  finalResult,
  initialResult,
  delay,
  borderColor,
}: {
  fruits: Fruit[];
  isSpinning: boolean;
  finalResult: number;
  initialResult: number;
  delay: number;
  borderColor: string;
}) {
  return (
    <motion.div
      className="flex h-[96px] w-[96px] justify-center overflow-clip rounded-[28px] border-4 transition-colors duration-500"
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
}

function SmoothSpinningReel({
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
}) {
  const fruitHeight = 80;
  const fruitSpacing = 8;
  const totalFruitHeight = fruitHeight + fruitSpacing;

  if (isSpinning) {
    const spinCycles = 24;
    const paddingCycles = 2;
    const extendedFruits: Fruit[] = [];

    for (let i = 0; i < spinCycles + paddingCycles; i++) {
      extendedFruits.push(...fruits);
    }

    const selectionCycles = 20;
    const lastRepetitionStart = selectionCycles * fruits.length;
    const finalFruitIndex = lastRepetitionStart + finalResult;
    const finalPosition = -(finalFruitIndex * totalFruitHeight);

    // This is the new part: calculate where the animation should start from.
    const initialPosition = -(initialResult * totalFruitHeight);

    return (
      <motion.div
        className="space-y-2 pt-1"
        initial={{ y: initialPosition }}
        animate={{ y: finalPosition }}
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
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
              transform: 'translateZ(0)',
            }}
            key={idx}
          >
            {fruit.emoji}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className="space-y-2 pt-1">
      <motion.div
        className="flex h-[80px] w-[80px] items-center justify-center rounded-[20px] text-3xl"
        style={{
          backgroundColor: fruits[finalResult].color,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          transform: 'translateZ(0)',
        }}
      >
        {fruits[finalResult].emoji}
      </motion.div>
    </div>
  );
}

function FirstStep({ setStep }: { setStep: (step: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col items-center justify-between gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
        className="relative mb-4 flex h-[64px] w-[64px] items-center justify-center"
      >
        <motion.div
          animate={{ y: [-4, 0, -4] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Coin />
        </motion.div>
        <motion.div
          animate={{ scale: [0.9, 1, 0.95, 0.9], rotate: [0, 360, 0] }}
          transition={{
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          className="absolute -bottom-4 -left-8"
        >
          <Sparkle1 />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, -120, -360, 0] }}
          transition={{
            rotate: {
              duration: 32,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          className="absolute -top-2 -right-4"
        >
          <Sparkle2 />
        </motion.div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <CoinShadow />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center gap-2"
      >
        <h1 className="text-xl font-semibold">Claim your daily agent hours</h1>
        <p className="text-center text-sm font-medium text-[#737373]">
          Spin to receive it. Get up to 60 minutes of free agent hours
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.3, ease: 'easeOut' }}
      >
        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          onClick={() => setStep(1)}
          className="flex h-[44px] w-fit cursor-pointer items-center gap-1 rounded-full bg-[#2DA9FF]/16 pr-3 pl-4 text-sm font-semibold text-[#2DA9FF]"
        >
          <span>Claim Now</span>
          <CentralChevronRightSmallFilledOnStroke2Radius3 className="size-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function SecondStep({
  setStep,
  finalResults,
  setFinalResults,
}: {
  setStep: (step: number) => void;
  finalResults: number[];
  setFinalResults: (result: number[]) => void;
}) {
  const [isDragAtEnd, setIsDragAtEnd] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinComplete, setIsSpinComplete] = useState(false);
  const [borderColors, setBorderColors] = useState(['#eaeaea', '#eaeaea', '#eaeaea']);
  const [dragProgress, setDragProgress] = useState(0);
  const constraintsRef = useRef(null);
  const dragButtonRef = useRef(null);
  const controls = useAnimation();
  const previousFinalResults = usePrevious(finalResults);

  // Set initial position
  useEffect(() => {
    controls.set({ x: 0 });
  }, [controls]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setIsSpinComplete(false);
    setBorderColors(['#eaeaea', '#eaeaea', '#eaeaea']);

    const results: number[] = [];

    for (let slot = 0; slot < 3; slot++) {
      const randomFruitIndex = Math.floor(Math.random() * baseFruits.length);
      results.push(randomFruitIndex);
    }

    setFinalResults(results);

    setTimeout(() => {
      // Mark spin animation as complete
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

      setTimeout(() => {
        setStep(2);
      }, 2500);
    }, 4500);
  };

  const handleDrag = (_: unknown, info: { offset: { x: number } }) => {
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
  };

  const buttonStyles = {
    spinning: { backgroundColor: '#b3b3b3', color: '#ffffff' },
    atEnd: { backgroundColor: '#2DA9FF', color: '#ffffff' },
    default: { backgroundColor: '#ffffff', color: '#2DA9FF' },
  };

  const getButtonStyles = () => {
    if (isSpinning) return buttonStyles.spinning;
    if (isDragAtEnd) return buttonStyles.atEnd;
    return buttonStyles.default;
  };

  const handleDragEnd = () => {
    if (isDragAtEnd) {
      handleSpin();
      // Reset the button position when user releases at the end
      controls.start({
        x: 0,
        transition: {
          type: 'spring',
          bounce: 0.2,
          duration: 0.45,
        },
      });
      setIsDragAtEnd(false);
      setTimeout(() => setDragProgress(0), 100);
    } else {
      setDragProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="flex w-full flex-col gap-24"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          {[0, 1, 2].map((idx) => (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.1,
                type: 'tween',
              }}
              key={idx}
              className="flex flex-col items-center gap-6"
            >
              {isSpinComplete && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.8, y: 20, rotateY: 0 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0, rotateY: 180 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.4,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="z-50 flex size-6 items-center justify-center rounded-[8px] shadow-[0_0.5px_2px_0_rgba(50,50,50,0.08),0_2px_4px_0_rgba(50,50,50,0.08)]"
                  layoutId={`fruit-${idx}`}
                >
                  <CentralCrossLargeFilledOnStroke2Radius3 className="size-4 text-red-500" />
                </motion.div>
              )}
              <SlotReel
                key={idx}
                fruits={baseFruits}
                isSpinning={isSpinning}
                finalResult={finalResults[idx]}
                initialResult={previousFinalResults?.[idx] ?? 0}
                delay={idx * 0.2}
                borderColor={borderColors[idx]}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 5 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-between"
        >
          <span className="text-sm font-medium text-[#737373]">Potential Win</span>
          {/* <motion.span layoutId="score" className="font-semibold">
             10
           </motion.span> */}
          <motion.span
            className="font-semibold"
            animate={
              isSpinComplete
                ? {
                    scale: [1, 1.25, 1, 1, 1.25, 1, 1, 1.25, 1],
                  }
                : { scale: 1 }
            }
            transition={{
              duration: 1.4,
              times: [0, 0.071, 0.143, 0.286, 0.357, 0.429, 0.571, 0.643, 1],
              type: 'tween',
            }}
          >
            10
          </motion.span>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
        className="rounded-full bg-[#f7f7f7] p-1"
      >
        <div ref={constraintsRef} className="relative">
          {!isSpinning && (
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
            drag={isSpinning ? false : 'x'}
            dragDirectionLock
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={getButtonStyles()}
            className="flex h-[36px] w-[36px] cursor-grab items-center justify-center rounded-full shadow-xs"
          >
            <CentralArrowPathRightFilledOnStroke2Radius3 className="size-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ThirdStep({
  finalResults,
  setStep,
}: {
  finalResults: number[];
  setStep: (step: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="flex w-full flex-col gap-16"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col gap-4"
      >
        <div className="relative rounded-[24px] border p-1 shadow-[0_2px_4px_-0.5px_rgba(50,50,50,0.04),0_4px_8px_-2px_rgba(50,50,50,0.04)]">
          <motion.div
            animate={{ rotate: [0, 8, 0, -8, 0], y: [0, -8, 0, 2, 0] }}
            transition={{
              rotate: {
                duration: 24,
                repeat: Infinity,
                ease: 'linear',
              },
              y: {
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
            className="absolute -top-6 -left-6 z-10"
          >
            <Badge />
          </motion.div>
          <div className="relative flex flex-col items-center gap-4 rounded-[20px] border border-[#323232]/6 bg-[#f7f7f7] px-6 py-8">
            <div className="absolute top-3 right-3">
              <CentralHistoryFilledOnStroke2Radius3 className="size-5 text-[#a3a3a3]" />
            </div>
            <span className="text-lg font-semibold">You got</span>
            <span className="text-5xl font-semibold text-[#2DA9FF]">10</span>
            <span className="text-sm font-medium text-[#737373]">Compute minutes</span>
            <div className="absolute inset-0 overflow-clip rounded-[20px]">
              <motion.div
                className="absolute h-[512px] w-[48px] rotate-45 bg-white"
                initial={{ opacity: 0.2, x: -165, y: -165 }}
                animate={{ opacity: 0.4, x: 180, y: -360 }}
                transition={{ duration: 0.5, delay: 1.2, type: 'tween' }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          {finalResults.map((slotData, idx) => (
            <motion.div
              transition={{
                delay: idx * 0.1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              key={idx}
              layoutId={`fruit-${idx}`}
            >
              <div
                className="z-50 flex h-[44px] w-[44px] items-center justify-center rounded-[14px] text-2xl"
                style={{
                  backgroundColor: baseFruits[slotData].color,
                }}
              >
                {baseFruits[slotData].emoji}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
          className="text-center text-sm font-medium"
        >
          No matches. Better luck next time!
        </motion.p>
      </motion.div>
      <motion.button
        initial={{ scale: 0.95, opacity: 0, y: 5 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2, ease: 'easeOut' }}
        whileTap={{ scale: 0.95, transition: { duration: 0.2 } }}
        onClick={() => setStep(0)}
        className="h-[44px] cursor-pointer rounded-full bg-[#2DA9FF] text-sm font-semibold text-white"
      >
        Back to Menu
      </motion.button>
    </motion.div>
  );
}

export default function Page() {
  const [step, setStep] = useState(0);
  const [finalResults, setFinalResults] = useState([0, 1, 2]);

  function renderStep() {
    switch (step) {
      case 0:
        return <FirstStep setStep={setStep} />;
      case 1:
        return (
          <SecondStep
            setStep={setStep}
            finalResults={finalResults}
            setFinalResults={setFinalResults}
          />
        );
      case 2:
        return <ThirdStep finalResults={finalResults} setStep={setStep} />;
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center font-[family-name:var(--font-open-runde)]">
      <div className="absolute top-4 left-4 hidden">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ChevronLeft />
        </button>
        <button onClick={() => setStep(Math.min(2, step + 1))} disabled={step === 2}>
          <ChevronRight />
        </button>
      </div>
      <div className="flex h-[364px] w-[320px] items-end justify-center">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
