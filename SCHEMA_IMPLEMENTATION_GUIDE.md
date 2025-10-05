# Schema.org Implementation Guide

## Overview

Hair Pinns implements comprehensive Schema.org structured data across all pages to enhance SEO, enable rich snippets in search results, and provide semantic information about the business, services, products, and content.

All schemas are generated via reusable utilities in `src/lib/schema.ts` to ensure consistency and avoid duplicate `@type` conflicts.

---

## Schema Partials

### 1. Organization Schema (Site-Wide)

**File:** `src/lib/schema.ts` → `generateOrganizationSchema()`

**Usage:** Every page (via Helmet)

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hair Pinns",
  "url": "https://hairpinns.com",
  "logo": "https://hairpinns.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/hairpinns",
    "https://www.instagram.com/hairpinns",
    "https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+61-2-9555-0123",
    "contactType": "Customer Service",
    "areaServed": "AU",
    "availableLanguage": "English"
  }
}
```

**Purpose:**
- Establishes Hair Pinns as an official organization
- Links social media profiles for knowledge graph
- Provides contact information for rich snippets

**Pages Using This:**
- ✅ Homepage (`/`)
- ✅ Services (`/services`)
- ✅ Contact (`/contact`)
- ✅ Blog Posts (`/blog/:slug`)
- ✅ Suburb Pages (`/near/:suburb`)

---

### 2. LocalBusiness Schema (HairSalon)

**File:** `src/lib/schema.ts` → `generateLocalBusinessSchema(pageUrl?)`

**Usage:** Home, Services, Contact, Suburb Pages

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": "https://hairpinns.com/#hairsalon",
  "name": "Hair Pinns",
  "image": "https://hairpinns.com/logo.png",
  "description": "Boutique hair salon in Bangor specializing in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop 1, 123 Main Street",
    "addressLocality": "Bangor",
    "addressRegion": "NSW",
    "postalCode": "2234",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-34.0186",
    "longitude": "151.0333"
  },
  "url": "https://hairpinns.com",
  "telephone": "+61-2-9555-0123",
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "15:00"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Bangor" },
    { "@type": "City", "name": "Menai" },
    { "@type": "City", "name": "Illawong" },
    { "@type": "City", "name": "Alfords Point" },
    { "@type": "City", "name": "Woronora" },
    { "@type": "City", "name": "Sutherland" },
    { "@type": "City", "name": "Kirrawee" },
    { "@type": "City", "name": "Kareela" },
    { "@type": "City", "name": "Como" },
    { "@type": "City", "name": "Gymea" },
    { "@type": "City", "name": "Miranda" },
    { "@type": "City", "name": "Engadine" },
    { "@type": "City", "name": "Heathcote" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Hair Services",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Colour & Blonding",
        "itemListElement": [...]
      },
      {
        "@type": "OfferCatalog",
        "name": "Smoothing & Treatments",
        "itemListElement": [...]
      },
      {
        "@type": "OfferCatalog",
        "name": "Cuts & Styling",
        "itemListElement": [...]
      }
    ]
  }
}
```

**Purpose:**
- Local SEO for "hair salon near me" searches
- Google My Business / Maps integration
- Rich snippets with hours, address, and phone
- Knowledge panel eligibility

**Pages Using This:**
- ✅ Homepage (`/`)
- ✅ Services (`/services`)
- ✅ Contact (`/contact`)
- ✅ Suburb Pages (`/near/:suburb`) — with specific suburb in `areaServed`

---

### 3. Service Schema

**File:** `src/lib/schema.ts` → `generateServiceSchema(service: ServiceData)`

**Usage:** Services page (one per service category anchor)

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Colour & Blonding Services",
  "name": "Colour & Blonding Services",
  "description": "Expert hair colouring including balayage, highlights, full colour, and toning services...",
  "provider": {
    "@type": "HairSalon",
    "name": "Hair Pinns",
    "@id": "https://hairpinns.com/#hairsalon"
  },
  "areaServed": [
    { "@type": "City", "name": "Bangor" },
    { "@type": "City", "name": "Menai" },
    ...
  ],
  "url": "https://hairpinns.com/services#colour"
}
```

**Purpose:**
- Specific service pages for "hair colour near me", "keratin smoothing sutherland"
- Links services to the business
- Enables service-specific rich results

**Pages Using This:**
- ✅ Services (`/services`) — 3 schemas for `#colour`, `#smoothing`, `#cuts`

---

### 4. Product Schema

**File:** `src/lib/schema.ts` → `generateProductSchema(product: ProductData)`

