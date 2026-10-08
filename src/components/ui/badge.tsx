import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary-lighter/50 bg-primary-bg px-3 py-1 text-xs font-semibold tracking-wide text-primary',
        className,
      )}
      {...props}
    />
  );
}
