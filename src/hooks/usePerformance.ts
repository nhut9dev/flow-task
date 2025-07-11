import { useCallback, useEffect, useRef } from 'react';
// Import ReactDOM for flushSync
import ReactDOM from 'react-dom';

/**
 * Hook để monitor component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTimeRef.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[${componentName}] Render #${renderCountRef.current} (${timeSinceLastRender.toFixed(2)}ms)`,
      );
    }

    lastRenderTimeRef.current = currentTime;
  });

  const getRenderStats = useCallback(
    () => ({
      renderCount: renderCountRef.current,
      timeSinceLastRender: performance.now() - lastRenderTimeRef.current,
    }),
    [],
  );

  return { getRenderStats };
}

/**
 * Hook để monitor memory usage
 */
export function useMemoryMonitor() {
  const memoryRef = useRef<{
    initial: number;
    current: number;
    peak: number;
  } | null>(null);

  useEffect(() => {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      memoryRef.current = {
        initial: memory.usedJSHeapSize,
        current: memory.usedJSHeapSize,
        peak: memory.usedJSHeapSize,
      };

      const interval = setInterval(() => {
        if (memoryRef.current) {
          memoryRef.current.current = memory.usedJSHeapSize;
          memoryRef.current.peak = Math.max(memoryRef.current.peak, memory.usedJSHeapSize);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const getMemoryStats = useCallback(() => {
    if (!memoryRef.current) return null;

    const { initial, current, peak } = memoryRef.current;
    return {
      initial: formatBytes(initial),
      current: formatBytes(current),
      peak: formatBytes(peak),
      increase: formatBytes(current - initial),
    };
  }, []);

  return { getMemoryStats };
}

/**
 * Hook để optimize re-renders với shallow comparison
 */
export function useShallowEqual<T>(value: T): T {
  const ref = useRef<T>(value);

  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Hook để batch updates
 */
export function useBatchUpdates() {
  const batchRef = useRef<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchUpdate = useCallback((update: () => void) => {
    batchRef.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const updates = [...batchRef.current];
      batchRef.current = [];

      // Execute all updates in a single batch
      ReactDOM.flushSync(() => {
        updates.forEach((update) => update());
      });
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { batchUpdate };
}

/**
 * Hook để measure function execution time
 */
export function usePerformanceTimer() {
  const timersRef = useRef<Map<string, number>>(new Map());

  const startTimer = useCallback((name: string) => {
    timersRef.current.set(name, performance.now());
  }, []);

  const endTimer = useCallback((name: string) => {
    const startTime = timersRef.current.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      timersRef.current.delete(name);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Timer] ${name}: ${duration.toFixed(2)}ms`);
      }

      return duration;
    }
    return 0;
  }, []);

  const measureAsync = useCallback(
    async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
      startTimer(name);
      try {
        const result = await fn();
        return result;
      } finally {
        endTimer(name);
      }
    },
    [startTimer, endTimer],
  );

  return { startTimer, endTimer, measureAsync };
}

// Utility functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
