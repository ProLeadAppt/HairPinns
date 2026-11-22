// Campaign labels, ad click IDs and the original external referrer may cross
// the storefront/checkout boundary. Never forward arbitrary query strings,
// customer emails or email-provider recipient tokens.
export const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
export const CLICK_ID_KEYS = ['gclid', 'fbclid', 'gbraid', 'wbraid'];
export const CONTEXT_KEYS = ['referrer', 'landing'];

const UTM_VALUE = /^[a-zA-Z0-9][a-zA-Z0-9 _.,()/-]{0,159}$/;
const CLICK_ID_VALUE = /^[A-Za-z0-9_-]{5,512}$/;
const LINKER_VALUE = /^[A-Za-z0-9*._~-]{8,512}$/;
const CHECKOUT_HOSTS = new Set(['femtat-zu.myshopify.com', 'checkout.shopify.com']);

const ATTRIBUTION_ATTRIBUTE_KEYS = new Set([
  ...CAMPAIGN_KEYS.map((key) => `hp_${key}`),
  ...CLICK_ID_KEYS.map((key) => `hp_${key}`),
  'hp_referrer',
  'hp_landing',
]);

function ownHost(hostname) {
  const host = hostname.toLowerCase();
  return host === 'hairpinns.com'
    || host.endsWith('.hairpinns.com')
    || host.endsWith('.myshopify.com')
    || host.endsWith('.shopify.com')
    || host === 'shop.app'
    || host.endsWith('.shop.app')
    || host === 'localhost'
    || host === '127.0.0.1';
}

function sourceFromHost(hostname) {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'googleadservices.com' || host.endsWith('.googleadservices.com') || host === 'doubleclick.net' || host.endsWith('.doubleclick.net')) {
    return { utm_source: 'google', utm_medium: 'cpc' };
  }
  if (host.startsWith('google.') || host.includes('.google.')) {
    return { utm_source: 'google', utm_medium: 'organic' };
  }
  if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.com' || host.endsWith('.fb.com')) {
    return { utm_source: 'facebook', utm_medium: 'social' };
  }
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
    return { utm_source: 'instagram', utm_medium: 'social' };
  }
  if (host === 'bing.com' || host.endsWith('.bing.com')) {
    return { utm_source: 'bing', utm_medium: 'organic' };
  }
  return null;
}

export function sanitiseReferrer(value) {
  if (typeof value !== 'string' || !value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || ownHost(url.hostname)) return '';
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString().slice(0, 300);
  } catch {
    return '';
  }
}

export function sanitiseLanding(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '';
  try {
    const url = new URL(value, 'https://hairpinns.com');
    const kept = new URLSearchParams();
    for (const key of [...CAMPAIGN_KEYS, ...CLICK_ID_KEYS]) {
      const entry = url.searchParams.get(key);
      const pattern = CLICK_ID_KEYS.includes(key) ? CLICK_ID_VALUE : UTM_VALUE;
      if (entry && pattern.test(entry)) kept.set(key, entry);
    }
    const query = kept.toString();
    const landing = query ? `${url.pathname}?${query}` : url.pathname;
    return landing.length <= 300 ? landing : landing.slice(0, 300);
  } catch {
    return '';
  }
}

function fillMissingSource(result) {
  if (result.utm_source) return;
  if (result.gclid || result.gbraid || result.wbraid) {
    result.utm_source = 'google';
    if (!result.utm_medium) result.utm_medium = 'cpc';
    return;
  }
  if (result.fbclid && !result.utm_source) {
    result.utm_source = 'facebook';
    if (!result.utm_medium) result.utm_medium = 'social';
    return;
  }
  if (!result.referrer) return;
  try {
    const derived = sourceFromHost(new URL(result.referrer).hostname);
    if (!derived) return;
    result.utm_source = derived.utm_source;
    if (!result.utm_medium) result.utm_medium = derived.utm_medium;
  } catch {
    // A rejected referrer never becomes a source.
  }
}

export function sanitiseCampaign(input) {
  const result = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result;
  for (const key of CAMPAIGN_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && UTM_VALUE.test(value)) result[key] = value;
  }
  for (const key of CLICK_ID_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && CLICK_ID_VALUE.test(value)) result[key] = value;
  }
  const referrer = sanitiseReferrer(input.referrer);
  const landing = sanitiseLanding(input.landing);
  if (referrer) result.referrer = referrer;
  if (landing) result.landing = landing;
  if (landing) {
    const params = new URL(landing, 'https://hairpinns.com').searchParams;
    for (const key of [...CAMPAIGN_KEYS, ...CLICK_ID_KEYS]) {
      if (result[key]) continue;
      const value = params.get(key);
      const pattern = CLICK_ID_KEYS.includes(key) ? CLICK_ID_VALUE : UTM_VALUE;
      if (value && pattern.test(value)) result[key] = value;
    }
  }
  fillMissingSource(result);
  // An isolated content/term label is not a visit. A click ID or external
  // referrer is, even when the ad platform did not add utm_source.
  if (!result.utm_source && !CLICK_ID_KEYS.some((key) => result[key]) && !result.referrer) return {};
  return result;
}

export function isAttributionAttribute(key) {
  return ATTRIBUTION_ATTRIBUTE_KEYS.has(key);
}

export function campaignAttributes(campaign) {
  const clean = sanitiseCampaign(campaign);
  const keys = [...CAMPAIGN_KEYS, ...CLICK_ID_KEYS, ...CONTEXT_KEYS];
  return keys.filter((key) => clean[key]).map((key) => ({ key: `hp_${key}`, value: clean[key] }));
}

export function sanitiseLinker(value) {
  return typeof value === 'string' && LINKER_VALUE.test(value) ? value : '';
}

export function isCheckoutHost(hostname) {
  return CHECKOUT_HOSTS.has(String(hostname || '').toLowerCase());
}

export function checkoutWithCampaign(checkoutUrl, campaign, linker) {
  const clean = sanitiseCampaign(campaign);
  const queryKeys = [...CAMPAIGN_KEYS, ...CLICK_ID_KEYS].filter((key) => clean[key]);
  const gl = sanitiseLinker(linker);
  if (!queryKeys.length && !gl) return checkoutUrl;
  try {
    const url = new URL(checkoutUrl);
    if (url.protocol !== 'https:' || !isCheckoutHost(url.hostname)) return checkoutUrl;
    // Replace a campaign as a unit, without inheriting labels from another send.
    for (const key of [...CAMPAIGN_KEYS, ...CLICK_ID_KEYS]) url.searchParams.delete(key);
    for (const key of queryKeys) url.searchParams.set(key, clean[key]);
    if (gl) url.searchParams.set('_gl', gl);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}
