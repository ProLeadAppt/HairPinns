# PR5: Repo-Grounded, Policy-Compliant Local Review Proof Architecture

## 1. Executive Summary

PR5 introduces a **provenance-gated review proof layer** that renders sourced, permission-aware trust signals from the existing `proofRegistry` onto service detail and location pages — without fabricating reviews, without `AggregateRating` schema, and without publishing Google review counts until the unresolved Google proof record is refreshed.

> **Implementation correction, 2026-07-26:** The original scoped-reference proposal below was deliberately narrowed during review. A Fresha venue aggregate is not service-specific or suburb-specific proof. The implemented design therefore reuses the existing `fresha-venue-rating` record through a fail-closed lookup and `resolveVenueReviewProof()`. Service pages label it explicitly as the **Hair Pinns venue on Fresha**. Among location pages, only the canonical Bangor salon route can resolve it; evidence-pending suburb pages receive no badge. No duplicate proof record or broad per-suburb scoped ledger was added.

The implemented layer builds a **`ReviewProofBadge` component** that reads resolved venue proof, keeps the existing Fresha booking journey intact, and remains UI-only. Registry parity prevents supported aggregate wording from escaping the proof boundary.

---

## 2. Current State (Baseline)

### Files already in place

| File | Role | Status |
|------|------|--------|
| `src/config/proofRegistry.ts` | `ProofRecord` model + `PROOF_REGISTRY` + `getPublishableProof` + `validateProofRegistry` | ✅ 5 records |
| `src/config/entityRegistry.ts` | `EntityRegistry` with Fresha venue/professional URLs, Sustainable Salons URL, Google place ID | ✅ Canonical |
| `src/config/registryParity.test.ts` | Parity test that bans stale claims | ✅ |
| `src/lib/reviewPolicy.ts` | Rating-neutral feedback routing | ✅ |
| `src/components/reviews/ReviewCarousel.tsx` | Third-party embedded iframe (reputationhub.site) | ✅ External widget |
| `src/components/reviews/ReviewChoices.tsx` | Feedback choice UI | ✅ Active |
| `src/data/serviceDetails.ts` | Per-service detail data with `priceProofId` | ✅ |

### Existing proof records (already defined)

| ID | Source | Status | Value |
|----|--------|--------|-------|
| `fresha-venue-rating` | Fresha | published | rating:5, reviewCount:936 |
| `service-menu-live-source` | Fresha | published | menuVerified:true |
| `sustainable-salons-membership` | Sustainable Salons | published | listed:true |
| `jena-behind-chair-since-2009` | Owned profile | published | sinceYear:2009 |
| `google-rating-unresolved` | Google | **withheld** | (none — blocked until refreshed) |

### What does NOT exist (gap for PR5)

- No component renders `fresha-venue-rating` as a visible trust signal
- No data model ties a service/location to a specific proof record for review attribution
- No UI seam for per-service Fresha review references on `ServiceDetailExperience` or `LocationPage`
- No RED test that validates the new seam at build time or runtime
- No proof of provenance on the static `AITestimonials` data (currently fabricated testimonials)

---

## 3. Data Model Proposal

### 3.1 New type: `ReviewProofRef` (in `src/config/proofRegistry.ts`)

```typescript
/**
 * Links a service, location, or product to a specific proof record.
 * Used by components to render provenance-gated review trust signals.
 */
export interface ReviewProofRef {
  /** The PROOF_REGISTRY id this reference resolves to. */
  proofId: string;
  /** Optional: override label shown to the user (e.g., "5.0★ on Fresha"). */
  displayLabel?: string;
  /** The entity slug this ref belongs to (service slug, location slug, etc.). */
  entitySlug: string;
  /** What kind of entity this ref belongs to. */
  entityType: "service" | "location" | "product";
  /**
   * The specific facet of the proof record to render.
   * If omitted, renders the record's top-level claim string.
   */
  valueKey?: keyof ProofRecord["value"];
  /**
   * Whether to show this as a link to the sourceUrl.
   * Default true for dynamic, published proofs.
   */
  linkToSource?: boolean;
}
```

