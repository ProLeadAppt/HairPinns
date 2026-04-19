# Clusters A, B, C Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 16 new blog posts across three SEO content clusters (E-E-A-T authority, suburb coverage, seasonal) in three sequential commits, each cluster shippable on its own.

**Architecture:** All posts append to the existing `blogPosts` array in [src/data/blogPosts.ts](../../../src/data/blogPosts.ts). No new files, no new components, no new routes — dynamic `/blog/:slug` already handles new posts. `topicMap.ts` gets updates so new posts surface in `RelatedContent` blocks across service/suburb/product/collection pages. Each cluster = one commit. Prerender build regenerates all route HTML, so each commit must pass `npm run build` before being pushed.

**Tech Stack:** TypeScript, Vite, `@prerenderer/rollup-plugin`, React Router. No tests exist for blog content — verification is typecheck + build + manual visual review.

**Source spec:** [2026-04-19-clusters-a-b-c-rollout-design.md](../specs/2026-04-19-clusters-a-b-c-rollout-design.md)

---

## File Structure

Two files modified, no files created:

- **Modify:** `HairPinns/src/data/blogPosts.ts` — 16 new `BlogPost` objects appended to the `blogPosts` array. File grows from 2246 lines to ~4600 lines. Responsibility: single source of truth for all blog content.
- **Modify:** `HairPinns/src/data/topicMap.ts` — `blogSlugs` arrays updated across 9 of the 14 topics to include the new post slugs. Responsibility: cross-content linking source of truth.

No component, route, or build-config changes.

---

## Pre-flight: Shared references

Every post in this plan uses these image constants already declared at the top of `blogPosts.ts`. Pick whichever fits the post content best:

- `juuce037`, `juuce038`, `juuce050`, `juuce064`, `juuce091`, `juuce118`, `juuce119`, `juuce120`
- `accessories016`, `aromaganicShampoo`, `img0133`, `img0136`, `bamchaTowel`

**Date stamp on every new post:** `"April 19, 2026"` (matches Cluster 1–3 ship date).

**Author on every new post:** `"Jena Pinn"`.

**Insert location for every new post:** append inside the `blogPosts: BlogPost[] = [...]` array, immediately before the closing `];` at the end of the file. Preserve existing posts — never reorder or edit them.

---

## Task 1 — Commit 1 / Post 1: Meet Jena (E-E-A-T anchor, 2000w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts` (append new BlogPost)
- Modify: `HairPinns/src/data/topicMap.ts` (add slug to 3 topics)

This post ships first so the other 3 E-E-A-T posts (and eventually every post) can link to it as the author profile.

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

Insert this object as the final element of the `blogPosts` array (before the closing `];`). Preserve the trailing comma on the previous object's closing `}`:

```typescript
  {
    slug: "meet-jena-15-years-sutherland-shire",
    title: "Meet Jena: 15+ Years Behind the Chair in Sutherland Shire",
    excerpt: "Jena Pinn, founder of Hair Pinns Bangor, shares her 15+ years of hairdressing experience in the Sutherland Shire — her training, her approach, and why she opened her own salon.",
    category: "About",
    date: "April 19, 2026",
    readTime: "7 min read",
    image: juuce091,
    author: "Jena Pinn",
    content: {
      introduction: "I'm Jena Pinn, founder of Hair Pinns in Bangor. I've been behind the chair for over 15 years, mostly in the Sutherland Shire, and I opened Hair Pinns because I wanted a salon that worked the way I'd always wished salons worked — honest, consistent, and built around the client's long-term hair health, not this week's upsell. Here's a bit about how I got here, what I specialise in, and why I do it the way I do.",
      sections: [
        {
          heading: "How I Got Here: 15+ Years in Sutherland Shire Salons",
          content: "I trained in the Sutherland Shire and apprenticed through salons across Miranda, Cronulla, and Caringbah before opening Hair Pinns. Over that time I've done continuing education with Juuce, QIQI, and Aromaganic, specialised in colour correction and smoothing systems, and seen the industry shift from chemical-heavy to bond-repair and organic formulations. The Sutherland Shire has been my whole career — I know the water, the humidity, the beach-and-sun lifestyle, and how Shire hair actually behaves through a Sydney summer."
        },
        {
          heading: "What I Specialise In",
          content: "Three areas make up most of my chair time: colour (balayage, foils, and colour correction — especially fixing at-home box dye or other salons' over-processing); smoothing treatments (Straight Up Smoothing and QIQI Vega — I'm certified in both); and cut-and-finish work on mid-length to long hair. I'm not a trendy-every-six-months salon. Clients come to me because they want their hair to look good in three months, not just walking out the door today."
        },
        {
          heading: "Why I Opened Hair Pinns",
          content: "I spent years working in salons that prioritised upselling over honest advice. Clients getting pushed into services that didn't suit their hair. Stylists rotated every visit so no one knew your history. That's not how hair works — hair is a long game. You need continuity, honest pricing, and a stylist who remembers that three months ago you had a reaction to a specific product line. Hair Pinns was built around those three things: one stylist (me, or my trusted team who've been with the salon for years), transparent pricing on every service, and records of what works for your hair specifically."
        },
        {
          heading: "My Approach: Long-Term Hair Health First",
          content: "If you come in wanting something that will damage your hair, I'll tell you — and I'll usually propose a multi-session plan instead. For example, box-dye recovery normally takes 2–3 visits to do safely, not one aggressive bleach bath. Dramatic colour changes on previously-treated hair take time. I'd rather lose a one-time service than damage a client's hair and lose them forever. Most Hair Pinns clients have been with me for 3+ years. That's the test."
        },
        {
          heading: "Who I Work Well With",
          content: "Clients who want honest pricing, a stylist who knows their hair history, and results that look good weeks and months after the appointment. I'm less suited to clients who want a different radical look every visit or who chase whatever's trending online. There are excellent salons for that — I'm not one. I'm the 'I want this to actually work and keep working' salon."
        },
        {
          heading: "Where to Find the Salon",
          content: "Hair Pinns is at our Bangor location in the Sutherland Shire, with free parking out the front and a 5–10 minute drive from most Shire suburbs. You can book online 24/7 at hairpinns.com/booking, call 0468 093 991, or chat with Isabella (our booking assistant) from any page on the site. First visit? Mention you found us through the blog — I like to know what brought you in."
        }
      ],
      quickAnswer: {
        question: "Who is Jena Pinn?",
        answer: "Jena Pinn is the founder and head stylist of Hair Pinns in Bangor, with 15+ years of hairdressing experience across the Sutherland Shire. She specialises in colour (including box-dye recovery and balayage), Straight Up Smoothing and QIQI Vega treatments, and cut-and-finish work on mid-length to long hair."
      },
      keyTakeaways: [
        "15+ years in Sutherland Shire salons before opening Hair Pinns",
        "Certified in Juuce, QIQI Vega, and Straight Up Smoothing systems",
        "Specialises in colour correction, balayage, smoothing, and cuts",
        "Built Hair Pinns around stylist continuity, honest pricing, and long-term hair health",
        "Most clients have been with the salon for 3+ years"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your first appointment with Jena"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts — add slug to 3 topics**

Open `HairPinns/src/data/topicMap.ts`. For each of these three topics, append `'meet-jena-15-years-sutherland-shire'` to the `blogSlugs` array (after the last existing entry, preserve trailing comma convention of the file):

- Topic `smoothing` — `blogSlugs` array (currently ending with `'sutherland-shire-hair-salon-guide'`)
- Topic `colour` — `blogSlugs` array (currently ending with `'sutherland-shire-hair-salon-guide'`)
- Topic `cuts` — `blogSlugs` array (currently ending with `'your-hair-deserves-the-best-wet-brush'`)

- [ ] **Step 3: Typecheck**

Run from `HairPinns/`:

```bash
cd HairPinns && npx tsc --noEmit
```

Expected: exits clean, no errors. If it fails on a missing comma or type mismatch, fix and re-run.

- [ ] **Step 4: Dev server spot-check**

Run from `HairPinns/`:

```bash
npm run dev
```

Navigate to `http://localhost:<port>/blog/meet-jena-15-years-sutherland-shire`. Verify:
- Page loads with title "Meet Jena: 15+ Years Behind the Chair in Sutherland Shire"
- Introduction paragraph renders
- All 6 H2 sections render
- Quick Answer block present
- Key Takeaways bullets render
- CTA button shows "Book your first appointment with Jena"

Stop the dev server (Ctrl+C) when done.

**Do not commit yet — Task 1 is the first of 4 tasks in Commit 1.**

---

## Task 2 — Commit 1 / Post 2: The 7 Colouring Mistakes (E-E-A-T, 2500w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts` (append new BlogPost)
- Modify: `HairPinns/src/data/topicMap.ts` (add slug to 3 topics)

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

Append immediately after the `meet-jena-15-years-sutherland-shire` object, before the closing `];`:

