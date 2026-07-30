import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./ReviewFeedback.tsx", import.meta.url), "utf8");

describe("ReviewFeedback CRM delivery contract", () => {
  it("sends an explicit non-marketing consent state and checks delivery success", () => {
    expect(source).toContain("consent_marketing: false");
    expect(source).toContain("const success = await hpCapture.postToGHL(");
    expect(source).toContain("if (!success)");
  });
});
