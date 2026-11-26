import { BUSINESS_NAP } from "../config/businessConfig";
import type { LocationPageData } from "../data/locationPages";

interface LocationFaqSchema {
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export const buildLocationFaqSchema = (
  faqs: LocationPageData["faqs"],
): LocationFaqSchema | null => {
  if (faqs.length === 0) return null;

  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const getLocationTravelCopy = (
  location: LocationPageData,
): { heroLabel: string; visitNote: string } => {
  if (location.evidenceStatus === "canonical-location") {
    return {
      heroLabel: "Bangor salon location",
      visitNote: `Hair Pinns is at ${BUSINESS_NAP.address.full}.`,
    };
  }

  return {
    heroLabel: `Check live directions from ${location.name}`,
    visitNote: `Check live directions from ${location.name} to ${BUSINESS_NAP.address.street} before leaving.`,
  };
};

export const getLocationJourneyHeading = (location: LocationPageData): string =>
  location.evidenceStatus === "canonical-location"
    ? "Visit Hair Pinns in Bangor"
    : `From ${location.name} to Bangor`;

export const getLocationHeading = (location: LocationPageData): string =>
  location.slug === "bangor-2234"
    ? "Hairdresser in Bangor"
    : `Hairdresser near ${location.name}`;

export const getLocationSeoTitle = (location: LocationPageData): string =>
  location.seoTitle ?? `Hairdresser & Hair Salon near ${location.name} | Hair Pinns`;

export const getLocationMetaDescription = (location: LocationPageData): string =>
  location.metaDescription ?? (
    location.evidenceStatus === "canonical-location"
      ? `Hair salon in Bangor for one-on-one colour, blonding, smoothing, cuts and styling. Book online or call ${BUSINESS_NAP.phone.display}.`
      : `Hair salon near ${location.name} for colour, blonding, smoothing, cuts and styling at Hair Pinns in Bangor. Book online or call ${BUSINESS_NAP.phone.display}.`
  );

/** Area pages should not promote the same-suburb local guide as a competing URL. */
export const competingLocalBlogSlug = (areaSlug: string): string => {
  const suburb = areaSlug.replace(/-\d{4}$/, "");
  return suburb === "bangor"
    ? "best-hair-salon-bangor"
    : `best-hair-salon-near-${suburb}`;
};
