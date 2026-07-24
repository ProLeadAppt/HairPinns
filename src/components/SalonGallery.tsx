import { useState, useEffect, useRef, type CSSProperties } from 'react';
import OptimizedImage from './OptimizedImage';

interface GalleryImage {
  src: string;
  alt: string;
  aspectRatio: number; // e.g., 1.5 for 3:2, 0.75 for 3:4
}

interface SalonGalleryProps {
  images: GalleryImage[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: string;
}

/**
 * SalonGallery Component
 * 
 * CSS Masonry layout with lazy loading and no CLS
 * Reserved aspect ratio prevents layout shift
 * 
 * @example
 * <SalonGallery
 *   images={[
 *     { src: '/gallery/foils-1', alt: 'Full head foils on blonde hair at Hair Pinns, Bangor', aspectRatio: 1.33 },
 *     { src: '/gallery/treatment-2', alt: 'Keratin treatment on curly hair at Hair Pinns, Bangor', aspectRatio: 0.75 }
 *   ]}
 *   columns={{ mobile: 2, tablet: 3, desktop: 4 }}
 * />
 */
export const SalonGallery = ({
  images,
  columns = { mobile: 2, tablet: 3, desktop: 4 },
  gap = '1rem',
}: SalonGalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setLoadedImages((prev) => new Set(prev).add(index));
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      className="gallery-masonry"
      style={{
        display: 'grid',
        gap: gap,
        gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
      }}
    >
      <style>
        {`
          @media (min-width: 768px) {
            .gallery-masonry {
              grid-template-columns: repeat(${columns.tablet}, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .gallery-masonry {
              grid-template-columns: repeat(${columns.desktop}, 1fr);
            }
          }
          
          .gallery-item {
            break-inside: avoid;
            position: relative;
            overflow: hidden;
            border-radius: 0;
          }
          
          .gallery-item::before {
            content: '';
            display: block;
            padding-top: calc(100% / var(--aspect-ratio));
          }
          
          .gallery-item img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      {images.map((image, index) => {
        const shouldLoad = loadedImages.has(index);

        return (
          <div
            key={index}
            className="gallery-item group cursor-pointer border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-3 transition-opacity duration-300 hover:opacity-95"
            style={{
              '--aspect-ratio': image.aspectRatio,
            } as CSSProperties}
            data-index={index}
            ref={(el) => {
              if (el && !shouldLoad && observerRef.current) {
                observerRef.current.observe(el);
              }
            }}
          >
            {shouldLoad ? (
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SalonGallery;
