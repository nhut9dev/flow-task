import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook để quản lý localStorage với caching và error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {},
) {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * Hook để cache API responses
 */
export function useApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number; // Time to live in milliseconds
    staleWhileRevalidate?: boolean;
  } = {},
) {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchRef = useRef<number>(0);

  const cacheKey = `api_cache_${key}`;
  const timestampKey = `api_cache_timestamp_${key}`;

  const [cachedData, setCachedData] = useLocalStorage<T | null>(cacheKey, null);
  const [cachedTimestamp, setCachedTimestamp] = useLocalStorage<number>(timestampKey, 0);

  const isStale = Date.now() - cachedTimestamp > ttl;

  const fetchData = useCallback(
    async (force = false) => {
      if (!force && !isStale && cachedData) {
        setData(cachedData);
        return cachedData;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        setData(result);
        setCachedData(result);
        setCachedTimestamp(Date.now());
        lastFetchRef.current = Date.now();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);

        // Return stale data if available and staleWhileRevalidate is enabled
        if (staleWhileRevalidate && cachedData && !isStale) {
          setData(cachedData);
          return cachedData;
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      fetcher,
      cachedData,
      cachedTimestamp,
      isStale,
      ttl,
      staleWhileRevalidate,
      setCachedData,
      setCachedTimestamp,
    ],
  );

  const invalidate = useCallback(() => {
    setCachedData(null);
    setCachedTimestamp(0);
    setData(null);
  }, [setCachedData, setCachedTimestamp]);

  // Initialize with cached data if available
  useEffect(() => {
    if (cachedData && !isStale) {
      setData(cachedData);
    }
  }, [cachedData, isStale]);

  return {
    data,
    loading,
    error,
    fetchData,
    invalidate,
    isStale,
    lastFetch: lastFetchRef.current,
  };
}

/**
 * Hook để debounce localStorage updates
 */
export function useDebouncedLocalStorage<T>(key: string, initialValue: T, delay: number = 1000) {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSetValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }, delay);
    },
    [key, value, delay],
  );

  // Initialize from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, debouncedSetValue] as const;
}
