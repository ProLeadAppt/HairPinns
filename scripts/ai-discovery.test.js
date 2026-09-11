import { describe, expect, it } from "vitest";
import { buildDiscoveryFiles } from "./ai-discovery.js";

const registry = {
  site: { url: "https://hairpinns.com", locale: "en-AU", country: "AU" },
  ids: {
    organization: "https://hairpinns.com/#organization",
    hairSalon: "https://hairpinns.com/#hairsalon",
    store: "https://hairpinns.com/#store",
    webSite: "https://hairpinns.com/#website",
    jena: "https://hairpinns.com/#jena-pinn",
    place: "https://hairpinns.com/#bangor-studio",
  },
  business: {
    name: "Hair Pinns",
    legalName: "Hair Pinns Pty Ltd",
    publicPositioning: "Appointment-only Bangor hair salon and Australia-wide haircare store",
  },
  person: { name: "Jena Pinn", safeExperienceWording: "Behind the chair since 2009" },
  contact: {
    address: {
      street: "60 Goorgool Road",
      locality: "Bangor",
      region: "NSW",
      postcode: "2234",
      country: "AU",
      full: "60 Goorgool Road, Bangor NSW 2234",
    },
    phone: { display: "0416 037 663", raw: "+61416037663" },
    email: "hairpinns1@gmail.com",
  },
  hours: {
    timezone: "Australia/Sydney",
    checkedDate: "2026-07-25",
    weekly: [
      { day: "Tuesday", opens: "09:00", closes: "17:00" },
      { day: "Wednesday", opens: "16:00", closes: "21:00" },
    ],
  },
  profiles: {
    google: { profileUrl: "https://example.com/google" },
    fresha: { venueUrl: "https://example.com/fresha" },
    instagram: "https://example.com/instagram",
    facebook: "https://example.com/facebook",
    sustainableSalons: "https://example.com/sustainable",
  },
  serviceAreas: ["Bangor", "Menai"],
};

const routes = [
  "/",
  "/about",
  "/blog",
  "/blog/first-guide",
  "/blog/second-guide",
  "/blog/christmas-gift-packs-at-hair-pinns",
  "/services",
  "/services/colour/full-head-foils",
  "/areas/menai-2234",
  "/shipping-to/new-south-wales",
  "/collections/qiqi",
  "/collections/free-extra-eligible",
  "/products/qiqi-vega",
];

describe("AI discovery generation", () => {
  const files = buildDiscoveryFiles({ registry, routes, sourceDate: "2026-07-25" });

  it("generates every discovery file from one deterministic model", () => {
    expect(Object.keys(files).sort()).toEqual([
      "ai.txt",
      "llm.txt",
      "llms-full.txt",
      "llms.json",
      "llms.txt",
    ]);
    expect(files["llm.txt"]).toBe(files["llms-full.txt"]);
    expect(Object.values(files).every((content) => content.includes("GENERATED FILE"))).toBe(true);
  });

  it("projects canonical facts without inventing ratings", () => {
    expect(files["llms.txt"]).toContain("Tuesday: 09:00–17:00");
    expect(files["llms.txt"]).toContain("60 Goorgool Road, Bangor NSW 2234");
    expect(files["llms.txt"]).toContain("0416 037 663");
    expect(files["llms.txt"]).toContain("2 active guides");
    expect(files["llms.txt"]).not.toMatch(/reviewCount|aggregateRating|\d+ reviews/i);
  });

  it("publishes only manifest-backed absolute URLs", () => {
    expect(files["llms-full.txt"]).toContain("https://hairpinns.com/blog/first-guide/");
    expect(files["llms-full.txt"]).toContain("https://hairpinns.com/products/qiqi-vega/");
    expect(files["llms-full.txt"]).not.toContain("christmas-gift-packs");
    expect(files["llms-full.txt"]).not.toContain("free-extra-eligible");
  });

  it("emits valid structured JSON with canonical hours and route counts", () => {
    expect(() => JSON.parse(files["llms.json"])).not.toThrow();
    const json = JSON.parse(files["llms.json"]);
    expect(json.openingHoursSpecification[0]).toMatchObject({
      dayOfWeek: "Tuesday",
      opens: "09:00",
      closes: "17:00",
    });
    expect(json.routeSummary.blogs).toBe(2);
    expect(json.routeSummary.products).toBe(1);
  });
});
