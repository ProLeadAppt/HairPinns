# Suburb Service Area Pages Guide

## Overview

Hair Pinns now has dedicated service area pages for 12 suburbs surrounding the Bangor base location. Each page is optimized for local SEO, includes unique local context, and tracks engagement via Zapier.

---

## Live Pages

All pages follow the `/near/{suburb}` URL pattern:

| Suburb | URL | Drive Time | Local Context |
|--------|-----|------------|---------------|
| Menai | `/near/menai` | 5–7 min | Georges River humidity → frizz treatments |
| Illawong | `/near/illawong` | 8–10 min | Riverside humidity → anti-frizz smoothing |
| Alfords Point | `/near/alfords-point` | 6–8 min | Coastal breeze + river humidity |
| Woronora | `/near/woronora` | 10–12 min | River valley traps moisture |
| Sutherland | `/near/sutherland` | 8–10 min | Hard water → clarifying treatments |
| Kirrawee | `/near/kirrawee` | 12–15 min | Coastal air: salt + humidity protection |
| Kareela | `/near/kareela` | 10–12 min | Bushland dryness → hydrating treatments |
| Como | `/near/como` | 12–14 min | Riverside humidity → smoothing |
| Gymea | `/near/gymea` | 15–18 min | Coastal proximity: salt air + humidity |
| Miranda | `/near/miranda` | 15–18 min | Shopping district: all-day hold styles |
| Engadine | `/near/engadine` | 10–12 min | Bush surrounds: dryness + dust protection |
| Heathcote | `/near/heathcote` | 5–7 min | Bushland: low humidity, dusty air |

---

## Page Structure

Each suburb page includes:

### 1. SEO & Schema
- **H1:** "Hair Salon Near {SUBURB} — Hair Pinns"
- **Meta description:** Drive time, services, local context
- **Breadcrumbs:** Home → Service Areas → {Suburb}
- **Schema:**
  - BreadcrumbList (structured navigation)
  - LocalBusiness (inherits core data, `areaServed` includes suburb)

### 2. Hero Section
- Intro paragraph (80–100 words)
- Positions Hair Pinns as boutique option for Colour & Blonding, Smoothing, Cuts & Styling
- References local climate conditions (humidity, water minerals, salt air, etc.)

### 3. Local Context Banner
- Visual callout with MapPin icon
- Unique local note about climate conditions (e.g., "Menai's humidity from Georges River...")

### 4. Services Cards
Three service cards linking to:
- `/services#colour` — Colour & Blonding
- `/services#smoothing` — Smoothing & Treatments
- `/services#cuts` — Cuts & Styling

### 5. How to Visit Section
- Drive time from suburb
- Route directions (e.g., "via Menai Road")
- Parking information
- Salon address and hours

### 6. Local FAQs
Each suburb has 3 unique FAQs (60–90 words each) tailored to:
- Local climate challenges (humidity, hard water, coastal air, dryness)
- Common blonde care concerns (brassiness, toning frequency)
- Treatment longevity and aftercare (smoothing, colour maintenance)

**Feedback Widget:** Each FAQ includes thumbs up/down feedback tracked via `faq_feedback` event

### 7. CTA Section
Two primary CTAs:
- **Book on Fresha** (primary button, external link)
- **Shop Featured Products** (secondary button, links to `/collections`)

### 8. Internal Links
Each page links to:
- 2 nearby suburb pages (avoids reciprocal loops)
- `/services` (View All Services)
- `/about` (About Jena & Hair Pinns)

---

## Zapier Tracking

### Event: `suburb_page_view`

**Trigger:** Once per session (sessionStorage key: `suburb_view_{suburb}`)

**Payload:**
```json
{
  "event_name": "suburb_page_view",
  "suburb": "menai",
  "suburb_name": "Menai",
  "source_page": "https://hairpinns.com/near/menai",
  "context": { /* standard context fields */ },
  "session": { /* UTM parameters */ },
  "first_touch": { /* attribution data */ }
}
```

**Purpose:**
- Track which suburbs drive the most traffic
- Analyze which UTM sources lead to suburban searches
- Measure engagement by suburb (time on page, bounce rate)
- **Non-PII:** No personal data captured (only anonymous tracking)

### Zapier Workflow Suggestion

**Catch Hook → Filter → Google Sheets:**

