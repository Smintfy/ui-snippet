'use client';

import { motion, MotionConfig, AnimatePresence } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import useMeasure from '@/hooks/use-measure';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        'w-fit cursor-pointer items-center rounded-lg border border-indigo-600 bg-gradient-to-b from-indigo-500 to-indigo-600 px-3 font-medium text-white select-none hover:bg-gradient-to-b hover:from-indigo-500/80 hover:to-indigo-600/80',
        'shadow-[0px_1px_0px_0px_rgba(255,255,255,0.10)_inset, 0px_4px_8px_-2px_rgba(0,0,0,0.05), 0px_2px_4px_-1px_rgba(0,0,0,0.05)] flex h-[40px]',
        `${className}`,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        'text-tertiary flex h-[40px] w-fit cursor-pointer items-center rounded-lg px-3 font-medium select-none hover:bg-neutral-100',
        `${className}`,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const StepOne = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">This is step one</h2>
        <p className="text-secondary">
          This is a multi-step component. It{"'"}s a great way to guide users through a process.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-2/3 rounded-md bg-neutral-100" />
        <div className="h-5 w-1/2 rounded-md bg-neutral-100" />
        <div className="h-5 w-3/4 rounded-md bg-neutral-100" />
        <div className="h-5 w-1/4 rounded-md bg-neutral-100" />
      </div>
    </>
  );
};

const StepTwo = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">This is step two</h2>
        <p className="text-secondary">
          This is a multi-step component. It{"'"}s a great way to guide users through a process.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-2/3 rounded-md bg-neutral-100" />
        <div className="h-5 w-1/2 rounded-md bg-neutral-100" />
        <div className="h-5 w-3/5 rounded-md bg-neutral-100" />
      </div>
    </>
  );
};

const StepThree = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">This is step three</h2>
        <p className="text-secondary">
          This is a multi-step component. It{"'"}s a great way to guide users through a process.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-2/3 rounded-md bg-neutral-100" />
        <div className="h-5 w-1/2 rounded-md bg-neutral-100" />
        <div className="h-5 w-3/4 rounded-md bg-neutral-100" />
        <div className="h-5 w-1/4 rounded-md bg-neutral-100" />
        <div className="h-5 w-2/5 rounded-md bg-neutral-100" />
      </div>
    </>
  );
};

export function MultiStep() {
  const [currentStep, setCurrentStep] = useState(0);
  const [clickDirection, setClickDirection] = useState(1);
  const ref = useRef(null);
  const { height } = useMeasure({ ref });

  const steps = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
    }
  }, [currentStep]);

  const variants = {
    initial: (custom: number) => ({
      x: `${100 * custom}%`,
      filter: 'blur(2.5px)',
      opacity: 0,
    }),
    animate: () => ({
      x: 0,
      filter: 'blur(0)',
      opacity: 1,
    }),
    exit: (custom: number) => ({
      x: `${-100 * custom}%`,
      filter: 'blur(2.5px)',
      opacity: 0,
    }),
  };

  return (
    <div className="flex h-[400px] items-center">
      <MotionConfig transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
        <motion.div
          animate={{ height }}
          className={cn(
            'relative flex w-full max-w-[460px] flex-col overflow-hidden rounded-2xl bg-neutral-50 will-change-transform',
            'shadow-[0px_0px_0px_1px_rgba(0,0,0,0.10),0px_12px_24px_-6px_rgba(51,51,51,0.03),0px_8px_16px_-4px_rgba(51,51,51,0.03),0px_4px_8px_-2px_rgba(51,51,51,0.03),0px_2px_4px_-0.5px_rgba(51,51,51,0.03)]',
          )}
        >
          <div ref={ref} className="h-fit w-full">
            <div className="p-1">
              <motion.div
                layout
                className="border-primary/10 mb-4 overflow-hidden rounded-xl border bg-white p-6"
              >
                <AnimatePresence mode="popLayout" initial={false} custom={clickDirection}>
                  <motion.div
                    key={currentStep}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={clickDirection}
                    className="flex flex-col gap-6"
                  >
                    {steps}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <motion.div layout className="mb-3 flex justify-between px-2">
                <SecondaryButton
                  aria-label="Go to previous step"
                  className="disabled:invisible disabled:cursor-not-allowed"
                  disabled={currentStep === 0}
                  onClick={() => {
                    if (currentStep === 0) {
                      return;
                    }
                    setCurrentStep((prev) => prev - 1);
                    setClickDirection(-1);
                  }}
                >
                  <span>Back</span>
                </SecondaryButton>
                <PrimaryButton
                  aria-label="Go to next step"
                  onClick={() => {
                    if (currentStep === 2) {
                      toast.message('Onboarding completed', {
                        description: 'Now you know what to do.',
                      });
                      setCurrentStep(0);
                      return;
                    }
                    setCurrentStep((prev) => prev + 1);
                    setClickDirection(1);
                  }}
                >
                  <span>{currentStep === 2 ? 'Complete' : 'Continue'}</span>
                </PrimaryButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
}