```typescript
  {
    slug: "the-7-colouring-mistakes-i-see-every-week",
    title: "The 7 Colouring Mistakes I See Every Week (And How to Avoid Them)",
    excerpt: "After 15+ years behind the chair, these are the seven hair-colouring mistakes I see every week — at-home and at other salons — and exactly how to avoid them.",
    category: "Colour",
    date: "April 19, 2026",
    readTime: "9 min read",
    image: aromaganicShampoo,
    author: "Jena Pinn",
    content: {
      introduction: "After 15+ years behind the chair in the Sutherland Shire, these are the seven hair-colouring mistakes I see every single week — some from home dye jobs, some from other salons, some from clients following advice they read online. Every one of them is avoidable, and every one of them makes the next appointment harder (and more expensive). Here's what they are and how to stop making them.",
      sections: [
        {
          heading: "Mistake 1: Box Dye Over Previously-Coloured Hair",
          content: "Box dye contains a one-size-fits-all developer strength that doesn't know what's already on your hair. If you've had foils, balayage, or any professional colour, box dye reacts unpredictably — I've seen blondes turn green, brunettes turn orange, and previously-healthy hair come out like straw. If you need to cover regrowth between salon appointments, ask your stylist for a root tint take-home kit mixed to your formula. Safe, consistent, and won't wreck the colour underneath."
        },
        {
          heading: "Mistake 2: Bleaching at Home to 'Save Money'",
          content: "Home bleach damage is the single most common reason clients book a consultation. The maths never works out — a $30 home bleach kit that goes wrong turns into $400–$800 of colour correction over 2–3 visits, plus 6+ months of extra conditioning. I'd rather you booked a quarter-head foil package ($200ish) than touched a home bleach kit. Every time."
        },
        {
          heading: "Mistake 3: Washing Hair Too Soon After Colour",
          content: "The first wash after colour sets how long the colour holds. Most people wash within 24 hours — colour pigments are still settling into the cortex for 48–72 hours after the service. Waiting 72 hours before the first wash, then washing with a sulfate-free shampoo, adds weeks to the colour's life. One small change, big payoff."
        },
        {
          heading: "Mistake 4: Using Regular Shampoo on Coloured Hair",
          content: "Sulfates (SLS, SLES) strip colour. Faster than sun, faster than heat, faster than anything else. If your shampoo lathers aggressively and leaves hair 'squeaky clean', it's stripping colour. Switch to a sulfate-free shampoo — we stock Juuce, Pure, and Aromaganic sulfate-free ranges at the salon. The difference in colour longevity is dramatic: 4 weeks vs 8–10."
        },
        {
          heading: "Mistake 5: Going Too Light in One Session",
          content: "Clients come in wanting to go from brunette to Scandinavian blonde in one appointment. It almost never works safely. Each lightening session lifts 2–3 levels; going 4–5 levels means bleach pushed too far, and hair that looks ashy the first week but feels like cotton candy by week three. Real platinum transformations are 2–3 sessions, 4–6 weeks apart. Any stylist who promises it in one session is prioritising the sale over your hair."
        },
        {
          heading: "Mistake 6: Skipping Bond Builder During Colour",
          content: "A bond-building additive (Olaplex, Smartbond, or similar) mixed into bleach or colour is the single biggest hair-health upgrade of the last decade. It costs $20–$40 to add to a service and the difference in hair condition post-colour is night and day. If your salon doesn't offer it or charges $80+ for it, that's a red flag. We include bond builder in all our colour packages because not using it is cutting corners on hair health."
        },
        {
          heading: "Mistake 7: Chasing Instagram Colours on Wrong Base",
          content: "Pinterest and Instagram colour inspiration is amazing, but the photo you're showing me was taken on a model with a naturally level-7 blonde base, professional lighting, and a fresh service. If your base is level-4 dark brunette, achieving that exact photo takes 2–3 sessions and will look different in real light. I'll always tell you what's achievable and what isn't — and what the photo is hiding. Pick colour based on your own base, not someone else's."
        },
        {
          heading: "A Quick Story: The Most-Common Fix",
          content: "Composite of several clients I've seen: comes in after a home bleach and box-dye combo, hair orange-banded at the mid-lengths, platinum patches at the front, and brittle texture overall. We don't try to fix it in one visit. Visit one: cut off the worst damage, apply a colour-depositing toner to unify the tone, bond-repair mask. Visit two (4 weeks later): low-lights in the orange bands to restore dimension. Visit three (4 weeks later): final toner and gloss. Cost across all three: around $500–$700. Cost of the one-visit miracle a different salon quoted: $300 but with the damage doubled. Slower is cheaper and better. Every time."
        }
      ],
      productModule: {
        title: "Protect coloured hair at home",
        products: [
          { name: "Sulfate-free shampoo range", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Stops colour stripping at wash time" },
          { name: "Aromaganic Blonde Care", link: "https://hairpinns.com/collections/aromaganic", description: "Violet pigment for bright, brass-free blonde" },
          { name: "Juuce Bond Repair", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Weekly mask to rebuild colour-damaged bonds" }
        ]
      },
      quickAnswer: {
        question: "What are the most common hair colouring mistakes?",
        answer: "The seven most common colouring mistakes are: box dye over previously-coloured hair, home bleach to save money, washing too soon after colour, using sulfate shampoo on coloured hair, going too light in one session, skipping bond builder during the service, and chasing Instagram colours on the wrong base. Each one makes the next service harder and more expensive."
      },
      keyTakeaways: [
        "Box dye over professional colour is unpredictable and often damaging",
        "Home bleach kits almost always cost more than a salon service in the long run",
        "Wait 72 hours before the first wash post-colour for best longevity",
        "Sulfate-free shampoo is non-negotiable for colour-treated hair",
        "Real platinum transformations are 2–3 sessions, not one"
      ]
    },
    cta: {
      type: "service",
      servicePath: "/services/colouring-packages/long-hair-colour-package",
      customText: "Book a colour consultation"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts — add slug to 3 topics**

Append `'the-7-colouring-mistakes-i-see-every-week'` to the `blogSlugs` array of these three topics:

- Topic `colour`
- Topic `blonde-care`
- Topic `foils`

- [ ] **Step 3: Typecheck**

Run from `HairPinns/`:

```bash
cd HairPinns && npx tsc --noEmit
```

Expected: exits clean.

- [ ] **Step 4: Dev server spot-check**

Start dev server, navigate to `/blog/the-7-colouring-mistakes-i-see-every-week`, verify all 8 H2 sections render, productModule renders with 3 product links, quickAnswer and keyTakeaways render. Stop server.

---

## Task 3 — Commit 1 / Post 3: Home Hair Care Myths (E-E-A-T, 1500w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

Append before the closing `];`:

```typescript
  {
    slug: "home-hair-care-myths-stylist-wishes-youd-stop",
    title: "Home Hair Care Myths a Stylist Wishes You'd Stop Believing",
    excerpt: "After 15+ years in the salon, these are the home hair care myths I hear most often — and what actually works instead.",
    category: "Education",
    date: "April 19, 2026",
    readTime: "6 min read",
    image: juuce118,
    author: "Jena Pinn",
    content: {
      introduction: "After 15+ years behind the chair in the Sutherland Shire, I've heard every home-hair-care myth there is. Some are harmless, some are actively damaging, and a lot of them got started in beauty magazines in the 1990s and never died. Here are the ones I wish would stop — and what actually works for healthy hair at home.",
      sections: [
        {
          heading: "Myth: You Need to Wash Your Hair Every Day",
          content: "Most people over-wash. Washing strips natural oils (sebum) that protect and moisturise the hair shaft. For fine straight hair, every 2–3 days is enough. For thick or wavy hair, 2–3 times a week. For curly hair, once a week plus co-washes. Greasy-feeling hair in the first week of washing less is the scalp rebalancing — push through it and it settles in 2–3 weeks."
        },
        {
          heading: "Myth: Trimming Makes Hair Grow Faster",
          content: "Trimming doesn't change growth rate — hair grows at the root, not the tip. What trimming does do is prevent splits from travelling up the shaft, which means more hair stays on your head instead of breaking off. So yes, trim every 10–12 weeks if you're growing hair out. But you're preventing loss, not accelerating growth."
        },
        {
          heading: "Myth: 100 Brush Strokes a Night for Shiny Hair",
          content: "This one won't die. 100 strokes of a bristle brush on dry hair causes breakage, especially at the mid-lengths where the hair is most fragile. If you want shiny hair: detangle gently with a wet brush or wide-tooth comb, use a leave-in with a small amount of oil on the ends, and let your scalp's natural oils distribute over the day. Aggressive brushing is not a shine strategy."
        },
        {
          heading: "Myth: Cold Water Rinses Add Shine",
          content: "Barely. The cuticle-flattening effect from cold water is minor and temporary. What actually adds shine: cuticle-smoothing products (silicone-lite leave-ins, shine sprays), heat tools below 180°C with heat protection, and avoiding hard-water mineral buildup with a clarifying wash monthly. Cold rinses aren't wrong, they're just not doing what you've been told they're doing."
        },
        {
          heading: "Myth: Natural Oils Fix Damage",
          content: "Coconut oil, argan oil, castor oil — all helpful for moisture and sealing the cuticle. None of them repair damage. Damage is broken disulfide bonds inside the hair shaft, and once bonds are broken, only professional bond-repair products (Juuce Bond Repair, Olaplex-type treatments) can rebuild them. Natural oils sit on top of the hair — they mask damage, they don't fix it. The fix is a bond-repair mask weekly plus a trim of anything beyond repair."
        },
        {
          heading: "Myth: Expensive Shampoo Is Always Better",
          content: "Price correlates with quality but not perfectly. A $25 sulfate-free shampoo that suits your hair will outperform a $70 one that doesn't. What matters: sulfate-free formula, pH-balanced (5.0–6.5), no heavy silicones if you're curly or fine. Ask your stylist for a recommendation based on your hair type rather than buying the most-expensive option."
        },
        {
          heading: "What Actually Works",
          content: "The basics that actually move the needle on hair health: sulfate-free shampoo, conditioner on mid-lengths to ends (never the scalp), a weekly bond-repair mask if you colour or heat-style, heat protection every time you use a hot tool, and a trim every 10–12 weeks. Skip the rest. No supplement, brush technique, or rinse temperature replaces those basics."
        }
      ],
      quickAnswer: {
        question: "What are the biggest home hair care myths?",
        answer: "The biggest home hair care myths are: needing to wash daily, trimming speeds up growth, 100 brush strokes for shine, cold water rinses add shine, natural oils repair damage, and expensive shampoo is always better. What actually works: sulfate-free shampoo, conditioner on mid-lengths, weekly bond-repair mask, heat protection, and regular trims."
      },
      keyTakeaways: [
        "Over-washing strips natural oils — most hair needs every 2–3 days max",
        "Trimming prevents breakage, it doesn't speed up growth",
        "Natural oils mask damage, they don't repair broken bonds",
        "Sulfate-free shampoo is the single biggest home-care upgrade",
        "Stick to basics: sulfate-free shampoo, bond mask weekly, heat protection, regular trims"
      ]
    },
    cta: {
      type: "service",
      servicePath: "/services/cut-packages/mid-length-wash-cut-blowdry",
      customText: "Book a trim at Hair Pinns"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts — add slug to 3 topics**

Append `'home-hair-care-myths-stylist-wishes-youd-stop'` to the `blogSlugs` array of:

- Topic `bond-repair`
- Topic `scalp-health`
- Topic `organic-care`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Dev server spot-check**

Verify `/blog/home-hair-care-myths-stylist-wishes-youd-stop` renders correctly.

---

## Task 4 — Commit 1 / Post 4: Box Dye Recovery (E-E-A-T, 2500w) + Commit 1

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "how-to-recover-hair-from-box-dye-damage",
    title: "How to Recover Hair From Box Dye Damage",
    excerpt: "A stylist's honest guide to recovering hair from box dye damage — what the process actually looks like, how long it takes, and how much it costs in the Sutherland Shire.",
    category: "Colour",
    date: "April 19, 2026",
    readTime: "9 min read",
    image: juuce050,
    author: "Jena Pinn",
    content: {
      introduction: "After 15+ years behind the chair in the Sutherland Shire, box-dye recovery is the single most common consultation I take. You've dyed your hair at home, it's gone wrong — wrong colour, uneven, damaged, or all three — and now you're looking for help. Here's the honest version: what's actually achievable, how long it takes, how much it costs, and what to do in the meantime.",
      sections: [
        {
          heading: "First: Why Box Dye Damage Is So Hard to Fix",
          content: "Box dye contains a fixed-strength developer (usually 20 or 30 volume) designed to work across all hair types. It doesn't know you've already got colour on your hair, has no way to read porosity, and deposits pigment in unpredictable ways over previously-treated hair. The result is usually one of three patterns: orange or brassy banding at the mid-lengths, patchy lift (platinum patches next to dark patches), or an overall muddy tone that sits somewhere between your goal and your starting colour. Fixing it means working with hair that now has multiple different colour histories on the same head."
        },
        {
          heading: "Step 1: The Consultation (Not the Service)",
          content: "Before any colour goes on, I do a consultation — strand test, porosity check, and history-taking. I need to know every product on your hair in the last 12 months. Henna, box dye, semi-permanent, 'natural' colours from the health food store — all of it matters. Some ingredients (henna especially) react violently with salon lighteners and can cause hair to literally smoke. This is why reputable salons refuse to colour over unknown home treatments without testing first. Don't hide anything — I can't help you if I don't know what's on the hair."
        },
        {
          heading: "Step 2: Visit One — Stabilise, Don't Lift",
          content: "The first visit is almost never where we get to the final colour. It's the visit where we stabilise the hair — cut off the worst damaged ends, apply a colour-depositing toner or gloss to even out the tone, and do a bond-repair treatment. Goal: your hair is healthier, more even, and looks presentable, even if it's not the final shade. Cost: usually $200–$350 depending on length. Time: 2–3 hours."
        },
        {
          heading: "Step 3: Visit Two — Gentle Progression",
          content: "4–6 weeks after visit one, visit two starts the progression toward your goal colour. This might be low-lights to break up banding, a partial foil package to introduce dimension, or a gentle gloss for tone. We're still not going for 'the full transformation' — we're one step closer. Cost: $250–$400. Another bond-repair treatment goes in."
        },
        {
          heading: "Step 4: Visit Three — Final Colour",
          content: "4–6 weeks after visit two, the final visit is where we land on your goal colour. By now the hair is healthier, more predictable, and can handle the final step (full balayage, a toner refresh, a cut to remove the last damaged length). Cost: $280–$450. Total cost across all three visits: $730–$1200. Total time: 10–14 weeks."
        },
        {
          heading: "Honest Answer: What If You Can't Wait That Long?",
          content: "I get it — a wedding, a work event, a new job. If time matters more than optimal hair health, we can compress to two visits, or sometimes one if the damage is mild. I'll tell you the tradeoff upfront: faster means more aggressive, which means more damage, which means more ongoing conditioning and probably another cut 6 months down the track. Sometimes that's the right call for the situation. Sometimes it isn't. I'd rather you make that call with real information than not know what you're trading."
        },
        {
          heading: "What to Do Between Appointments",
          content: "Weekly bond-repair mask (Juuce Bond Repair is our salon favourite). Sulfate-free shampoo — no exceptions. Heat styling below 160°C with heat protection. A silk or satin pillowcase to reduce friction breakage. Absolutely no home colour during recovery, including 'just the roots' box dye. One more home dye job during a recovery process can undo a full visit's worth of work."
        },
        {
          heading: "A Client Case Study (Composite)",
          content: "Composite of several clients I've seen: started with mid-brunette natural base, box-dyed blonde at home, ended up with orange banding and platinum patches. Visit one: cut 6cm off the worst damage, applied a low-level gloss to unify tone, bond mask. Result: looked presentable, not final, but much less dramatic. Visit two (4 weeks): low-lights in the orange bands to add depth. Visit three (8 weeks from start): final balayage and gloss. Final cost: around $850. Final result: a soft dimensional blonde that grows out gracefully. She's been back every 12 weeks for two years now and her hair is in the best condition it's been in a decade. That's the path. It's slower, it works, it lasts."
        }
      ],
      productModule: {
        title: "Between-appointment recovery kit",
        products: [
          { name: "Juuce Bond Repair", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Weekly mask to rebuild damaged bonds" },
          { name: "Sulfate-free shampoo", link: "https://hairpinns.com/collections/pure-certified-organic-hair-care", description: "Stops further colour stripping" },
          { name: "Heat protection spray", link: "https://hairpinns.com/collections/heat-protection", description: "Essential before any hot tool" }
        ]
      },
      quickAnswer: {
        question: "How do you recover hair from box dye damage?",
        answer: "Box dye damage is recovered over 2–3 salon visits spaced 4–6 weeks apart, not in one session. Visit one stabilises tone and cuts damaged ends; visit two adds dimension with low-lights or foils; visit three lands on the final colour. Total cost in the Sutherland Shire: $730–$1200. Weekly bond-repair masks and sulfate-free shampoo are essential between visits."
      },
      keyTakeaways: [
        "Box dye over previous colour causes unpredictable banding and patchy lift",
        "Recovery is always multi-visit — 2–3 visits over 8–14 weeks",
        "Visit one stabilises, visit two progresses, visit three lands the final colour",
        "Total cost in the Sutherland Shire: $730–$1200 depending on length and damage",
        "Weekly bond-repair mask and sulfate-free shampoo are non-negotiable between visits"
      ]
    },
    cta: {
      type: "service",
      servicePath: "/services/colouring-packages/long-hair-colour-package",
      customText: "Book a colour correction consultation"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts — add slug to 3 topics**

Append `'how-to-recover-hair-from-box-dye-damage'` to the `blogSlugs` array of:

- Topic `colour`
- Topic `bond-repair`
- Topic `blonde-care`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Full build**

This is the first build after a content batch — verify prerender generates 232 route HTML files (228 existing + 4 new E-E-A-T posts).

```bash
cd HairPinns && npm run build
```

Expected: build completes without error. In the output, look for the prerender step listing routes. Confirm routes `/blog/meet-jena-15-years-sutherland-shire`, `/blog/the-7-colouring-mistakes-i-see-every-week`, `/blog/home-hair-care-myths-stylist-wishes-youd-stop`, and `/blog/how-to-recover-hair-from-box-dye-damage` appear in the list.

If build exceeds 10 minutes, stop and report before proceeding.

- [ ] **Step 5: Dev server spot-check of all 4 posts**

```bash
npm run dev
```

Navigate to each of the 4 new `/blog/<slug>` URLs. Verify each renders. Also navigate to a service page that the topicMap update touched (e.g., `/services/colouring-packages/long-hair-colour-package`) and confirm the `RelatedContent` block surfaces at least one of the new posts.

- [ ] **Step 6: Commit Cluster A**

```bash
cd "d:/Dev/Hair Pinns"
git add HairPinns/src/data/blogPosts.ts HairPinns/src/data/topicMap.ts HairPinns/docs/superpowers/specs/2026-04-19-clusters-a-b-c-rollout-design.md HairPinns/docs/superpowers/plans/2026-04-19-clusters-a-b-c-rollout.md
git commit -m "$(cat <<'EOF'
Cluster A (E-E-A-T): 4 posts establishing Jena's author authority

- Meet Jena bio post (2000w) ships first so other posts can link to it
- 7 Colouring Mistakes (2500w)
- Home Hair Care Myths (1500w)
- Box Dye Recovery guide (2500w)
- All 4 wired into topicMap across colour, cuts, smoothing, blonde-care, bond-repair, scalp-health, organic-care, foils

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git status
```

Expected: commit succeeds, status clean.

---

## Task 5 — Commit 2 / Post 5: Bangor flagship (1000w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

Bangor is the salon's home suburb — this post is the anchor for all 6 other suburb posts. It replaces section 5 of the Menai template with "About the Salon and the Team in Bangor".

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-bangor",
    title: "The Best Hair Salon in Bangor: Meet Hair Pinns",
    excerpt: "Hair Pinns is the hair salon in Bangor in the Sutherland Shire — 15+ years of local stylist experience, honest pricing, free parking, and a team that knows your hair history.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "5 min read",
    image: juuce119,
    author: "Jena Pinn",
    content: {
      introduction: "If you live in Bangor and you're looking for a hair salon, you don't have to drive out of the suburb. Hair Pinns is right here — and we've built the salon around what Bangor locals actually want from their stylist: continuity, honest pricing, and hair that still looks good three months after the appointment. Here's a bit about who we are and what we do.",
      sections: [
        {
          heading: "Where We Are in Bangor",
          content: "Hair Pinns is at our Bangor shopfront with free parking right out the front. For Bangor locals it's a short drive from any postcode in the suburb — no traffic, no parking drama, no need to leave the Shire. We're also convenient for clients from Menai, Illawong, Woronora, and Barden Ridge, most of whom are regulars at this point."
        },
        {
          heading: "What Bangor Clients Tell Us They Value",
          content: "Three things come up in every new-client consultation with Bangor locals: (1) They want the same stylist every visit — not a rotating team that never remembers their history. At Hair Pinns you see Jena every time, or her trusted team who've been with the salon for years. (2) They want honest pricing on a public menu, not surprise fees at checkout. Our services are priced transparently online. (3) They want a salon that treats their hair like a long-term relationship, not a one-off service. Most of our Bangor clients have been with us for 3+ years."
        },
        {
          heading: "Services Popular with Bangor Locals",
          content: "The most-booked services for Bangor clients: Straight Up Smoothing (8–12 weeks of frizz-free hair through Sydney humidity), full head foils for blonde maintenance, and balayage for low-maintenance colour. We also do kids cuts and formal styling — big for Bangor families heading to school events. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "About the Salon and the Team in Bangor",
          content: "Hair Pinns was founded by Jena Pinn after 15+ years working in salons across the Sutherland Shire. The salon is small by design — we'd rather take fewer clients and know them well than rotate high volumes. Jena is certified in Juuce, QIQI Vega, and Straight Up Smoothing systems, and specialises in colour (especially colour correction and balayage) and smoothing. Our team has been with the salon for years — when you book, you know who you're getting. Read more about Jena's background in Meet Jena: 15+ Years Behind the Chair in Sutherland Shire."
        },
        {
          heading: "What to Expect on Your First Visit",
          content: "Your first visit starts with a 10-minute consultation — hair history, goals, what's worked and what hasn't. We price everything upfront before we start. If what you're asking for isn't the right call for your hair (for example, going too light in one session on damaged hair), we'll tell you and propose an alternative. No upsell pressure, no surprise costs at the end. Just honest work you can book again next time."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon in Bangor?",
        answer: "Hair Pinns is the hair salon in Bangor in the Sutherland Shire, run by Jena Pinn with 15+ years of local experience. Specialises in colour, Straight Up Smoothing, and cuts. 4.9-star Google rating, free parking, transparent pricing. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns is based in Bangor with free parking out the front",
        "Most-booked services: Straight Up Smoothing, full head foils, balayage",
        "Owner-operated by Jena Pinn with 15+ years of Sutherland Shire experience",
        "Honest pricing and stylist continuity are the core values",
        "Most Bangor clients have been with the salon 3+ years"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment at Hair Pinns Bangor"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts — add slug to 3 topics**

Append `'best-hair-salon-bangor'` to the `blogSlugs` array of:

- Topic `cuts`
- Topic `colour`
- Topic `smoothing`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/best-hair-salon-bangor` renders. Do not commit yet — 6 more suburb posts in Commit 2.

---

## Task 6 — Commit 2 / Post 6: Illawong (800w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-near-illawong",
    title: "Best Hair Salon Near Illawong: What the Locals Say",
    excerpt: "Looking for a hair salon near Illawong? Here's what Illawong locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: juuce120,
    author: "Jena Pinn",
    content: {
      introduction: "If you're in Illawong and searching for a hair salon, you have options — but the feedback we hear from Illawong locals who've become Hair Pinns regulars tends to be the same: 'Wish I'd found you sooner.' Here's what matters when you're picking a salon close to Illawong, and honest answers about whether we're the right fit.",
      sections: [
        {
          heading: "Why Illawong Locals Drive to Bangor",
          content: "Hair Pinns is a short drive from Illawong via Alfords Point Road and Fowler Road — generally under 10 minutes without traffic. Free parking right out the front of the salon. For most Illawong postcodes it's faster than heading into Miranda or Sutherland and trying to find parking. A good portion of our regulars come from the Illawong and Menai areas combined."
        },
        {
          heading: "What Illawong Clients Tell Us They Value",
          content: "Three things come up in every new-client consultation from the Illawong area: (1) They want the same stylist every time — not a rotating roster. At Hair Pinns you see Jena every visit, or her trusted team who've been here for years. (2) They want transparent pricing on a public menu, no surprise fees. (3) They want a salon that treats their hair like a long-term investment, not a quick transaction. Long-standing client relationships are how we measure whether we're doing the job right."
        },
        {
          heading: "Services Popular with Illawong Locals",
          content: "The most-booked services for Illawong clients: Straight Up Smoothing (keeps frizz down through Sydney humidity for 8–12 weeks), full head foils for blonde maintenance, and weekend appointments — we know the Illawong commute is tighter on weekdays. We also do kids cuts and formal styling. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Real Review from an Illawong Client",
          content: "'Honest pricing, same stylist every visit, and I walk out with hair that still looks right in three weeks. That's all I wanted and it took years to find it.' — K. R., Illawong. (Composite of client feedback — real quote to be added before publish.) This captures the Hair Pinns approach: we don't promise miracles, we deliver what we say we'll deliver, and we charge for exactly that."
        },
        {
          heading: "What If You're Not Ready to Switch Salons?",
          content: "Fair. Most of our Illawong clients first came for one specific service — usually smoothing or a colour fix — while keeping their existing salon for everything else. After a few visits, they switched fully. We're happy either way. If you want to try us first, book a single-service appointment. No commitment, no membership, no hard sell."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon near Illawong?",
        answer: "Hair Pinns in Bangor is under 10 minutes from Illawong via Alfords Point Road with free parking out the front. Specialises in colour, Straight Up Smoothing, foils, and weekend appointments. 4.9-star Google rating. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns Bangor is a short drive from Illawong via Alfords Point Road",
        "Free parking, stylist continuity, transparent pricing",
        "Popular Illawong bookings: Straight Up Smoothing, full head foils, weekends",
        "Try a single service first — no membership required",
        "Most clients stay 3+ years once they switch"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Illawong"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'best-hair-salon-near-illawong'` to the `blogSlugs` array of topic `cuts`.

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/best-hair-salon-near-illawong` renders.

---

## Task 7 — Commit 2 / Post 7: Sutherland (800w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-near-sutherland",
    title: "Best Hair Salon Near Sutherland: What the Locals Say",
    excerpt: "Looking for a hair salon near Sutherland? Here's what Sutherland locals value in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: juuce091,
    author: "Jena Pinn",
    content: {
      introduction: "If you're in Sutherland and searching for a hair salon, you have plenty of options in town — but a lot of Sutherland locals make the short drive to Bangor for Hair Pinns. Here's what matters when you're picking a salon close to Sutherland, and honest answers about whether we're worth the drive.",
      sections: [
        {
          heading: "Why Sutherland Locals Drive to Bangor",
          content: "Hair Pinns is 10–12 minutes from central Sutherland via Old Illawarra Road — generally faster than trying to find parking in central Sutherland during peak hours. Free parking out the front of the salon. Several of our regulars make the drive because the parking and the predictable time beats the convenience of walking distance in the Sutherland CBD."
        },
        {
          heading: "What Sutherland Clients Tell Us They Value",
          content: "Three things come up every time from Sutherland locals: (1) They want one stylist per visit, consistently — not a rotating team where no one remembers the last conversation. At Hair Pinns you see Jena every visit, or her trusted team. (2) They want transparent pricing — full service menu public, no surprise fees at checkout. (3) They want long-term hair health prioritised over the single-service sale. Most Sutherland clients have been with us for several years."
        },
        {
          heading: "Services Popular with Sutherland Locals",
          content: "The most-booked services for Sutherland clients: full colour packages (cut and colour combined), Straight Up Smoothing for Sydney humidity (8–12 weeks of frizz-free hair), and professional blowdries for events. We also do colour correction and balayage — Sutherland clients tend to want salon-finish blowdries that last. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Real Review from a Sutherland Client",
          content: "'Jena priced my colour correction upfront, delivered the result over three visits exactly as she said she would, and my hair has been in better condition ever since. I used to drive into the city. Now I drive to Bangor.' — M. T., Sutherland. (Composite of client feedback — real quote to be added before publish.) This captures our approach: honest timelines, honest pricing, long-term results."
        },
        {
          heading: "What If You're Not Ready to Switch Salons?",
          content: "Totally fair. Most of our Sutherland clients first booked us for one specific service — usually a colour correction or smoothing treatment — while keeping their existing salon for routine cuts. After two or three visits, most switch fully. We're happy either way. If you want to try us first, book a single-service appointment. No commitment, no membership, no pressure."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon near Sutherland?",
        answer: "Hair Pinns in Bangor is 10–12 minutes from Sutherland via Old Illawarra Road with free parking out the front. Specialises in full colour packages, Straight Up Smoothing, and colour correction. 4.9-star Google rating. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns Bangor is 10–12 minutes from Sutherland via Old Illawarra Road",
        "Free parking out the front beats central Sutherland parking hunts",
        "Popular Sutherland bookings: full colour packages, smoothing, event blowdries",
        "Transparent pricing and stylist continuity drive most switch-over decisions",
        "Try one service first — no membership required"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Sutherland"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'best-hair-salon-near-sutherland'` to the `blogSlugs` array of topic `cuts`.

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/best-hair-salon-near-sutherland` renders.

---

## Task 8 — Commit 2 / Post 8: Cronulla (800w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-near-cronulla",
    title: "Best Hair Salon Near Cronulla: What the Locals Say",
    excerpt: "Looking for a hair salon near Cronulla? Here's what Cronulla locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: accessories016,
    author: "Jena Pinn",
    content: {
      introduction: "If you're in Cronulla and searching for a hair salon, you've got choices up and down the beach — but several Cronulla locals make the drive to Bangor because Hair Pinns specialises in the exact problems beach-and-sun hair faces. Here's what matters when you're picking a salon close to Cronulla, and honest answers about whether we're the right fit.",
      sections: [
        {
          heading: "Why Cronulla Locals Drive to Bangor",
          content: "Hair Pinns is 15–18 minutes from central Cronulla via Kingsway and Old Illawarra Road. Free parking right out the front — no hunting for a meter. Several of our regulars drive from Cronulla because the parking and the predictable timing is worth the extra few minutes compared to the Cronulla CBD parking situation."
        },
        {
          heading: "What Cronulla Clients Tell Us They Value",
          content: "Three things come up every time from Cronulla clients: (1) They want a stylist who understands beach-and-sun hair — salt, chlorine, UV exposure destroy colour and texture faster than most salons account for. (2) They want transparent pricing — no surprise fees at checkout. (3) They want a salon that plays the long game, not one pushing this week's special. Cronulla clients especially tend to stay 3+ years once they switch."
        },
        {
          heading: "Services Popular with Cronulla Locals",
          content: "The most-booked services for Cronulla clients: blonde balayage and full head foils (blonde beach hair is the brief), beach-recovery smoothing treatments (Straight Up Smoothing keeps frizz down for 8–12 weeks despite salt water), and deep-conditioning or bond-repair treatments for sun-damaged ends. We stock heat protection and sulfate-free ranges that beach-hair clients especially benefit from. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Real Review from a Cronulla Client",
          content: "'I surf year-round and my hair used to fry by January. Jena put me on a smoothing and bond-repair schedule and now my hair survives summer — even my colour. Worth every minute of the drive.' — J. L., Cronulla. (Composite of client feedback — real quote to be added before publish.) This captures the Cronulla-specific approach: we plan around the lifestyle, not just the appointment."
        },
        {
          heading: "What If You're Not Ready to Switch Salons?",
          content: "Fair enough. Most of our Cronulla clients first came for one specific service — usually a smoothing treatment for beach hair or a colour correction — while keeping their existing salon for everything else. After a few visits, most switch fully. If you want to try us first, book a single-service appointment. No commitment, no membership, no pressure."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon near Cronulla?",
        answer: "Hair Pinns in Bangor is 15–18 minutes from Cronulla via Kingsway with free parking out the front. Specialises in blonde balayage, foils, beach-recovery smoothing, and bond-repair for sun-damaged hair. 4.9-star Google rating. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns Bangor is 15–18 minutes from Cronulla via Kingsway",
        "Free parking out the front beats the Cronulla CBD parking hunt",
        "Cronulla clients especially benefit from smoothing, bond-repair, and beach-ready blonde services",
        "Stylist continuity lets us plan around your actual lifestyle",
        "Try one service first — no membership required"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Cronulla"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'best-hair-salon-near-cronulla'` to the `blogSlugs` array of topic `cuts`.

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/best-hair-salon-near-cronulla` renders.

---

## Task 9 — Commit 2 / Post 9: Como (800w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-near-como",
    title: "Best Hair Salon Near Como: What the Locals Say",
    excerpt: "Looking for a hair salon near Como? Here's what Como locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: img0133,
    author: "Jena Pinn",
    content: {
      introduction: "If you're in Como and searching for a hair salon, the options nearest you are limited — which is why a lot of Como locals make the short drive to Bangor for Hair Pinns. Here's what matters when you're picking a salon close to Como, and honest answers about whether we're the right fit.",
      sections: [
        {
          heading: "Why Como Locals Drive to Bangor",
          content: "Hair Pinns is 8–10 minutes from Como via Como Bridge and the Princes Highway. Free parking out the front of the salon — no meter hunting. Como sits on the bridge between the Sutherland Shire proper and the St George area; heading south to Bangor is usually quicker than heading north into busier suburbs."
        },
        {
          heading: "What Como Clients Tell Us They Value",
          content: "Three things come up with Como clients: (1) They want one stylist every visit who remembers their hair history — not rotating staff where every visit starts from scratch. At Hair Pinns you see Jena every visit, or her trusted team. (2) They want transparent pricing on a public menu — no surprise fees. (3) They want low-maintenance results — colour that grows out gracefully, cuts that don't need a blowdry to look right. Most Como clients stay long-term because the results hold up."
        },
        {
          heading: "Services Popular with Como Locals",
          content: "The most-booked services for Como clients: low-maintenance balayage (grows out gracefully over 3–4 months), mid-length cut-and-blowdry packages, and toner refreshes. We also do Straight Up Smoothing for clients who want to eliminate frizz between visits. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Real Review from a Como Client",
          content: "'Jena gave me a balayage that genuinely looks good at 12 weeks — I've never had that from another salon. Honest pricing, same stylist every time, and the short drive from Como is a non-issue.' — S. B., Como. (Composite of client feedback — real quote to be added before publish.) This captures the Como-specific appeal: low-maintenance results that justify the drive."
        },
        {
          heading: "What If You're Not Ready to Switch Salons?",
          content: "Fair. Most of our Como clients first came for a balayage or a smoothing treatment while keeping their existing salon for everything else. After a few visits, most switch fully. If you want to try us first, book a single-service appointment. No commitment, no membership, no pressure."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon near Como?",
        answer: "Hair Pinns in Bangor is 8–10 minutes from Como via Como Bridge and the Princes Highway with free parking out the front. Specialises in low-maintenance balayage, mid-length cuts, and Straight Up Smoothing. 4.9-star Google rating. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns Bangor is 8–10 minutes from Como via Como Bridge",
        "Free parking out the front — no meter hunting",
        "Popular Como bookings: low-maintenance balayage, mid-length cut-and-blowdry, smoothing",
        "Stylist continuity and transparent pricing drive switch-over decisions",
        "Try one service first — no membership required"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Como"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'best-hair-salon-near-como'` to the `blogSlugs` array of topic `cuts`.

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/best-hair-salon-near-como` renders.

---

## Task 10 — Commit 2 / Post 10: Miranda (800w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-near-miranda",
    title: "Best Hair Salon Near Miranda: What the Locals Say",
    excerpt: "Looking for a hair salon near Miranda? Here's what Miranda locals look for in a family-friendly salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: juuce037,
    author: "Jena Pinn",
    content: {
      introduction: "If you're in Miranda and searching for a hair salon, you have no shortage of options in and around Westfield. But many Miranda locals — especially families with school-age kids — make the drive to Bangor for Hair Pinns because we do family appointments well. Here's what matters when you're picking a salon close to Miranda, and honest answers about whether we're the right fit.",
      sections: [
        {
          heading: "Why Miranda Locals Drive to Bangor",
          content: "Hair Pinns is 10–12 minutes from central Miranda via Kingsway and Old Illawarra Road. Free parking out the front — very different from Miranda Westfield's parking situation. For families bringing kids, the out-the-front parking and the quieter suburb vibe is often the whole reason they switched."
        },
        {
          heading: "What Miranda Clients Tell Us They Value",
          content: "Three things come up with Miranda clients: (1) They want one stylist per person per visit — parents want a consistent stylist, kids want someone who remembers them. At Hair Pinns every family member sees the same stylist consistently. (2) They want transparent pricing, including kids services, on a public menu. (3) They want a salon that handles the practical stuff — booking the whole family in one session, kids' cuts that don't turn into a battle, formal styling for school events. Miranda families especially stay long-term."
        },
        {
          heading: "Services Popular with Miranda Locals",
          content: "The most-booked services for Miranda clients: family appointments (parent + kids in one session), kids cut-and-blowdry bundles, mid-length cuts for mums, and formal styling for school formals and events. We also do smoothing and foils, of course, but the family-appointment angle is what Miranda clients specifically mention. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Real Review from a Miranda Client",
          content: "'I bring both kids and book myself for the same session. The kids actually look forward to it now — the stylist knows them by name. Parking out the front with two under five is the difference between possible and not.' — R. G., Miranda. (Composite of client feedback — real quote to be added before publish.) This captures what Miranda families specifically come for."
        },
        {
          heading: "What If You're Not Ready to Switch Salons?",
          content: "Fair. Most of our Miranda clients first came for a formal styling appointment (school formal, wedding) or a one-off smoothing, while keeping their existing salon for routine cuts. After a few visits, most switch fully — especially once the kids come along and family booking becomes a factor. If you want to try us first, book a single-service appointment. No commitment, no membership, no pressure."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon near Miranda?",
        answer: "Hair Pinns in Bangor is 10–12 minutes from Miranda via Kingsway with free parking out the front. Specialises in family appointments, kids cuts, mid-length cuts, and school formal styling. 4.9-star Google rating. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns Bangor is 10–12 minutes from Miranda via Kingsway",
        "Free parking out the front — easier than Miranda Westfield for families",
        "Popular Miranda bookings: family appointments, kids cuts, formal styling",
        "Every family member sees a consistent stylist",
        "Try one service first — no membership required"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Miranda"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'best-hair-salon-near-miranda'` to the `blogSlugs` array of topic `cuts`.

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/best-hair-salon-near-miranda` renders.

---

## Task 11 — Commit 2 / Post 11: Engadine (800w) + Commit 2

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "best-hair-salon-near-engadine",
    title: "Best Hair Salon Near Engadine: What the Locals Say",
    excerpt: "Looking for a hair salon near Engadine? Here's what Engadine locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: "Local",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: juuce064,
    author: "Jena Pinn",
    content: {
      introduction: "If you're in Engadine and searching for a hair salon, the local options work for most people — but a lot of Engadine clients drive to Bangor for Hair Pinns because of the combination of consistency, honest pricing, and services that cover the whole family. Here's what matters when you're picking a salon close to Engadine, and honest answers about whether we're the right fit.",
      sections: [
        {
          heading: "Why Engadine Locals Drive to Bangor",
          content: "Hair Pinns is 10–14 minutes from central Engadine via the Princes Highway and Old Illawarra Road. Free parking out the front. For Engadine locals it's generally faster than heading north into Sutherland or south into Heathcote for a salon, and the Bangor parking is a non-issue."
        },
        {
          heading: "What Engadine Clients Tell Us They Value",
          content: "Three things come up with Engadine clients: (1) They want stylist continuity — seeing the same person every visit who knows their hair history and can adjust as hair changes over time. At Hair Pinns, that's Jena or her trusted team who've been here for years. (2) They want transparent pricing on a public menu. (3) They want a salon that works for the whole family — kids' cuts, mum's colour, seniors' wash-and-set. Engadine clients especially appreciate that we cover the full age range well."
        },
        {
          heading: "Services Popular with Engadine Locals",
          content: "The most-booked services for Engadine clients: family cut appointments, kids cut-and-blowdry bundles, seniors' colour and styling (we do gentle colour suited to mature hair very well), and mid-length cut packages. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Real Review from an Engadine Client",
          content: "'My mum, my daughter, and I all go to Jena now. Three generations, same stylist. My mum used to dread hair appointments and now looks forward to them.' — D. P., Engadine. (Composite of client feedback — real quote to be added before publish.) This captures the Engadine-specific appeal: a salon that genuinely works across ages."
        },
        {
          heading: "What If You're Not Ready to Switch Salons?",
          content: "Fair. Most of our Engadine clients first came for one service — often a kids cut or a gentle senior colour — while keeping their existing salon for other services. After a few visits, most switch fully. If you want to try us first, book a single-service appointment. No commitment, no membership, no pressure."
        }
      ],
      quickAnswer: {
        question: "What's the best hair salon near Engadine?",
        answer: "Hair Pinns in Bangor is 10–14 minutes from Engadine via the Princes Highway with free parking out the front. Specialises in family appointments, kids cuts, mid-length cuts, and gentle colour for mature hair. 4.9-star Google rating. Book online 24/7 or call 0468 093 991."
      },
      keyTakeaways: [
        "Hair Pinns Bangor is 10–14 minutes from Engadine via the Princes Highway",
        "Free parking out the front, no meter hunting",
        "Popular Engadine bookings: family cut packages, kids cuts, seniors colour",
        "One stylist who knows your hair across multiple generations",
        "Try one service first — no membership required"
      ]
    },
    cta: {
      type: "booking",
      customText: "Book your appointment from Engadine"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'best-hair-salon-near-engadine'` to the `blogSlugs` array of topic `cuts`.

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Full build**

```bash
cd HairPinns && npm run build
```

Expected: build completes, prerender generates 239 route HTML files (232 + 7 new suburb posts). Confirm routes for all 7 new suburb posts appear in the prerender output.

If build exceeds 10 minutes, stop and report.

- [ ] **Step 5: Dev server spot-check of all 7 suburb posts**

```bash
npm run dev
```

Navigate to each of the 7 `/blog/best-hair-salon-<suburb>` URLs. Verify each renders with 5 sections (Bangor flagship has "About the Salon and the Team in Bangor" as its section 4). Confirm the review-placeholder section reads cleanly even with the composite review — it should not feel like broken content.

- [ ] **Step 6: Commit Cluster B**

```bash
cd "d:/Dev/Hair Pinns"
git add HairPinns/src/data/blogPosts.ts HairPinns/src/data/topicMap.ts
git commit -m "$(cat <<'EOF'
Cluster B (suburb coverage): 7 local-intent posts

- Bangor flagship (1000w) — our home suburb, "About the team" beat replaces closer
- Illawong, Sutherland, Cronulla, Como, Miranda, Engadine (~800w each)
- Each post has suburb-specific service-mix in section 3 to avoid duplicate-content flags
- Review placeholders shipped as composites, TODO-marked for Jena to replace before publish
- All 7 wired into topicMap cuts topic; Bangor additionally into colour and smoothing

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git status
```

Expected: commit succeeds, status clean.

---

## Task 12 — Commit 3 / Post 12: Summer Hair Care (1500w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "summer-hair-care-australia-beach-sun-salt",
    title: "Summer Hair Care in Australia: Beach, Sun, Salt Guide",
    excerpt: "A stylist's complete guide to summer hair care in Australia — how to protect your hair from sun, salt, chlorine, and humidity, and the products that actually work.",
    category: "Seasonal",
    date: "April 19, 2026",
    readTime: "7 min read",
    image: juuce120,
    author: "Jena Pinn",
    content: {
      introduction: "Australian summer is brutal on hair. UV, salt water, chlorine, humidity, and surprise northerly winds all pile up between December and February, and by March most clients walk into the salon with hair that's drier, more brittle, and a different colour than when they left in November. Here's how to actually protect your hair through an Australian summer — what works, what doesn't, and the products I put on my own clients.",
      sections: [
        {
          heading: "The Four Things Killing Your Hair in Summer",
          content: "UV radiation breaks down the melanin in your hair cortex, fading colour and weakening the structure. Salt water strips moisture and leaves a rough residue on the cuticle. Chlorine oxidises colour and damages bonds — especially on blonde hair, which can literally turn green from copper in chlorinated water. Humidity swells the cuticle and causes frizz. All four compound. A single beach day with no protection is the equivalent of weeks of normal wear."
        },
        {
          heading: "Before the Beach or Pool",
          content: "Two habits make a huge difference. (1) Wet your hair with fresh water before you go in the sea or pool. Hair that's already saturated absorbs less salt or chlorine. (2) Apply a leave-in conditioner or oil to damp hair before going out. This creates a barrier. Juuce Heat Shield or Pure Precious Ends both work — the silicone-lite ones are better than heavy oils because they don't go sticky in sun. Reapply every couple of hours if you're in and out of the water."
        },
        {
          heading: "After the Beach or Pool",
          content: "Rinse with fresh water ASAP. Don't leave salt or chlorine sitting on your hair to dry in the sun — that's where most of the damage happens. Within a few hours, do a proper wash with a clarifying or cleansing shampoo (we like Juuce Clarifying) to remove residue, then deep-condition. This isn't optional — it's the single biggest summer-hair habit that separates clients whose hair survives summer from clients whose hair falls apart."
        },
        {
          heading: "Weekly Summer Routine",
          content: "Weekly bond-repair mask (Juuce Bond Repair, left on 10–15 minutes). This rebuilds what UV and chlorine are actively breaking. Once a week clarify with a clarifying shampoo to remove product and mineral buildup. Sulfate-free everyday shampoo otherwise. Heat protection before any hot tool — but honestly, try to air-dry through summer when you can. Less heat means less compound damage."
        },
        {
          heading: "Blondes Need Extra Help in Summer",
          content: "Blonde hair turning brassy, orange, or green is summer's signature damage. Purple or violet toning shampoo 1–2 times a week stops brassiness. For green from chlorine — apply a clarifying shampoo with baking soda mixed in (tablespoon per handful) before you leave the pool, rinse, and it won't set. Already green? A clarifying shampoo routine over a few washes usually lifts it. If not, book a toner refresh."
        },
        {
          heading: "Should You Time Your Colour Around Summer?",
          content: "If you're a regular colour client, time major colour work (full foils, balayage refresh, colour correction) for late summer or early autumn — March–May — so the colour is fresh going into less-damaging seasons. Going into summer with a brand-new platinum blonde and no pre-summer protection plan is setting money on fire. Your stylist can plan this with you — bring it up at your next appointment."
        },
        {
          heading: "Products to Stock for Summer",
          content: "Minimum kit: (1) leave-in conditioner or oil for beach days, (2) clarifying shampoo for post-beach washes, (3) weekly bond-repair mask, (4) sulfate-free everyday shampoo, (5) purple shampoo if blonde, (6) heat protection for any styling. All of these are available at hairpinns.com/collections — free shipping over $150 Australia-wide."
        }
      ],
      productModule: {
        title: "Summer hair survival kit",
        products: [
          { name: "Heat protection range", link: "https://hairpinns.com/collections/heat-protection", description: "Barrier for sun and styling heat" },
          { name: "Juuce Bond Repair", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Weekly mask rebuilds UV and chlorine damage" },
          { name: "Frizz-free must-haves", link: "https://hairpinns.com/collections/frizz-free-must-haves", description: "Humidity-fighting leave-ins and serums" }
        ]
      },
      quickAnswer: {
        question: "How do you protect your hair in Australian summer?",
        answer: "Protect summer hair by wetting it with fresh water before the beach or pool, applying leave-in conditioner or oil as a barrier, rinsing with fresh water immediately after, and washing with clarifying shampoo to remove salt and chlorine. Weekly bond-repair masks, sulfate-free shampoo, and purple shampoo for blondes are essential. Time major colour work for March–May, not pre-summer."
      },
      keyTakeaways: [
        "UV, salt, chlorine, and humidity all damage hair — effects compound",
        "Wet hair with fresh water before the beach so it absorbs less salt",
        "Rinse immediately after the beach — never let salt dry in the sun",
        "Weekly bond-repair mask is the single best summer habit",
        "Time major colour work for March–May, not pre-summer"
      ]
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections/heat-protection",
      customText: "Shop summer hair protection"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'summer-hair-care-australia-beach-sun-salt'` to the `blogSlugs` array of:

- Topic `heat-protection`
- Topic `frizz-control`
- Topic `hydration`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/summer-hair-care-australia-beach-sun-salt` renders.

---

## Task 13 — Commit 3 / Post 13: Winter Hair Care 2026 (1200w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

Net-new post at new slug — existing `winter-weather-hair-care-sydney` remains untouched.

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "winter-hair-care-sydney-2026",
    title: "Winter Hair Care for Sydney Weather (2026 Guide)",
    excerpt: "A stylist's guide to winter hair care in Sydney — dealing with dry heat, wind, cold rain, and the specific problems Sydney winter causes for coloured and treated hair.",
    category: "Seasonal",
    date: "April 19, 2026",
    readTime: "6 min read",
    image: juuce091,
    author: "Jena Pinn",
    content: {
      introduction: "Sydney winter is milder than most Australian cities, but it still does damage — just differently from summer. Cold wind, low humidity, indoor heating, and more frequent hot-water washes all conspire to dry hair out by late August. Here's what actually happens to hair in Sydney winter and the routine I recommend to clients to keep hair in condition through to spring.",
      sections: [
        {
          heading: "What Sydney Winter Does to Hair",
          content: "Three things. (1) Dry air. Indoor heating and lower humidity pull moisture out of the hair shaft, leading to brittle mid-lengths and static at the ends. (2) Wind. Cold wind causes tangles and breakage, especially on longer hair. (3) Hot showers. Winter is when people habitually crank the shower temperature — hot water opens the cuticle and strips colour and moisture faster than warm water. Milder than summer damage, but compounds over 4–5 months."
        },
        {
          heading: "The Winter Routine That Works",
          content: "Switch to a more hydrating shampoo and conditioner (we use Juuce hydration range or Pure Sacred Mask in the salon). Wash 2–3 times a week maximum — over-washing in winter strips oils that are already depleted. Weekly deep-conditioning or bond-repair mask becomes non-negotiable. Turn the shower temperature down — lukewarm, not hot. Leave-in conditioner daily on mid-lengths to ends."
        },
        {
          heading: "Protect Ends From Wind Damage",
          content: "Long-haired clients get ends that look chewed through by August — that's wind friction plus dry air. Tie hair back loosely when outdoors in windy weather (a silk scrunchie rather than an elastic). A leave-in with a small amount of oil on the ends creates a protective film. At night, a silk or satin pillowcase cuts friction damage while you sleep — this helps year-round but makes a visible difference in winter."
        },
        {
          heading: "Indoor Heating Is the Hidden Problem",
          content: "Reverse-cycle aircon and fan heaters pull humidity out of the air and out of your hair. If you're in a heavily-heated home or office, a humidifier near your main work area helps — hair isn't the only thing that benefits. Skin, lips, and eyes all hold up better with 40–50% humidity vs 20%. Hair shows it fastest."
        },
        {
          heading: "Colour Care in Winter",
          content: "Coloured hair loses depth and vibrancy in winter — not because winter fades colour, but because dry hair cuticles reflect less light, so colour looks dull. Weekly gloss or glaze treatment (we do these in under 30 minutes in the salon) restores shine. At home, a colour-depositing conditioner 1–2 times a week between visits keeps brightness up. Especially important for blondes whose tone shifts warmer in dry conditions."
        },
        {
          heading: "When to Book the Big Services",
          content: "Winter is actually a great time for bigger colour work and smoothing treatments — less UV exposure, less humidity, colour and smoothing hold longer. If you've been holding off on a major foil service or a Straight Up Smoothing, July–August is prime booking season."
        }
      ],
      productModule: {
        title: "Winter hydration kit",
        products: [
          { name: "Juuce Hydration range", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Shampoo and conditioner for winter dryness" },
          { name: "Pure Sacred Mask", link: "https://hairpinns.com/collections/pure-certified-organic-hair-care", description: "Weekly deep-conditioning mask" },
          { name: "Leave-in conditioner", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Daily protection for mid-lengths and ends" }
        ]
      },
      quickAnswer: {
        question: "How do you care for hair in Sydney winter?",
        answer: "Sydney winter hair care means switching to hydrating shampoo and conditioner, washing 2–3 times a week maximum in lukewarm water, using a weekly bond-repair or deep-conditioning mask, and applying leave-in daily to mid-lengths and ends. Indoor heating dries hair more than outdoor cold does — a humidifier and silk pillowcase both help."
      },
      keyTakeaways: [
        "Dry air, cold wind, and hot showers are Sydney winter's main hair stressors",
        "Lukewarm showers and 2–3 washes a week, not hot daily washes",
        "Weekly deep-conditioning or bond-repair mask is non-negotiable",
        "Silk pillowcase cuts overnight friction damage",
        "Winter is the best season for major colour or smoothing work — holds longer"
      ]
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections/juuce-botanicals",
      customText: "Shop winter hydration range"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'winter-hair-care-sydney-2026'` to the `blogSlugs` array of:

- Topic `hydration`
- Topic `scalp-health`
- Topic `bond-repair`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/winter-hair-care-sydney-2026` renders.

---

## Task 14 — Commit 3 / Post 14: School Formal Trends 2026 (1500w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "school-formal-hair-trends-2026",
    title: "School Formal Hair Trends 2026: What's In and How to Book",
    excerpt: "A stylist's guide to 2026 school formal hair trends — what's in, what photographs well, how to prep, and when to book so you're not disappointed.",
    category: "Seasonal",
    date: "April 19, 2026",
    readTime: "6 min read",
    image: accessories016,
    author: "Jena Pinn",
    content: {
      introduction: "School formal season creeps up every year — and every year a handful of year 12s walk in the week of the formal hoping for a specific look with no booking and no trial run. Here's what's trending for 2026 school formal hair, what actually photographs well (trends and photographs aren't always the same thing), how to prep your hair in the weeks leading up, and when to book so you're not scrambling.",
      sections: [
        {
          heading: "2026 Formal Hair Trends We're Booking",
          content: "Four looks come up most often in 2026 consultations. (1) Soft Hollywood waves with a deep side part — the 'old money' look. Photographs beautifully, suits most hair lengths, doesn't date. (2) Sleek low bun with a middle part and face-framing pieces — minimal, modern, photographs well with structured dresses. (3) Half-up with volume crown and loose cascading curls through the lengths — the 'princess' look, suits long hair specifically. (4) Loose textured updo with pulled-out face pieces — undone-but-intentional, big on TikTok, pairs with flowier dresses."
        },
        {
          heading: "What Actually Photographs Well",
          content: "Formal photos last forever, so the ranking matters. Defined shapes photograph better than loose texture — the flash flattens subtle texture. Face-framing pieces are essential because they add dimension that photography otherwise loses. Don't over-gel — shiny in person often reads as greasy in photos. A mid-level hold with some movement photographs better than cement-firm structure."
        },
        {
          heading: "Hair Prep Timeline for Formal",
          content: "8 weeks out: if you're planning a major colour change, this is the latest safe window. Don't go for a radical new colour the week of the formal — hair needs time to settle. 4 weeks out: trim any dead ends so your style holds. 2 weeks out: weekly deep-conditioning masks so hair is in peak condition. 1 week out: book your formal appointment if you haven't — and critically, book a trial if the look is complex. Day before: deep condition but don't wash morning-of — day-old hair holds styles better than squeaky-clean hair."
        },
        {
          heading: "Should You Do a Trial?",
          content: "For complex updos, yes, always. A 30-minute trial 1–2 weeks before the formal lets you see the look on your own hair, photograph it, and adjust. For simpler looks like Hollywood waves or a sleek low bun, usually unnecessary if you trust your stylist. If you've never been to the salon before, a trial is always worth it — the stylist learns your hair's quirks before the main event."
        },
        {
          heading: "Extensions for Formal",
          content: "Clip-in extensions remain the best way to add length or thickness for a formal night without committing to permanent extensions. We sell high-quality clip-ins you can install yourself the day of, or the stylist can blend them in during the appointment. Budget $100–$250 for good-quality clip-ins in the right colour match. Avoid cheap synthetic — they don't hold heat and look obvious in photos."
        },
        {
          heading: "When to Book",
          content: "For a formal in October–November, book your hair appointment by early August. Good formal appointment slots fill up 2–3 months out because most schools have formals clustered in the same weeks. If you leave it until September, you'll struggle to get your preferred time. Book online 24/7 at hairpinns.com/booking or call 0468 093 991."
        },
        {
          heading: "Makeup Timing on Formal Day",
          content: "Quick tip: do hair before makeup, not the other way around. Hair styling can smudge freshly-applied makeup with movement and product sprays. If you're booking both at the salon, your stylist will sequence this correctly — we always do hair first unless there's a specific reason otherwise."
        }
      ],
      quickAnswer: {
        question: "What are the 2026 school formal hair trends?",
        answer: "The 2026 school formal hair trends booking most often are soft Hollywood waves with a deep side part, sleek low buns with a middle part, half-up volume-crown styles, and loose textured updos with pulled-out face-framing pieces. Book 2–3 months ahead for formal season, and do a trial 1–2 weeks before the formal if the look is complex."
      },
      keyTakeaways: [
        "Four top 2026 trends: Hollywood waves, sleek low bun, half-up volume, textured updo",
        "Defined shapes photograph better than loose texture in flash lighting",
        "Book 2–3 months before formal season — slots fill fast",
        "Do a trial for complex updos 1–2 weeks before the main event",
        "Hair before makeup on formal day"
      ]
    },
    cta: {
      type: "service",
      servicePath: "/services/kids-formal/high-school-formal-hairstyle",
      customText: "Book your school formal appointment"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'school-formal-hair-trends-2026'` to the `blogSlugs` array of:

- Topic `kids-formal`
- Topic `cuts`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/school-formal-hair-trends-2026` renders.

---

## Task 15 — Commit 3 / Post 15: Christmas Hair Gifts 2026 (1200w)

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "christmas-hair-gifts-2026",
    title: "Christmas Hair Care Gift Guide 2026",
    excerpt: "A stylist's Christmas gift guide for anyone who loves their hair — from $30 stocking fillers to premium bundles, shipped Australia-wide with free shipping over $150.",
    category: "Seasonal",
    date: "April 19, 2026",
    readTime: "5 min read",
    image: juuce118,
    author: "Jena Pinn",
    content: {
      introduction: "Hair care makes a better Christmas gift than most people realise. Good salon-grade products last months, get used every single day, and solve real problems. The generic department-store gift sets are often a disappointment — cheap formulas in pretty packaging. Here's what I'd actually give as a Christmas gift across price points, with a note on who each one suits.",
      sections: [
        {
          heading: "Under $40 — Stocking Fillers That Get Used",
          content: "A good detangling brush ($30–$40). Wet Brush is the one we recommend most — it works wet or dry, reduces breakage, and comes in fun designs that genuinely land with teenagers and adults alike. Clip-in accessories and ponytail wraps ($15–$35) for anyone who wants styling options without commitment. A quality leave-in conditioner ($30–$40) — Juuce or Pure leave-ins are daily-use products most people wouldn't buy themselves but happily use when gifted."
        },
        {
          heading: "$40–$80 — Practical Gifts That Solve Problems",
          content: "A bond-repair mask ($45–$65) for anyone who colours, heat-styles, or complains about damaged hair. Juuce Bond Repair is the go-to. A heat-protection spray ($40–$50) for anyone who uses hot tools. Purple or silver shampoo ($40–$55) for any blonde friend — they'll use it, they'll notice the difference, it's a genuinely useful gift. A quality hair oil ($50–$75) — QIQI Bare Repair or Pure Precious Ends both work for ends protection."
        },
        {
          heading: "$80–$150 — Proper Routine Starter Kits",
          content: "A shampoo-and-conditioner duo in a premium range ($80–$120) — Juuce, Pure, or Aromaganic depending on the recipient's priorities (bond repair, organic, or blonde care). This replaces their supermarket purchases and actually shifts their hair condition over 6–8 weeks. A complete smoothing-maintenance kit ($100–$150) — shampoo, conditioner, mask, oil — for anyone who's had a smoothing treatment done at a salon. Pairs especially well with a gift voucher for a service."
        },
        {
          heading: "Over $150 — Premium or Bundles",
          content: "A full routine bundle — shampoo, conditioner, mask, leave-in, heat protection ($150–$250). Free shipping applies at $150+ so bundle gifting is cost-efficient. A salon service gift voucher — especially popular for Christmas. We offer vouchers from $50 up; most people gift $100–$200 as a contribution toward a service. Recipient books the appointment of their choice. Zero mismatch risk."
        },
        {
          heading: "For the Teenagers and Tweens",
          content: "Teenagers are fussy gift recipients, but a Wet Brush in a glitter design and a set of Pure clip-in accessories almost always lands well. For slightly older teens who actually care about their hair, a purple shampoo (if blonde) or a leave-in conditioner tends to be genuinely used. Skip anything that needs application technique — they won't read the instructions."
        },
        {
          heading: "What to Avoid as a Gift",
          content: "Generic drugstore 'hair care gift sets' with mystery ingredients — they disappoint. Heat tools for someone who already has one — unless you know specifically they want a new one. Hair cuts vouchers as standalone gifts — people get picky about stylists; book it with an 'any service' gift voucher instead. Anything requiring a hair-type match you're guessing at — shampoo for curly hair given to someone with straight hair is awkward."
        },
        {
          heading: "Order Cutoffs and Gift Wrapping",
          content: "We ship Australia-wide with free shipping over $150. Christmas order cutoffs are usually mid-December for guaranteed delivery before the 25th — check hairpinns.com for the exact date closer to the season. Gift-wrap options available at checkout. Local Sutherland Shire pickup available year-round."
        }
      ],
      productModule: {
        title: "Shop Christmas hair gifts",
        products: [
          { name: "Wet Brush range", link: "https://hairpinns.com/collections/wet-brush-detanglers", description: "Best stocking-filler gift, every price point" },
          { name: "Hair accessories", link: "https://hairpinns.com/collections/hair-pinns-accessories", description: "Clip-ins and ponytail wraps under $40" },
          { name: "Pure Organic bundles", link: "https://hairpinns.com/collections/pure-certified-organic-hair-care", description: "Premium routine gifts, $80+" }
        ]
      },
      quickAnswer: {
        question: "What are the best hair care Christmas gifts?",
        answer: "The best hair care Christmas gifts by price: under $40 — Wet Brush or leave-in conditioner; $40–$80 — bond-repair mask, heat protection, or purple shampoo; $80–$150 — shampoo-conditioner duos in premium ranges; over $150 — full routine bundles with free shipping, or salon service gift vouchers. Avoid generic drugstore gift sets."
      },
      keyTakeaways: [
        "Wet Brush is the reliable stocking-filler across all age groups",
        "Bond-repair mask makes the best $40–$80 gift — solves a real problem",
        "Salon service gift vouchers avoid mismatch risk entirely",
        "Free shipping kicks in at $150 — bundle gifts efficiently",
        "Skip generic drugstore gift sets"
      ]
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections/hair-pinns-accessories",
      customText: "Shop Christmas hair gifts"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'christmas-hair-gifts-2026'` to the `blogSlugs` array of:

- Topic `styling-tools`
- Topic `hydration`
- Topic `organic-care`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Spot-check**

Verify `/blog/christmas-hair-gifts-2026` renders.

---

## Task 16 — Commit 3 / Post 16: Beating Frizz Sydney Humidity (1600w) + Commit 3

**Files:**
- Modify: `HairPinns/src/data/blogPosts.ts`
- Modify: `HairPinns/src/data/topicMap.ts`

- [ ] **Step 1: Append new BlogPost to blogPosts.ts**

```typescript
  {
    slug: "beating-frizz-sydney-humidity",
    title: "Beating Frizz in Sydney Humidity: A Stylist's Complete Guide",
    excerpt: "A stylist's complete guide to beating frizz in Sydney humidity — why it happens, what actually works, and the salon treatments that give you months of smooth hair.",
    category: "Seasonal",
    date: "April 19, 2026",
    readTime: "7 min read",
    image: juuce038,
    author: "Jena Pinn",
    content: {
      introduction: "Sydney humidity turns smooth hair into frizz within minutes of stepping outside, and a lot of the advice online doesn't work — or works for 20 minutes then falls apart. After 15+ years doing hair in the Sutherland Shire I've tested every approach, and here's the version that actually holds up through a real Sydney summer or spring day. Causes, at-home fixes, and when it's time to consider a salon treatment.",
      sections: [
        {
          heading: "Why Hair Frizzes in Humidity",
          content: "The science is simple. Hair has an outer cuticle (like roof tiles) and an inner cortex. When humidity is high, moisture in the air is absorbed through the cuticle into the cortex. The cortex swells, the cuticle lifts, and hair appears frizzy. Dry or damaged hair frizzes more because the cuticle is already raised — moisture rushes in even faster. Healthy, well-moisturised hair with a closed cuticle frizzes less. Everything that follows is about keeping the cuticle flat and the hair hydrated enough that it doesn't need to grab moisture from the air."
        },
        {
          heading: "The Daily Routine That Reduces Frizz",
          content: "Four habits matter. (1) Sulfate-free shampoo — sulfates roughen the cuticle, making hair frizz-prone. (2) Conditioner on every wash, mid-lengths to ends, left on for 2–3 minutes. (3) Leave-in with a lightweight silicone or oil on damp hair before styling — this creates a barrier against humidity. (4) Avoid over-washing. Hair washed daily is hair stripped daily. 2–3 washes a week is plenty for most hair types."
        },
        {
          heading: "Styling to Prevent Frizz",
          content: "Heat styling, counterintuitively, helps with frizz — the cuticle seals flat when heated. Key is low heat (below 180°C) with a good heat protectant. A smoothing cream before blow-drying, blow-dry with the nozzle pointing down the hair shaft (root to tip), and a quick pass with a flat iron on the worst frizz zones. Finish with a shine spray or a drop of hair oil on the ends. Air-drying without product is a frizz guarantee in Sydney humidity."
        },
        {
          heading: "What Doesn't Work (But People Swear By)",
          content: "Argan oil on dry hair alone — without the underlying moisture balance, it just sits on top. Heavy silicone 'anti-frizz' drugstore serums — often work for an hour then hair feels coated. Cold-water rinses — barely helps. 'Don't touch your hair once it's dry' — realistic for nobody. The fundamental issue is cuticle health; surface fixes without that base don't last."
        },
        {
          heading: "Products That Actually Work in Sydney",
          content: "Juuce Heat Shield doubles as heat protection and humidity defence — our most-reached-for product at this salon for a reason. Pure Guardian Angel for finer hair. QIQI Bare Repair oil as a finishing product on the ends. Juuce Bond Repair weekly mask if hair is also damaged. All available at hairpinns.com with free shipping over $150."
        },
        {
          heading: "The Salon Treatment That Changes Everything: Straight Up Smoothing",
          content: "If your hair is frizz-prone and humidity is ruining your life from October to March, a salon smoothing treatment is the biggest upgrade available. Straight Up Smoothing is our signature treatment — no formaldehyde, suits most hair types, and gives 8–12 weeks of frizz-free hair through Sydney humidity. It doesn't make hair poker-straight — it seals the cuticle so humidity can't penetrate. Most clients say it changed their relationship with hair in summer. Priced $220–$480 depending on length. Book a consultation first if you've never had a smoothing treatment so we can assess your hair."
        },
        {
          heading: "When to Book Smoothing for Best Results",
          content: "Smoothing treatments hold 8–12 weeks. To cover peak humidity (December–February), book a smoothing in late October or November. For year-round control, clients typically book twice a year — one pre-summer (October–November) and one mid-autumn (April–May). Aftercare is non-negotiable: sulfate-free shampoo only, or the smoothing washes out fast."
        },
        {
          heading: "When Frizz Means Damage, Not Humidity",
          content: "If your hair is frizzy in low-humidity weather too (winter, indoors), that's damage, not humidity. The fix is bond-repair-focused: weekly Juuce Bond Repair mask, a trim to remove the worst damage, a colour-treatment break if possible. Smoothing won't fix damaged hair — the foundation needs to be there first. Book a consultation and we'll tell you honestly which path fits your hair."
        }
      ],
      productModule: {
        title: "Sydney humidity survival kit",
        products: [
          { name: "Frizz-free must-haves", link: "https://hairpinns.com/collections/frizz-free-must-haves", description: "Leave-ins and serums for humidity defence" },
          { name: "QIQI smoothing range", link: "https://hairpinns.com/collections/qiqi", description: "At-home maintenance for salon smoothing" },
          { name: "Juuce Bond Repair", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Weekly mask if frizz is damage-related" }
        ]
      },
      quickAnswer: {
        question: "How do you beat frizz in Sydney humidity?",
        answer: "Beat Sydney humidity frizz with sulfate-free shampoo, daily conditioner on mid-lengths to ends, a leave-in or oil before styling, and low-heat blow-drying with a heat protectant. For long-term control, a salon smoothing treatment like Straight Up Smoothing gives 8–12 weeks of frizz-free hair through peak humidity. Best booked in October–November for summer coverage."
      },
      keyTakeaways: [
        "Frizz happens when humidity swells the hair cortex and lifts the cuticle",
        "Daily basics: sulfate-free shampoo, conditioner every wash, leave-in before styling",
        "Heat styling with protectant actually reduces frizz by sealing the cuticle",
        "Straight Up Smoothing gives 8–12 weeks of humidity-proof hair",
        "If hair frizzes in low humidity too, it's damage — fix with bond repair first"
      ]
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections/frizz-free-must-haves",
      customText: "Shop frizz-free must-haves"
    }
  }
```

- [ ] **Step 2: Update topicMap.ts**

Append `'beating-frizz-sydney-humidity'` to the `blogSlugs` array of:

- Topic `frizz-control`
- Topic `smoothing`
- Topic `heat-protection`

- [ ] **Step 3: Typecheck**

```bash
cd HairPinns && npx tsc --noEmit
```

- [ ] **Step 4: Full build**

```bash
cd HairPinns && npm run build
```

Expected: build completes. Prerender generates 244 route HTML files (239 + 5 new seasonal posts). Confirm all 5 new seasonal post routes appear in the prerender output.

If build exceeds 10 minutes, stop and report.

- [ ] **Step 5: Dev server spot-check of all 5 seasonal posts**

```bash
npm run dev
```

Navigate to each of the 5 `/blog/<seasonal-slug>` URLs. Verify each renders. Also navigate to `/blog` and confirm all 16 new posts appear in the listing sorted by date. Finally, navigate to `/services/smoothing/mid-length-straight-up-smoothing` — confirm RelatedContent surfaces at least one of the new posts (the beating-frizz one, per topicMap assignment).

- [ ] **Step 6: Commit Cluster C**

```bash
cd "d:/Dev/Hair Pinns"
git add HairPinns/src/data/blogPosts.ts HairPinns/src/data/topicMap.ts
git commit -m "$(cat <<'EOF'
Cluster C (seasonal): 5 posts covering summer, winter, formals, Christmas, humidity

- Summer Hair Care Australia (1500w) — beach, sun, salt, chlorine defence
- Winter Hair Care Sydney 2026 (1200w) — new slug, existing winter post retained
- School Formal Trends 2026 (1500w)
- Christmas Hair Gifts 2026 (1200w) — new slug, existing Christmas post retained
- Beating Frizz Sydney Humidity (1600w)
- All 5 wired into topicMap: frizz-control, heat-protection, hydration, scalp-health, bond-repair, kids-formal, cuts, styling-tools, organic-care, smoothing
- Published now (not at seasonal peak) so Google indexes 4-8 weeks before each peak season

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git status
```

Expected: commit succeeds, status clean. All three clusters now shipped.

---

## Self-review checklist

**Spec coverage:**
- Commit 1 / Cluster A (4 posts): Tasks 1–4 ✓
- Commit 2 / Cluster B (7 posts): Tasks 5–11 ✓ (Bangor flagship in Task 5 has the "About the Salon" section-4 variance per spec)
- Commit 3 / Cluster C (5 posts): Tasks 12–16 ✓
- topicMap.ts updates per post: every task has a Step 2 that updates the correct topics per the spec's assignment tables ✓
- Review placeholder pattern for suburbs: composite reviews shipped with TODO comment language in the body ✓
- Typecheck + build gates: each commit task has typecheck; Tasks 4, 11, 16 have full `npm run build` ✓
- Commit messages: three distinct commit messages, one per cluster ✓
- Winter/Christmas as new slugs rather than in-place rewrites: Tasks 13 and 15 use new slugs ✓

**Placeholders scan:** No TBD/TODO markers in the plan content itself. The composite-review TODO comments are an intentional implementation pattern documented in the spec, not plan placeholders.

**Type consistency:** Every post uses the existing `BlogPost` interface. Optional fields (`productModule`) only included where commerce intent makes them useful. `cta.type` values match the interface's union type (`"booking" | "service" | "product" | "chat-isabella" | "call-sam"`). `servicePath` uses `/services/...` prefix matching existing posts. `productPath` uses full `https://hairpinns.com/collections/...` URL matching existing posts.

Plan complete.
