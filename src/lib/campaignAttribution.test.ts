import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitiseCampaign, checkoutWithCampaign } from '../../shared/campaignAttribution.js';

describe('campaign boundary', () => {
  it('keeps only bounded campaign labels, excluding contacts and arbitrary tokens', () => {
    expect(sanitiseCampaign({ utm_source: 'shopify_email', utm_medium: 'email', utm_campaign: 'Christmas packs 2026',
      email: 'customer@example.test', token: 'secret', utm_content: 'customer@example.test', utm_term: 'x'.repeat(161),
    })).toEqual({ utm_source: 'shopify_email', utm_medium: 'email', utm_campaign: 'Christmas packs 2026' });
    expect(sanitiseCampaign({ utm_content: 'hero' })).toEqual({});
    expect(sanitiseCampaign(null)).toEqual({});
  });

  it('preserves Shopify parameters while replacing the campaign as a unit', () => {
    const result = new URL(checkoutWithCampaign('https://femtat-zu.myshopify.com/checkouts/cn/test?key=keep&discount=WELCOME&utm_content=old',
      { utm_source: 'shopify_email', utm_campaign: 'tips' }));
    expect(result.searchParams.get('key')).toBe('keep');
    expect(result.searchParams.get('discount')).toBe('WELCOME');
    expect(result.searchParams.get('utm_source')).toBe('shopify_email');
    expect(result.searchParams.has('utm_content')).toBe(false);
  });

  it('does not decorate other destinations or invalid URLs', () => {
    for (const url of ['https://other.myshopify.com/checkouts/test', 'https://example.test', 'javascript:alert(1)', 'bad']) {
      expect(checkoutWithCampaign(url, { utm_source: 'email' })).toBe(url);
    }
  });
});

describe('campaign navigation', () => {
  beforeEach(() => {
    vi.resetModules();
    const values = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => values.delete(key)),
    });
    vi.stubGlobal('window', { location: { search: '' } });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('retains a campaign after internal navigation and replaces it for a new campaign', async () => {
    const { captureCampaign, getCampaign } = await import('./campaignAttribution');
    captureCampaign('?utm_source=shopify_email&utm_medium=email&utm_content=hero', 1000);
    expect(getCampaign(1001)).toEqual({ utm_source: 'shopify_email', utm_medium: 'email', utm_content: 'hero' });
    captureCampaign('?utm_source=facebook&utm_campaign=second', 1002);
    expect(getCampaign(1003)).toEqual({ utm_source: 'facebook', utm_campaign: 'second' });
  });

  it('expires old campaign state and survives corrupt storage', async () => {
    const { captureCampaign, getCampaign } = await import('./campaignAttribution');
    captureCampaign('?utm_source=shopify_email', 1000);
    expect(getCampaign(1000 + 30 * 60 * 1000)).toEqual({});
    sessionStorage.setItem('hp_campaign_v1', '{bad');
    expect(getCampaign()).toEqual({});
  });

  it('continues using memory when browser storage is blocked', async () => {
    const { captureCampaign, getCampaign } = await import('./campaignAttribution');
    const spy = vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    captureCampaign('?utm_source=shopify_email', 1000);
    expect(getCampaign(1001)).toEqual({ utm_source: 'shopify_email' });
    spy.mockRestore();
  });
});
