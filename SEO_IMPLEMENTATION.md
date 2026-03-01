# SEO Implementation Guide

## Overview
Comprehensive SEO implementation for Hair Pinns website with unique titles, meta descriptions, Open Graph tags, structured data, sitemaps, and proper canonicals.

---

## 1. Page-Level SEO (Titles & Descriptions)

### Core Pages

#### Homepage (/)
- **Title:** "Hair Pinns | Boutique Hair Salon Bangor | Expert Colour & Cuts" (64 chars)
- **Description:** "Boutique hair salon in Bangor. Expert Colour & Blonding, Keratin Smoothing, Precision Cuts. 12+ years experience. Book online 24/7." (135 chars)
- **OG Image:** `og-default.jpg`
- **Canonical:** `https://hairpinns.com`

#### Services (/services)
- **Title:** "Hair Services Bangor | Colour, Smoothing & Cuts | Hair Pinns" (61 chars)
- **Description:** "Expert salon services: Balayage, Keratin Smoothing, Precision Cuts. 12+ years experience. Book online 24/7 via Fresha." (121 chars)
- **OG Image:** `og-service.jpg`
- **Canonical:** `https://hairpinns.com/services`

#### About (/about)
- **Title:** "About Jena & Hair Pinns Bangor | Boutique Hair Salon" (54 chars)
- **Description:** "Meet Jena, founder of Hair Pinns boutique salon in Bangor. 12+ years experience in colour, balayage & keratin. Honest care, expert results." (142 chars)
- **OG Image:** `og-default.jpg`
- **Canonical:** `https://hairpinns.com/about`

#### Booking (/booking)
- **Title:** "Book Appointment Online | Hair Pinns Bangor | 24/7 Booking" (60 chars)
- **Description:** "Book your hair appointment online 24/7 via Fresha. Colour, treatments, cuts & styling. Instant confirmation. Same-day available." (130 chars)
- **OG Image:** `og-service.jpg`
- **Canonical:** `https://hairpinns.com/booking`

#### Contact (/contact)
- **Title:** "Contact Hair Pinns Bangor | Call (02) 9555 0123" (48 chars)
- **Description:** "Visit Hair Pinns in Bangor, Sutherland Shire. Call (02) 9555 0123. Free parking, easy access. Open Mon-Sat." (109 chars)
- **OG Image:** `og-default.jpg`
- **Canonical:** `https://hairpinns.com/contact`

#### Collections (/collections)
- **Title:** "Shop Hair Care Collections | Professional Products | Hair Pinns" (64 chars)
- **Description:** "Shop professional hair care: Gift Packs, Daily Care, Treatments & Styling. Olaplex, Kevin Murphy & more. Curated by experts." (137 chars)
- **OG Image:** `og-collection.jpg`
- **Canonical:** `https://hairpinns.com/collections`

### Dynamic Pages

#### Suburb Pages (/near/:suburb)
- **Title Template:** "Hair Salon {SUBURB} | Hair Pinns Bangor | Book Online"
- **Description Template:** "{DRIVE_TIME} from {SUBURB}. Colour, smoothing & cuts. Expert care since 2018. Book online 24/7."
- **OG Image:** `og-suburb.jpg`
- **Canonical:** `https://hairpinns.com/near/{suburb-slug}`
- **Example (Menai):** "Hair Salon Menai | Hair Pinns Bangor | Book Online" (51 chars)

#### Collection Detail (/collections/:handle)
- **Title:** "{Collection Title} | Hair Care Products | Hair Pinns"
- **Description:** First 155 chars of collection description
- **OG Image:** `og-collection.jpg`
- **Canonical:** `https://hairpinns.com/collections/{handle}`

#### Product Detail (/products/:handle)
- **Title:** "{Product Title} | ${Price} | Hair Pinns"
- **Description:** Product bullets + savings message (≤160 chars)
- **OG Image:** Product image (first image)
- **Canonical:** `https://hairpinns.com/products/{handle}`
- **Note:** Includes variant canonical support

#### Blog Post (/blog/:slug)
- **Title:** "{Post Title} | Hair Pinns Blog"
- **Description:** Post excerpt (≤160 chars)
- **OG Image:** `og-blog.jpg` or post featured image
- **Canonical:** `https://hairpinns.com/blog/{slug}`

---

## 2. Open Graph Images

### Image Specifications
- **Dimensions:** 1200x630px
- **Format:** JPG (optimized for social sharing)
- **Max file size:** 8MB (recommended <1MB)

### OG Image Types
- `og-default.jpg` - Homepage, About, Contact
- `og-service.jpg` - Services, Booking
- `og-collection.jpg` - Collections pages
- `og-product.jpg` - Product detail pages (or dynamic product image)
- `og-suburb.jpg` - Suburb landing pages
- `og-blog.jpg` - Blog posts (or post featured image)

