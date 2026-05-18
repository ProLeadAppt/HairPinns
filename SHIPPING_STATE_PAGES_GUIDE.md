# State-by-State Shipping Pages — Guide for Jena

There are 8 dedicated landing pages — one per Australian state/territory —
designed to capture searchers looking for hair-product delivery to their
state. Each page has unique copy, climate-tied product picks, and
state-specific FAQs that compound into rankings for high-intent queries
like "hair products delivered to Melbourne" or "QIQI shampoo shipping
Perth".

Live URLs once deployed:

- /shipping-to/new-south-wales
- /shipping-to/victoria
- /shipping-to/queensland
- /shipping-to/western-australia
- /shipping-to/south-australia
- /shipping-to/tasmania
- /shipping-to/australian-capital-territory
- /shipping-to/northern-territory

## How to edit the copy

Everything you'd want to change lives in **one file**:
[src/data/shippingStates.ts](src/data/shippingStates.ts).

For each state, you can edit:

| Field | What it controls |
|---|---|
| `localIntro` | The opening paragraph under the H1. Jena's voice. Front-load the state name and the "Australia-wide shipping" phrase. |
| `climateHook` | One-sentence hook that frames why hair-care needs differ in that state. Appears under "Delivering across [state]". |
| `productPicks` | 2–4 collection cards. Each has a label, a `/collections/<handle>` path, and a one-line reason. Pick the ranges that genuinely help that state's climate. |
| `faqs` | 4–6 state-specific FAQs. **Must be unique across the whole site** — duplicate FAQs across pages get filtered out of Google's FAQ rich results. |
| `nearbyStates` | Slugs of related states that appear as "Shipping to other states" buttons at the bottom. |
| `majorCities` | 4–6 cities/towns that appear as tags under the H2. Already filled in with sensible defaults — only change if there's a specific city Jena wants to highlight. |
| `standardDeliveryDays` / `expressDeliveryDays` | Update only if Australia Post / courier ETAs change. Currently set against typical Bangor-NSW dispatch windows. |

The structural fields (`slug`, `name`, `abbreviation`, `capital`, `postcodeRange`) are facts — don't change unless Australia changes.

## How to add another page (e.g. a city like Sydney)

This template can be extended to city-level pages later. To do that:

1. Copy a state entry in `shippingStates.ts`, change the `slug` to the city (e.g. `"sydney"`), update fields.
2. The build pipeline auto-discovers it:
   - `scripts/collect-prerender-routes.js` generates `/shipping-to/sydney`
   - `scripts/generate-sitemap.js` adds it to `sitemap.xml`
   - The next deploy prerenders the HTML
3. No code changes needed.

## What schema each page emits

Every state page ships with full SEO structured data:

- `BreadcrumbList` → Home › Shipping › [State]
- `WebPage` with `speakable` (the intro + delivery-windows section is voice-assistant-ready)
- `FAQPage` (every Q&A in `faqs` array becomes a rich-result candidate)
- `Organization` (the Hair Pinns parent, with `areaServed: AU`, `currenciesAccepted: AUD`, payment methods)
- `HairSalon` `LocalBusiness` (with GeoCircle for Bangor + aggregateRating 4.9★/53)

Plus the site-wide signals (en-AU hreflang, geo meta tags, Offer eligibleRegion AU on every product).

## Discovery — how Google + LLMs find these pages

1. **sitemap.xml** lists all 8 URLs with `priority: 0.8` (higher than blog posts, lower than collections — appropriate for a transactional landing page).
2. **/policies/shipping** has a grid of 8 state cards linking to each page.
3. **/sitemap** (the user-facing sitemap) has a new "Shipping Destinations" section.
4. **llms.txt** and **llms-full.txt** enumerate all 8 URLs with delivery times so AI assistants surface them when users ask about delivery to specific states.

## Why this beats generic programmatic SEO

The standard "programmatic SEO" trap is thin, duplicate pages. These pages avoid that by being **genuinely different per state**:

- Different delivery windows (NSW: 1–3 days, WA: 5–8 days, NT: 6–10 days)
- Different climate framing (QLD humidity vs SA dry vs TAS cool-wet)
- Different product picks per state (smoothing-aftercare for QLD vs bond-repair for VIC)
- Different FAQ content (4–6 unique answers per state, not paraphrased)
- Different major-city tags

Each page has ~400–600 words of unique content. Google won't filter these as duplicate. AI overviews will quote them.

## Next steps once content is reviewed

Once Jena has reviewed and tweaked the copy:

1. Re-run a build locally (`npm run build`) to regenerate prerendered HTML.
2. Push the commits → Netlify rebuilds → live in ~3 minutes.
3. Submit the new URLs in Google Search Console → URL Inspection → Request Indexing (one click per URL, takes 5 mins for all 8).
4. Same in Bing Webmaster Tools.
5. Watch the "Discovery → Indexed" report over 2–4 weeks.

The 8 new pages will start ranking for "[product] delivery to [state]" within 2–4 weeks. State-capital queries (e.g. "Melbourne hair products delivery") take a bit longer (4–8 weeks) but compound over time.
