import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import EstimatedDelivery from "./EstimatedDelivery";

describe("delivery estimates", () => {
  it("does not invent dates or faster delivery for higher spend", () => {
    const low = renderToStaticMarkup(<EstimatedDelivery cartTotal={20} />);
    expect(renderToStaticMarkup(<EstimatedDelivery cartTotal={200} />)).toBe(low);
    expect(low).toContain("after dispatch");
    expect(low).toContain("preorder");
    expect(low).not.toContain("Estimated delivery:");
  });
});
