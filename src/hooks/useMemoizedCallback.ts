import { useCallback, useRef } from 'react';

/**
 * Custom hook để memoize callbacks với dependency tracking
 * Tương tự useCallback nhưng với shallow comparison cho dependencies
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[],
): T {
  const ref = useRef<{
    deps: any[];
    callback: T;
    memoized: T;
  } | null>(null);

  if (!ref.current || !shallowEqual(ref.current.deps, dependencies)) {
    ref.current = {
      deps: dependencies,
      callback,
      memoized: callback,
    };
  }

  return ref.current.memoized;
}

/**
 * Shallow comparison cho arrays
 */
function shallowEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Hook để debounce function calls
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = [],
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay, ...dependencies],
  );

  return debouncedCallback;
}

/**
 * Hook để throttle function calls
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = [],
): T {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    ((...args: any[]) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        callback(...args);
        lastCallRef.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastCallRef.current = Date.now();
          },
          delay - (now - lastCallRef.current),
        );
      }
    }) as T,
    [callback, delay, ...dependencies],
  );

  return throttledCallback;
}
