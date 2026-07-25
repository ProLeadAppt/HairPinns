import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { locationPages } from "@/data/locationPages";

const netlifyConfig = readFileSync(new URL("../../netlify.toml", import.meta.url), "utf8");

describe("legacy suburb edge redirects", () => {
  it("maps every canonical location from both historic route families", () => {
    for (const location of Object.values(locationPages)) {
      const legacySlug = location.slug.replace(/-\d{4}$/, "");
      for (const prefix of ["near", "suburbs"]) {
        expect(netlifyConfig).toContain(`from = "/${prefix}/${legacySlug}"`);
        expect(netlifyConfig).toMatch(
          new RegExp(`from = "/${prefix}/${legacySlug}"[\\s\\S]{0,120}to = "/areas/${location.slug}/?"`),
        );
      }
    }
  });
});
