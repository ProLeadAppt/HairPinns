import { useEffect, useRef, useState } from "react";

interface GalleryImage {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "editorial";
}

const ImageGallery = ({ images, columns = 3, variant = "default" }: ImageGalleryProps) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const closeLightbox = () => {
    const returnIndex = lightboxIdx;
    setLightboxIdx(null);
    window.setTimeout(() => {
      if (returnIndex !== null) triggerRefs.current[returnIndex]?.focus();
    }, 0);
  };

  useEffect(() => {
    if (lightboxIdx === null) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIdx]);

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <>
      <div data-gallery-variant={variant} className={`grid ${gridCols[columns]} ${variant === "editorial" ? "gap-x-3 gap-y-8 sm:gap-x-5" : "gap-3 sm:gap-4"}`}>
        {images.map((img, i) => (
          <button
            key={i}
            ref={(node) => { triggerRefs.current[i] = node; }}
            onClick={() => setLightboxIdx(i)}
            className={variant === "editorial"
              ? "group aspect-[4/5] overflow-hidden border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-plum))]"
              : "aspect-square overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-brand-500"}
          >
            <picture className="block h-full w-full">
              {img.fallbackSrc && <source type="image/avif" srcSet={img.src} />}
              <img
                src={img.fallbackSrc || img.src}
                alt={img.alt}
                loading="lazy"
                className={variant === "editorial" ? "h-full w-full object-cover" : "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"}
                decoding="async"
                width="800"
                height="800"
              />
            </picture>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded work image"
          onClick={closeLightbox}
        >
          <button
            ref={closeRef}
            type="button"
            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 rounded-full text-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={closeLightbox}
            aria-label="Close image gallery"
          >
            &times;
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full text-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
          >
            &lsaquo;
          </button>
          <picture className="contents">
            {images[lightboxIdx].fallbackSrc && <source type="image/avif" srcSet={images[lightboxIdx].src} />}
            <img
              src={images[lightboxIdx].fallbackSrc || images[lightboxIdx].src}
              alt={images[lightboxIdx].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
          </picture>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full text-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((lightboxIdx + 1) % images.length);
            }}
            aria-label="Next image"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
