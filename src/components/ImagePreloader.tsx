import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface ImagePreloaderProps {
  src: string; // Base path without extension
  as?: 'image';
  type?: 'image/avif' | 'image/webp' | 'image/jpeg';
  imageSrcSet?: string;
  imageSizes?: string;
}

/**
 * ImagePreloader Component
 * 
 * Preloads critical images (hero, above-the-fold) using <link rel="preload">
 * Only use for LCP (Largest Contentful Paint) images
 * 
 * @example
 * <ImagePreloader
 *   src="/images/hero"
 *   type="image/avif"
 *   imageSrcSet="/images/hero-640w.avif 640w, /images/hero-1280w.avif 1280w"
 *   imageSizes="100vw"
 * />
 */
export const ImagePreloader = ({
  src,
  as = 'image',
  type = 'image/avif',
  imageSrcSet,
  imageSizes = '100vw',
}: ImagePreloaderProps) => {
  // Generate default srcset if not provided
  const defaultSrcSet = imageSrcSet || 
    `${src}-640w.${type.split('/')[1]} 640w, ${src}-1280w.${type.split('/')[1]} 1280w`;

  return (
    <Helmet>
      <link
        rel="preload"
        as={as}
        type={type}
        href={`${src}-1280w.${type.split('/')[1]}`}
        imageSrcSet={defaultSrcSet}
        imageSizes={imageSizes}
      />
    </Helmet>
  );
};

/**
 * Helper: Preload multiple critical images
 */
export const PreloadImages = ({ images }: { images: ImagePreloaderProps[] }) => {
  return (
    <>
      {images.map((img, index) => (
        <ImagePreloader key={index} {...img} />
      ))}
    </>
  );
};

/**
 * Hook: Preload images programmatically
 */
export const useImagePreload = (imageUrls: string[]) => {
  useEffect(() => {
    imageUrls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, [imageUrls]);
};

export default ImagePreloader;
