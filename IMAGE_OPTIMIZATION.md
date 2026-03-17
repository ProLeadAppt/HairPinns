# Image Optimization Guide

## Overview
Comprehensive image optimization strategy using modern formats (AVIF/WebP), responsive loading, and performance-first approach.

---

## 1. Image Formats & Fallbacks

### Format Stack
```
AVIF (smallest, best quality) → WebP (good compression) → JPG (universal fallback)
```

### Browser Support
- **AVIF**: Chrome 85+, Edge 93+, Safari 16+, Firefox 93+
- **WebP**: Chrome 23+, Edge 18+, Safari 14+, Firefox 65+
- **JPG**: Universal fallback

### Implementation
Use `<picture>` element with multiple `<source>` tags:

```tsx
<OptimizedImage
  src="/images/hero"
  alt="Balayage on brunette hair at Hair Pinns, Bangor"
  sizes="(max-width: 768px) 100vw, 1200px"
  priority={true}
/>
```

This generates:
```html
<picture>
  <source type="image/avif" srcset="..." sizes="..." />
  <source type="image/webp" srcset="..." sizes="..." />
  <source type="image/jpeg" srcset="..." sizes="..." />
  <img src="fallback.jpg" alt="..." />
</picture>
```

---

## 2. Target File Sizes

### Size Targets
| Image Type | Target Size | Max Size | Notes |
|------------|-------------|----------|-------|
| Hero Images | ≤ 120KB | 150KB | Above-the-fold, LCP |
| Product Grid | ≤ 80KB | 100KB | 3-column grid items |
| Collection Cards | ≤ 100KB | 120KB | 2-column cards |
| Thumbnails | ≤ 35KB | 50KB | Small UI elements |
| Gallery Images | ≤ 60KB | 80KB | Masonry layout |
| Avatars | ≤ 20KB | 30KB | Profile images |

### Compression Settings (Recommended)
- **AVIF**: Quality 65-75, effort 4
- **WebP**: Quality 75-85
- **JPG**: Quality 80-85, progressive

### Collection Image Compression
Large collection WebP images (>200KB) can be recompressed with:
```bash
npm run compress-collections
```
Targets: volume, heat-protection, frizz-free, blonde-bombshells, curly-girlys, best-sellers. Reduces ~7MB to ~330KB (95%+ savings).

---

## 3. Responsive Images (srcset + sizes)

### Standard Breakpoints
```
640w  - Mobile portrait
768w  - Mobile landscape / Tablet portrait
1024w - Tablet landscape / Small desktop
1280w - Desktop
1536w - Large desktop
1920w - Extra large desktop
```

### Sizes Attribute Patterns

#### Hero Images (Full-width)
```html
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
```
**Use for:** Homepage hero, service page banners

#### Product Grid (3-column)
```html
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
```
**Use for:** Product cards, collection items

#### Collection Cards (2-column)
```html
sizes="(max-width: 768px) 100vw, 50vw"
```
**Use for:** Collection overview cards

#### Thumbnails
```html
sizes="(max-width: 768px) 25vw, 150px"
```
**Use for:** Product thumbnails, related items

#### Gallery (4-column masonry)
```html
sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
```
**Use for:** Salon gallery, portfolio

### Helper Import
```tsx
import { imageSizes } from '@/lib/imageHelpers';

<OptimizedImage
  src="/images/product"
  sizes={imageSizes.productGrid3Col}
  alt="..."
/>
```

---

## 4. Image Preloading (Hero Only)

### When to Preload
✅ **DO Preload:**
- Hero images (LCP - Largest Contentful Paint)
- Above-the-fold images on homepage
- First visible collection/product image

❌ **DON'T Preload:**
- Below-the-fold images
- Gallery images
- Lazy-loaded content
- Background images (use CSS)

### Implementation
```tsx
import { ImagePreloader } from '@/components/ImagePreloader';

// Single image
<ImagePreloader
  src="/images/hero"
  type="image/avif"
  imageSrcSet="/images/hero-640w.avif 640w, /images/hero-1280w.avif 1280w"
  imageSizes="100vw"
/>

// Multiple images
<PreloadImages
  images={[
    { src: '/images/hero', type: 'image/avif', imageSizes: '100vw' }
  ]}
/>
```

