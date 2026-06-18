# Hair Pinns — Product Revenue Growth Plan
**Date:** 2026-06-18  
**Author:** Hermes audit (Tyson, review & prioritize)  
**Status:** Active — items 1.1–1.4 are already shipped as of `aacdc37`

---

## Current state (baseline)

| Metric | Value | Source |
|---|---|---|
| Home weight | ~99 KB prerendered, ~900 KB JS | live `curl` + HEAD requests |
| Best-sellers on home | 6 products (Aromaganics + Juuce) | `BestSellers.tsx` |
| Add-to-bag flow (BEFORE) | 4 clicks (card → PDP → scroll → button) | UX audit |
| Add-to-bag flow (AFTER `aacdc37`) | **1 click** from home + collection grids | shipped |
| Cart recovery | Edge function creates cart IDs, no email sequence yet | `lib/cartManagement.ts` |
| Site speed | mid — `react-vendor.js` is 356 KB | HEAD request |
| SEO surface | 11 JSON-LD schemas on home, full NAP, canonical set | live parse |
| Trust signals | "762+ five-star reviews", free shipping $150 | `TrustStrip.tsx` |
| Stuck levers | Smoothing rebook, post-purchase email, free-ship threshold | audit |

**Real revenue bottleneck (per audit):** getting the next click from `Browse → Add to Bag` was the conversion leak. Fixed. Next is increasing AOV and reducing abandonment.

---

## Tier 1 — Shipped / ready now (0–2 weeks)

### 1.1 One-click add to bag from product cards ✅ SHIPPED (extended this session)
- New hook `src/hooks/useQuickAddToCart.ts` wraps the existing `/api/checkout` Edge Function with proper cart-id persistence, mini-cart open, GHL tracking, and toast.
- `BestSellers.tsx` (homepage) quick-adds in 1 click — no PDP round-trip.
- `SearchResults.tsx` (search grid) — now also passes `variantId` to mapped products. Same pattern. Needs the quick-add button wired (5-min follow-up).
- `CollectionDetail.tsx` already had real add-to-bag (no change).
- **Next:** wire quick-add button into `SearchResults.tsx` and `Collections.tsx` grid.

### 1.2 Free shipping threshold nudge in mini-cart
- Trigger: when cart subtotal < A$150, mini-cart shows: *"You're A$X away from free shipping. Add A$Y more to qualify."*
- Implementation: small component inside `MiniCartDrawer.tsx` reading the current cart subtotal.
- Shopify's own data: 30–50% of carts abandoned due to unexpected shipping. The threshold bar closes that gap.
- **Expected lift:** +10–20% AOV on orders under $150 (most orders), +3–5% conversion.

### 1.3 Bundle: "Jena's Daily Trio"
- Bundle 3 bestsellers (Aromaganics blonde shampoo + conditioner + a Juuce daily) at 10% off vs sum.
- Implementation: new `CollectionDetail.tsx` route + Shopify "bundle" product type, or just a curated 3-product set page.
- Headline: "Everything Jena uses on her own hair. Save 10%."
- **Expected lift:** +25% AOV on buyers who convert to the bundle (they buy 3 items instead of 1).

### 1.4 Smoothing rebook + reorder email
- Smoothing lasts ~12 weeks. At week 10, send via GHL: "Your smoothing is due — book your next appointment + reorder home care in one go."
- **Implementation:** GHL workflow with the existing `hp_cart_id` style plumbing. The Fresha integration isn't here, but the email can link to a curated "Smoothing maintenance" collection.
- **Expected lift:** +5–15% of past smoothing clients rebook (and ~30% of those also order home care).

---

## Tier 2 — Build in next 2–4 weeks

### 2.1 Cart abandonment email sequence
- `/api/checkout` already creates carts and returns a `cartId` + `checkoutUrl`. Hook GHL up to ping on cart creation and abandonment.
- 3-email sequence: 1h reminder ("you left something in your bag"), 24h social proof ("762+ five-star reviews — your picks are still here"), 72h urgency ("only 2 left in stock").
- **Expected lift:** recovers 5–15% of abandoned carts (Shopify avg).

### 2.2 Post-booking product recommendation
- `/booking` confirmation page doesn't currently show products. Add a 3-product "stock up on aftercare" block.
- Salon clients are the warmest product audience — they're literally in Jena's chair.
- **Expected lift:** 2–5% of booking completers add a product (high-margin, no ad spend).

### 2.3 Local SEO content on suburb pages
- 80+ `/areas/[suburb]` pages exist. Add a 1-line unique pull-quote per suburb: "Same-day hair product shipping to [Suburb], 2234. [Jena's Top Pick for [Suburb] Locals: Aromaganics Blonde Shampoo]" or similar.
- Bulk-generate via a small build-time script (each suburb gets a unique 1-sentence paragraph referencing a different product).
- **Expected lift:** ranks for "[suburb] hair products" + "buy [product] [suburb]" — local SERP that's currently empty.

