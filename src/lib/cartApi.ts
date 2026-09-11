import { clearCartId, getCartId, saveCartId } from "./cartManagement";

export interface CartMoney {
  amount: string;
  currencyCode: string;
}

export interface CartLine {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title?: string;
      price?: CartMoney;
      product?: {
        id?: string;
        title?: string;
        handle?: string;
        tags?: string[];
      };
      image?: { url?: string; altText?: string | null } | null;
    };
  };
}

export interface CartSnapshot {
  id: string;
  checkoutUrl: string;
  totalQuantity?: number;
  lines: { edges: CartLine[] };
  cost: {
    subtotalAmount?: CartMoney;
    totalAmount: CartMoney;
  };
  discountCodes?: { code: string; applicable: boolean }[];
}

export interface CartInputLine {
  merchandiseId: string;
  quantity: number;
}

type CartActionRequest =
  | { action: "get"; cartId: string }
  | { action: "add"; cartId?: string; lines: CartInputLine[] }
  | { action: "remove"; cartId: string; lineIds: string[] }
  | { action: "checkout"; cartId: string; discountCodes?: string[] };

export class CartApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "CartApiError";
    this.status = status;
    this.code = code;
  }
}

export const isStaleCartError = (error: unknown): error is CartApiError =>
  error instanceof CartApiError && (error.status === 410 || error.code === "STALE_CART");

async function postCartAction(payload: CartActionRequest): Promise<CartSnapshot> {
  const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
  const origin = typeof window === "undefined" ? "http://localhost" : window.location.origin;
  let response = await fetch(new URL("/api/checkout", origin).href, options);
  if (response.status === 404) {
    response = await fetch(new URL("/.netlify/functions/checkout", origin).href, options);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new CartApiError(
      result.message || result.error || "Your bag could not be updated.",
      response.status,
      result.code,
    );
  }
  if (!result.cart?.id) {
    throw new CartApiError("The shop returned an incomplete bag.", 502, "INVALID_CART_RESPONSE");
  }
  return result.cart as CartSnapshot;
}

function persistCart(cart: CartSnapshot) {
  if (cart.id) saveCartId(cart.id);
  return cart;
}

export async function getCartSnapshot(cartId: string): Promise<CartSnapshot> {
  return persistCart(await postCartAction({ action: "get", cartId }));
}

export async function addCartLines(
  lines: CartInputLine[],
  cartId: string | null = getCartId(),
): Promise<CartSnapshot> {
  const request = cartId
    ? { action: "add" as const, cartId, lines }
    : { action: "add" as const, lines };

  try {
    return persistCart(await postCartAction(request));
  } catch (error) {
    if (!cartId || !isStaleCartError(error)) throw error;
    clearCartId();
    return persistCart(await postCartAction({ action: "add", lines }));
  }
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<CartSnapshot> {
  try {
    return persistCart(await postCartAction({ action: "remove", cartId, lineIds }));
  } catch (error) {
    if (isStaleCartError(error)) clearCartId();
    throw error;
  }
}

export async function prepareCartCheckout(
  cartId: string,
  discountCodes?: string[],
): Promise<CartSnapshot> {
  return persistCart(await postCartAction({ action: "checkout", cartId, discountCodes }));
}
