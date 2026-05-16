import { useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

const ImageGallery = ({ images, columns = 3 }: ImageGalleryProps) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-3 sm:gap-4`}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIdx(i)}
            className="aspect-square overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              decoding="async"
              width="800"
              height="800"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 rounded-full text-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setLightboxIdx(null)}
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
          <img
            src={images[lightboxIdx].src}
            alt={images[lightboxIdx].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            loading="lazy"
            decoding="async"
            width="800"
            height="800"
          />
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
