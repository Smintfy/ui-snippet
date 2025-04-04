'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { OTPInput, SlotProps } from 'input-otp';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AnimatedNumberProps {
  value: string | null;
  placeholder: string;
}

function Separator() {
  return <div className="h-0.5 w-2 rounded-full bg-[#d4d4d4]" />;
}

function AnimatedNumber({ value, placeholder }: AnimatedNumberProps) {
  return (
    <div className="relative flex h-[40px] w-[32px] items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0.25, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.08, ease: 'easeInOut' }}
          className={cn('absolute', value === null ? 'text-primary/10' : '')}
        >
          {value ?? placeholder}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Slot(props: SlotProps & { isShaking?: boolean }) {
  const placeholderChar = '0';

  return (
    <motion.div
      layout
      className="text-primary bg-accent relative flex h-[40px] w-[36px] items-center justify-center rounded-[10px] text-base font-semibold"
    >
      <AnimatedNumber value={props.char} placeholder={placeholderChar} />
      {props.isActive ? (
        <motion.div
          layoutId="indicator"
          className={cn(
            'absolute inset-0 z-10 rounded-[10px] border-3',
            props.isShaking ? 'border-rose-400' : 'border-blue-400',
          )}
          transition={{ duration: 0.12, ease: 'easeInOut' }}
        />
      ) : null}
    </motion.div>
  );
}

export default function FamilyStyleOTP() {
  const CORRECT_OTP = '123456';
  const [value, setValue] = useState('');
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisableSubmitButton(value.length !== 6);
  }, [value]);

  const handleSubmit = () => {
    // Fix for an issue where user can briefly click submit again after submitting,
    // prevent submission if one is already in progress.
    if (isVerifying) return;

    setIsVerifying(true);
    setDisableSubmitButton(true);

    if (value === CORRECT_OTP) {
      toast.message('Successfully verified', {
        description: 'Your OTP has been verified.',
      });
    } else {
      setIsShaking(true);
      setErrorMessage('Sorry, something went wrong.');
    }

    setTimeout(() => {
      setValue('');
      setIsVerifying(false);

      // Focus back to the first slot after submitting.
      if (otpRef.current) {
        otpRef.current.focus();
        otpRef.current.setSelectionRange(0, 0);
      }

      setDisableSubmitButton(false);
    }, 600);
  };

  return (
    <div className="my-6 flex flex-col">
      <div className="mb-6">
        <h2 className="mb-1 text-xl font-semibold text-[#232323]">Verification Code</h2>
        <p className="text-tertiary text-sm">We{"'"}ve sent you a verification code.</p>
      </div>
      <motion.div
        animate={isShaking ? { x: [0, -5, 5, -2.5, 2.5, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => setIsShaking(false)}
      >
        <OTPInput
          ref={otpRef}
          value={value}
          maxLength={6}
          containerClassName="group flex gap-2 items-center mb-6"
          onChange={(newValue) => {
            // Error if value doesn't contain number
            if (!/^\d*$/.test(newValue)) {
              setIsShaking(true);
              return;
            }
            setValue(newValue);
            if (errorMessage) setErrorMessage('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (value.length < 6) return;
              handleSubmit();
            }
          }}
          render={({ slots }) => (
            <>
              <div className="flex gap-1">
                {slots.slice(0, 3).map((slot, idx) => (
                  <Slot key={idx} {...slot} isShaking={isShaking} />
                ))}
              </div>
              <Separator />
              <div className="flex gap-1">
                {slots.slice(3).map((slot, idx) => (
                  <Slot key={idx} {...slot} isShaking={isShaking} />
                ))}
              </div>
            </>
          )}
        />
      </motion.div>
      <span className="text-tertiary mb-3 text-[13px]">
        Didn{"'"}t receive a code?{' '}
        <button
          className="cursor-pointer font-medium text-blue-500"
          onClick={() => {
            toast.message('Verification code has been sent', {
              description: 'Normally you would get a code but this is just a prototype ;)',
            });
          }}
        >
          Resend
        </button>
      </span>
      <div className="mb-12 h-[28px]">
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.p
              key="error-message"
              className="flex h-[28px] w-fit items-center rounded-full bg-rose-50 px-2.5 text-[13px] font-medium text-rose-500"
              initial={{ scale: 0.2, opacity: 0, x: -80 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.2, opacity: 0, x: -80 }}
              transition={{ duration: 0.1 }}
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <button
        disabled={disableSubmitButton}
        onClick={() => {
          handleSubmit();
        }}
        className={cn(
          'h-[40px] w-full cursor-pointer rounded-full bg-blue-400 font-semibold text-white select-none disabled:cursor-not-allowed disabled:bg-blue-400/40',
          'transform transition-transform duration-200 ease-out hover:scale-95 active:scale-95 disabled:scale-100',
          isVerifying
            ? 'text-[#b3b3b3] disabled:bg-[#f0f0f0]'
            : 'bg-blue-400 disabled:bg-blue-400/40',
        )}
      >
        {isVerifying ? 'Verifying' : 'Submit'}
      </button>
    </div>
  );
}
