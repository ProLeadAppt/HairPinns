/**
 * Cart & Checkout Tracking Utilities
 * 
 * Non-blocking browser analytics for ecommerce behaviour.
 * These events do not collect PII.
 */

export interface CartItem {
  product_id: string;
  product_title: string;
  price: number;
  variant?: string;
  quantity: number;
  currency?: string;
}

/**
 * Track "Add to Cart" event
 * Fires a non-blocking GA4 event with product details.
 */
export async function trackAddToCart(item: CartItem): Promise<void> {
  window.gtag?.("event", "add_to_cart", {
    currency: item.currency || "AUD",
    value: item.price * item.quantity,
    items: [{
      product_id: item.product_id,
      item_name: item.product_title,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.variant || "default",
    }],
  });
}

/**
 * Track "Begin Checkout" event
 * Fires a non-blocking GA4 event with the cart summary.
 */
export async function trackBeginCheckout(
  cartItems: CartItem[],
  cartTotal: number
): Promise<void> {
  window.gtag?.("event", "begin_checkout", {
    currency: "AUD",
    value: cartTotal,
    items: cartItems.map((item) => ({
      item_id: item.product_id,
      item_name: item.product_title,
      quantity: item.quantity,
      price: item.price,
      item_variant: item.variant || "default",
    })),
  });
}

/**
 * Track "View Product" event (optional)
 * Useful for analytics and retargeting
 */
export async function trackViewProduct(
  productId: string,
  productTitle: string,
  price: number
): Promise<void> {
  window.gtag?.("event", "view_item", {
    currency: "AUD",
    value: price,
    items: [{ item_id: productId, item_name: productTitle, price }],
  });
}

/**
 * Example cart state for reference
 * (Implement actual cart state management as needed)
 */
export interface Cart {
  items: CartItem[];
  total: number;
}

/**
 * Calculate cart total from items
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
