import { cn } from '~lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  if (lines === 1) {
    return <div className={cn('animate-pulse bg-muted rounded', className || 'h-4 w-full')} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-muted rounded',
            className || 'h-4 w-full',
            index === lines - 1 && 'w-3/4',
          )}
        />
      ))}
    </div>
  );
}
