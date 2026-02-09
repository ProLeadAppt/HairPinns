import { getShopInfo } from "./shopify";

/**
 * Run Shopify connection sanity check
 * Call this in development to verify Shopify configuration
 */
export async function runShopifySanityCheck() {
  try {
    const shop = await getShopInfo();
    console.log("🎉 Shopify Storefront API connected successfully!");
    console.log(`📍 Store: ${shop.name}`);
    return true;
  } catch (error) {
    console.error("❌ Shopify connection failed. Check your configuration.");
    return false;
  }
}

// Auto-run in development (non-blocking)
if (import.meta.env.DEV) {
  runShopifySanityCheck().catch((error) => {
    // Silently fail - don't break the app if Shopify config is missing
    console.warn("[Shopify] Sanity check skipped:", error.message);
  });
}
