/**
 * Shopping cart management utilities
 * Handles cart state persistence in localStorage
 * 
 * Note: Cart operations now handled server-side via /api/checkout Edge Function
 * This file only manages cart ID persistence for session continuity
 */

export interface CartItem {
  variantId: string;
  quantity: number;
  productTitle?: string;
  productHandle?: string;
  price?: number;
  image?: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: any[];
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

const CART_STORAGE_KEY = "hp_cart_id";
const CHECKOUT_URL_KEY = "hp_checkout_url";

/**
 * Normalize cart ID to Shopify GID format (required by Storefront API)
 */
export function normalizeCartId(cartId: string | null): string | null {
  if (!cartId || typeof cartId !== "string") return null;
  const trimmed = cartId.trim();
  if (trimmed.startsWith("gid://shopify/Cart/")) return trimmed;
  return `gid://shopify/Cart/${trimmed}`;
}

/**
 * Get cart ID from localStorage
 */
export function getCartId(): string | null {
  return localStorage.getItem(CART_STORAGE_KEY);
}

/**
 * Save cart ID to localStorage
 */
export function saveCartId(cartId: string): void {
  localStorage.setItem(CART_STORAGE_KEY, cartId);
}

/**
 * Clear cart ID from localStorage
 */
export function clearCartId(): void {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CHECKOUT_URL_KEY);
}

/**
 * Get checkout URL from localStorage
 */
export function getStoredCheckoutUrl(): string | null {
  return localStorage.getItem(CHECKOUT_URL_KEY);
}

/**
 * Save checkout URL to localStorage
 */
export function saveCheckoutUrl(url: string): void {
  localStorage.setItem(CHECKOUT_URL_KEY, url);
}

/**
 * @deprecated Use /api/checkout Edge Function instead
 * 
 * All cart operations should now go through the server-side Edge Function:
 * POST /api/checkout with { lines: [{ merchandiseId, quantity }], cartId? }
 * 
 * Example:
 * ```
 * const response = await fetch('/api/checkout', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     lines: [{ merchandiseId: variantId, quantity: 1 }],
 *     cartId: localStorage.getItem('hp_cart_id') // optional
 *   })
 * });
 * const { checkoutUrl, cartId } = await response.json();
 * ```
 */
export async function addToBag(
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  console.warn("⚠️ addToBag() is deprecated. Use /api/checkout Edge Function instead.");
  throw new Error("Client-side cart operations are disabled. Use /api/checkout Edge Function.");
}

/**
 * Get checkout URL from localStorage
 * @deprecated Cart checkout now handled via /api/checkout Edge Function
 */
export function getCheckoutUrl(): string | null {
  return getStoredCheckoutUrl();
}
