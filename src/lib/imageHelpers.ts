/**
 * Image Optimization Helpers
 * 
 * Utilities for generating proper alt text, sizes attributes, and image paths
 */

// Alt Text Patterns
export const generateAltText = {
  /**
   * Service/Style on hair type
   * @example "Full head foils on brunette hair at Hair Pinns, Bangor"
   */
  service: (service: string, hairType: string) =>
    `${service} on ${hairType} hair at Hair Pinns, Bangor`,

  /**
   * Product on hair type
   * @example "Keratin smoothing treatment on curly hair at Hair Pinns, Bangor"
   */
  product: (product: string, hairType?: string) =>
    hairType
      ? `${product} on ${hairType} hair at Hair Pinns, Bangor`
      : `${product} hair care product at Hair Pinns, Bangor`,

  /**
   * Salon interior
   * @example "Modern styling station at Hair Pinns salon, Bangor"
   */
  interior: (description: string) =>
    `${description} at Hair Pinns salon, Bangor`,

  /**
   * Before/After
   * @example "Before and after full head foils transformation at Hair Pinns, Bangor"
   */
  transformation: (service: string) =>
    `Before and after ${service} transformation at Hair Pinns, Bangor`,

  /**
   * Staff/About
   * @example "Jena, lead stylist at Hair Pinns, Bangor"
   */
  staff: (name: string, role: string) =>
    `${name}, ${role} at Hair Pinns, Bangor`,
};

// Responsive Sizes Attributes
export const imageSizes = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  heroFullWidth: '100vw',
  productGrid3Col: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  productGrid2Col: '(max-width: 768px) 100vw, 50vw',
  collectionCard: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw',
  thumbnail: '(max-width: 768px) 25vw, 150px',
  galleryMasonry: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  avatar: '80px',
  logo: '200px',
};

// Image Dimensions by Type (for aspect ratio reservation)
export const imageDimensions = {
  hero: { width: 1920, height: 1080 }, // 16:9
  heroTall: { width: 1920, height: 1280 }, // 3:2
  productSquare: { width: 800, height: 800 }, // 1:1
  productPortrait: { width: 800, height: 1067 }, // 3:4
  collectionCard: { width: 800, height: 450 }, // 16:9
  thumbnail: { width: 150, height: 150 }, // 1:1
  gallery: { width: 600, height: 800 }, // 3:4 (variable)
  avatar: { width: 80, height: 80 }, // 1:1
  logo: { width: 200, height: 60 }, // Variable
};

// Target File Sizes (for optimization guidance)
export const targetFileSizes = {
  hero: 120, // KB
  productGrid: 80, // KB
  thumbnail: 35, // KB
  collection: 100, // KB
  gallery: 60, // KB
};

/**
 * Generate image path with format
 */
export const getImagePath = (
  basePath: string,
  width: number,
  format: 'avif' | 'webp' | 'jpg'
): string => {
  return `${basePath}-${width}w.${format}`;
};

/**
 * Generate srcset for multiple formats
 */
export const generateSrcSet = (
  basePath: string,
  sizes: number[],
  format: 'avif' | 'webp' | 'jpg'
): string => {
  return sizes
    .map((size) => `${basePath}-${size}w.${format} ${size}w`)
    .join(', ');
};

/**
 * Standard responsive breakpoints
 */
export const imageBreakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280,
  xlarge: 1536,
  xxlarge: 1920,
};

/**
 * Get optimal image sizes for different contexts
 */
export const getOptimalSizes = (context: keyof typeof imageSizes): number[] => {
  const sizeMap: Record<string, number[]> = {
    hero: [640, 768, 1024, 1280, 1536, 1920],
    heroFullWidth: [640, 768, 1024, 1280, 1536, 1920],
    productGrid3Col: [320, 480, 640, 800],
    productGrid2Col: [480, 640, 800, 1024],
    collectionCard: [480, 640, 800, 1024],
    thumbnail: [80, 150, 200],
    galleryMasonry: [320, 480, 640],
    avatar: [80, 160],
    logo: [200, 400],
  };
  
  return sizeMap[context] || [640, 1024, 1536];
};

/**
 * Calculate aspect ratio padding for CSS
 */
export const getAspectRatioPadding = (width: number, height: number): string => {
  return `${(height / width) * 100}%`;
};

/**
 * Validate alt text (no keyword stuffing)
 */
export const validateAltText = (alt: string): boolean => {
  const keywords = ['hair pinns', 'bangor', 'hair salon', 'hairdresser'];
  const lowerAlt = alt.toLowerCase();
  
  // Check for multiple instances of same keyword
  for (const keyword of keywords) {
    const matches = lowerAlt.match(new RegExp(keyword, 'g'));
    if (matches && matches.length > 1) {
      console.warn(`Alt text contains keyword "${keyword}" multiple times. Avoid keyword stuffing.`);
      return false;
    }
  }
  
  // Check for excessive length
  if (alt.length > 125) {
    console.warn('Alt text is too long. Keep under 125 characters.');
    return false;
  }
  
  // Check for empty or generic text
  if (!alt || alt.toLowerCase().includes('image') || alt.toLowerCase().includes('photo')) {
    console.warn('Alt text is empty or too generic. Be descriptive.');
    return false;
  }
  
  return true;
};

export default {
  generateAltText,
  imageSizes,
  imageDimensions,
  targetFileSizes,
  getImagePath,
  generateSrcSet,
  imageBreakpoints,
  getOptimalSizes,
  getAspectRatioPadding,
  validateAltText,
};
