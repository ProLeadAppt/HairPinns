# Hair Pinns connection hub release

Status: combined hub and event-guide candidate, awaiting hosted preview checks and publication. QR print artwork remains provisional until the permanent URL is live and verified.

## Source and scope

- Started from current published main commit `c8db36e5659b158acd64ebe2d0b6d4ad4af5acc4`, Christmas guide PR100. The signed-in hosting dashboard independently confirmed deploy `6ae2b0f18d6231faa1a26b10` and automatic publishing from main.
- Add a standalone `public/connect/` page and local brand assets, with focused tests. No new backend, analytics, QR subscription or tracking shortener.
- Integrate the separately reviewed event-appointment guide and its explicit per-post opt-out of the existing promotional sign-up. Default behavior for other articles remains unchanged.
- Refresh expired Fresha evidence only after a current public-source audit. All 15 copied service price/duration pairs matched. No service prices, durations, names or descriptions changed. See `fresha-proof-2026-11-03.md` for sources and limits.
- No changes to account, security, DNS, hosting configuration, offers, shipping, discounts, cart or checkout logic.

## Hub behavior

The permanent URL is https://hairpinns.com/connect/ . Four equally available choices link directly to Facebook, Instagram, the existing website and Google reviews. All feedback is welcome; no rating filter, incentive, form or script is used. Google may require the visitor to sign in.

The document works without JavaScript, uses local Playfair Display and Inter fonts, has large button targets and visible keyboard focus, and follows the existing white, pale lilac, purple and ink brand palette.

## Destination evidence, 3 November 2026

- Facebook: https://www.facebook.com/Hair.Pinns/ and Instagram: https://www.instagram.com/hair.pinns/ were read from fresh public website header/footer HTML.
- Website: https://hairpinns.com/ returns the current public site.
- Google Maps identified the existing place ID `ChIJs9xoWku_EmsRo264WfJGtg4` as Hair Pinns at 60 Goorgool Rd, Bangor NSW 2234, with the matching website and phone number. Its public profile displayed a Write a review action.
- Direct action: https://search.google.com/local/writereview?placeid=ChIJs9xoWku_EmsRo264WfJGtg4 . This reaches Google's authentication boundary when signed out. No account access or review submission was attempted. A signed-in review form was not tested.

## Validation and release gates

- Focused hub tests cover exact destination parity, neutral reviews, absence of scripts/forms/tracking, document semantics and local assets.
- Copy, editorial/design, tracking and trust checks pass. Full unit/function/render tests passed after the source-backed evidence refresh; rerun after guide integration.
- Scoped lint and whitespace checks pass. Full lint retains the existing 1 error and 16 warnings. The 24 TypeScript diagnostics matched an exact main-source baseline byte for byte. These baseline checks are not clean.
- The local public-catalogue generation and Vite compilation pass. Complete hosted prerender, SEO, internal-link and crawler checks must pass on the reviewed source before release.
- Actual mobile/desktop visual, keyboard, navigation and destination checks must be completed on the hosted preview, not inferred from source tests. Local browser execution was unavailable; it was not counted as passing.
- Colour contrast is 12.73:1 for ink on pale, 6.68:1 for accent on pale, and 14.14:1 for ink on white.

## Print gate

The provisional code points to the permanent Hair Pinns URL and uses error correction H, black on white, and a four-module quiet zone. The 2460px PNG decoded independently at five scales down to 123px and from the rendered A5 proof. The 90mm code area on the A5 concept has no logo overlay. Three PDF proofs were rendered and visually checked.

After the preview passes, publish through the existing Git workflow without overwriting newer work. Verify the exact production commit, live hub, four destinations, new guide, existing site navigation and genuine 404 behavior. Only then issue final unmarked SVG/PNG/PDF artwork.

Before engraving, request a full-size physical proof and scan it with iPhone and Android at the intended distance, lighting and material finish. Keep the printed URL working permanently. Clear, reflective or low-contrast material requires an opaque white backing and physical testing.
