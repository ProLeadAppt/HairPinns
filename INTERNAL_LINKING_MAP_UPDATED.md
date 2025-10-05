# Internal Linking Map - Updated for /near/* Suburb Routes

## Overview
All suburb pages have been migrated to `/near/*` structure with complete internal linking network.

---

## Primary Navigation Structure

### Homepage (/) → Service Areas
```
/ (Home)
  └─ Services (/services#areas) ← Main hub for suburb discovery
      ├─ Near Bangor (/near/bangor)
      ├─ Near Menai (/near/menai)
      ├─ Near Illawong (/near/illawong)
      ├─ Near Alfords Point (/near/alfords-point)
      ├─ Near Woronora (/near/woronora)
      ├─ Near Sutherland (/near/sutherland)
      ├─ Near Kirrawee (/near/kirrawee)
      ├─ Near Kareela (/near/kareela)
      ├─ Near Como (/near/como)
      ├─ Near Gymea (/near/gymea)
      ├─ Near Miranda (/near/miranda)
      ├─ Near Engadine (/near/engadine)
      └─ Near Heathcote (/near/heathcote)
```

---

## Suburb Page Internal Linking

Each suburb page includes:
1. **Breadcrumb trail**: Home → Areas We Serve → {Suburb}
2. **Service cards** (3): Links to `/services#colour`, `/services#smoothing`, `/services#cuts`
3. **Nearby suburbs section**: 2-3 related suburb links
4. **Footer CTAs**: Book Now (Fresha), Shop Products (/collections)
5. **Bottom navigation**: Services, About, Contact links

### Nearby Suburb Network (Bi-directional linking)

| Suburb | Links To |
|--------|----------|
| **Bangor** | Menai, Woronora, Heathcote |
| **Menai** | Illawong, Bangor |
| **Illawong** | Menai, Alfords Point |
| **Alfords Point** | Illawong, Bangor |
| **Woronora** | Sutherland, Bangor |
| **Sutherland** | Woronora, Kirrawee |
| **Kirrawee** | Sutherland, Gymea |
| **Kareela** | Sutherland, Como |
| **Como** | Kareela, Gymea |
| **Gymea** | Miranda, Como |
| **Miranda** | Gymea, Kirrawee |
| **Engadine** | Heathcote, Woronora |
| **Heathcote** | Engadine, Bangor |

---

## Pages Linking TO Suburbs

### 1. Services Page (`/services#areas`)
**Location**: Bottom of page, after FAQs
**Format**: 13 suburb cards in 3-column grid (mobile: 1 column)

Each card includes:
- Title: "Hair Salon {Suburb}"
- Drive time snippet
- Specialty note (e.g., "riverside humidity solutions")
- Link: `/near/{slug}`

**SEO benefit**: Geographic keyword targeting from high-authority services page

---

### 2. Sitemap Page (`/sitemap`)
**Location**: "Service Areas" section
**Format**: Bulleted list of 13 links

Links:
- Near Bangor → `/near/bangor`
- Near Menai → `/near/menai`
- Near Illawong → `/near/illawong`
- (etc., all 13 suburbs)

**SEO benefit**: Crawlability, helps Google discover all suburb pages

---

### 3. Invalid Suburb 404 (`/pages/InvalidSuburb.tsx`)
**Trigger**: Any unknown `/near/*` slug (e.g., `/near/invalid-area`)

**Content**:
- Error message: "Area Not Found"
- Grid of 6 popular suburbs (Bangor, Menai, Illawong, Sutherland, Engadine, Miranda)
- CTAs: Back to Home, View Services, Book Now
- Footer help text: "Can't find your suburb? Contact us"

**UX benefit**: Converts 404 errors into navigation opportunities

---

### 4. Breadcrumbs (All suburb pages)
**Path**: Home → Areas We Serve → {Suburb}

**Clickable segments**:
1. "Home" → `/`
2. "Areas We Serve" → `/services#areas`
3. "{Suburb}" → (current page, non-clickable)

---

## Outbound Links FROM Suburbs

Each suburb page links to:

### Primary CTAs (Hero + Bottom)
- **Book on Fresha** (external): 2 instances per page
- **View All Services** → `/services`
- **Shop Featured Products** → `/collections`

### Service Cards (3 per page)
- **Colour & Blonding** → `/services#colour`
- **Smoothing & Treatments** → `/services#smoothing`
- **Cuts & Styling** → `/services#cuts`

### Footer Navigation (Global)
- About → `/about`
- Services → `/services`
- Collections → `/collections`
- Blog → `/blog`
- Contact → `/contact`
- All policy pages

### Nearby Suburbs Section (2-3 per page)
- Geographic clustering (e.g., river suburbs link to other river suburbs)
- Drive-time proximity (closer suburbs linked first)

---

## Redirect Architecture

### Old → New Path (301 Permanent)
Component: `SuburbRedirect.tsx`

All old `/suburbs/*` paths redirect to `/near/*`:
- `/suburbs/menai` → `/near/menai`
- `/suburbs/illawong` → `/near/illawong`
- `/suburbs/alfords-point` → `/near/alfords-point`
- (All 13 suburbs supported)

**SEO benefit**: 
- Preserves existing link equity
- Prevents 404s from old backlinks
- Signals to Google that content has moved permanently

**Implementation**:
```tsx
<Route path="/suburbs/:suburb" element={<SuburbRedirect />} />
```

---

## XML Sitemap Integration

**File**: `public/sitemap.xml`

