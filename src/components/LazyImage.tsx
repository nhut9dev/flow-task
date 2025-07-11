'use client';

import { memo } from 'react';

import { useLazyImage } from '~hooks/useIntersectionObserver';
import { LoadingSkeleton } from '~ui/loading-skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
}

const LazyImage = memo<LazyImageProps>(
  ({ src, alt, placeholder, className = '', width, height }) => {
    const { ref, src: imageSrc, isLoaded, error, isVisible } = useLazyImage(src, placeholder);

    if (error) {
      return (
        <div
          className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
          style={{ width, height }}
        >
          <span className="text-xs">Failed to load image</span>
        </div>
      );
    }

    return (
      <div ref={ref} className={`relative ${className}`} style={{ width, height }}>
        {!isLoaded && <LoadingSkeleton className="absolute inset-0" />}

        {isVisible && (
          <img
            src={imageSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ width, height }}
          />
        )}
      </div>
    );
  },
);

LazyImage.displayName = 'LazyImage';

export default LazyImage;
