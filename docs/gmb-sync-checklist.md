# Google My Business (GBP) Sync Checklist

Keep the Hair Pinns website and Google Business Profile in sync for maximum local SEO and map pack visibility. Update this checklist whenever you change business details.

**Source of truth for website NAP:** `src/config/businessConfig.ts`

---

## NAP (Name, Address, Phone) — Must Match Exactly

| Field | Website Value | GMB Value | Match? |
|-------|---------------|-----------|--------|
| Business name | Hair Pinns | | |
| Street address | 60 Goorgool Rd | | |
| Locality | Bangor | | |
| Region | NSW | | |
| Postcode | 2234 | | |
| Country | AU | | |
| Full address | 60 Goorgool Rd, Bangor NSW 2234 | | |
| Phone (display) | 0468 093 991 | | |
| Phone (raw) | +61468093991 | | |
| Website URL | https://hairpinns.com | | |
| Email | hairpinns1@gmail.com | | |

**Action:** If you change NAP in `businessConfig.ts`, update GMB to match. If you change GMB, update `businessConfig.ts` and redeploy.

---

## GBP Categories

| Type | Value | Corresponding Website Page |
|------|-------|---------------------------|
| Primary category | (e.g. Hair Salon) | Homepage, /services |
| Secondary categories | (e.g. Hair Stylist, Beauty Salon) | Each should have a page or section |

**Action:** Each GBP category should have a dedicated URL with title format: `"Category Bangor"` or `"Category Sutherland Shire"`.

---

## GBP Services

List each service from GMB. Ensure each has:
- A dedicated page (e.g. /services/smoothing/mid-length-straight-up-smoothing)
- Title tag including service name + Bangor or Sutherland Shire

**Action:** Add any new GMB services to the website. Remove discontinued services from both.

---

## Description

GMB description should mirror key value props from:
- Homepage hero
- About page
- Include: Bangor, Sutherland Shire, 15+ years, colour, smoothing, cuts

---

## Attributes

| Attribute | Website | GMB |
|-----------|---------|-----|
| Hours | Tue 10–5, Wed 6–9, Thu 9–9, Fri 9–5:30, Sat 8–2 | |
| Payment methods | (as accepted) | |
| Accessibility | (if applicable) | |

---

## Photos

- Logo: Consistent with website
- Team: Jena, staff
- Services: Colour, smoothing, cuts
- Interior: Salon space

---

## Posts

Use GMB posts to promote:
- Stocktake sales (when active)
- New services
- Blog posts
- Same offers as website banners

---

## Q&A

Answers to common questions should align with:
- Site FAQs (e.g. suburb pages, service pages)
- Contact info (phone, booking link)

---

## Post-Website-Change (Within 48 Hours)

After updating NAP, services, key pages, schema, meta tags, or business info on the website:

1. Run through this checklist
2. Update GMB to match within 48 hours
3. Verify NAP, description, hours, and services are in sync
4. **Schema/meta changes:** Verify GBP description and categories still align with website messaging (e.g. retail vs local balance, Australia-wide shipping)

---

## Monthly Sync Steps

1. Compare NAP in GMB vs. `businessConfig.ts`
2. Verify all GBP services have website pages
3. Check description matches current messaging
4. Update hours if changed
5. Add a post promoting current offer or blog

---

## Quarterly Sync (Full Audit)

1. Full NAP audit across website, GMB, and key directories
2. Verify every GBP service has a corresponding page with correct title format
3. Refresh GMB description to match current messaging
4. Review and update Q&A answers
5. Run [GSC CTR Analysis](gsc-ctr-analysis-workflow.md) for title tag opportunities
6. Run [GBP Silo Audit](gbp-silo-audit-prompt.md) — Screaming Frog + AI to check website structure matches GBP categories and services
7. Competitor check — Oz Hair & Beauty, Beautopia, My Haircare: what do they rank for? Any schema or content gaps we can address?
8. Consider adding 1–2 customer stories per suburb (with permission) — see suburb page structure in `src/data/suburbPages.ts`

---

## Multi-Channel Map Pack

Map pack visibility extends beyond Google. Ensure Hair Pinns is claimed and optimized on all major platforms:

| Channel | Status | Notes |
|---------|--------|-------|
| Google Business Profile | Primary | Keep in sync with this checklist |
| Apple Business Connect | | [mapsconnect.apple.com](https://mapsconnect.apple.com) |
| Bing Places | | [Bing Places](https://www.bingplaces.com) |

**Full setup guide:** [Multi-Channel Map Setup](multi-channel-map-setup.md) — Apple Business Connect, Bing Places, NAP consistency, Bing Webmaster Tools sitemap submission.

---

## Related Docs

- [Multi-Channel Map Setup](multi-channel-map-setup.md) — Apple Business Connect, Bing Places, sitemap submission
- [GSC CTR Analysis Workflow](gsc-ctr-analysis-workflow.md) — Use GSC data + AI for title tag optimization
- [Local Authority Signals](local-authority-signals.md) — Chamber of Commerce, directories, community events
- [GBP Silo Audit Prompt](gbp-silo-audit-prompt.md) — Screaming Frog + AI audit for category/service gaps
