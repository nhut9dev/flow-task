import { AlertCircle, X } from 'lucide-react';

import { AppError } from '~lib/errors/AppError';
import { Button } from '~ui/button';

interface ErrorMessageProps {
  error: AppError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, onDismiss, className }: ErrorMessageProps) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className={`bg-destructive/10 border border-destructive/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <p className="text-sm text-destructive font-medium">{message}</p>

          {typeof error === 'object' && error.code && (
            <p className="text-xs text-muted-foreground mt-1">Error code: {error.code}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
              Retry
            </Button>
          )}

          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} className="text-xs p-1 h-auto">
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
