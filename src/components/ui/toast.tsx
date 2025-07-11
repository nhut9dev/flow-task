import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~utils/common';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[100%] data-[swipe=move]:translate-x-0 data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-80 data-[state=closed]:slide-out-to-right-40 data-[state=open]:slide-in-from-right-40',
  {
    variants: {
      variant: {
        default: 'bg-background border',
        success:
          'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
        destructive:
          'group destructive bg-destructive text-destructive-foreground border-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, action, variant, onClose, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
        <div className="flex flex-col gap-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          {description && <div className="text-xs opacity-80">{description}</div>}
        </div>
        {action}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    );
  },
);
Toast.displayName = 'Toast';

export { Toast, toastVariants };