### 3.2 New registry: `SCOPED_PROOF_REFS` (in a new file `src/config/scopedProofRefs.ts`)

```typescript
import type { ReviewProofRef } from "./proofRegistry";

/**
 * Maps entities (services, locations, products) to their associated
 * proof-of-record review claims. Every entry here references a published,
 * non-expired record in PROOF_REGISTRY.
 *
 * This is the ONLY place copy-level review references are defined.
 * No service detail page or location page hardcodes a review reference
 * directly — they import from this ledger.
 */
export const SCOPED_PROOF_REFS: readonly ReviewProofRef[] = [
  // ── Service-level Fresha review proof refs ──
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "mid-length-straight-up-smoothing",
    entityType: "service",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "long-thick-straight-up-smoothing",
    entityType: "service",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "full-head-foils-package",
    entityType: "service",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "half-head-foils-cut-blowdry",
    entityType: "service",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "quarter-head-foils-cut-blowdry",
    entityType: "service",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "straight-up-smoothing-teens",
    entityType: "service",
    valueKey: "rating",
    linkToSource: true,
  },

  // ── Location-level Fresha review proof refs ──
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "bangor",
    entityType: "location",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "menai",
    entityType: "location",
    valueKey: "rating",
    linkToSource: true,
  },
  {
    proofId: "fresha-venue-rating",
    displayLabel: "5.0★ venue rating",
    entitySlug: "sutherland",
    entityType: "location",
    valueKey: "rating",
    linkToSource: true,
  },
  // ... etc. for all location slugs
];
```

### 3.3 Resolver function (in `src/config/scopedProofRefs.ts`)

```typescript
import { getPublishableProof, type ProofRecord } from "./proofRegistry";

export interface ResolvedProofRef {
  ref: ReviewProofRef;
  record: ProofRecord;
  label: string;
  isAvailable: boolean;
}

/**
 * Resolves SCOPED_PROOF_REFS for a given entity against the current
 * published, non-expired proof registry. Returns an empty array if
 * the proof record is expired, withheld, or the ref doesn't match.
 */
export const resolveProofRefsForEntity = (
  entitySlug: string,
  entityType: ReviewProofRef["entityType"],
  asOfDate?: string,
): ResolvedProofRef[] => {
  const publishable = getPublishableProof(asOfDate);
  const publishableIds = new Set(publishable.map((p) => p.id));

  return SCOPED_PROOF_REFS
    .filter((ref) => ref.entitySlug === entitySlug && ref.entityType === entityType)
    .map((ref) => {
      const record = getPublishableProof(asOfDate).find((p) => p.id === ref.proofId);
      if (!record) {
        return { ref, record: null as unknown as ProofRecord, label: "", isAvailable: false };
      }

      const value = ref.valueKey && record.value
        ? String(record.value[ref.valueKey] ?? "")
        : "";

      return {
        ref,
        record,
        label: ref.displayLabel ?? (value ? value : record.claim),
        isAvailable: record.publicationStatus === "published" && !isExpired(record, asOfDate),
      };
    })
    .filter((resolved) => resolved.isAvailable);
};
```

### 3.4 New proof record for service-menu review linkage

Add to `PROOF_REGISTRY` in `src/config/proofRegistry.ts`:

```typescript
{
  id: "fresha-venue-review-proof",
  claim: "Every service with a Fresha review proof ref links to the same verified 5.0 venue rating on Fresha.",
  scope: "venue",
  sourceType: "fresha",
  sourceUrl: ENTITY_REGISTRY.profiles.fresha.venueUrl,
  checkedDate: "2026-07-25",
  expiryDate: "2026-10-25",
  dynamic: true,
  publicationStatus: "published",
  value: { venueRatingAvailable: true, refCount: 6 },
}
```

---

## 4. UI Component Architecture

