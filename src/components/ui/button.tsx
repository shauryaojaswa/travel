import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-6 py-3',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white shadow-calm hover:bg-primary-light hover:shadow-calm-md active:scale-[0.98]',
        outline:
          'border-2 border-primary-light bg-transparent text-primary hover:bg-primary-bg hover:shadow-calm active:scale-[0.98]',
        soft: 'bg-primary-bg text-primary hover:bg-primary-lighter/50 hover:shadow-calm active:scale-[0.98]',
        ghost: 'text-ink-medium hover:bg-primary-bg hover:text-primary',
        white: 'bg-white text-primary shadow-calm hover:shadow-calm-md hover:scale-[1.02]',
      },
      size: {
        default: 'min-h-[44px] px-6 py-3',
        sm: 'min-h-[38px] px-4 py-2 text-xs',
        lg: 'min-h-[52px] px-8 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
