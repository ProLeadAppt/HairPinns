import { BUSINESS_NAP } from "../config/businessConfig";
import { PRIORITY_LOCATION_COPY } from "./locationPageCopy";

export type LocationEvidenceStatus =
  | "canonical-location"
  | "pending-local-evidence";

export interface LocationPageData {
  slug: string;
  name: string;
  fullName: string;
  postcode: string;
  driveTime: string;
  evidenceStatus: LocationEvidenceStatus;
  localIntro: string;
  popularServices: string[];
  faqs: Array<{ question: string; answer: string }>;
  nearbyLocations: string[];
  /** Exact title for priority suburb pages. Falls back when omitted. */
  seoTitle?: string;
  /** Exact meta description for priority suburb pages. Falls back when omitted. */
  metaDescription?: string;
  /** Reserved for permissioned, source-backed first-person guidance only. */
  jenaTip?: string;
}

type LocationDefinition = Pick<
  LocationPageData,
  "slug" | "name" | "fullName" | "postcode" | "nearbyLocations"
>;

const LOCATION_DEFINITIONS: readonly LocationDefinition[] = [
  {
    slug: "como-2226",
    name: "Como",
    fullName: "Como NSW 2226, Australia",
    postcode: "2226",
    nearbyLocations: ["oyster-bay-2225", "jannali-2226", "sutherland-2232", "gymea-2227"],
  },
  {
    slug: "gymea-2227",
    name: "Gymea",
    fullName: "Gymea NSW 2227, Australia",
    postcode: "2227",
    nearbyLocations: ["miranda-2228", "kirrawee-2232", "sylvania-2224", "como-2226"],
  },
  {
    slug: "menai-2234",
    name: "Menai",
    fullName: "Menai NSW 2234, Australia",
    postcode: "2234",
    nearbyLocations: ["bangor-2234", "illawong-2234", "alfords-point-2234", "sutherland-2232"],
  },
  {
    slug: "bangor-2234",
    name: "Bangor",
    fullName: "Bangor NSW 2234, Australia",
    postcode: "2234",
    nearbyLocations: ["menai-2234", "barden-ridge-2234", "illawong-2234", "alfords-point-2234"],
  },
  {
    slug: "jannali-2226",
    name: "Jannali",
    fullName: "Jannali NSW 2226, Australia",
    postcode: "2226",
    nearbyLocations: ["como-2226", "oyster-bay-2225", "sutherland-2232", "gymea-2227"],
  },
  {
    slug: "kareela-2232",
    name: "Kareela",
    fullName: "Kareela NSW 2232, Australia",
    postcode: "2232",
    nearbyLocations: ["sutherland-2232", "como-2226", "jannali-2226", "miranda-2228"],
  },
  {
    slug: "miranda-2228",
    name: "Miranda",
    fullName: "Miranda NSW 2228, Australia",
    postcode: "2228",
    nearbyLocations: ["caringbah-2229", "gymea-2227", "sutherland-2232", "kirrawee-2232"],
  },
  {
    slug: "padstow-2211",
    name: "Padstow",
    fullName: "Padstow NSW 2211, Australia",
    postcode: "2211",
    nearbyLocations: ["alfords-point-2234", "illawong-2234", "menai-2234", "bangor-2234"],
  },
  {
    slug: "cronulla-2230",
    name: "Cronulla",
    fullName: "Cronulla NSW 2230, Australia",
    postcode: "2230",
    nearbyLocations: ["caringbah-2229", "miranda-2228", "sylvania-2224", "gymea-2227"],
  },
  {
    slug: "illawong-2234",
    name: "Illawong",
    fullName: "Illawong NSW 2234, Australia",
    postcode: "2234",
    nearbyLocations: ["menai-2234", "alfords-point-2234", "bangor-2234", "barden-ridge-2234"],
  },
  {
    slug: "kirrawee-2232",
    name: "Kirrawee",
    fullName: "Kirrawee NSW 2232, Australia",
    postcode: "2232",
    nearbyLocations: ["sutherland-2232", "gymea-2227", "miranda-2228", "sylvania-2224"],
  },
  {
    slug: "sylvania-2224",
    name: "Sylvania",
    fullName: "Sylvania NSW 2224, Australia",
    postcode: "2224",
    nearbyLocations: ["miranda-2228", "gymea-2227", "kirrawee-2232", "caringbah-2229"],
  },
  {
    slug: "caringbah-2229",
    name: "Caringbah",
    fullName: "Caringbah NSW 2229, Australia",
    postcode: "2229",
    nearbyLocations: ["cronulla-2230", "miranda-2228", "gymea-2227", "sutherland-2232"],
  },
  {
    slug: "oyster-bay-2225",
    name: "Oyster Bay",
    fullName: "Oyster Bay NSW 2225, Australia",
    postcode: "2225",
    nearbyLocations: ["como-2226", "jannali-2226", "sylvania-2224", "kareela-2232"],
  },
  {
    slug: "sutherland-2232",
    name: "Sutherland",
    fullName: "Sutherland NSW 2232, Australia",
    postcode: "2232",
    nearbyLocations: ["kirrawee-2232", "kareela-2232", "menai-2234", "miranda-2228"],
  },
  {
    slug: "engadine-2233",
    name: "Engadine",
    fullName: "Engadine NSW 2233, Australia",
    postcode: "2233",
    nearbyLocations: ["bangor-2234", "menai-2234", "sutherland-2232", "kirrawee-2232"],
  },
  {
    slug: "barden-ridge-2234",
    name: "Barden Ridge",
    fullName: "Barden Ridge NSW 2234, Australia",
    postcode: "2234",
    nearbyLocations: ["bangor-2234", "menai-2234", "illawong-2234", "alfords-point-2234"],
  },
  {
    slug: "alfords-point-2234",
    name: "Alfords Point",
    fullName: "Alfords Point NSW 2234, Australia",
    postcode: "2234",
    nearbyLocations: ["illawong-2234", "menai-2234", "bangor-2234", "barden-ridge-2234"],
  },
];

