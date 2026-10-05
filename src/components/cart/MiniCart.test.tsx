import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import type { CartSnapshot } from "@/lib/cartApi";
import MiniCart from "./MiniCart";

const state = vi.hoisted(() => ({ cart: null as CartSnapshot | null }));
vi.mock("@/contexts/CartContext", () => ({ useCart: () => ({ cart: state.cart, cartLoading: false, cartError: null }) }));
vi.mock("@/hooks/use-promotion-now", () => ({ usePromotionNow: () => new Date("2026-10-05T12:00:00Z") }));
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));
vi.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a> }));

const money = (amount: string) => ({ amount, currencyCode: "AUD" });
beforeEach(() => {
  state.cart = {
    id: "cart", checkoutUrl: "https://example.test/checkout", totalQuantity: 1,
    lines: { edges: [{ node: {
      id: "line", quantity: 1,
      cost: { subtotalAmount: money("48.85"), totalAmount: money("39.08") },
      discountAllocations: [{ targetType: "LINE_ITEM", title: "KidsPack20", discountedAmount: money("9.77") }],
      merchandise: { id: "variant", price: money("48.85"), product: { title: "Kids selection" } },
    } }] },
    cost: { subtotalAmount: money("39.08"), totalAmount: money("49.03") },
  };
});
const render = () => renderToStaticMarkup(<MiniCart open onClose={() => undefined} />);

describe("cart discount rendering", () => {
  it("renders original subtotal, the Shopify title and savings, then the unmodified subtotal", () => {
    const html = render();
    expect(html).toMatch(/Subtotal before discounts<\/dt><dd[^>]*>\$48\.85/);
    expect(html).toMatch(/KidsPack20<\/dt><dd[^>]*>−\$9\.77/);
    expect(html).toMatch(/data-cart-subtotal=""[^>]*>\$39\.08/);
    expect(html).toMatch(/<del[^>]*><span[^>]*>Before discount: <\/span>\$48\.85/);
    expect(html).toContain("Line subtotal: </span>$39.08");
    expect(html).not.toContain("$49.03");
    expect(html).toContain("Shipping and any taxes are confirmed in Shopify checkout.");
    expect(html.match(/KidsPack20/g)).toHaveLength(1);
  });

  it("removes discount rows and strike-through when Shopify removes the allocation", () => {
    state.cart!.lines.edges[0].node.discountAllocations = [];
    state.cart!.lines.edges[0].node.cost = { subtotalAmount: money("43.90"), totalAmount: money("43.90") };
    state.cart!.cost.subtotalAmount = money("43.90");
    const html = render();
    expect(html).not.toContain("data-cart-savings");
    expect(html).not.toContain("<del");
    expect(html).toMatch(/data-cart-subtotal=""[^>]*>\$43\.90/);
  });

  it("renders an unchanged subtotal when allocation details cannot be reconciled", () => {
    state.cart!.lines.edges[0].node.discountAllocations![0].discountedAmount = money("19.54");
    const html = render();
    expect(html).not.toContain("data-cart-savings");
    expect(html).toMatch(/data-cart-subtotal=""[^>]*>\$39\.08/);
  });

  it("escapes Shopify labels as text", () => {
    state.cart!.lines.edges[0].node.discountAllocations![0].title = '<img src=x onerror="alert(1)">';
    const html = render();
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(html).not.toContain('<img src="x"');
  });
});
