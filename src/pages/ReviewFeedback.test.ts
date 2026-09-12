import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ReviewFeedback.tsx", import.meta.url), "utf8");

describe("ReviewFeedback delivery contract", () => {
  it("sends private feedback through the first-party Netlify form", () => {
    expect(source).toContain('submitNetlifyForm("hair-pinns-review-feedback"');
    expect(source).not.toContain("consent_marketing");
  });
});
