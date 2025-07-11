import { useCallback, useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface UseIntersectionObserverResult {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  isVisible: boolean;
}

/**
 * Hook để lazy load components và images
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverResult {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: Element | null) => {
      if (elementRef.current) {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }

      elementRef.current = node;

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);
            }
          },
          {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px',
            root: options.root || null,
          },
        );

        observerRef.current.observe(node);
      }
    },
    [options.threshold, options.rootMargin, options.root, isVisible],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { ref, isIntersecting, isVisible };
}

/**
 * Hook để lazy load images
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (isVisible && src) {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setError(false);
      };

      img.onerror = () => {
        setError(true);
        setIsLoaded(false);
      };
    }
  }, [isVisible, src]);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    error,
    isVisible,
  };
}

/**
 * Hook để lazy load components
 */
export function useLazyComponent<T>(importFn: () => Promise<{ default: React.ComponentType<T> }>) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (isVisible && !Component && !isLoaded) {
      importFn()
        .then((module) => {
          setComponent(() => module.default);
          setIsLoaded(true);
          setError(false);
        })
        .catch((err) => {
          console.error('Failed to load component:', err);
          setError(true);
          setIsLoaded(false);
        });
    }
  }, [isVisible, Component, isLoaded, importFn]);

  return {
    ref,
    Component,
    isLoaded,
    error,
    isVisible,
  };
}
