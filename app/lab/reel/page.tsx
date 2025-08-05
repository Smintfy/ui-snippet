'use client';

import { toast, Toaster } from 'sonner';
import { motion } from 'motion/react';
import { useState } from 'react';

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
  delay,
  borderColor,
}: {
  fruits: Fruit[];
  isSpinning: boolean;
  finalResult: number;
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
        delay={delay}
      />
    </motion.div>
  );
}

function SmoothSpinningReel({
  fruits,
  isSpinning,
  finalResult,
  delay,
}: {
  fruits: Fruit[];
  isSpinning: boolean;
  finalResult: number;
  delay: number;
}) {
  const fruitHeight = 80;
  const fruitSpacing = 8;
  const totalFruitHeight = fruitHeight + fruitSpacing;

  if (isSpinning) {
    // Create extended array for smooth spinning
    const spinCycles = 24; // Number of full cycles before stopping
    const paddingCycles = 2; // Extra cycles for visual padding
    const extendedFruits: Fruit[] = [];

    // Add multiple cycles of fruits
    for (let i = 0; i < spinCycles + paddingCycles; i++) {
      extendedFruits.push(...fruits);
    }

    // Calculate final position to land exactly on our target fruit
    const selectionCycles = 20; // Pick random fruit after this many cycles
    const lastRepetitionStart = selectionCycles * fruits.length;
    const finalFruitIndex = lastRepetitionStart + finalResult;
    const finalPosition = -(finalFruitIndex * totalFruitHeight);

    return (
      <motion.div
        className="space-y-2 pt-1"
        initial={{ y: 0 }}
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

  // Show static result when not spinning
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

export default function Page() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalResults, setFinalResults] = useState([0, 0, 0]);
  const [borderColors, setBorderColors] = useState(['#eaeaea', '#eaeaea', '#eaeaea']);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Reset border colors to default during spin
    setBorderColors(['#eaeaea', '#eaeaea', '#eaeaea']);

    // Generate random results for all 3 slots
    const results: number[] = [];

    for (let slot = 0; slot < 3; slot++) {
      const randomFruitIndex = Math.floor(Math.random() * baseFruits.length);
      results.push(randomFruitIndex);
    }

    setFinalResults(results);

    // Show results and update border colors after all animations complete
    setTimeout(() => {
      const resultText = results.map((index) => baseFruits[index].emoji).join(' ');

      // Update border colors with staggered delays
      results.forEach((resultIndex, slotIndex) => {
        setTimeout(() => {
          setBorderColors((prev) => {
            const newColors = [...prev];
            newColors[slotIndex] = baseFruits[resultIndex].color;
            return newColors;
          });
        }, slotIndex * 300); // 300ms delay between each slot
      });

      toast.message(`Result: ${resultText}`, {
        duration: 3000,
      });
    }, 4800);

    // Reset spinning state after all animations complete
    setTimeout(() => setIsSpinning(false), 4800);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center font-[family-name:var(--font-open-runde)]">
      <Toaster />
      <div className="flex flex-col gap-16">
        <div className="flex gap-4">
          {[0, 1, 2].map((slotIndex) => (
            <SlotReel
              key={slotIndex}
              fruits={baseFruits}
              isSpinning={isSpinning}
              finalResult={finalResults[slotIndex]}
              delay={slotIndex * 0.2}
              borderColor={borderColors[slotIndex]}
            />
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSpin}
            disabled={isSpinning}
            className="cursor-pointer rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Spin
          </motion.button>
        </div>
      </div>
    </div>
  );
}