| Column | Data Source | Purpose |
|--------|-------------|---------|
| Timestamp | `context.timestamp` | When page was viewed |
| Suburb | `suburb_name` | Which suburb page |
| Source Page | `source_page` | Full URL with query params |
| UTM Source | `session.utm_source` | Campaign source |
| UTM Medium | `session.utm_medium` | Campaign medium |
| UTM Campaign | `session.utm_campaign` | Campaign name |
| First Touch Source | `first_touch.first_utm_source` | Original source |
| Referrer | `context.referrer` | Where user came from |

**Analytics Use Cases:**
- Identify which suburbs generate the most interest
- Determine if paid ads for specific suburbs are effective
- Compare first-touch vs last-touch attribution by suburb
- Plan future suburb page expansion based on engagement

---

## FAQ Strategy

Each suburb has 3 unique FAQs addressing:

### Common Themes
1. **Local Climate:** How does {suburb}'s specific climate (humidity, dryness, salt air, hard water) affect hair?
2. **Blonde Maintenance:** Preventing brassiness, toning frequency, product recommendations for Sydney's water/sun
3. **Treatment Aftercare:** How long do smoothing treatments last? What aftercare is needed? Can I swim/heat style?

### Customization by Suburb Type

**Coastal/Riverside Suburbs** (Menai, Illawong, Alfords Point, Woronora, Como, Gymea):
- Focus on humidity + frizz control
- Salt air protection
- Smoothing treatment longevity in high moisture

**Inland/Bushland Suburbs** (Kareela, Engadine, Heathcote):
- Focus on dryness + hydration
- Dust/pollen buildup removal
- Protecting hair from low humidity

**Urban/High-Traffic Suburbs** (Sutherland, Miranda, Kirrawee):
- Hard water effects (buildup, brassiness)
- All-day style hold
- Quick maintenance routines for busy lifestyles

---

## Internal Linking Strategy

### Nearby Suburbs Map

Each suburb links to 2 nearby suburbs to encourage exploration:

| Suburb | Links To |
|--------|----------|
| Menai | Illawong, Bangor (future) |
| Illawong | Menai, Alfords Point |
| Alfords Point | Illawong, Bangor (future) |
| Woronora | Sutherland, Bangor (future) |
| Sutherland | Woronora, Kirrawee |
| Kirrawee | Sutherland, Gymea |
| Kareela | Sutherland, Como |
| Como | Kareela, Gymea |
| Gymea | Miranda, Como |
| Miranda | Gymea, Kirrawee |
| Engadine | Heathcote, Woronora |
| Heathcote | Engadine, Bangor (future) |

