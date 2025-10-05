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
   * 2. Zapier sends confirmation email/SMS with unique confirmation link
   * 3. User clicks confirmation link → "Confirm" event fires
   * 4. Zapier receives "Confirm" event → Applies tag "subscribed" and starts nurture
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
   * Shopify Storefront API Configuration
   * These are PUBLIC credentials safe for client-side use
   */
  shopify: {
    domain: 'femtat-zu.myshopify.com',
    storefrontToken: 'c4e78c2d75c37a6a3ae370dfc1e71bf4',
    apiVersion: '2024-07',
    storeUrl: 'https://hairpinns.com', // User-facing store URL
  },
} as const;

export default projectConfig;
