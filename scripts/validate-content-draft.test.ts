import { describe, expect, it } from "vitest";
import { validateContentDraft } from "./validate-content-draft.mjs";
describe("draft content gates", () => {
  const draft = () => ({ status: "draft", week: 17, title: "Heat care", seoTitle: "Heat care | Hair Pinns", slug: "heat-care-draft", metaDescription: "x".repeat(145), content: { introduction: "word ".repeat(1180), stylistTip: "word ".repeat(10), sections: [{ heading: "Protection", content: "word ".repeat(5), subsections: [{ heading: "Application", content: "word ".repeat(5) }], bullets: ["one point"], steps: ["first step"] }] }, booking: { url: "https://example.test", verifiedAt: "2026-10-07", evidence: "Fresha checked" }, products: [{ handle: "verified-product", variantId: "123", verifiedAt: "2026-10-07", evidence: "catalogue read" }], factReview: { completed: true }, overlapReview: { completed: true } });
  it("accepts a complete reviewed draft without publishing it", () => expect(validateContentDraft(draft()).valid).toBe(true));
  it("rejects duplicate intent identifiers and activation requests", () => {
    const result = validateContentDraft({ ...draft(), activateEmail: true }, [{ slug: "heat-care-draft" }]);
    expect(result.valid).toBe(false); expect(result.errors.join(" ")).toContain("Slug already exists"); expect(result.errors.join(" ")).toContain("cannot activate");
  });
  it("requires metadata bounds, current variants and reviewed facts", () => {
    expect(validateContentDraft({ ...draft(), metaDescription: "Short", products: [], factReview: { completed: false } }).errors).toHaveLength(3);
  });
});
