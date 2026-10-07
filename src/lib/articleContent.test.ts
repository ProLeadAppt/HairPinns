import { describe, expect, it } from "vitest";
import { articleWordCount } from "./articleContent";
describe("article body count", () => {
  it("counts visible subsections, lists and tips while excluding link URLs", () => {
    expect(articleWordCount({ introduction: "Two words", stylistTip: "Stylist advice", sections: [{ content: "[Read this](/products/a?variant=123)", subsections: [{ heading: "Heading", content: "Useful details" }], bullets: ["One point"], steps: ["First step"] }] })).toBe(12);
  });
});
