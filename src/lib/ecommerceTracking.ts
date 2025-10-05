import { hpCapture } from "./hpCapture";

/**
 * Track add_to_cart event to Zapier (analytics only, no PII)
 */
export async function trackAddToCart(params: {
  product_id: string;
  title: string;
  variant_id: string;
  price: number;
  currency: string;
  quantity?: number;
}) {
  try {
    await hpCapture.trackEvent("add_to_cart", {
      product_id: params.product_id,
      title: params.title,
      variant_id: params.variant_id,
      price: params.price,
      currency: params.currency,
      quantity: params.quantity || 1,
    });
    console.log("✅ Tracked add_to_cart:", params);
  } catch (error) {
    console.error("Failed to track add_to_cart:", error);
  }
}

/**
 * Track begin_checkout event to Zapier (analytics only, no PII)
 */
export async function trackBeginCheckout(params: {
  cart_total: number;
  item_count: number;
  currency?: string;
}) {
  try {
    await hpCapture.trackEvent("begin_checkout", {
      cart_total: params.cart_total,
      item_count: params.item_count,
      currency: params.currency || "AUD",
    });
    console.log("✅ Tracked begin_checkout:", params);
  } catch (error) {
    console.error("Failed to track begin_checkout:", error);
  }
}