### 4.1 New component: `ReviewProofBadge` (`src/components/reviews/ReviewProofBadge.tsx`)

```typescript
interface ReviewProofBadgeProps {
  proofRef: ResolvedProofRef;
  variant?: "simple" | "detailed" | "link";
  showSourceIcon?: boolean;
  className?: string;
}
```

Renders:
- **Simple**: `5.0★ on Fresha` (pill badge with star icon + source icon)
- **Detailed**: `5.0★ venue rating • 936 reviews • Verified on Fresha` (expanded card)
- **Link**: Anchored to `record.sourceUrl` with arrow ↗
- Always shows source attribution (`sourceType === "fresha"` → Fresha logo/icon)
- Never shows aggregate rating schema markup
- Always links to Fresha venue URL for click-through verification

### 4.2 Integration points (UI seams)

| Page | Component | Where to integrate | Ref |
|------|-----------|-------------------|-----|
| `ServiceDetailExperience.tsx` | Sidebar (booking aside) | Under price/duration block, before Fresha CTA | `resolveProofRefsForEntity(serviceSlug, "service")` |
| `LocationPage.tsx` | Services section or hero sidebar | Alongside "Salon" info block or under the popular services list | `resolveProofRefsForEntity(slug, "location")` |
| `Services.tsx` | ReviewStrip area | If ReviewStrip returns, replace with `ReviewProofBadge` row | All service proof refs |
| `ServiceDirectory.tsx` | Category headers | Per-category Fresha proof badge | Via `priceProofId` |

### 4.3 What to NOT do (policy enforcement)

- ❌ Do NOT render `AggregateRating` schema — the `schema.ts` `ProductData.rating` field is unused; keep it that way
- ❌ Do NOT render the `google-rating-unresolved` record — its `publicationStatus` is `"withheld"`
- ❌ Do NOT fabricate individual review excerpts — no `Review` schema, no `author`, no `reviewBody`
- ❌ Do NOT render the static `AITestimonials` data as proof — it has no proof record backing
- ❌ Do NOT embed `reviewCount` from Fresha as raw count in schema — only for UI display with source attribution

---

## 5. Privacy & Permission Constraints

| Constraint | Enforcement | Why |
|-----------|-------------|-----|
| Google reviews not published | `google-rating-unresolved` has `publicationStatus: "withheld"`; `getPublishableProof` filters it out | No current canonical source metadata |
| Fresha review count for display only | Rendered only in UI via `ReviewProofBadge`; no `AggregateRating` schema emitted | Avoids fabricated schema; count is source-verified |
| No PII in feedback | `ReviewFeedback` clears name+email on reload (sessionStorage only saves feedback text, not PII) | GDPR / privacy compliance |
| No assumed sentiment | `reviewPolicy.ts` offers same choices for all ratings | Rating-neutral design principle |
| Third-party widget is isolated | `ReviewCarousel.tsx` embeds reputationhub.site in iframe — sandboxed | Content Security Policy |

---

## 6. RED Tests (Write Before Implementation)

### 6.1 Build-time parity test: `scopedProofRefs.test.ts`

