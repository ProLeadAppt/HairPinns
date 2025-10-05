/**
 * Cart & Checkout Tracking Utilities
 * 
 * Non-blocking event tracking for e-commerce behaviors.
 * These events don't collect PII, only behavioral data.
 */

import { hpCapture } from "./hpCapture";

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
 * Fires non-blocking Zapier event with product details
 */
export async function trackAddToCart(item: CartItem): Promise<void> {
  try {
    await hpCapture.trackEvent("add_to_cart", {
      product_id: item.product_id,
      product_title: item.product_title,
      price: item.price,
      variant: item.variant || "default",
      quantity: item.quantity,
      currency: item.currency || "AUD",
    });
  } catch (error) {
    // Silent fail - don't disrupt user experience
    console.error("[Cart Tracking] Failed to track add_to_cart:", error);
  }
}

/**
 * Track "Begin Checkout" event
 * Fires non-blocking Zapier event with cart summary
 */
export async function trackBeginCheckout(
  cartItems: CartItem[],
  cartTotal: number
): Promise<void> {
  try {
    // Build line items summary
    const lineItemsSummary = cartItems.map((item) => ({
      product_id: item.product_id,
      product_title: item.product_title,
      quantity: item.quantity,
      price: item.price,
      line_total: item.price * item.quantity,
    }));

    await hpCapture.trackEvent("begin_checkout", {
      cart_line_items: lineItemsSummary,
      cart_total: cartTotal,
      cart_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      currency: "AUD",
    });
  } catch (error) {
    // Silent fail - don't disrupt user experience
    console.error("[Cart Tracking] Failed to track begin_checkout:", error);
  }
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
  try {
    await hpCapture.trackEvent("view_product", {
      product_id: productId,
      product_title: productTitle,
      price: price,
      currency: "AUD",
    });
  } catch (error) {
    console.error("[Cart Tracking] Failed to track view_product:", error);
  }
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