### Best Practices
- Only preload 1-2 critical images per page
- Preload AVIF first, browser will fall back if unsupported
- Match srcset/sizes with the actual image element

---

## 5. Salon Gallery Implementation

### CSS Masonry Layout
```tsx
<SalonGallery
  images={[
    { 
      src: '/gallery/balayage-1', 
      alt: 'Balayage on blonde hair at Hair Pinns, Bangor',
      aspectRatio: 1.33 // 4:3
    },
    { 
      src: '/gallery/treatment-2', 
      alt: 'Keratin smoothing on curly hair at Hair Pinns, Bangor',
      aspectRatio: 0.75 // 3:4
    }
  ]}
  columns={{ mobile: 2, tablet: 3, desktop: 4 }}
/>
```

### Features
- **CSS Masonry**: Native grid layout, no JS required
- **Lazy Loading**: Intersection Observer, loads on scroll
- **No CLS**: Reserved aspect ratio prevents layout shift
- **Hover Effects**: Subtle scale on hover
- **Responsive**: 2/3/4 columns based on viewport

### Preventing CLS (Cumulative Layout Shift)
```css
.gallery-item::before {
  content: '';
  display: block;
  padding-top: calc(100% / var(--aspect-ratio));
}
```

Aspect ratio is set inline:
```tsx
style={{ '--aspect-ratio': image.aspectRatio }}
```

This reserves space before image loads, preventing layout shift.

---

## 6. Alt Text Guidelines

### Pattern
```
{{style or product}} on {{hair type/colour}} at Hair Pinns, Bangor
```

### Examples

#### ✅ Good Alt Text
```
"Balayage on brunette hair at Hair Pinns, Bangor"
"Keratin smoothing on curly hair at Hair Pinns, Bangor"
"Full highlights on blonde hair at Hair Pinns, Bangor"
"Olaplex treatment on damaged hair at Hair Pinns, Bangor"
"Modern styling station at Hair Pinns salon, Bangor"
"Jena, lead stylist at Hair Pinns, Bangor"
```

#### ❌ Bad Alt Text (Keyword Stuffing)
```
"Hair Pinns Bangor hair salon balayage hair color Bangor NSW"
"Best hair salon Hair Pinns Bangor hairdresser near me"
"Hair salon image photo at Hair Pinns"
```

### Rules
1. **Be Descriptive**: Describe what's in the image
2. **Include Context**: Hair type, color, service
3. **Mention Location Once**: "at Hair Pinns, Bangor" at end
4. **No Keyword Stuffing**: Use "Hair Pinns, Bangor" max once
5. **Keep Concise**: Under 125 characters
6. **Avoid Generic Terms**: Don't use "image", "photo", "picture"

### Helper Function
```tsx
import { generateAltText } from '@/lib/imageHelpers';

// Service image
generateAltText.service('Balayage', 'brunette');
// → "Balayage on brunette hair at Hair Pinns, Bangor"

// Product image
generateAltText.product('Keratin smoothing treatment', 'curly');
// → "Keratin smoothing treatment on curly hair at Hair Pinns, Bangor"

// Interior image
generateAltText.interior('Modern styling station');
// → "Modern styling station at Hair Pinns salon, Bangor"

// Staff image
generateAltText.staff('Jena', 'lead stylist');
// → "Jena, lead stylist at Hair Pinns, Bangor"
```

### Validation
```tsx
import { validateAltText } from '@/lib/imageHelpers';

validateAltText('Balayage on blonde hair at Hair Pinns, Bangor'); // true
validateAltText('Hair salon Hair Pinns Bangor hair'); // false (keyword stuffing)
```

---

## 7. Component Usage

### OptimizedImage (Primary Component)

