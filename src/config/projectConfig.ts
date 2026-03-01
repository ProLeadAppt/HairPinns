// Project-wide configuration
// Modify these settings to control global behavior

export const projectConfig = {
  /**
   * Double Opt-In Configuration
   * 
   * When enabled (true), all form submissions will require email/SMS confirmation
   * before the contact is fully subscribed and enters nurture flows.
   * 
   * Workflow:
   * 1. User submits form → Contact created with tag "pending_confirm"
   * 2. GHL sends confirmation email/SMS with unique confirmation link
   * 3. User clicks confirmation link → "Confirm" event fires
   * 4. GHL receives "Confirm" event → Applies tag "subscribed" and starts nurture
   * 
   * Set to false to immediately subscribe contacts upon form submission.
   */
  double_opt_in: true,
  
  /**
   * GDPR Region Detection
   * Set the detected region for GDPR compliance
   */
  gdpr_region: 'AU',
  
  /**
   * GoHighLevel Inbound Webhook URL
   * Used for all form submissions and event tracking
   * Loaded from environment variable for security
   */
  ghl: {
    inboundWebhookUrl: import.meta.env.VITE_GHL_INBOUND_WEBHOOK_URL || '',
  },
  
  /**
   * Shopify Storefront API Configuration
   * These are PUBLIC credentials safe for client-side use
   * Loaded from environment variables for easier configuration
   */
  shopify: {
    domain: import.meta.env.VITE_SHOPIFY_MYSHOPIFY_DOMAIN || 'zemtat.zurmy.myshopify.com',
    storefrontToken: import.meta.env.VITE_SF_STOREFRONT_TOKEN || '',
    apiVersion: import.meta.env.VITE_SF_API_VERSION || '2025-01',
    storeUrl: `https://${import.meta.env.VITE_SHOP_DOMAIN || 'hairpinns.com'}`,
    shopDomain: import.meta.env.VITE_SHOP_DOMAIN || 'hairpinns.com',
  },
} as const;

export default projectConfig;
