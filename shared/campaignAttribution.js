// Only campaign labels cross the storefront/checkout boundary. Never forward
// arbitrary query strings, customer emails or email-provider recipient tokens.
export const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];

export function sanitiseCampaign(input) {
  const result = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result;
  for (const key of CAMPAIGN_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9 _.,()/-]{0,159}$/.test(value)) {
      result[key] = value;
    }
  }
  // An isolated content/term label is not a new campaign.
  return result.utm_source ? result : {};
}

export function campaignAttributes(campaign) {
  return Object.entries(sanitiseCampaign(campaign)).map(([key, value]) => ({ key: `hp_${key}`, value }));
}

export function checkoutWithCampaign(checkoutUrl, campaign) {
  const clean = sanitiseCampaign(campaign);
  if (!Object.keys(clean).length) return checkoutUrl;
  try {
    const url = new URL(checkoutUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'femtat-zu.myshopify.com') return checkoutUrl;
    // Replace a campaign as a unit, without inheriting labels from another send.
    for (const key of CAMPAIGN_KEYS) url.searchParams.delete(key);
    for (const [key, value] of Object.entries(clean)) url.searchParams.set(key, value);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}
