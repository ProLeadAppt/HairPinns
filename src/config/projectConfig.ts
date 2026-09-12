// Project-wide configuration
// Modify these settings to control global behavior

export const projectConfig = {
  /**
   * GDPR Region Detection
   * Set the detected region for GDPR compliance
   */
  gdpr_region: 'AU',
  
  /**
   * Shopify Storefront API Configuration
   * These are PUBLIC credentials safe for client-side use
   * Loaded from environment variables for easier configuration
   */
  shopify: {
    domain: import.meta.env.VITE_SHOPIFY_MYSHOPIFY_DOMAIN || 'femtat-zu.myshopify.com',
    storefrontToken: import.meta.env.VITE_SF_STOREFRONT_TOKEN || '',
    apiVersion: import.meta.env.VITE_SF_API_VERSION || '2026-07',
    storeUrl: `https://${import.meta.env.VITE_SHOP_DOMAIN || 'hairpinns.com'}`,
    shopDomain: import.meta.env.VITE_SHOP_DOMAIN || 'hairpinns.com',
  },
} as const;

export default projectConfig;
