# Multi-Channel Map Pack Setup

Map pack visibility is not just Google. Apple Maps (2B+ devices) and Bing both drive cold traffic. This guide covers claiming and optimizing Hair Pinns across all major map platforms.

**Source of truth for NAP:** `src/config/businessConfig.ts` — use these values for every profile.

---

## Checklist: Map Pack Channels

| Channel | Claim URL | Status |
|---------|-----------|--------|
| Google Business Profile | [business.google.com](https://business.google.com) | Primary |
| Apple Business Connect | [mapsconnect.apple.com](https://mapsconnect.apple.com) | |
| Bing Places | [Bing Places](https://www.bingplaces.com) | |

---

## Apple Business Connect

1. **Claim your business** at [mapsconnect.apple.com](https://mapsconnect.apple.com)
2. **Add NAP** — use values from `businessConfig.ts`:
   - Name: Hair Pinns
   - Address: 60 Goorgool Rd, Bangor NSW 2234
   - Phone: 0468 093 991
   - Website: https://hairpinns.com
   - Email: hairpinns1@gmail.com
3. **Hours** — match GBP: Tue 10–5, Wed 6–9, Thu 9–9, Fri 9–5:30, Sat 8–2
4. **Photos** — logo, team, services, interior (consistent with website)
5. **Showcases** — highlight key services (Colour & Blonding, Smoothing, Cuts)
6. **Custom Action** — add booking link (from `bookingConfig.ts`)

---

## Bing Places

1. **Claim your business** at [Bing Places](https://www.bingplaces.com)
2. **NAP consistency** — ensure Name, Address, Phone match `businessConfig.ts` exactly
3. **Categories** — Hair Salon (primary), Hair Stylist, Beauty Salon as applicable
4. **Hours, photos, description** — mirror GBP and website

---

## Bing Webmaster Tools (Sitemap Submission)

Bing uses its own index. Submitting your sitemap speeds discovery of new and updated pages.

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. **Verify site ownership** (DNS, file upload, or meta tag)
3. **Submit sitemap:** `https://hairpinns.com/sitemap.xml`
4. For ongoing notifications when content changes, see [IndexNow Setup](indexnow-setup.md)

---

## NAP Consistency Across All Profiles

Every map and directory listing must use identical NAP. Reference `businessConfig.ts`:

| Field | Value |
|-------|-------|
| Business name | Hair Pinns |
| Street | 60 Goorgool Rd |
| Locality | Bangor |
| Region | NSW |
| Postcode | 2234 |
| Country | AU |
| Phone (display) | 0468 093 991 |
| Phone (raw) | +61468093991 |
| Website | https://hairpinns.com |
| Email | hairpinns1@gmail.com |

---

## Related Docs

- [GMB Sync Checklist](gmb-sync-checklist.md) — Google Business Profile sync
- [IndexNow Setup](indexnow-setup.md) — Notify Bing/Yandex when content changes
