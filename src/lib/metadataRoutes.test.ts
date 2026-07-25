import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("route metadata contracts", () => {
  it("mentions a suburb once in location titles", () => {
    const source = readFileSync(resolve(process.cwd(), "src/pages/LocationPage.tsx"), "utf8");

    expect(source).not.toContain(
      "Hairdresser ${locationData.name} | Hair Salon near ${locationData.name}",
    );
    expect(source).toContain(
      "Hairdresser & Hair Salon near ${locationData.name} | Hair Pinns",
    );
  });
});
