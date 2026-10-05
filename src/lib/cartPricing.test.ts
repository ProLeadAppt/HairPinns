import { describe, expect, it } from "vitest";
import type { CartDiscountAllocation, CartLine, CartSnapshot } from "./cartApi";
import { getCartLinePricing, getCartSavings } from "./cartPricing";

const money = (amount: string, currencyCode = "AUD") => ({ amount, currencyCode });
const allocation = (amount: string, label = "KidsPack20", targetType = "LINE_ITEM"): CartDiscountAllocation => ({
  title: label, targetType, discountedAmount: money(amount),
});
const line = (original: string, total = original, quantity = 1, discounts: CartDiscountAllocation[] = []): CartLine => ({
  node: {
    id: `line-${original}`, quantity,
    merchandise: { id: "variant", price: money("999.00") },
    cost: { subtotalAmount: money(original), totalAmount: money(total) },
    discountAllocations: discounts,
  },
});
const cart = (lines: CartLine[], subtotal: string): CartSnapshot => ({
  id: "cart", checkoutUrl: "https://example.test/checkout",
  totalQuantity: lines.reduce((sum, item) => sum + item.node.quantity, 0),
  lines: { edges: lines, pageInfo: { hasNextPage: false } },
  cost: { subtotalAmount: money(subtotal), totalAmount: money("999.95") },
});
const kidsCart = () => cart([line("48.85", "39.08", 1, [allocation("9.77")])], "39.08");

describe("Shopify-confirmed cart pricing", () => {
  it("explains KidsPack20 once without recalculating a percentage or subtracting twice", () => {
    expect(getCartSavings(kidsCart())).toEqual({ originalSubtotal: 48.85, discounts: [{ label: "KidsPack20", amount: 9.77 }] });
  });

  it("does not invent savings below the eligible threshold", () => {
    expect(getCartSavings(cart([line("43.90")], "43.90"))).toBeNull();
  });

  it("does not treat unrelated products as eligible threshold spend", () => {
    expect(getCartSavings(cart([line("43.90"), line("32.95")], "76.85"))).toBeNull();
  });

  it("sums Shopify line amounts once even when quantity is greater than one", () => {
    const multiple = line("48.85", "39.08", 3, [allocation("9.77")]);
    expect(getCartLinePricing(multiple.node, "AUD")).toEqual({ original: 48.85, total: 39.08 });
    expect(getCartSavings(cart([multiple], "39.08"))?.originalSubtotal).toBe(48.85);
  });

  it("groups a discount across eligible lines while retaining unrelated full-priced lines", () => {
    const mixed = cart([
      line("20.00", "16.00", 1, [allocation("4.00")]),
      line("28.85", "23.08", 1, [allocation("5.77")]),
      line("32.95"),
    ], "72.03");
    expect(getCartSavings(mixed)).toEqual({ originalSubtotal: 81.8, discounts: [{ label: "KidsPack20", amount: 9.77 }] });
  });

  it("displays confirmed code or custom labels and supports a fully discounted line", () => {
    const code = { ...allocation("5.00"), title: undefined, code: "SALE" };
    expect(getCartSavings(cart([line("10.00", "0.00", 1, [code, allocation("5.00", "Gift")])], "0.00")))
      .toEqual({ originalSubtotal: 10, discounts: [{ label: "SALE", amount: 5 }, { label: "Gift", amount: 5 }] });
  });

  it("never includes shipping allocations or a tax/shipping-inclusive cart total", () => {
    const source = kidsCart();
    source.lines.edges[0].node.discountAllocations?.push(allocation("9.95", "Shipping", "SHIPPING_LINE"));
    expect(getCartSavings(source)?.discounts).toEqual([{ label: "KidsPack20", amount: 9.77 }]);
    // Cart-level allocations may duplicate line details: only the line source is used.
    Object.assign(source, { discountAllocations: [allocation("9.77")] });
    expect(getCartSavings(source)?.discounts).toEqual([{ label: "KidsPack20", amount: 9.77 }]);
  });

  it("does not subtract cart-level savings from the merchandise subtotal", () => {
    const source = cart([line("48.85")], "48.85");
    source.cost.totalAmount = money("39.08");
    Object.assign(source, { discountAllocations: [allocation("9.77")] });
    expect(getCartSavings(source)).toBeNull();
  });

  it.each(["9.76", "9.78", "bad", "-9.77", "Infinity"])("hides unverified savings for allocation %s", amount => {
    const source = kidsCart();
    source.lines.edges[0].node.discountAllocations = [allocation(amount)];
    expect(getCartSavings(source)).toBeNull();
  });

  it("hides duplicated, missing and wrong-currency allocation details", () => {
    const source = kidsCart();
    source.lines.edges[0].node.discountAllocations = [allocation("9.77"), allocation("9.77")];
    expect(getCartSavings(source)).toBeNull();
    source.lines.edges[0].node.discountAllocations = [];
    expect(getCartSavings(source)).toBeNull();
    source.lines.edges[0].node.discountAllocations = [{ ...allocation("9.77"), discountedAmount: money("9.77", "USD") }];
    expect(getCartSavings(source)).toBeNull();
  });

  it("hides the summary if line totals, cart subtotal or pagination are incomplete", () => {
    const source = kidsCart();
    source.cost.subtotalAmount = money("40.00");
    expect(getCartSavings(source)).toBeNull();
    source.cost.subtotalAmount = money("39.08");
    source.lines.pageInfo = { hasNextPage: true };
    expect(getCartSavings(source)).toBeNull();
    source.lines.pageInfo = { hasNextPage: false };
    source.totalQuantity = 2;
    expect(getCartSavings(source)).toBeNull();
    source.totalQuantity = 1;
    delete source.lines.edges[0].node.cost;
    expect(getCartSavings(source)).toBeNull();
  });

  it("supports legacy snapshots without claiming a discount", () => {
    const source = cart([line("10.00")], "10.00");
    delete source.lines.edges[0].node.cost;
    source.lines.edges[0].node.merchandise.price = money("10.00");
    expect(getCartSavings(source)).toBeNull();
    expect(getCartLinePricing(source.lines.edges[0].node, "AUD")).toEqual({ original: null, total: 10 });
    expect(getCartSavings(null)).toBeNull();
  });

  it("clears savings when Shopify removes the discount after a quantity change", () => {
    expect(getCartSavings(kidsCart())).not.toBeNull();
    expect(getCartSavings(cart([line("43.90")], "43.90"))).toBeNull();
  });
});
