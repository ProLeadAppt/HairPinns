import type { CartLine, CartMoney, CartSnapshot } from "./cartApi";

// Reconcile Shopify amounts in the currency's minor units. This only formats
// confirmed prices; eligibility, percentages and discount rules stay in Shopify.
function scaleFor(currency: string): number {
  try {
    return 10 ** new Intl.NumberFormat("en-AU", {
      style: "currency", currency,
    }).resolvedOptions().maximumFractionDigits;
  } catch {
    return 100;
  }
}

function minorUnits(money: CartMoney | undefined, currency: string): number | null {
  if (!money || money.currencyCode !== currency || !/^\d+(?:\.\d+)?$/.test(money.amount)) return null;
  const units = Math.round(Number(money.amount) * scaleFor(currency));
  return Number.isSafeInteger(units) ? units : null;
}

export function getCartLinePricing(line: CartLine["node"], currency: string) {
  const scale = scaleFor(currency);
  const original = minorUnits(line.cost?.subtotalAmount, currency);
  const total = minorUnits(line.cost?.totalAmount, currency);
  const unitPrice = minorUnits(line.merchandise.price, currency) ?? 0;
  return {
    total: (total ?? unitPrice * line.quantity) / scale,
    original: original !== null && total !== null && original > total ? original / scale : null,
  };
}

export interface CartSavings {
  originalSubtotal: number;
  discounts: { label: string; amount: number }[];
}

/**
 * Explain only line discounts that reconcile exactly to Shopify's subtotal.
 * Never subtract these allocations again from the already discounted subtotal,
 * include shipping, or combine cart-level and line-level representations.
 * An incomplete/legacy cart still shows Shopify's own subtotal without a claim.
 */
export function getCartSavings(cart: CartSnapshot | null | undefined): CartSavings | null {
  const currency = cart?.cost.subtotalAmount?.currencyCode;
  if (!cart || !currency || cart.lines.pageInfo?.hasNextPage || !cart.lines.edges.length) return null;
  const subtotal = minorUnits(cart.cost.subtotalAmount, currency);
  if (subtotal === null) return null;

  const discounts = new Map<string, number>();
  let originalSubtotal = 0;
  let lineTotal = 0;
  let quantity = 0;
  for (const { node } of cart.lines.edges) {
    const original = minorUnits(node.cost?.subtotalAmount, currency);
    const total = minorUnits(node.cost?.totalAmount, currency);
    if (original === null || total === null || total > original) return null;
    originalSubtotal += original;
    lineTotal += total;
    quantity += node.quantity;
    let allocated = 0;
    for (const allocation of node.discountAllocations ?? []) {
      if (allocation.targetType !== "LINE_ITEM") continue;
      const amount = minorUnits(allocation.discountedAmount, currency);
      if (amount === null) return null;
      if (amount === 0) continue;
      const label = allocation.title?.trim() || allocation.code?.trim() || "Discount";
      allocated += amount;
      discounts.set(label, (discounts.get(label) ?? 0) + amount);
    }
    // Line amounts include quantity already. Missing or duplicated allocations
    // must not create an invented savings row, even if another line offsets it.
    if (allocated !== original - total) return null;
  }
  if (cart.totalQuantity !== undefined && quantity !== cart.totalQuantity) return null;
  if (lineTotal !== subtotal || originalSubtotal <= subtotal || !discounts.size) return null;

  const scale = scaleFor(currency);
  return {
    originalSubtotal: originalSubtotal / scale,
    discounts: Array.from(discounts, ([label, amount]) => ({ label, amount: amount / scale })),
  };
}
