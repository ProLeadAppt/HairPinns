import { describe, expect, it } from "vitest";
import { serviceDetailData } from "@/data/serviceDetails";
import { serviceCategories } from "./Services";

const directoryPrices = new Map(
  serviceCategories.flatMap((category) =>
    category.services.map((service) => [service.title, service.price] as const),
  ),
);

describe("current Fresha service menu", () => {
  it.each([
    ["Mid-Length Straight Up Smoothing Treatment", "A$ 339"],
    ["Long/Thick Straight Up Smoothing Treatment", "A$ 362"],
    ["Straight Up Smoothing for Teens", "A$ 289"],
    ["Full Head of Foils Package", "A$ 283"],
    ["1/2 Head of Foils, Cut & Blow-dry", "A$ 253"],
    ["1/4 Head Foils, Cut & Blow-dry", "A$ 223"],
    ["Long Hair Colour Package", "A$ 213"],
    ["Mid-Length Colour Package", "A$ 198"],
    ["Short Hair Colour Package", "A$ 184"],
    ["Long Cut/Blow-dry", "A$ 104"],
    ["Mid-Length Cut/Blowdry", "A$ 94"],
    ["Short Hair Cut & Blowdry", "A$ 87"],
    ["Kids Cut & Blow-dry Bundle", "A$ 67"],
    ["Primary Formal Hairstyle", "A$ 69"],
    ["High School Formal Hairstyle", "A$ 79"],
    ["Add curls to other service", "A$ 27"],
    ["GHD Curls Short/Mid-Length", "A$ 49"],
    ["GHD Curls LONG", "A$ 64"],
    ["Upstyle SHORT", "A$ 89"],
    ["Upstyle mid-length", "A$ 99"],
    ["Upstyle LONG", "A$ 104"],
    ["Superior Conditioning Treatment", "A$ 34"],
    ["Step 2- Rinse, dry/straighten", "A$ 419"],
  ])("shows %s at %s", (title, price) => {
    expect(directoryPrices.get(title)).toBe(price);
  });

  it("keeps detailed page prices in step with directory prices", () => {
    for (const category of serviceDetailData) {
      for (const service of category.services) {
        const directoryPrice = directoryPrices.get(service.title);
        expect(directoryPrice, `Missing directory entry for ${service.title}`).toBeDefined();
        expect(service.price, service.title).toBe(directoryPrice);
      }
    }
  });

  it("does not advertise legacy options absent from the public booking menu", () => {
    for (const title of [
      "Little Princess Crown Braid",
      "Complete Pamper Package",
      "Child Formal Hairstyle",
      "Rinse-out Colour",
      "OSTEO",
      "Regrowth colour + 20 foils",
    ]) {
      expect(directoryPrices.has(title), title).toBe(false);
    }
  });
});
