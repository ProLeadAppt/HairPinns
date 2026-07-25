import { ENTITY_REGISTRY } from "./entityRegistry";

/** Canonical site URL, projected from the entity registry for existing callers. */
export const SITE_URL = ENTITY_REGISTRY.site.url;

/** Return the final public URL form used by Netlify and every SEO surface. */
export const canonicalSiteUrl = (value: string = SITE_URL): string => {
  const absolute = value.startsWith("http")
    ? value
    : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
  const parsed = new URL(absolute);

  if (parsed.origin === SITE_URL) {
    const lastSegment = parsed.pathname.split("/").filter(Boolean).at(-1) || "";
    const isStaticFile = /\.[a-z0-9]{2,8}$/i.test(lastSegment);
    if (!isStaticFile && !parsed.pathname.endsWith("/")) {
      parsed.pathname = `${parsed.pathname}/`;
    }
  }

  return parsed.toString();
};

/**
 * Backward-compatible NAP projection. New fact ownership belongs in
 * entityRegistry.ts; this object exists so callers can migrate without a
 * simultaneous site-wide API break.
 */
export const BUSINESS_NAP = {
  name: ENTITY_REGISTRY.business.name,
  ...ENTITY_REGISTRY.contact,
} as const;

/** Canonical weekly hours. Special-date overrides live beside these in the registry. */
export const BUSINESS_HOURS = ENTITY_REGISTRY.hours.weekly;

const formatTime = (value: string): string => {
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;
  return minute === "00" ? `${displayHour}${suffix}` : `${displayHour}:${minute}${suffix}`;
};

const SHORT_DAY: Record<(typeof BUSINESS_HOURS)[number]["day"], string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const BUSINESS_DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** Complete seven-day display derived from the canonical weekly records. */
export const BUSINESS_WEEK_DISPLAY = BUSINESS_DAY_ORDER.map((day) => {
  const hours = BUSINESS_HOURS.find((entry) => entry.day === day);
  return [
    SHORT_DAY[day],
    hours ? `${formatTime(hours.opens)}–${formatTime(hours.closes)}` : "Closed",
  ] as const;
});

/** Short display strings generated from the same weekly-hour records as schema. */
export const BUSINESS_HOURS_DISPLAY = [
  ...BUSINESS_HOURS.map(
    (hours) =>
      `${SHORT_DAY[hours.day]}: ${formatTime(hours.opens)} - ${formatTime(hours.closes)}`,
  ),
  "Sun - Mon: Closed",
] as const;

/** Canonical Google Places identifiers and actions. */
export const GBP_ID = ENTITY_REGISTRY.profiles.google.placeId;
export const GBP_REVIEW_URL = ENTITY_REGISTRY.profiles.google.reviewUrl;
export const GBP_URL = ENTITY_REGISTRY.profiles.google.profileUrl;
