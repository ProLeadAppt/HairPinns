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

  it('keeps Google and Meta click IDs and derives a source when the ad did not send one', () => {
    expect(sanitiseCampaign({
      gclid: 'CjwKCAjwtest',
      fbclid: 'IwARtest',
      email: 'person@example.test',
    })).toMatchObject({ gclid: 'CjwKCAjwtest', fbclid: 'IwARtest', utm_source: 'google', utm_medium: 'cpc' });
  });

  it('turns an external Google referrer into source labels without copying the checkout hop', () => {
    expect(sanitiseCampaign({
      referrer: 'https://www.google.com/search?q=wet+brush',
      landing: '/products/wet-brush-original-detangler/?gclid=CjwKCAjwtest',
    })).toEqual({
      gclid: 'CjwKCAjwtest',
      referrer: 'https://www.google.com/search',
      landing: '/products/wet-brush-original-detangler/?gclid=CjwKCAjwtest',
      utm_source: 'google',
      utm_medium: 'cpc',
    });
    expect(sanitiseCampaign({ referrer: 'https://hairpinns.com/collections/' })).toEqual({});
  });

  it('puts click IDs on the Shopify checkout URL and the GA linker when one is supplied', () => {
    const result = new URL(checkoutWithCampaign(
      'https://checkout.shopify.com/checkouts/cn/test?key=keep',
      { gclid: 'CjwKCAjwtest', referrer: 'https://www.google.com/' },
      '1*abc~def',
    ));
    expect(result.searchParams.get('key')).toBe('keep');
    expect(result.searchParams.get('gclid')).toBe('CjwKCAjwtest');
    expect(result.searchParams.get('utm_source')).toBe('google');
    expect(result.searchParams.get('_gl')).toBe('1*abc~def');
    expect(result.searchParams.has('referrer')).toBe(false);
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
    captureCampaign('?utm_source=shopify_email&utm_medium=email&utm_content=hero', 1000, '', '/');
    expect(getCampaign(1001)).toEqual({ utm_source: 'shopify_email', utm_medium: 'email', utm_content: 'hero', landing: '/' });
    captureCampaign('?utm_source=facebook&utm_campaign=second', 1002, '', '/blog/');
    expect(getCampaign(1003)).toEqual({ utm_source: 'facebook', utm_campaign: 'second', landing: '/blog/' });
  });

  it('expires old campaign state and survives corrupt storage', async () => {
    const { captureCampaign, getCampaign } = await import('./campaignAttribution');
    captureCampaign('?utm_source=shopify_email', 1000, '', '/');
    expect(getCampaign(1000 + 30 * 60 * 1000)).toEqual({});
    sessionStorage.setItem('hp_campaign_v1', '{bad');
    expect(getCampaign()).toEqual({});
  });

  it('continues using memory when browser storage is blocked', async () => {
    const { captureCampaign, getCampaign } = await import('./campaignAttribution');
    const spy = vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    captureCampaign('?utm_source=shopify_email', 1000, '', '/');
    expect(getCampaign(1001)).toEqual({ utm_source: 'shopify_email', landing: '/' });
    spy.mockRestore();
  });
});
