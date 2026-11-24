import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const posts: Record<string, { seoTitle: string; metaDescription: string; areaPath: string }> = {
  "best-hair-salon-bangor.tsx": {
    seoTitle: "Hair Salon in Bangor: Booking Guide | Hair Pinns",
    metaDescription: "A practical guide to Hair Pinns at 60 Goorgool Road, Bangor, covering colour, smoothing, cuts, salon hours and how to book online with Jena.",
    areaPath: "/areas/bangor-2234",
  },
  "best-hair-salon-near-cronulla.tsx": {
    seoTitle: "Hair Salon Near Cronulla: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Cronulla? See why Shire locals drive to Hair Pinns in Bangor for one-on-one colour, smoothing, cuts and easy parking.",
    areaPath: "/areas/cronulla-2230",
  },
  "best-hair-salon-near-menai.tsx": {
    seoTitle: "Hair Salon Near Menai: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Menai? See why Menai locals choose Jena at Hair Pinns in Bangor, 5 mins away with free parking and honest pricing.",
    areaPath: "/areas/menai-2234",
  },
  "best-hair-salon-near-engadine.tsx": {
    seoTitle: "Hair Salon Near Engadine: Local Guide | Hair Pinns",
    metaDescription: "Searching for a hair salon near Engadine? Discover one-on-one colour, smoothing and cuts with Jena at Hair Pinns in Bangor with easy street parking.",
    areaPath: "/areas/engadine-2233",
  },
  "best-hair-salon-near-miranda.tsx": {
    seoTitle: "Hair Salon Near Miranda: Local Guide | Hair Pinns",
    metaDescription: "Tired of busy shopping-centre salons near Miranda? See why locals visit Hair Pinns in Bangor for calm one-on-one colour, smoothing and cuts with Jena.",
    areaPath: "/areas/miranda-2228",
  },
  "best-hair-salon-near-illawong.tsx": {
    seoTitle: "Hair Salon Near Illawong: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hair salon near Illawong? Visit Jena at Hair Pinns in nearby Bangor for one-on-one colour, smoothing, cuts and free parking.",
    areaPath: "/areas/illawong-2234",
  },
  "best-hair-salon-near-sutherland.tsx": {
    seoTitle: "Hair Salon Near Sutherland Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Sutherland? See why locals head 10 minutes up to Bangor for Jena's one-on-one colour, smoothing and cuts at Hair Pinns.",
    areaPath: "/areas/sutherland-2232",
  },
  "best-hair-salon-near-como.tsx": {
    seoTitle: "Hair Salon Near Como: Local Guide | Hair Pinns",
    metaDescription: "Looking for a hairdresser near Como? Discover one-on-one colour, smoothing and cuts with Jena at Hair Pinns in Bangor, with free parking out front.",
    areaPath: "/areas/como-2226",
  },
  "sutherland-shire-hair-salon-guide.tsx": {
    seoTitle: "Sutherland Shire Hair Salon Guide | Hair Pinns",
    metaDescription: "How to choose a Sutherland Shire hair salon that listens. Jena's practical guide to colour, blonding, smoothing, cuts and booking in Bangor.",
    areaPath: "/areas/bangor-2234",
  },
};

describe("Sutherland Shire local guides", () => {
  it("uses exact titles and descriptions, with a live area link and no banned claims", () => {
    for (const [file, expected] of Object.entries(posts)) {
      const source = readFileSync(new URL(`./blog-posts/${file}`, import.meta.url), "utf8");
      expect(source, file).toContain(`seoTitle: "${expected.seoTitle}"`);
      if (file === "best-hair-salon-bangor.tsx") {
        expect(source, file).toContain(
          'metaDescription: "A practical guide to Hair Pinns at " + BUSINESS_NAP.address.street + ", Bangor, covering colour, smoothing, cuts, salon hours and how to book online with Jena."',
        );
      } else {
        expect(source, file).toContain(`metaDescription: "${expected.metaDescription}"`);
      }
      expect(expected.seoTitle.length, file).toBeLessThanOrEqual(60);
      expect(expected.metaDescription.length, file).toBeLessThanOrEqual(155);
      expect(source, file).toContain(expected.areaPath);
      expect(source, file).not.toMatch(/[\u2013\u2014]/);
      expect(source, file).not.toMatch(/trusted team|Sarah M\.|8\s*[-\u2013]\s*12 weeks|stylists|\bteam\b/i);
    }
  });
});