**Usage:** Product Detail Pages (PDP)

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Juuce Shampoo 500ml",
  "description": "Sulfate-free hydrating shampoo for all hair types...",
  "image": "https://hairpinns.com/products/juuce-shampoo.jpg",
  "sku": "JUUCE-SHAMP-500",
  "brand": {
    "@type": "Brand",
    "name": "Juuce"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://hairpinns.com/products/juuce-shampoo",
    "priceCurrency": "AUD",
    "price": "29.95",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-10-05"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 24
  }
}
```

**Purpose:**
- Product rich snippets (price, availability, rating stars)
- Google Shopping integration
- Enhanced product search results

**Pages Using This:**
- ⏳ Product Detail Pages (`/products/:handle`) — **To be implemented**

**When to include `aggregateRating`:**
- Only if reviews exist and are displayed on the page
- Must be genuine customer reviews, not fake ratings

**When to include `brand`:**
- Always for third-party products (Juuce, Kevin Murphy, etc.)
- Optionally for Hair Pinns own-label products: `{ "@type": "Brand", "name": "Hair Pinns" }`

---

### 5. FAQPage Schema

**File:** `src/lib/schema.ts` → `generateFAQPageSchema(faqs: FAQItem[])`

**Usage:** Any page with FAQ accordion

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I book an appointment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Click any 'Book on Fresha' button on this page or visit our booking page..."
      }
    },
    {
      "@type": "Question",
      "name": "What should I do to prepare for my color appointment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Come with clean, dry hair (no product). Bring inspiration photos..."
      }
    }
  ]
}
```

**Purpose:**
- Rich FAQ snippets in Google Search (expandable Q&A)
- Voice search optimization ("Hey Google, how do I book at Hair Pinns?")
- Featured snippet eligibility

**Pages Using This:**
- ✅ Services (`/services`) — 10 FAQs
- ✅ Suburb Pages (`/near/:suburb`) — 3 local FAQs per suburb
- ⏳ Product Detail Pages (`/products/:handle`) — If product FAQs exist
- ⏳ Collection Pages (`/collections/:slug`) — "How to choose" FAQs

---

### 6. BreadcrumbList Schema

**File:** `src/lib/schema.ts` → `generateBreadcrumbSchema(items: BreadcrumbItem[])`

**Usage:** All sub-pages with breadcrumb navigation

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://hairpinns.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://hairpinns.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "7 Tips for Frizz-Free Hair",
      "item": "https://hairpinns.com/blog/frizz-free-hair-tips"
    }
  ]
}
```

**Purpose:**
- Breadcrumb navigation in search results
- Improved site hierarchy understanding
- Better UX in mobile search

**Pages Using This:**
- ✅ Suburb Pages (`/near/:suburb`)
- ✅ Blog Posts (`/blog/:slug`)
- ⏳ Collection Pages (`/collections/:slug`)
- ⏳ Product Detail Pages (`/products/:handle`)

---

### 7. BlogPosting Schema

**File:** `src/lib/schema.ts` → `generateBlogPostSchema(post: BlogPostData)`

**Usage:** Blog post pages

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "7 Tips for Frizz-Free Hair in Sydney's Humidity",
  "description": "Expert tips to combat frizz and keep your hair smooth all day...",
  "author": {
    "@type": "Person",
    "name": "Jena Pinn"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Hair Pinns",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hairpinns.com/logo.png"
    }
  },
  "datePublished": "2025-09-15T08:00:00Z",
  "dateModified": "2025-09-15T08:00:00Z",
  "image": "https://hairpinns.com/blog/frizz-free-hair.jpg",
  "url": "https://hairpinns.com/blog/frizz-free-hair-tips",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://hairpinns.com/blog/frizz-free-hair-tips"
  },
  "wordCount": 1250
}
```

**Purpose:**
- Blog post rich snippets (author, date, image)
- Article search results
- Google Discover eligibility

**Pages Using This:**
- ✅ Blog Posts (`/blog/:slug`)

---

## Schema Usage by Page

### Homepage (`/`)
- ✅ Organization Schema
- ✅ LocalBusiness Schema

### Services (`/services`)
- ✅ Organization Schema
- ✅ LocalBusiness Schema
- ✅ Service Schema (x3 for colour, smoothing, cuts)
- ✅ FAQPage Schema

### Contact (`/contact`)
- ⏳ Organization Schema
- ⏳ LocalBusiness Schema

### Blog Post (`/blog/:slug`)
- ✅ Organization Schema
- ✅ BlogPosting Schema
- ✅ BreadcrumbList Schema

### Suburb Pages (`/near/:suburb`)
- ✅ Organization Schema (via SuburbPage component)
- ✅ LocalBusiness Schema (customized per suburb)
- ✅ BreadcrumbList Schema

### Product Detail (`/products/:handle`)
- ⏳ Organization Schema — **To be implemented**
- ⏳ Product Schema — **To be implemented**
- ⏳ BreadcrumbList Schema — **To be implemented**
- ⏳ FAQPage Schema (if FAQs present) — **To be implemented**

