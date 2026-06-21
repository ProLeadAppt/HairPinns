import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

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
    const urls = Array.from(new Set(imageUrls.filter(Boolean)));
    if (!urls.length) return;

    const added: HTMLLinkElement[] = [];
    urls.forEach((url) => {
      const selector = `link[rel="preload"][as="image"][href="${CSS.escape(url)}"]`;
      if (document.head.querySelector(selector)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.setAttribute('data-hp-preload', 'true');
      document.head.appendChild(link);
      added.push(link);
    });

    return () => {
      added.forEach((link) => link.remove());
    };
  }, [imageUrls]);
};

export default ImagePreloader;
