import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("route metadata contracts", () => {
  it("mentions a suburb once in location titles", () => {
    const page = readFileSync(resolve(process.cwd(), "src/pages/LocationPage.tsx"), "utf8");
    const presentation = readFileSync(resolve(process.cwd(), "src/lib/locationPresentation.ts"), "utf8");

    expect(page).toContain("title={getLocationSeoTitle(locationData)}");
    expect(page).toContain("{getLocationHeading(locationData)}");
    expect(presentation).not.toContain(
      "Hairdresser ${location.name} | Hair Salon near ${location.name}",
    );
    expect(presentation).toContain(
      "Hairdresser & Hair Salon near ${location.name} | Hair Pinns",
    );
    expect(presentation).toContain('location.slug === "bangor-2234"');
    expect(presentation).toContain('"Hairdresser in Bangor"');
  });
});
