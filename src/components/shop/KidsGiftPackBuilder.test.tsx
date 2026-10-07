import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GiftChoice, GiftProduct } from "@/lib/kidsGiftSelection";
import KidsGiftPackBuilder from "./KidsGiftPackBuilder";

const state = vi.hoisted(() => ({ choices: {} as Record<string, GiftChoice> }));
vi.mock("react", async importOriginal => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: () => undefined,
  useState: (initial: unknown) => (typeof initial === "object" || typeof initial === "function")
    ? [state.choices, (update: (current: Record<string, GiftChoice>) => Record<string, GiftChoice>) => { state.choices = typeof update === "function" ? update(state.choices) : update; }]
    : [initial, () => undefined],
}));
vi.mock("react-router-dom", () => ({ Link: "a" }));

const gid = (id: string) => `gid://shopify/ProductVariant/${id}`;
const snowWhite = gid("53203907805365");
const yellow = gid("101");
const product: GiftProduct = {
  id: "brush", handle: "wet-brush-kids-detangler", title: "Wet Brush Kids Detangler",
  images: { edges: [] },
  variants: { edges: [
    { node: { id: snowWhite, title: "Snow White Mini", availableForSale: true, price: { amount: "16.95", currencyCode: "AUD" } } },
    { node: { id: yellow, title: "Yellow", availableForSale: true, price: { amount: "19.95", currencyCode: "AUD" } } },
  ] },
};
function descendants(node: ReactNode): ReactElement<Record<string, any>>[] {
  if (!isValidElement<Record<string, any>>(node)) return [];
  return [node, ...Children.toArray(node.props.children).flatMap(descendants)];
}
const render = (value = product) => descendants(KidsGiftPackBuilder({ products: [value] }));
const productLinks = (nodes = render()) => nodes.filter(node => node.type === "a" && node.props.to?.startsWith("/products/"));
const choose = (id: string) => render().find(node => node.type === "select" && node.props.id === "gift-option-brush")!.props.onChange({ target: { value: id } });

beforeEach(() => { state.choices = {}; });

describe("gift builder selected-variant links", () => {
  it("keeps the unselected product link neutral", () => {
    expect(productLinks().map(node => node.props.to)).toEqual(["/products/wet-brush-kids-detangler"]);
    expect(state.choices).toEqual({});
  });

  it("carries Snow White into the image link without changing the choice, quantity or price", () => {
    choose(snowWhite);
    expect(productLinks()[0].props.to).toBe("/products/wet-brush-kids-detangler?variant=53203907805365");
    expect(state.choices).toEqual({ brush: { variantId: snowWhite, quantity: 1 } });
    const text = render().flatMap(node => Children.toArray(node.props.children)).filter(value => typeof value === "string").join(" ");
    expect(text).toContain("$16.95");
  });

  it("updates the destination when the selected variant changes and removes it on deselection", () => {
    choose(snowWhite);
    choose(yellow);
    expect(productLinks()[0].props.to).toBe("/products/wet-brush-kids-detangler?variant=101");
    choose("");
    expect(productLinks()[0].props.to).toBe("/products/wet-brush-kids-detangler");
    expect(state.choices).toEqual({});
  });

  it("uses the same selected destination for the all-styles link", () => {
    choose(snowWhite);
    const many = { ...product, variants: { edges: Array.from({ length: 21 }, (_, index) => ({ node: {
      ...product.variants!.edges[0].node, id: index === 0 ? snowWhite : gid(String(index)),
    } })) } };
    expect(productLinks(render(many)).map(node => node.props.to)).toEqual([
      "/products/wet-brush-kids-detangler?variant=53203907805365",
      "/products/wet-brush-kids-detangler?variant=53203907805365",
    ]);
  });

  it("does not navigate to an unavailable or no-longer-present choice", () => {
    state.choices = { brush: { variantId: gid("missing"), quantity: 1 } };
    expect(productLinks()[0].props.to).toBe("/products/wet-brush-kids-detangler");
  });
});
