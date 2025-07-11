import { useCallback, useState } from 'react';

import { ApiResponse } from '~lib/api/client';
import { AppError } from '~lib/errors/AppError';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null,
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall(...args);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        const appError =
          error instanceof AppError
            ? error
            : new AppError(error.message || 'An error occurred', error.status || 500);

        setState({
          data: null,
          loading: false,
          error: appError,
        });
      }
    },
    [apiCall],
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}
