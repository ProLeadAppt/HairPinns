import { sanitiseCampaign } from '../../shared/campaignAttribution.js';
import { marketingAttributionAllowed } from './attributionConsent';

const STORAGE_KEY = 'hp_campaign_v1';
const MAX_AGE = 30 * 60 * 1000;
const CLICK_IDS = ['gclid', 'fbclid', 'gbraid', 'wbraid'] as const;
let memory: { capturedAt: number; campaign: Record<string, string> } | undefined;
let lastSearch: string | undefined;

function currentReferrer() {
  try {
    return typeof document === 'undefined' ? '' : document.referrer || '';
  } catch {
    return '';
  }
}

function currentLanding() {
  try {
    if (typeof window === 'undefined') return '/';
    return `${window.location.pathname || '/'}${window.location.search || ''}`;
  } catch {
    return '/';
  }
}

/** Retain the landing visit across internal navigation for this tab only. */
export function captureCampaign(
  search?: string,
  now = Date.now(),
  referrer = currentReferrer(),
  landing = currentLanding(),
) {
  const query = search ?? (typeof window === 'undefined' ? '' : window.location.search);
  const campaign = sanitiseCampaign({
    ...Object.fromEntries(new URLSearchParams(query)),
    referrer,
    landing,
  });
  if (Object.keys(campaign).length && query !== lastSearch) {
    memory = { capturedAt: now, campaign };
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* Memory still works. */ }
  }
  lastSearch = query;
}

export function getCampaign(now = Date.now()): Record<string, string> {
  if (typeof window === 'undefined') return {};
  captureCampaign(window.location.search, now);
  if (!memory) {
    try { memory = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') || undefined; } catch { /* No attribution. */ }
  }
  if (!memory || !Number.isFinite(memory.capturedAt) || now < memory.capturedAt || now - memory.capturedAt >= MAX_AGE) {
    memory = undefined;
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage is optional. */ }
    return {};
  }
  const campaign = sanitiseCampaign(memory.campaign) as Record<string, string>;
  if (marketingAttributionAllowed()) return campaign;
  return Object.fromEntries(Object.entries(campaign).filter(([key]) => !CLICK_IDS.includes(key as typeof CLICK_IDS[number])));
}