const POPULAR_SERVICES = [
  "Colour & Blonding",
  "Keratin/Straight Up Smoothing",
  "Cuts & Styling",
] as const;

const buildLocationPage = (definition: LocationDefinition): LocationPageData => {
  const isCanonicalLocation = definition.slug === "bangor-2234";
  const priorityCopy = PRIORITY_LOCATION_COPY[definition.slug as keyof typeof PRIORITY_LOCATION_COPY];

  return {
    ...definition,
    driveTime: isCanonicalLocation ? "At the Bangor salon" : "Check live directions",
    evidenceStatus: isCanonicalLocation
      ? "canonical-location"
      : "pending-local-evidence",
    localIntro: priorityCopy?.localIntro ?? (
      isCanonicalLocation
        ? `Hair Pinns is an appointment-only Bangor hair salon at ${BUSINESS_NAP.address.street}. Check the current service menu and appointment availability through Fresha, or text ${BUSINESS_NAP.phone.display} for help choosing a service before visiting.`
        : `Hair Pinns serves clients travelling from ${definition.name} at its appointment-only salon in Bangor. Check the current service menu and appointment availability through Fresha, and use live directions to ${BUSINESS_NAP.address.street} before leaving.`
    ),
    popularServices: [...POPULAR_SERVICES],
    faqs: priorityCopy?.faqs ?? [],
    seoTitle: priorityCopy?.seoTitle,
    metaDescription: priorityCopy?.metaDescription,
  };
};

export const locationPages: Record<string, LocationPageData> = Object.fromEntries(
  LOCATION_DEFINITIONS.map((definition) => [
    definition.slug,
    buildLocationPage(definition),
  ]),
);

export const getAllLocationSlugs = (): string[] => Object.keys(locationPages);

export const getLocationData = (slug: string): LocationPageData | undefined =>
  locationPages[slug];

export const getLocationBySlug = getLocationData;
