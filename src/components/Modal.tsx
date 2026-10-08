import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Accessible modal: Escape to close, body scroll lock, focus trap-lite
 * (initial focus on close button), calm spring entrance.
 */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy: string;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
        >
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink-dark/40 backdrop-blur-sm"
            tabIndex={-1}
          />
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'glass relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-card bg-white shadow-bloom sm:rounded-card',
              wide ? 'max-w-4xl' : 'max-w-2xl',
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-medium shadow-calm transition hover:scale-105 hover:text-primary"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
