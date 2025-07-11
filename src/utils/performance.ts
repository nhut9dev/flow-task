/**
 * Utility functions cho performance optimization
 */

/**
 * Debounce function để tránh gọi quá nhiều lần
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function để giới hạn tần suất gọi
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Memoize function với cache size limit
 */
export function memoize<T extends (...args: any[]) => any>(func: T, maxSize: number = 100): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);

    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch DOM updates để tối ưu performance
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  if (typeof window === 'undefined') {
    updates.forEach((update) => update());
    return;
  }

  // Use requestAnimationFrame để batch updates
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

/**
 * Lazy load script
 */
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string = 'fetch'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  document.head.appendChild(link);
}

/**
 * Measure function execution time
 */
export function measureTime<T>(fn: () => T, label?: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (process.env.NODE_ENV === 'development' && label) {
    console.log(`[${label}] Execution time: ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Measure async function execution time
 */
export async function measureTimeAsync<T>(fn: () => Promise<T>, label?: string): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (process.env.NODE_ENV === 'development' && label) {
    console.log(`[${label}] Execution time: ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Intersection Observer wrapper
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }

  return new IntersectionObserver(callback, options);
}

/**
 * Resize Observer wrapper
 */
export function createResizeObserver(
  callback: (entries: ResizeObserverEntry[]) => void,
): ResizeObserver | null {
  if (typeof window === 'undefined' || !window.ResizeObserver) {
    return null;
  }

  return new ResizeObserver(callback);
}

/**
 * Performance mark và measure
 */
export function createPerformanceMark(name: string): void {
  if (typeof performance !== 'undefined') {
    performance.mark(name);
  }
}

export function createPerformanceMeasure(name: string, startMark: string, endMark: string): void {
  if (typeof performance !== 'undefined') {
    try {
      performance.measure(name, startMark, endMark);
    } catch (error) {
      console.warn(`Failed to create performance measure: ${name}`, error);
    }
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): {
  navigation: PerformanceNavigationTiming | null;
  memory: any;
  timing: PerformanceTiming | null;
} {
  if (typeof window === 'undefined') {
    return { navigation: null, memory: null, timing: null };
  }

  const navigationEntry = performance.getEntriesByType('navigation')[0];
  return {
    navigation: navigationEntry ? (navigationEntry as PerformanceNavigationTiming) : null,
    memory: (performance as any).memory || null,
    timing: (performance as any).timing || null,
  };
}

/**
 * Optimize images với lazy loading
 */
export function optimizeImage(src: string): string {
  // Implement image optimization logic here
  // This could integrate with a CDN or image optimization service
  return src;
}

/**
 * Prefetch data
 */
export function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000, // 5 minutes
): Promise<T> {
  const cacheKey = `prefetch_${key}`;
  const timestampKey = `prefetch_timestamp_${key}`;

  const cached = localStorage.getItem(cacheKey);
  const timestamp = localStorage.getItem(timestampKey);

  if (cached && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < ttl) {
      return Promise.resolve(JSON.parse(cached));
    }
  }

  return fetcher().then((data) => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(timestampKey, Date.now().toString());
    return data;
  });
}
