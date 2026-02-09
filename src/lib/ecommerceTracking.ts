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
 * Track micro-conversions for funnel analysis
 */
export async function trackMicroConversion(
  eventName: string,
  params: Record<string, any> = {}
) {
  try {
    await hpCapture.trackEvent(`micro_conversion_${eventName}`, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to track micro conversion ${eventName}:`, error);
  }
}

/**
 * Track product view for conversion funnel
 */
export async function trackProductView(productId: string, productTitle: string) {
  await trackMicroConversion("product_view", {
    product_id: productId,
    product_title: productTitle,
  });
}

/**
 * Track scroll depth for engagement metrics
 */
export async function trackScrollDepth(depth: number, page: string) {
  // Only track at 25%, 50%, 75%, 100% to avoid spam
  if ([25, 50, 75, 100].includes(depth)) {
    await trackMicroConversion("scroll_depth", {
      depth,
      page,
    });
  }
}

/**
 * Track AI SEO metrics (answer box appearances, featured snippets)
 */
export async function trackAISEOEvent(
  eventType: "answer_box_view" | "featured_snippet_view" | "zero_click_search",
  params: Record<string, any> = {}
) {
  try {
    await hpCapture.trackEvent(`ai_seo_${eventType}`, {
      ...params,
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });
  } catch (error) {
    console.error(`Failed to track AI SEO event ${eventType}:`, error);
  }
}

/**
 * Track conversion funnel step
 */
export async function trackFunnelStep(
  step: "view" | "interest" | "consideration" | "intent" | "purchase",
  params: Record<string, any> = {}
) {
  try {
    await hpCapture.trackEvent(`funnel_${step}`, {
      ...params,
      funnel_step: step,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to track funnel step ${step}:`, error);
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