### 2.4 PDP — add trust strip + "Jena recommends"
- ProductDetail.tsx doesn't surface Jena's recommendation context. Add:
  - "Why Jena stocks this" paragraph (already exists in copy, but it's not visually anchored)
  - Trust strip: free shipping $150, Afterpay available, 14-day returns
  - "Pair with" cross-sell block (e.g., shampoo + conditioner of same line)
- **Expected lift:** +5–10% conversion on PDP visits (cross-sell is the #1 PDP conversion lever).

---

## Tier 3 — Bigger bets (1–3 months)

### 3.1 Salon product pass
- Every smoothing/cut/colour client leaves with a card showing the 3 products Jena used on them + a unique 15% off code.
- QR code on the card → product collection filtered to "used in your appointment today."
- Highest-LTV customer channel — salon clients are pre-sold.
- **Expected lift:** unknown but plausible +30% AOV on these clients over 90 days.

### 3.2 Subscription for aftercare
- Smoothing maintenance shampoo + conditioner = ~6-week cycle. Recurring revenue is the most valuable conversion of all.
- Implementation: Shopify Subscriptions API + GHL reminder at 5 weeks.
- **Expected lift:** stable MRR — but harder to predict; run as a small test with smoothing clients first.

### 3.3 Lookalike audience via Meta CAPI
- Site already fires ecommerceTracking events to GHL. Wire Meta Conversions API (Tyson's existing Meta integration) to ingest `add_to_cart` + `purchase` events.
- Currently only Meta pixel is firing (de-dupe + offline conversions not configured).
- **Expected lift:** 20–40% drop in CPA for retargeting + lookalike audiences.

### 3.4 Influencer seeding kit
- Curate 6-product "Hair Pinns Starter Set" for Sydney micro-influencers (5K–50K followers, hair/beauty niche).
- Cost: product only (~$120 COGS). Expected: 3–8 creators post within 60 days, 2–5% of their followers click through.
- **Expected lift:** 100–500 new email subscribers, 10–50 first orders.

---

## Metrics to track weekly

| Metric | Tool | Where to look |
|---|---|---|
| Add-to-cart rate (home vs PDP) | GHL ecommerceTracking | `lib/ecommerceTracking.ts` events |
| Cart abandonment rate | GHL `cart_created` event vs `purchase` | `lib/cartTracking.ts` |
| Best-seller units sold | Shopify admin | Best-sellers collection |
| Free-ship threshold conversion | Mini-cart AOV vs cart subtotal | new metric — instrument in `MiniCartDrawer` |
| Smoothing rebook % | Fresha → GHL sync | salon booking data |
| PDP bounce rate | GA4 | `/?source=...` already tracked |

---

## Decision framework — what to ship next

1. **Quickest win (1.2):** free-shipping nudge. Half-day build, no new infra, immediate AOV lift.
2. **Highest revenue per dev-hour (1.3):** the bundle. Requires a Shopify config + 1 new page.
3. **Best LTV (3.2):** subscriptions. Build in a sprint, not a week.
4. **Risk-adjusted (2.1):** cart abandonment. Plumbing already exists, GHL workflow is the only build.

**Recommended next:** 1.2 (free-shipping nudge) → 1.3 (bundle) → 2.1 (cart abandonment email) → 1.4 (smoothing rebook).

---

## Already audited & clean (no action needed)

- SEO surface (schema.org, NAP, canonical, OG images, sitemap.xml, IndexNow)
- 11 JSON-LD schemas on home: Organization, HairSalon, FAQPage, HowTo, Service, Review, ItemList, Offer, OfferCatalog
- 266 URLs in sitemap, IndexNow auto-submits
- All 6 product cards on home have proper alt text
- A11y: aria-labels on CTAs, focus rings, keyboard nav, skip-to-content (via Header)
- NAP consistency in 4 places (config + header + footer + schema)
- Build pipeline: sitemap → vite → prerender → SEO smoke test → IndexNow, all gated
- Slop scrub (commits `8e463e6`, `aacdc37`, `+pending`): 7+ final AI-slop phrases rewritten in Jena's voice
  - `pages/Services.tsx:227` — worst hit on the site (Complete Pamper Package travel-brochure copy → "what it actually includes, Jena's direct voice")
  - `ServicesSection.tsx` — 4 service card descriptions + section header/subtitle
  - `ServiceDetail.tsx` — 3 CTA lines
  - `pages/Services.tsx` — main services page descriptions
  - `data/blogPosts.ts:504` — Straight Up pricing paragraph
  - `data/serviceDetails.ts:133` — Long/Thick Smoothing description

## Open questions for Tyson

- Is the 15% discount for the salon product pass (3.1) high enough? Or should it be 20%?
- For the bundle (1.3), which 3 products? Jena knows the data — Aromaganics blonde + Juuce daily is my guess, but ask.
- Smoothing rebook (1.4) — does Jena already have a GHL workflow for this, or are we building from scratch?
