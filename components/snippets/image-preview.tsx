'use client';

import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const MotionImage = motion.create(Image);

interface ImagePreviewProps {
  uniqueId?: string;
}

export function ImagePreview({ uniqueId = '' }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex w-[260px] flex-col rounded-xl border">
      <MotionConfig
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1, duration: 0.6 }}
      >
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <motion.div
              layoutId={`image-preview-dialog${uniqueId}`}
              className="relative z-10 aspect-video w-full cursor-pointer rounded-lg"
              role="button"
            >
              <MotionImage
                layoutId={`image-preview${uniqueId}`}
                src="/gyoza-shop.jpg"
                alt="gyoza shop in Tokyo, Japan."
                fill
                priority
                sizes="100%"
                className="rounded-lg object-cover"
              />
            </motion.div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <AnimatePresence initial={false} mode="sync">
              {isOpen && (
                <>
                  <Dialog.Overlay>
                    <motion.div
                      className="fixed inset-0 z-40 h-full w-full backdrop-blur-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <Dialog.Content className="w-[720px]">
                      <VisuallyHidden>
                        <Dialog.Title>Image Preview</Dialog.Title>
                        <Dialog.Description>
                          Interaction built using shared layout animations and Radix dialog
                          primitive.
                        </Dialog.Description>
                      </VisuallyHidden>
                      <motion.div
                        layoutId={`image-preview-dialog${uniqueId}`}
                        className="relative aspect-video w-full overflow-hidden rounded-2xl"
                      >
                        <MotionImage
                          layoutId={`image-preview${uniqueId}`}
                          src="/gyoza-shop.jpg"
                          alt="gyoza shop in Tokyo, Japan."
                          fill
                          sizes="100%"
                          className="rounded-2xl object-cover select-none"
                        />
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            role="button"
                            aria-label="Close dialog"
                            className="absolute top-3 right-3 z-10 h-fit w-fit rounded-full border border-white/20 bg-white/20 p-[6px] backdrop-blur hover:bg-white/50 focus-visible:outline-none"
                          >
                            <X size={20} color="white" />
                          </button>
                        </Dialog.Close>
                      </motion.div>
                    </Dialog.Content>
                  </div>
                </>
              )}
            </AnimatePresence>
          </Dialog.Portal>
        </Dialog.Root>
      </MotionConfig>
    </div>
  );
}