#### Hero Image (Priority)
```tsx
import OptimizedImage from '@/components/OptimizedImage';
import { imageSizes } from '@/lib/imageHelpers';

<OptimizedImage
  src="/images/hero"
  alt="Balayage on brunette hair at Hair Pinns, Bangor"
  sizes={imageSizes.hero}
  width={1920}
  height={1080}
  priority={true}
  className="w-full h-auto"
/>
```

#### Product Grid
```tsx
<OptimizedImage
  src="/images/products/shampoo-set"
  alt="Hydrating shampoo set at Hair Pinns, Bangor"
  sizes={imageSizes.productGrid3Col}
  width={800}
  height={800}
  loading="lazy"
  className="rounded-lg"
/>
```

#### Thumbnail
```tsx
<OptimizedImage
  src="/images/products/conditioner-thumb"
  alt="Deep conditioner thumbnail"
  sizes={imageSizes.thumbnail}
  width={150}
  height={150}
  loading="lazy"
  className="rounded"
/>
```

### SalonGallery (Portfolio/Work)
```tsx
import SalonGallery from '@/components/SalonGallery';

<SalonGallery
  images={[
    { 
      src: '/gallery/work-1',
      alt: 'Balayage on blonde hair at Hair Pinns, Bangor',
      aspectRatio: 0.75 // 3:4 portrait
    },
    { 
      src: '/gallery/work-2',
      alt: 'Full colour transformation at Hair Pinns, Bangor',
      aspectRatio: 1.33 // 4:3 landscape
    }
  ]}
  columns={{ mobile: 2, tablet: 3, desktop: 4 }}
  gap="1rem"
/>
```

### ImagePreloader (Hero Only)
```tsx
import { ImagePreloader } from '@/components/ImagePreloader';

<ImagePreloader
  src="/images/hero"
  type="image/avif"
  imageSizes="100vw"
/>
```

---

## 8. File Organization

### Directory Structure
```
public/
├── images/
│   ├── hero/
│   │   ├── hero-640w.avif
│   │   ├── hero-640w.webp
│   │   ├── hero-640w.jpg
│   │   ├── hero-1280w.avif
│   │   ├── hero-1280w.webp
│   │   ├── hero-1280w.jpg
│   │   └── hero-1920w.{avif,webp,jpg}
│   ├── products/
│   │   ├── product-name-320w.{avif,webp,jpg}
│   │   ├── product-name-640w.{avif,webp,jpg}
│   │   └── product-name-800w.{avif,webp,jpg}
│   ├── gallery/
│   │   └── ... (masonry images)
│   └── collections/
│       └── ... (collection cards)
```

### Naming Convention
```
{category}/{name}-{width}w.{format}

Examples:
/images/hero-1280w.avif
/images/products/shampoo-set-640w.webp
/images/gallery/balayage-work-320w.jpg
```

---

## 9. Image Conversion Workflow

### Tools

#### CLI (ImageMagick)
```bash
# Convert to WebP
magick input.jpg -quality 80 -define webp:method=6 output.webp

# Convert to AVIF
magick input.jpg -quality 70 output.avif

# Batch convert and resize
for size in 640 768 1024 1280 1536; do
  magick hero.jpg -resize ${size}x -quality 70 hero-${size}w.avif
  magick hero.jpg -resize ${size}x -quality 80 hero-${size}w.webp
  magick hero.jpg -resize ${size}x -quality 85 hero-${size}w.jpg
done
```