```typescript
import { describe, expect, it } from "vitest";
import { getPublishableProof, PROOF_REGISTRY } from "./proofRegistry";
import { SCOPED_PROOF_REFS, resolveProofRefsForEntity } from "./scopedProofRefs";

describe("scoped proof refs", () => {
  it("every proofId in SCOPED_PROOF_REFS resolves to a published, non-expired proof record", () => {
    const publishableIds = new Set(getPublishableProof("2026-07-25").map((p) => p.id));
    const refProofIds = new Set(SCOPED_PROOF_REFS.map((ref) => ref.proofId));
    for (const proofId of refProofIds) {
      expect(publishableIds).toContain(proofId);
    }
  });

  it("every service slug exists in serviceDetailData", () => {
    const { serviceDetailData } = await import("../data/serviceDetails");
    const serviceSlugs = new Set(
      serviceDetailData.flatMap((cat) => cat.services.map((s) => s.slug)),
    );
    for (const ref of SCOPED_PROOF_REFS) {
      if (ref.entityType === "service") {
        expect(serviceSlugs).toContain(ref.entitySlug);
      }
    }
  });

  it("every location slug exists in locationPages data", () => {
    const { locationPages } = await import("../data/locationPages");
    const locationSlugs = new Set(locationPages.map((l) => l.slug));
    for (const ref of SCOPED_PROOF_REFS) {
      if (ref.entityType === "location") {
        expect(locationSlugs).toContain(ref.entitySlug);
      }
    }
  });

  it("resolves available proof refs for a valid service slug", () => {
    const refs = resolveProofRefsForEntity("mid-length-straight-up-smoothing", "service", "2026-07-25");
    expect(refs.length).toBeGreaterThan(0);
    expect(refs[0].isAvailable).toBe(true);
    expect(refs[0].record.id).toBe("fresha-venue-rating");
    expect(refs[0].label).toBe("5.0★ venue rating");
  });

  it("returns empty array for withheld or expired proof records", () => {
    const refs = resolveProofRefsForEntity("mid-length-straight-up-smoothing", "service", "2026-10-26");
    expect(refs.map((r) => r.isAvailable)).not.toContain(true);
  });

  it("rejects proofIds that reference the withheld google record", () => {
    const googleRef = SCOPED_PROOF_REFS.find((ref) => ref.proofId === "google-rating-unresolved");
    expect(googleRef).toBeUndefined();
  });
});
```

### 6.2 E2E test: `review-proof-badge.spec.ts`

```typescript
import { expect, test } from "@playwright/test";
import { ENTITY_REGISTRY } from "../../src/config/entityRegistry";

test("service detail page shows a sourced fresha review proof badge", async ({ page }) => {
  await page.goto("/services/smoothing/mid-length-straight-up-smoothing");

  // The badge should reference Fresha as the source
  await expect(page.locator("[data-review-proof]")).toBeVisible();
  await expect(page.locator("[data-review-proof-source='fresha']")).toBeVisible();

  // The badge should link to Fresha venue URL
  await expect(
    page.locator("[data-review-proof] a"),
  ).toHaveAttribute("href", ENTITY_REGISTRY.profiles.fresha.venueUrl);
});

test("location page shows a sourced fresha review proof badge", async ({ page }) => {
  await page.goto("/areas/bangor");

  await expect(page.locator("[data-review-proof]")).toBeVisible();
  await expect(page.locator("[data-review-proof-source='fresha']")).toBeVisible();
});

test("review proof badge does not render with google source", async ({ page }) => {
  await page.goto("/services/smoothing/mid-length-straight-up-smoothing");

  // Google proof is withheld — must not appear
  await expect(page.locator("[data-review-proof-source='google']")).toHaveCount(0);
});

test("review proof badge does not emit AggregateRating schema", async ({ page }) => {
  await page.goto("/services/smoothing/mid-length-straight-up-smoothing");

  const jsonld = page.locator('script[type="application/ld+json"]');
  const scripts = await jsonld.evaluateAll((nodes) =>
    nodes.map((node) => node.textContent),
  );
  for (const script of scripts) {
    expect(script).not.toContain("AggregateRating");
  }
});
```

### 6.3 Registry parity update: `registryParity.test.ts`

Add to existing test suite:

```typescript
it("binds every scoped proof ref to a published proof record", () => {
  const publishableIds = new Set(getPublishableProof("2026-07-25").map((p) => p.id));
  for (const ref of SCOPED_PROOF_REFS) {
    expect(publishableIds).toContain(ref.proofId);
  }
});

it("does not reference the withheld google proof in any scoped ref", () => {
  expect(
    SCOPED_PROOF_REFS.some((ref) => ref.proofId === "google-rating-unresolved"),
  ).toBe(false);
});
```

### 6.4 Content trust audit update

Add to `content-trust-audit.mjs`:

```javascript
{ pattern: /5\\.0\\s?(?:\\/|out of)?\\s?5/i, label: 'unsourced aggregate review rating outside the proof component' }
```

This ensures any loose "5.0" that's not inside `ReviewProofBadge` gets caught.

---

## 7. Implementation Sequence

### Phase 1 — Data layer (BLOCKING for UI)

1. Add `fresha-venue-review-proof` record to `PROOF_REGISTRY`
2. Create `src/config/scopedProofRefs.ts` with new types, `SCOPED_PROOF_REFS`, and `resolveProofRefsForEntity`
3. Add six RED tests in `scopedProofRefs.test.ts`
4. Update `registryParity.test.ts` with scoped ref parity checks

### Phase 2 — UI component

5. Create `ReviewProofBadge` component
6. Wire into `ServiceDetailExperience.tsx` sidebar
7. Wire into `LocationPage.tsx` hero sidebar or services section
8. Add E2E tests in `review-proof-badge.spec.ts`
9. Update content trust audit

### Phase 3 — Verification

10. Run `npm run audit:trust` — must pass cleanly
11. Run `npm test` — all RED tests pass
12. Run E2E — review proof badge renders on every service detail and location page
13. Google Rich Results Test — no `AggregateRating` emitted for services

---

## 8. Files Summary

| Action | File | Purpose |
|--------|------|---------|
| **MODIFY** | `src/config/proofRegistry.ts` | Add `fresha-venue-review-proof` record |
| **CREATE** | `src/config/scopedProofRefs.ts` | `ReviewProofRef`, `SCOPED_PROOF_REFS`, `resolveProofRefsForEntity` |
| **CREATE** | `src/config/scopedProofRefs.test.ts` | RED tests for scoped refs |
| **CREATE** | `src/components/reviews/ReviewProofBadge.tsx` | UI trust badge component |
| **CREATE** | `tests/e2e/review-proof-badge.spec.ts` | E2E tests for badge rendering |
| **MODIFY** | `src/components/services/ServiceDetailExperience.tsx` | Integrate badge in sidebar |
| **MODIFY** | `src/pages/LocationPage.tsx` | Integrate badge in hero or services section |
| **MODIFY** | `src/config/registryParity.test.ts` | Add scoped ref parity checks |
| **MODIFY** | `scripts/content-trust-audit.mjs` | Block unsourced rating claims outside proof component |
| **NO CHANGE** | `src/lib/schema.ts` | No AggregateRating added |
| **NO CHANGE** | `src/lib/reviewPolicy.ts` | Remains rating-neutral |
| **NO CHANGE** | `src/data/serviceDetails.ts` | Already has `priceProofId` — review refs go in scoped ledger |
| **NO CHANGE** | `src/data/locationPages.ts` | No proof refs in data — goes through scoped ledger |

---

## 9. Key Design Decisions

1. **Scoped proof refs are a ledger, not inline annotations** — Every service/location's Fresha review reference lives in `SCOPED_PROOF_REFS`, not scattered across page data. This enables build-time parity checks in a single sweep.

2. **Proof expiry drives UI visibility** — When `fresha-venue-rating` expires (e.g., after 3 months without re-verification), `resolveProofRefsForEntity` returns `isAvailable: false` and the badge hides. No stale data.

3. **No Google proof until refreshed** — The `google-rating-unresolved` record is `withheld`. Even if someone adds a scoped ref pointing to it, `getPublishableProof` filters it out. This is fail-closed by design.

4. **No AggregateRating anywhere** — The `ProductData.rating` field in `schema.ts` remains unused. The Fresha rating is a UI trust signal only, not schema markup. Per Google's guidelines, aggregate ratings must be from verified canonical sources, and the Fresha venue rating is a third-party platform rating that applies to the venue, not individual services/products within a product schema context.

5. **Third-party widget stays** — The `ReviewCarousel` (`reputationhub.site` iframe) operates independently of this architecture. It's a separate review display surface that does not go through the proof registry. The `ReviewProofBadge` is the provenance-gated alternative.