All 13 suburb pages listed:
```xml
<url>
  <loc>https://hairpinns.com/near/{slug}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

**Submission checklist**:
- ✅ Submit to Google Search Console
- ✅ Submit to Bing Webmaster Tools
- ✅ Reference in robots.txt: `Sitemap: https://hairpinns.com/sitemap.xml`

---

## Link Juice Flow

### High → Low Authority
```
Homepage (1.0 priority)
  ↓
Services Page (0.9 priority) ← Main suburb hub
  ↓
Suburb Pages (0.7 priority each)
  ↓
Related Suburbs (peer-to-peer 0.7 → 0.7)
```

### PageRank Distribution
- **Services page** acts as geographic hub
- Each suburb page has 2-3 nearby suburb links (distributes authority geographically)
- Breadcrumbs provide upward link flow back to Services
- Footer provides sitewide navigation to core pages

---

## Mobile Navigation

**Suburb discovery paths (mobile)**:
1. Header → "Services" → Scroll to "Areas We Serve" (13 cards)
2. Footer → "Service Areas" → Sitemap → Suburb list
3. Breadcrumbs → "Areas We Serve" → All suburbs

**Touch targets**: All suburb links sized for mobile (min 44x44px)

---

## Geographic Clustering Strategy

### River Suburbs (High humidity)
- Menai ↔ Illawong ↔ Alfords Point
- Woronora ↔ Como ↔ Engadine

### Coastal Suburbs (Salt air + sun)
- Gymea ↔ Miranda ↔ Kirrawee

### Bushland Suburbs (Dryness + dust)
- Kareela ↔ Heathcote ↔ Engadine

### Central Hub
- **Bangor** (home location) links to:
  - Menai (closest river suburb)
  - Woronora (river valley)
  - Heathcote (closest bushland)

---

## Future Expansion Paths

To add a new suburb:
1. Add data to `suburbPages.ts` (slug, name, drive time, intro, FAQs, nearby suburbs)
2. Update `sitemap.ts` with new URL
3. Update `public/sitemap.xml`
4. Add to Services page grid
5. Add to Sitemap page list
6. Add to nearbySuburbs arrays of 2-3 closest existing suburbs

No route changes needed (dynamic `/near/:suburb` handles all slugs).

---

## Analytics Tracking

Each suburb page view triggers:
```javascript
hpCapture.trackEvent('suburb_page_view', {
  suburb: slug,
  suburb_name: fullName,
  source_page: window.location.href
});
```

**Deduplication**: Once per session per suburb (sessionStorage)

**Metrics to monitor**:
- Top suburb pages by traffic
- Bounce rate per suburb
- Suburb → Services conversion rate
- Suburb → Booking conversion rate
- Nearby suburb click-through rate

---

## SEO Best Practices Implemented

### On-Page SEO (Per Suburb)
✅ Unique H1 with target keyword + location  
✅ Unique meta title (< 60 chars)  
✅ Unique meta description (< 160 chars)  
✅ Canonical URL (self-referencing)  
✅ Open Graph tags (title, description, image, URL)  
✅ JSON-LD schema (BreadcrumbList + LocalBusiness)  
✅ 3 unique FAQs with local context  
✅ Internal links to related content  
✅ Image alt text (when images added)  

### Technical SEO
✅ 301 redirects from old paths  
✅ Custom 404 with navigation  
✅ XML sitemap inclusion  
✅ Mobile-responsive design  
✅ Fast page load (React lazy loading)  
✅ Clean URL structure (/near/suburb-name)  
✅ Proper heading hierarchy (H1 → H2 → H3)  

### Content SEO
✅ Local climate/geography references  
✅ Unique value propositions per area  
✅ Drive time and route information  
✅ Service-specific FAQs (smoothing, colour, cuts)  
✅ Natural keyword density (no stuffing)  
✅ Conversational, helpful tone  

---

## Testing Checklist

### Functional Tests
- [ ] All 13 suburb pages load (200 OK)
- [ ] Invalid slugs show InvalidSuburb component
- [ ] Old `/suburbs/*` paths redirect to `/near/*` (301)
- [ ] Breadcrumbs navigate correctly
- [ ] Nearby suburb links work
- [ ] Service section links scroll to correct anchors
- [ ] Mobile navigation is usable
- [ ] CTAs open Fresha in new tab

### SEO Tests
- [ ] All pages have unique titles
- [ ] All pages have unique meta descriptions
- [ ] Canonical URLs are correct
- [ ] JSON-LD validates (Google Rich Results Test)
- [ ] Sitemap.xml includes all 13 suburbs
- [ ] Robots.txt allows suburb pages
- [ ] No duplicate content warnings

### Analytics Tests
- [ ] suburb_page_view events fire
- [ ] Events include suburb slug and name
- [ ] Deduplication works (max 1 event per session)
- [ ] Events visible in Zapier

---

## Quick Reference: All Valid Slugs

1. `bangor` - On-site
2. `menai` - 5–7 mins
3. `illawong` - 8–10 mins
4. `alfords-point` - 6–8 mins (kebab-case)
5. `woronora` - 10–12 mins
6. `sutherland` - 8–10 mins
7. `kirrawee` - 12–15 mins
8. `kareela` - 10–12 mins
9. `como` - 12–14 mins
10. `gymea` - 15–18 mins
11. `miranda` - 15–18 mins
12. `engadine` - 10–12 mins
13. `heathcote` - 5–7 mins

**Format**: All lowercase, hyphens for multi-word (only alfords-point)

---

**Last Updated**: 2025-10-05  
**Maintainer**: Hair Pinns Dev Team  
**Related Docs**: `SUBURB_PAGES_GUIDE.md`, `SEO_IMPLEMENTATION.md`
