import { describe, expect, it } from "vitest";
import { getProductAdvice } from "./productAdvice";

describe("Shopify product advice", () => {
  it("extracts only the recognised CMS headings as text", () => {
    expect(getProductAdvice('<h3>Who it suits</h3><p>Dry <strong>ends</strong> &amp; lengths.</p><h3>Other</h3><p>Ignore</p>')).toEqual([{ heading: "Who it suits", text: "Dry ends & lengths." }]);
  });
  it("does not invent advice when Shopify has none", () => {
    expect(getProductAdvice("<p>Existing description</p>")).toEqual([]);
  });
  it("ignores empty and duplicate sections", () => {
    expect(getProductAdvice('<h3>How to use it</h3><p></p><h3>Who it suits</h3><p>One</p><h3>Who it suits</h3><p>Two</p>')).toHaveLength(1);
  });
});