### Location
`public/` directory (e.g., `public/og-default.jpg`)

---

## 3. Canonical Tags

### Implementation
All pages include canonical tags to prevent duplicate content issues:

```html
<link rel="canonical" href="https://hairpinns.com/page-path" />
```

### Product Variants
Product detail pages use canonical to consolidate variant URLs:
```html
<link rel="canonical" href="https://hairpinns.com/products/{handle}" />
```

This prevents:
- `/products/product-name?variant=123`
- `/products/product-name?color=red`
- `/products/product-name?size=large`

From creating duplicate content.

---

## 4. Hreflang Tags

### Implementation
All pages include hreflang for en-AU:

```html
<link rel="alternate" hrefLang="en-AU" href="https://hairpinns.com/page-path" />
```

This signals to search engines that content is targeted to English-speaking Australian audiences.

---

## 5. Robots.txt

### Location
`public/robots.txt`

### Configuration
```
# Allow all bots
User-agent: *
Allow: /

# Disallow cart and checkout pages
Disallow: /cart
Disallow: /checkout
Disallow: /account

# Disallow query parameters that create duplicate content
Disallow: /*?*utm_*
Disallow: /*?*fbclid=*
Disallow: /*?*gclid=*
Disallow: /*?*sort=*
Disallow: /*?*filter=*

# Sitemap
Sitemap: https://hairpinns.com/sitemap.xml
```

### Purpose
- Prevent indexing of cart/checkout flows
- Block UTM/tracking parameters from creating duplicate content
- Direct crawlers to XML sitemap

---

## 6. Sitemaps

### XML Sitemap
**Location:** `public/sitemap.xml`

**Included URLs:**
- Core pages (homepage, services, about, booking, contact, collections, blog)
- Collection pages (4 collections)
- Suburb pages (10 suburbs)
- Policy pages (shipping, returns, privacy, terms)

**Properties:**
- `<loc>` - Full URL
- `<changefreq>` - Update frequency (weekly/monthly/yearly)
- `<priority>` - Page importance (0.0-1.0)
- `<lastmod>` - Last modification date (where applicable)

**Priority Hierarchy:**
- 1.0 - Homepage
- 0.9 - Services, Booking, Collections
- 0.8 - About, Contact, Blog, Collection pages
- 0.7 - Suburb pages
- 0.4 - Policy pages
- 0.3 - Legal pages

### HTML Sitemap
**Route:** `/sitemap`
**Component:** `src/pages/Sitemap.tsx`

User-friendly sitemap organized by:
- Main Pages
- Shop Collections
- Service Areas
- Policies & Legal

Links to XML sitemap at bottom.

---

## 7. Structured Data (JSON-LD)

### Organization Schema
- Applied to: All pages
- Type: `Organization`
- Location: `src/lib/schema.ts` → `generateOrganizationSchema()`

### LocalBusiness Schema
- Applied to: Homepage, Services, Contact, Suburb pages
- Type: `HairSalon` (extends LocalBusiness)
- Location: `src/lib/schema.ts` → `generateLocalBusinessSchema()`

### Service Schema
- Applied to: Services page
- Type: `Service`
- Services: Colour, Smoothing, Cuts
- Location: `src/lib/schema.ts` → `generateServiceSchema()`

### Product Schema
- Applied to: Product detail pages
- Type: `Product`
- Includes: Name, image, price, availability, rating
- Generated inline in `src/pages/ProductDetail.tsx`

### FAQPage Schema
- Applied to: Services page, Blog posts, Suburb pages
- Type: `FAQPage`
- Location: `src/lib/schema.ts` → `generateFAQPageSchema()`

### BlogPosting Schema
- Applied to: Blog post pages
- Type: `BlogPosting`
- Includes: Author, date, wordCount, publisher
- Generated inline in `src/pages/BlogPost.tsx`

### Breadcrumb Schema
- Applied to: Suburb pages, Blog posts
- Type: `BreadcrumbList`
- Shows hierarchical navigation path

---

## 8. Meta Tags Summary

### Standard Meta Tags
- `<title>` - Unique, ≤65 chars
- `<meta name="description">` - Unique, ≤160 chars
- `<link rel="canonical">` - Prevents duplicate content
- `<meta name="keywords">` - Suburb pages only

### Open Graph Tags
- `og:title` - Social sharing title
- `og:description` - Social sharing description
- `og:url` - Canonical URL
- `og:type` - Page type (`website`, `product`, `article`)
- `og:image` - Social sharing image (1200x630px)

### Product-Specific OG Tags
- `product:price:amount`
- `product:price:currency`

