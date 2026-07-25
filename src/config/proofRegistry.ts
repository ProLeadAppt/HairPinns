import { ENTITY_REGISTRY } from "./entityRegistry";

export type ProofSourceType =
  | "fresha"
  | "sustainable-salons"
  | "owned-profile"
  | "google";

export type ProofPublicationStatus = "published" | "withheld";

export interface ProofRecord {
  id: string;
  claim: string;
  scope: "venue" | "person" | "business";
  sourceType: ProofSourceType;
  sourceUrl: string;
  checkedDate: string;
  expiryDate?: string;
  dynamic: boolean;
  publicationStatus: ProofPublicationStatus;
  value?: Record<string, string | number | boolean>;
  note?: string;
}

export const PROOF_REGISTRY: readonly ProofRecord[] = [
  {
    id: "fresha-venue-rating",
    claim: "Hair Pinns- Bangor Studio has a 5.0 Fresha venue rating from 936 reviews.",
    scope: "venue",
    sourceType: "fresha",
    sourceUrl: ENTITY_REGISTRY.profiles.fresha.venueUrl,
    checkedDate: "2026-07-25",
    expiryDate: "2026-10-25",
    dynamic: true,
    publicationStatus: "published",
    value: { rating: 5, reviewCount: 936 },
  },
  {
    id: "service-menu-live-source",
    claim: "Published Hair Pinns service names and prices were checked against the live Fresha venue menu.",
    scope: "venue",
    sourceType: "fresha",
    sourceUrl: ENTITY_REGISTRY.profiles.fresha.venueUrl,
    checkedDate: "2026-07-25",
    expiryDate: "2026-08-25",
    dynamic: true,
    publicationStatus: "published",
    value: { menuVerified: true },
  },
  {
    id: "sustainable-salons-membership",
    claim: "Hair Pinns is listed in the Sustainable Salons directory.",
    scope: "business",
    sourceType: "sustainable-salons",
    sourceUrl: ENTITY_REGISTRY.profiles.sustainableSalons,
    checkedDate: "2026-07-25",
    expiryDate: "2027-01-25",
    dynamic: true,
    publicationStatus: "published",
    value: { listed: true },
  },
  {
    id: "jena-behind-chair-since-2009",
    claim: "Jena has been behind the chair since 2009.",
    scope: "person",
    sourceType: "owned-profile",
    sourceUrl: ENTITY_REGISTRY.profiles.instagram,
    checkedDate: "2026-07-25",
    dynamic: false,
    publicationStatus: "published",
    value: { sinceYear: 2009 },
  },
  {
    id: "google-rating-unresolved",
    claim: "Google rating and review count are not approved for publication until refreshed from the canonical Places record.",
    scope: "venue",
    sourceType: "google",
    sourceUrl: ENTITY_REGISTRY.profiles.google.profileUrl,
    checkedDate: "2026-07-25",
    dynamic: true,
    publicationStatus: "withheld",
    note: "The prior aggregate values had no current source metadata.",
  },
] as const;

const isExpired = (proof: ProofRecord, asOfDate: string): boolean =>
  Boolean(proof.expiryDate && proof.expiryDate < asOfDate);

export const getPublishableProof = (
  asOfDate: string = new Date().toISOString().slice(0, 10),
): ProofRecord[] =>
  PROOF_REGISTRY.filter(
    (proof) =>
      proof.publicationStatus === "published" && !isExpired(proof, asOfDate),
  );

export const validateProofRegistry = (
  asOfDate: string = new Date().toISOString().slice(0, 10),
  registry: readonly ProofRecord[] = PROOF_REGISTRY,
): string[] => {
  const issues: string[] = [];
  const ids = registry.map((proof) => proof.id);
  if (new Set(ids).size !== ids.length) issues.push("duplicate-proof-id");

  for (const proof of registry) {
    if (!proof.sourceUrl.startsWith("https://")) {
      issues.push(`invalid-proof-source:${proof.id}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(proof.checkedDate)) {
      issues.push(`invalid-proof-checked-date:${proof.id}`);
    }
    if (
      proof.publicationStatus === "published" &&
      proof.dynamic &&
      !proof.expiryDate
    ) {
      issues.push(`missing-proof-expiry:${proof.id}`);
    }
    if (
      proof.publicationStatus === "published" &&
      proof.dynamic &&
      isExpired(proof, asOfDate)
    ) {
      issues.push(`expired-proof:${proof.id}`);
    }
    if (proof.publicationStatus === "published" && !proof.value) {
      issues.push(`unsupported-proof:${proof.id}`);
    }
  }

  return issues;
};