#### Online Tools
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Cloudflare Images](https://www.cloudflare.com/products/cloudflare-images/) - Automatic format serving

#### Build-Time (Recommended)
Use build plugins to automate:
- `@squoosh/lib` (Node)
- `sharp` (Node, best performance)
- `image-webpack-loader` (Webpack)

### Sharp Example (Node Script)
```javascript
const sharp = require('sharp');
const sizes = [640, 768, 1024, 1280, 1536];

async function processImage(input, output) {
  for (const size of sizes) {
    // AVIF
    await sharp(input)
      .resize(size)
      .avif({ quality: 70, effort: 4 })
      .toFile(`${output}-${size}w.avif`);
    
    // WebP
    await sharp(input)
      .resize(size)
      .webp({ quality: 80 })
      .toFile(`${output}-${size}w.webp`);
    
    // JPG
    await sharp(input)
      .resize(size)
      .jpeg({ quality: 85, progressive: true })
      .toFile(`${output}-${size}w.jpg`);
  }
}

// Usage
processImage('./hero.jpg', './public/images/hero');
```

---

## 10. Performance Metrics

### Core Web Vitals Targets

#### LCP (Largest Contentful Paint)
- **Target:** < 2.5s
- **Optimization:** Preload hero image (AVIF), optimize file size to ≤120KB

#### CLS (Cumulative Layout Shift)
- **Target:** < 0.1
- **Optimization:** Reserve aspect ratio on all images, use width/height attributes

#### FID (First Input Delay)
- **Target:** < 100ms
- **Optimization:** Lazy load below-the-fold images, defer non-critical JS

### Monitoring
```javascript
// Log LCP element
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.renderTime, lastEntry.element);
}).observe({ type: 'largest-contentful-paint', buffered: true });

// Log CLS
let clsValue = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      console.log('CLS:', clsValue);
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
```

---

## 11. Checklist

### Before Launch
- [ ] Convert all hero images to AVIF/WebP/JPG at 640w, 1280w, 1920w
- [ ] Convert all product images to AVIF/WebP/JPG at 320w, 640w, 800w
- [ ] Convert gallery images to AVIF/WebP/JPG at 320w, 480w, 640w
- [ ] Verify all images meet file size targets
- [ ] Add srcset/sizes to all images
- [ ] Preload only hero image (1 per page)
- [ ] Reserve aspect ratios for all images (width/height attributes)
- [ ] Validate all alt text (no keyword stuffing, under 125 chars)
- [ ] Implement lazy loading for below-the-fold images
- [ ] Test gallery masonry layout on mobile/tablet/desktop
- [ ] Run Lighthouse audit (target 90+ performance score)
- [ ] Check Core Web Vitals in Chrome DevTools

### Testing
```bash
# Lighthouse CI
npx lighthouse https://hairpinns.com --view

# Check image sizes
du -h public/images/**/*.{avif,webp,jpg} | sort -h

# Validate formats
file public/images/hero-1280w.avif
```

---

## 12. Migration Strategy

### Phase 1: Infrastructure (Day 1)
- [x] Create `OptimizedImage` component
- [x] Create `ImagePreloader` component
- [x] Create `SalonGallery` component
- [x] Create `imageHelpers` utilities
- [ ] Set up image conversion script (Sharp)

### Phase 2: Critical Images (Day 2)
- [ ] Convert hero images (homepage, services, about)
- [ ] Update hero components to use `OptimizedImage`
- [ ] Preload homepage hero
- [ ] Verify LCP improvement (<2.5s)

### Phase 3: Product Images (Day 3-4)
- [ ] Convert product grid images (collections, PDP)
- [ ] Update product components with responsive sizes
- [ ] Implement lazy loading
- [ ] Test CLS (should be <0.1)

### Phase 4: Gallery & Polish (Day 5)
- [ ] Convert gallery images
- [ ] Implement `SalonGallery` on About page
- [ ] Update all alt text using helpers
- [ ] Run final Lighthouse audit

---

## 13. Notes

### AVIF vs WebP
- **AVIF**: 20-30% smaller than WebP, better quality
- **WebP**: Wider browser support, faster decode
- **Both**: Use both with fallback for best results

### Lazy Loading
- Use native `loading="lazy"` attribute (supported in all modern browsers)
- Intersection Observer as fallback for older browsers (gallery component)

### Next.js Alternative
If migrating to Next.js, use built-in `<Image>` component:
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="..."
  width={1920}
  height={1080}
  priority
  sizes="100vw"
/>
```

Next.js automatically:
- Serves AVIF/WebP with fallback
- Generates srcset
- Lazy loads by default
- Prevents CLS

---

**Last Updated:** 2025-01-05  
**Status:** ✅ Complete - Ready for image conversion and implementation
