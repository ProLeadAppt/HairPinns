import { useState } from 'react';

interface OptimizedImageProps {
  src: string; // Base path without extension (e.g., "/images/hero")
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  onLoad?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * Serves AVIF/WebP with JPG fallback using <picture> element
 * Implements responsive images with srcset and sizes
 * 
 * @example
 * <OptimizedImage
 *   src="/images/hero"
 *   alt="Balayage on brunette hair at Hair Pinns, Bangor"
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
 *   priority={true}
 * />
 */
export const OptimizedImage = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  // Generate srcset for different sizes
  const generateSrcSet = (format: string) => {
    const sizes = [640, 768, 1024, 1280, 1536];
    return sizes
      .map((size) => `${src}-${size}w.${format} ${size}w`)
      .join(', ');
  };

  return (
    <picture className={`block ${!imageLoaded ? 'animate-pulse bg-muted' : ''}`}>
      {/* AVIF - smallest, modern browsers */}
      <source
        type="image/avif"
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
      />
      
      {/* WebP - good compression, wide support */}
      <source
        type="image/webp"
        srcSet={generateSrcSet('webp')}
        sizes={sizes}
      />
      
      {/* JPG - fallback for older browsers */}
      <source
        type="image/jpeg"
        srcSet={generateSrcSet('jpg')}
        sizes={sizes}
      />
      
      {/* Fallback img tag */}
      <img
        src={`${src}-1024w.jpg`}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        style={{
          objectFit: objectFit,
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
        }}
      />
    </picture>
  );
};

/**
 * Responsive Image Sizes Guide:
 * 
 * Hero Images:
 * sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
 * Target: ≤ 120KB
 * 
 * Product Grid (3-col):
 * sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * Target: ≤ 80KB
 * 
 * Thumbnails:
 * sizes="(max-width: 768px) 25vw, 150px"
 * Target: ≤ 35KB
 * 
 * Collection Cards (2-col):
 * sizes="(max-width: 768px) 100vw, 50vw"
 * Target: ≤ 100KB
 */

export default OptimizedImage;
