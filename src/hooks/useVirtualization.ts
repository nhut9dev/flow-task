import { useCallback, useMemo, useRef, useState } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizationResult {
  virtualItems: Array<{
    index: number;
    offsetTop: number;
    height: number;
  }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export function useVirtualization(
  items: any[],
  { itemHeight, containerHeight, overscan = 5 }: VirtualizationOptions,
): VirtualizationResult {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const virtualItems = useMemo(() => {
    const items: Array<{ index: number; offsetTop: number; height: number }> = [];

    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight,
        height: itemHeight,
      });
    }

    return items;
  }, [startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  };

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll,
  };
}

/**
 * Hook để lazy load data với infinite scrolling
 */
export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  hasMore: boolean,
  threshold = 100,
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await loadMore();
      setData((prev) => [...prev, ...newData]);
    } catch (error) {
      console.error('Failed to load more data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadMore, hasMore, loading]);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreData();
          }
        },
        { rootMargin: `${threshold}px` },
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, loadMoreData, threshold],
  );

  return {
    data,
    loading,
    hasMore,
    lastElementRef,
    loadMoreData,
  };
}
