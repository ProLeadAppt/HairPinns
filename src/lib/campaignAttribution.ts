import { sanitiseCampaign } from '../../shared/campaignAttribution.js';

const STORAGE_KEY = 'hp_campaign_v1';
const MAX_AGE = 30 * 60 * 1000;
let memory: { capturedAt: number; campaign: Record<string, string> } | undefined;
let lastSearch: string | undefined;

/** Retain a tagged landing across internal navigation for this tab only. */
export function captureCampaign(search = window.location.search, now = Date.now()) {
  const campaign = sanitiseCampaign(Object.fromEntries(new URLSearchParams(search)));
  if (Object.keys(campaign).length && search !== lastSearch) {
    memory = { capturedAt: now, campaign };
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* Memory still works. */ }
  }
  lastSearch = search;
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
  return sanitiseCampaign(memory.campaign);
}
