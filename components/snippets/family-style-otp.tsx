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
      <AnimatePresence initial={false} mode="wait">
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

function Slot(props: SlotProps & { isShaking?: boolean; isVerifying: boolean; delay: number }) {
  const placeholderChar = '0';

  return (
    <motion.div
      layout
      className={cn(
        'relative flex h-[40px] w-[36px] items-center justify-center rounded-[10px] bg-[#f7f7f7] text-base font-semibold text-[#232323]',
        props.isVerifying && 'fast-pulse text-[#232323]/60 duration-100',
      )}
      style={{
        animationDelay: `${props.delay}ms`,
      }}
    >
      <AnimatedNumber value={props.char} placeholder={placeholderChar} />
      {props.isActive ? (
        <motion.div
          layoutId="indicator"
          className={cn(
            'absolute inset-0 z-10 rounded-[10px] border-3',
            props.isShaking ? 'border-rose-400' : 'border-blue-400',
            props.isVerifying && 'border-none',
          )}
          transition={{ duration: 0.12, ease: 'easeInOut' }}
        />
      ) : null}
    </motion.div>
  );
}

export function FamilyStyleOTP() {
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
    setErrorMessage('');

    setTimeout(() => {
      if (value === CORRECT_OTP) {
        toast.message('Successfully verified', {
          description: 'Your OTP has been verified.',
        });
      } else {
        setIsShaking(true);
        setErrorMessage('Invalid validation code');
      }

      setValue('');
      setIsVerifying(false);

      // Focus back to the first slot after submitting.
      if (otpRef.current) {
        otpRef.current.focus();
        otpRef.current.setSelectionRange(0, 0);
      }
    }, 2000);
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
                  <Slot
                    key={idx}
                    {...slot}
                    isShaking={isShaking}
                    isVerifying={isVerifying}
                    delay={idx * 100}
                  />
                ))}
              </div>
              <Separator />
              <div className="flex gap-1">
                {slots.slice(3).map((slot, idx) => (
                  <Slot
                    key={idx}
                    {...slot}
                    isShaking={isShaking}
                    isVerifying={isVerifying}
                    delay={(idx + 3) * 100}
                  />
                ))}
              </div>
            </>
          )}
        />
      </motion.div>
      <span className="text-tertiary mb-3 text-[13px]">
        Didn{"'"}t receive a code?{' '}
        <button
          className="cursor-pointer font-semibold text-blue-500"
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
        <AnimatePresence mode="wait" initial={false}>
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
          'flex h-[40px] w-full cursor-pointer items-center justify-center rounded-full bg-blue-400 font-semibold text-white select-none disabled:cursor-not-allowed disabled:bg-blue-400/40',
          'transform transition-transform duration-200 ease-out hover:scale-95 active:scale-95 disabled:scale-100',
          isVerifying
            ? 'text-[#b3b3b3] disabled:bg-[#f0f0f0]'
            : 'bg-blue-400 disabled:bg-blue-400/40',
        )}
      >
        <AnimatePresence initial={false}>
          {isVerifying ? (
            <motion.div
              className="flex w-fit items-center gap-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
              >
                <path
                  d="M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.024 13.2418 10.2961 13.5433C9.56814 13.8448 8.78793 14 8 14C7.21206 14 6.43185 13.8448 5.70389 13.5433C4.97594 13.2418 4.31451 12.7998 3.75736 12.2426C3.2002 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 7.21207 2.15519 6.43186 2.45672 5.7039C2.75825 4.97595 3.2002 4.31451 3.75736 3.75736C4.31451 3.20021 4.97594 2.75825 5.7039 2.45673C6.43185 2.1552 7.21207 2 8 2C8.78793 2 9.56814 2.1552 10.2961 2.45673C11.0241 2.75826 11.6855 3.20021 12.2426 3.75736C12.7998 4.31452 13.2417 4.97595 13.5433 5.7039C13.8448 6.43186 14 7.21207 14 8L14 8Z"
                  stroke="#DADADA"
                  strokeWidth="3"
                />
                <path
                  d="M14 8C14 8.94687 13.7759 9.88029 13.346 10.7239C12.9162 11.5676 12.2927 12.2976 11.5267 12.8541C10.7607 13.4107 9.87381 13.778 8.9386 13.9261C8.0034 14.0743 7.04641 13.9989 6.14589 13.7063"
                  stroke="#191919"
                  strokeOpacity="0.36"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Verifying
            </motion.div>
          ) : (
            <span>Submit</span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
