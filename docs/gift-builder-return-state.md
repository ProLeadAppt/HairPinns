# Gift-builder return-state verification

This batch starts from the exact production source `6c55aefe3b48df513eb4d457e3aaaa3b79d12890` (PR93), not GitHub main. The Netlify site read on 7 October 2026 still reports published deploy `6ac5bbbfce0e2e53138846c1` ready. That manual release has no native commit_ref; its source/tree and artifact reconciliation are recorded in the prior release receipt. This change has not been deployed.

## Shopper friction and scope

The released component owns choices in component-local state. Its existing mocked browser regression explicitly verifies that navigating to a product and returning resets the selection. The unchanged released regression passed at 390px and 1280px before this fix. A shopper inspecting styles can therefore lose chosen items and quantities. The read-only production audit retained one selected item and its subtotal after Back in Chrome. Thus the reset was reproduced in the released SPA regression, not every production Back visit. This fix makes the draft explicit and verifies reload as well as SPA navigation.

The candidate saves only product/variant IDs and quantities in this tab's session storage, under a versioned key with a 24-hour maximum age. Back/Forward and refresh restore those choices. It stores no prices, inventory, cart IDs, customer details or credentials. Current Shopify collection data still loads before the builder; existing selection validation uses current availability, quantity limits and prices. Missing, sold-out or reduced-stock choices block adding and use the existing warning. A keyboard-accessible 44px clear control removes the saved draft and remains mounted so clearing does not discard focus.

Malformed, oversized, expired, future or unknown-version data is ignored. Blocked storage does not prevent choosing or clearing; persistence is unavailable in that case. Category filtering and scroll restoration are outside this narrow change. Selections remain after an explicit successful add, matching the existing builder behaviour while it stays mounted; they are not added automatically.

## Audit boundaries

Representative live sulfate-free and kids-gift article paths were inspected at 390px. The sulfate-free shortcuts are 44px high, reach the guide/product section, and the audited articles have no horizontal overflow. The existing mobile menu supplies shopping and booking links, named-dialog focus containment, Escape and return focus with no short touch targets in the inspected controls. Those functioning layouts are preserved.

No traffic-ranking claim is made: analytics were not accessed or changed. Booking URLs were inspected, not submitted; commerce writes and enquiry actions were blocked in the audit/browser tests. Product data, policies, prices, service offers, claims, analytics and backend functions are unchanged. No conversion uplift is claimed without production measurement.

## Review and release

This is a stacked draft PR based on `fix/website-evidence-content-workflow` (PR93). Review only its focused diff. Existing main/production provenance divergence remains; do not deploy a stale-main rebuild. A separately approved release must preserve PR93 and its generated variant packaging. No merge or production deployment is authorised for this task.

## Final validation

- 461 unit tests across 79 files passed; changed-file lint passed.
- All 51 Chromium/Firefox/WebKit browser cases verified: 47 initial passes, then four Firefox retries passed after allowing the long scenario 150 seconds and 0.001px DOMRect precision. No product code changed for those retries.
- Build quality/trust checks and Vite compilation passed. Prerender verified all 344 routes: 342 initially and two readiness-timeout routes (`/about` and one Aromaganic variant) passed in isolated retries. A temporary QA-only CLI parser copy retained the variant query's equals sign; the tracked build script is unchanged.
- SEO: 344 routes clean. Links: 345 HTML files, 303 targets, zero unresolved/indirect. Crawler: 286 pages, zero warnings.
- Full typecheck retains 24 diagnostics byte-for-byte identical to exact released source. Full lint retains one existing `contactTracking.ts` prefer-rest-params error and 16 warnings.

Original and retry logs are retained separately in the task evidence directory. Generated sitemap/discovery/variant files are excluded from this PR. Production remains the prior PR93 release; no merge or production deployment occurred.
