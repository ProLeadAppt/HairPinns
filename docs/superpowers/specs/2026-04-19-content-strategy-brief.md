# Content Strategy Brief — Hair Pinns

**Goal:** Rank #1 in Google for hair salon searches in Sutherland Shire and top 3 for hair-product e-commerce terms nationally (Australia-wide).

**Date:** 2026-04-19

---

## Current state

- 29 blog posts, mostly product-centric and treatment-explanation pieces
- Strong coverage on: Juuce, QIQI, Pure, Wet Brush (brand pages)
- Strong coverage on: smoothing, infrared sauna, heat protection
- **Weak coverage on:** local-intent queries, comparison content, buyer-journey content, seasonal/trending queries

---

## Keyword opportunity categories

Content is organised by **searcher intent**. Pick one cluster at a time — do all 3–5 posts in a cluster before moving on. Intra-cluster cross-linking compounds authority.

### Cluster 1 — Local service intent (highest commercial value)

These searches are ready-to-book. Rank well for these and the phone rings.

| Target keyword | Post title | Length | Notes |
|---|---|---|---|
| hair salon sutherland shire | "The Sutherland Shire Hair Salon Guide: What to Look For" | 2000w | Compare what makes a good salon, positioning Hair Pinns as the benchmark. Link to every suburb page. |
| keratin smoothing sydney price | "Keratin Smoothing Sydney: Prices, Brands & What You Actually Get" | 2500w | Price ranges by salon tier, compare Vega vs. Nanoplasty vs. keratin. Strong internal link to all 3 smoothing service pages + qiqi collection. |
| best hair salon menai | "Best Hair Salon Near Menai: What the Locals Say" | 1500w | Use real Google reviews, mention landmarks, cross-link to `/near/menai`. Replicate for bangor, illawong, sutherland, cronulla, como, miranda (7 posts). |
| balayage sutherland shire | "Balayage in Sutherland Shire: What It Costs and How Long It Lasts" | 2000w | Targets a high-intent query with growing volume. Link to foil-packages services. |
| hair extensions bangor | "Hair Extensions in Bangor: Salon-Grade vs. DIY Clip-Ins" | 1500w | Even though Hair Pinns doesn't install extensions currently, ranking for this captures browsing intent; recommend Poppet Locks collection. |

### Cluster 2 — Comparison & decision content (product e-commerce)

These target researchers who are about to buy. "Vs" and "best for" queries convert.

| Target keyword | Post title | Length |
|---|---|---|
| juuce vs pure shampoo | "Juuce vs Pure Organic Shampoo: Which Is Right for Your Hair?" | 1800w |
| best shampoo colour treated hair australia | "Best Shampoo for Colour-Treated Hair in Australia (2026 Guide)" | 2500w |
| sulfate free shampoo australia | "The Best Sulfate-Free Shampoos Available in Australia" | 2000w |
| wet brush vs tangle teezer | "Wet Brush vs Tangle Teezer: Honest Comparison (From a Stylist)" | 1500w |
| keratin treatment vs brazilian blowout | "Keratin vs Brazilian Blowout vs Straight Up: Which One?" | 2000w |

### Cluster 3 — "How often / how much / how long" questions (AEO gold)

These target AI Overviews and Featured Snippets. Short, direct answers.

| Target keyword | Post title | Length |
|---|---|---|
| how often should you wash your hair | "How Often Should You Wash Your Hair? (By Hair Type)" | 1200w |
| how long does keratin smoothing last | "How Long Does Keratin Smoothing Actually Last?" | 1000w |
| how much does a full head of foils cost | "How Much Does a Full Head of Foils Cost in Sydney?" | 1200w |
| can I use purple shampoo every day | "Can You Use Purple Shampoo Every Day? What Stylists Say" | 1000w |
| when should I get a haircut | "When Should You Get a Haircut? Signs You're Overdue" | 1000w |

### Cluster 4 — Seasonal & trending (recurring traffic)

Re-published annually with date updates.

| Target keyword | Post title | When to publish |
|---|---|---|
| summer hair care australia | "Summer Hair Care in Australia: Beach, Sun, Salt Guide" | October |
| winter hair care sydney | "Winter Hair Care for Sydney Weather" | May *(already exists — refresh)* |
| formal hair 2026 | "School Formal Hair Trends 2026" | August |
| christmas hair gifts | "Christmas Hair Care Gift Guide" | November *(already exists — refresh)* |
| frizzy hair humidity sydney | "Beating Frizz in Sydney Humidity" | December |

### Cluster 5 — Jena's expertise / E-E-A-T

Google needs proof that Jena is a real expert. These posts compound her authority.

| Target keyword | Post title | Length |
|---|---|---|
| jena pinn hair pinns | "Meet Jena: 15+ Years Behind the Chair in Sutherland Shire" | 1500w |
| hair colouring mistakes | "The 7 Colouring Mistakes I See Every Week (And How to Avoid Them)" | 2000w |
| home hair care myths | "Home Hair Care Myths a Stylist Wishes You'd Stop Believing" | 1500w |
| how to fix box dye | "How to Recover Hair From Box Dye Damage" | 2000w |

---

## Content production standards

Every post MUST have:

1. **H1 includes the primary keyword** (write naturally — no stuffing)
2. **Meta description** with keyword in first 120 chars
3. **Quick Answer block** — AEO-optimised 2–3 sentence direct answer at top
4. **H2 subsections** every 300–400 words
5. **Internal links**: 3+ per post (service page, product collection, related blog)
6. **External links**: 1–2 to authoritative sources (research, manufacturer docs)
7. **Images** with descriptive alt text matching target keyword
8. **Key Takeaways block** at end (5 bullet summary for scanning)
9. **FAQ block** with 3–5 questions → wired into FAQPage schema
10. **Author attribution**: Jena Pinn (E-E-A-T)
11. **CTA**: book / shop / chat — matched to searcher intent
12. **2000+ words** for commercial queries, 1000+ for long-tail Q&A
13. **Topic map entry** — every post must be added to `src/data/topicMap.ts` so it slots into the cluster

---

## Execution plan

**Month 1 — Local domination**
- 5 suburb-specific posts (Cluster 1)
- Update `/near/:suburb` pages with an embed of the post
- Expected impact: significant rankings lift for "hair salon [suburb]" queries

**Month 2 — E-commerce authority**
- 5 comparison posts (Cluster 2)
- Each post wired into 2–3 product collections
- Expected impact: traffic to `/collections/` pages grows, Shopify orders increase

**Month 3 — AEO capture**
- 5 question-format posts (Cluster 3)
- Schema-rich with FAQPage and QAPage structured data
- Expected impact: appearances in Google AI Overviews and featured snippets

**Quarterly**
- Refresh seasonal posts (Cluster 4)
- Publish 1 Jena-focused expertise post (Cluster 5)

---

## Tracking success

Every post should be tracked in Google Search Console for:
- **Impressions** for target keyword → should grow week-over-week for 4–8 weeks
- **Click-through rate** → aim for >3% (rich snippets help)
- **Average position** → monitor rank for each target keyword
- **Referring pages** → internal linking strength

Set up a monthly review. If a post hasn't cracked the top 20 after 3 months, rewrite it — usually the angle is wrong.

---

## What NOT to write

- Generic "10 tips for healthy hair" posts (saturated, low intent)
- Celebrity hair roundups (no commercial tie to Hair Pinns)
- Overly promotional posts (Google demotes thin commercial content)
- Posts without a clear target keyword
- Posts shorter than 800 words (thin content penalty)