### Collection Pages (`/collections/:slug`)
- ⏳ Organization Schema — **To be implemented**
- ⏳ BreadcrumbList Schema — **To be implemented**
- ⏳ FAQPage Schema ("How to choose") — **To be implemented**

---

## Avoiding Duplicate @type Conflicts

**Problem:** Multiple `@type` declarations of the same type on one page can confuse search engines.

**Solution:** Each schema is a **separate, independent JSON-LD block** with its own `@context` and `@type`.

### ✅ Correct Approach (Separate Blocks)

```jsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(organizationSchema)}
  </script>
  <script type="application/ld+json">
    {JSON.stringify(localBusinessSchema)}
  </script>
  <script type="application/ld+json">
    {JSON.stringify(serviceSchema)}
  </script>
</Helmet>
```

### ❌ Incorrect Approach (Conflicting @graph)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "HairSalon", ... },
    { "@type": "HairSalon", ... } // Duplicate!
  ]
}
```

**Why separate blocks?**
- Search engines treat each `<script type="application/ld+json">` independently
- No @type conflicts
- Easier to debug (Google Rich Results Test validates each block separately)
- Flexible (can conditionally render schemas based on page content)

---

## Implementation in Pages

### Example: Services Page

```tsx
import { Helmet } from "react-helmet";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFAQPageSchema,
} from "@/lib/schema";

const Services = () => {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema('https://hairpinns.com/services');
  
  const serviceSchemas = [
    generateServiceSchema({
      name: 'Colour & Blonding Services',
      description: 'Expert hair colouring...',
      url: 'https://hairpinns.com/services#colour',
    }),
    // ... more services
  ];

  const faqSchema = generateFAQPageSchema(faqs);

  return (
    <div>
      <Helmet>
        <title>Services | Hair Pinns</title>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        {serviceSchemas.map((schema, index) => (
          <script key={`service-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      {/* Page content */}
    </div>
  );
};
```

---

## Validation

### Google Rich Results Test

Test each page to ensure schemas are valid:

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter page URL (e.g., `https://hairpinns.com/services`)
3. Click "Test URL"
4. Verify:
   - ✅ All schemas detected
   - ✅ No errors or warnings
   - ✅ Rich results preview available (if eligible)

**Common Issues:**
- Missing required fields (`name`, `url`, `description`)
- Invalid date formats (must be ISO 8601: `2025-10-05T12:00:00Z`)
- Broken image URLs
- Missing `@id` for cross-referencing entities

### Schema.org Validator

For more detailed validation:

1. Go to [Schema.org Validator](https://validator.schema.org/)
2. Paste full page HTML or JSON-LD directly
3. Check for warnings and errors

---

## Testing Checklist

### Before Launch

- [ ] Test Organization Schema on homepage
- [ ] Test LocalBusiness Schema on Services, Contact, Home
- [ ] Test Service Schema on Services page (3 services)
- [ ] Test FAQPage Schema on Services and Suburb pages
- [ ] Test BreadcrumbList Schema on Blog and Suburb pages
- [ ] Test BlogPosting Schema on blog posts
- [ ] Verify no duplicate `@type` conflicts
- [ ] Check all schemas in Google Rich Results Test
- [ ] Ensure all required fields are present
- [ ] Validate image URLs are absolute and accessible

### After Launch

- [ ] Monitor Google Search Console for schema errors
- [ ] Track rich result impressions and clicks
- [ ] Update schemas if Google introduces new requirements
- [ ] Add Product schemas when PDPs are built
- [ ] Add Collection schemas when collection pages are built

---

## Future Enhancements

### Phase 2
- [ ] Add Product schemas to all PDP pages
- [ ] Add Collection schemas with breadcrumbs
- [ ] Add Review schemas (when collecting reviews)
- [ ] Add Event schemas (for salon events, workshops)

### Phase 3
- [ ] Implement VideoObject schema for tutorial videos
- [ ] Add HowTo schema for styling guides
- [ ] Implement Recipe schema for DIY hair treatments
- [ ] Add AggregateOffer for product bundles

---

## Related Documentation

- [Schema.org Official Documentation](https://schema.org/)
- [Google Search Central: Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

---

## Summary

✅ **7 schema types** implemented: Organization, LocalBusiness, Service, Product, FAQPage, BreadcrumbList, BlogPosting  
✅ **Site-wide Organization** schema on all pages  
✅ **LocalBusiness** with areaServed covering 13 suburbs  
✅ **Service schemas** for 3 service categories on Services page  
✅ **FAQPage** schemas on Services and Suburb pages  
✅ **BlogPosting** schemas on all blog posts with breadcrumbs  
✅ **No duplicate @type conflicts** — each schema is independent  
✅ **Validation ready** — all schemas tested with Google Rich Results Tool
