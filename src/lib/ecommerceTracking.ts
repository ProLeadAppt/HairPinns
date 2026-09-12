import { pixelTracking } from "./pixelTracking";

export interface EcommerceTrackingItem {
  product_id: string;
  title: string;
  variant_id?: string;
  price: number;
  currency?: string;
  quantity?: number;
}

interface BeginCheckoutParams {
  cart_total: number;
  item_count: number;
  currency?: string;
  items: EcommerceTrackingItem[];
}

const currencyFor = (currency?: string) => currency || "AUD";
const itemIdFor = (item: EcommerceTrackingItem) => item.variant_id || item.product_id;

const trackBrowserEvent = (eventName: string, payload: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
};

/**
 * Track add_to_cart after Shopify confirms the cart mutation.
 * Browser pixels fire synchronously.
 */
export async function trackAddToCart(params: EcommerceTrackingItem): Promise<void> {
  const currency = currencyFor(params.currency);
  const quantity = params.quantity || 1;

  pixelTracking.trackAddToCart({
    id: itemIdFor(params),
    title: params.title,
    price: params.price,
    quantity,
    currency,
  });
}

/**
 * Track micro-conversions for funnel analysis.
 */
export async function trackMicroConversion(
  eventName: string,
  params: Record<string, unknown> = {},
): Promise<void> {
  trackBrowserEvent(`micro_conversion_${eventName}`, params);
}

/**
 * Track a product detail view in GA4 and Meta.
 */
export async function trackProductView(params: EcommerceTrackingItem): Promise<void> {
  const currency = currencyFor(params.currency);

  pixelTracking.trackProductView({
    id: itemIdFor(params),
    title: params.title,
    price: params.price,
    currency,
  });

  void trackMicroConversion("product_view", {
    product_id: params.product_id,
    variant_id: params.variant_id || "",
    product_title: params.title,
    price: params.price,
    currency,
  });
}

/**
 * Track scroll depth for engagement metrics.
 */
export async function trackScrollDepth(depth: number, page: string): Promise<void> {
  if ([25, 50, 75, 100].includes(depth)) {
    void trackMicroConversion("scroll_depth", { depth, page });
  }
}

/**
 * Track AI SEO metrics.
 */
export async function trackAISEOEvent(
  eventType: "answer_box_view" | "featured_snippet_view" | "zero_click_search",
  params: Record<string, unknown> = {},
): Promise<void> {
  trackBrowserEvent(`ai_seo_${eventType}`, params);
}

/**
 * Track conversion funnel steps in GA4.
 */
export async function trackFunnelStep(
  step: "view" | "interest" | "consideration" | "intent" | "purchase",
  params: Record<string, unknown> = {},
): Promise<void> {
  trackBrowserEvent(`funnel_${step}`, { ...params, funnel_step: step });
}

/**
 * Track begin_checkout with complete line-item data.
 */
export async function trackBeginCheckout(params: BeginCheckoutParams): Promise<void> {
  const currency = currencyFor(params.currency);

  pixelTracking.trackBeginCheckout({
    total: params.cart_total,
    currency,
    items: params.items.map((item) => ({
      id: itemIdFor(item),
      title: item.title,
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}