### Twitter Card Tags
- `twitter:card` - `summary_large_image`
- `twitter:title` - Falls back to OG title
- `twitter:description` - Falls back to OG description
- `twitter:image` - Falls back to OG image

### Language Tags
- `<link rel="alternate" hrefLang="en-AU">` - Australian English target

### Indexing Control
- `<meta name="robots" content="noindex,nofollow">` - Used on Confirm, 404 pages
- `<meta name="robots" content="noindex,follow">` - Used on HTML sitemap

---

## 9. Character Count Guidelines

### Title Tags
- **Minimum:** 30 characters
- **Maximum:** 65 characters (to prevent truncation)
- **Optimal:** 50-60 characters

### Meta Descriptions
- **Minimum:** 120 characters
- **Maximum:** 160 characters (to prevent truncation)
- **Optimal:** 145-155 characters

### Suburb Page Titles
Template: "Hair Salon {SUBURB} | Hair Pinns Bangor | Book Online"
- Menai: 51 chars ✓
- Engadine: 54 chars ✓
- Barden Ridge: 59 chars ✓

### Suburb Page Descriptions
Template: "{DRIVE_TIME} from {SUBURB}. Colour, smoothing & cuts. Expert care since 2018. Book online 24/7."
- Typically 90-110 chars ✓

---

## 10. Implementation Checklist

### ✅ Completed
- [x] Unique title tags for all pages (≤65 chars)
- [x] Unique meta descriptions for all pages (≤160 chars)
- [x] Dynamic titles/descriptions for suburb pages with {{SUBURB}} replacement
- [x] OG image references per template type (default, service, collection, product, suburb, blog)
- [x] XML sitemap generated (`/sitemap.xml`)
- [x] HTML sitemap page created (`/sitemap`)
- [x] robots.txt updated (allow all, disallow cart/account/query noise)
- [x] Canonical tags on all pages
- [x] Hreflang tags (en-AU) on all pages
- [x] Canonical tags for PDP variants
- [x] Structured data (Organization, LocalBusiness, Service, Product, FAQ, BlogPosting)
- [x] Breadcrumb schema for suburb pages

### 🔲 To Do (Production)
- [ ] Replace OG image placeholders with real images (1200x630px JPG)
- [ ] Generate dynamic XML sitemap from blog posts
- [ ] Generate dynamic XML sitemap from product catalog
- [ ] Add lastmod dates to XML sitemap based on actual content updates
- [ ] Test all meta tags with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test all meta tags with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Test structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

---

## 11. Testing Tools

### Meta Tag Validators
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Structured Data Validators
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Search Console - Rich Results](https://search.google.com/search-console)

### SEO Audits
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) (SEO audit)
- [Screaming Frog SEO Spider](https://www.screamingfrogseoseo.co.uk/)
- [Ahrefs Site Audit](https://ahrefs.com/site-audit)

### Robots.txt Tester
- [Google Search Console - robots.txt Tester](https://search.google.com/search-console)

---

## 12. Utility Functions

### Location
`src/lib/sitemap.ts`

### Functions

#### `getOGImage(type)`
Returns appropriate OG image URL based on page type:
- `default` → `/og-default.jpg`
- `product` → `/og-product.jpg`
- `collection` → `/og-collection.jpg`
- `blog` → `/og-blog.jpg`
- `suburb` → `/og-suburb.jpg`
- `service` → `/og-service.jpg`

#### `getSitemapUrls()`
Returns array of all URLs for XML sitemap generation with:
- `loc` - Full URL
- `changefreq` - Update frequency
- `priority` - Page importance
- `lastmod` - Last modification date

#### `generateXMLSitemap(urls)`
Generates valid XML sitemap string from URL array.

---

## 13. Maintenance

### Regular Updates
- **Weekly:** Review homepage, services meta tags for seasonal offers
- **Monthly:** Update suburb page descriptions if services change
- **Quarterly:** Audit OG images for freshness
- **Annually:** Review all meta descriptions for accuracy

### When Adding New Pages
1. Add unique title (≤65 chars) and description (≤160 chars)
2. Select appropriate OG image type
3. Add canonical tag
4. Add hreflang tag (en-AU)
5. Add to `getSitemapUrls()` in `src/lib/sitemap.ts`
6. Regenerate XML sitemap
7. Test with meta tag validators

---

## 14. Notes

- All OG image references point to placeholder paths; replace with real images in production
- Suburb pages use dynamic title/description templates populated from `src/data/suburbPages.ts`
- Product pages use first product image as OG image
- Blog posts can use featured image or default blog OG image
- Structured data uses existing schema generation functions from `src/lib/schema.ts`
- Canonical URLs use absolute URLs (full `https://hairpinns.com/...`) as per best practice

---

**Last Updated:** 2025-01-05  
**Status:** ✅ Complete - Ready for production with placeholder OG images