**Note:** "Bangor" is marked as future—when creating a Bangor suburb page (even though it's the home base), these links will activate.

---

## Schema Implementation

### BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hairpinns.com/" },
    { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": "https://hairpinns.com/near" },
    { "@type": "ListItem", "position": 3, "name": "Menai", "item": "https://hairpinns.com/near/menai" }
  ]
}
```

### LocalBusiness Schema
```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Hair Pinns",
  "description": "Boutique hair salon serving Menai...",
  "areaServed": [
    { "@type": "City", "name": "Menai" },
    { "@type": "City", "name": "Bangor" }
  ],
  "address": { /* Bangor address */ },
  "geo": { /* Bangor coordinates */ },
  "url": "https://hairpinns.com/near/menai",
  "telephone": "+61-2-9555-0123",
  "openingHoursSpecification": [ /* hours */ ]
}
```

**Benefits:**
- Rich snippets in Google Search (star ratings, hours, address)
- Local SEO boost for "{suburb} hair salon" searches
- Knowledge Panel eligibility for multi-location businesses

---

## Content Guidelines

### Tone & Voice
- **Warm & Approachable:** Avoid jargon, speak directly to the reader
- **Expert & Confident:** Demonstrate 20+ years of experience without being boastful
- **Local & Relevant:** Reference specific climate challenges unique to each suburb

### Writing Style
- **Intro (80–100 words):** Establish credibility, list core services, mention local context once
- **FAQs (60–90 words each):** Answer the question fully, provide actionable advice, offer next steps (book, product, etc.)
- **Local Notes (1–2 sentences):** Be specific to the suburb—avoid generic statements

### SEO Best Practices
- **Primary keyword:** "hair salon near {suburb}"
- **Secondary keywords:** "hairdresser {suburb}", "hair colour {suburb}", "keratin treatment {suburb}"
- **Keyword placement:** H1, first paragraph, FAQ questions, image alt text
- **Avoid keyword stuffing:** Use natural language, focus on user intent

---

## Future Enhancements

### Phase 2 (Optional)
1. **Add Bangor page** (home base) linking to nearby suburbs
2. **Create suburb landing page** (`/near`) with map of all service areas
3. **Add testimonials** from clients in each suburb (with location tags)
4. **Expand to more suburbs:** Heathcote extension (Waterfall, Helensburgh), northern suburbs (Oyster Bay, Sylvania)

### Phase 3 (Advanced)
1. **Dynamic schema:** Pull real-time reviews/ratings from Google Business Profile API
2. **Live booking availability:** Show real-time Fresha appointment slots per suburb
3. **Suburb-specific offers:** Target promotions based on local climate (e.g., "Menai Humidity Special: 20% off Smoothing")
4. **Heatmap analytics:** Visualize which suburbs generate the most bookings

---

## Testing Checklist

Before launch, verify each suburb page:

### SEO & Meta
- [ ] H1 includes suburb name
- [ ] Meta description under 160 characters
- [ ] Canonical URL set to `/near/{suburb}`
- [ ] Open Graph tags present
- [ ] BreadcrumbList schema validates (Google Rich Results Test)
- [ ] LocalBusiness schema validates

### Content
- [ ] Intro is 80–100 words
- [ ] Local note is unique and specific
- [ ] 3 FAQs are present and unique
- [ ] FAQs are 60–90 words each
- [ ] Feedback widget appears on each FAQ

### Links
- [ ] Book on Fresha button opens in new tab
- [ ] Shop Featured button links to `/collections`
- [ ] 2 nearby suburb links work
- [ ] `/services`, `/about` links work
- [ ] Service card anchors (`#colour`, `#smoothing`, `#cuts`) scroll correctly

### Tracking
- [ ] Page view event fires once per session
- [ ] Payload includes suburb name and slug
- [ ] UTM parameters captured if present
- [ ] No PII in payload
- [ ] FAQ feedback widget sends `faq_feedback` event

### Mobile
- [ ] Responsive layout on mobile/tablet
- [ ] Buttons are touch-friendly
- [ ] Accordions open/close smoothly
- [ ] Maps/directions render correctly

---

## Data Files

### `src/data/suburbPages.ts`

Centralizes all suburb data in a typed structure:

```typescript
export interface SuburbData {
  slug: string;
  name: string;
  driveTime: string;
  route: string;
  localNote: string;
  intro: string;
  faqs: { question: string; answer: string; }[];
  nearbySuburbs: string[]; // slugs for internal linking
}
```

**Why centralized data?**
- Single source of truth for all content
- Easy to update drive times, routes, or FAQs across all pages
- Type-safe (TypeScript enforces structure)
- Enables programmatic generation of sitemaps, menus, etc.

---

## Routing

All suburb pages are served via a single `SuburbPage` component with dynamic routing:

```typescript
// In App.tsx
<Route path="/near/:suburb" element={<SuburbPage />} />
```

The component:
1. Reads the `:suburb` param from the URL
2. Fetches data from `suburbPages.ts` using `getSuburbData(slug)`
3. If suburb not found → redirects to 404
4. Otherwise → renders page with unique content

**Benefits:**
- DRY (Don't Repeat Yourself) — one template, 12+ pages
- Easy to add new suburbs (just add data to `suburbPages.ts`)
- Consistent UX across all service area pages

---

## Related Documentation

- [EVENT_TRACKING_TABLE.md](./EVENT_TRACKING_TABLE.md) — All tracked events
- [GHL_FIELD_MAPPING.md](./GHL_FIELD_MAPPING.md) — Zapier → GHL mapping
- [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) — Pre-launch testing

---

## Summary

✅ **12 suburb pages live** at `/near/{suburb}`  
✅ **Unique local content** for each suburb (climate notes, FAQs)  
✅ **SEO optimized** with schema, breadcrumbs, meta tags  
✅ **Tracking enabled** via `suburb_page_view` event (once per session)  
✅ **Internal linking** to nearby suburbs + core pages  
✅ **Responsive design** with CTAs for booking + shopping  
✅ **FAQ feedback** widget on every FAQ for engagement tracking
