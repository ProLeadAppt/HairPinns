import { afterEach, describe, expect, it, vi } from 'vitest';
import { handler } from '../../netlify/functions/indexnow.js';

const eventFor = (urls) => ({ httpMethod: 'POST', body: JSON.stringify({ urls }) });
afterEach(() => vi.unstubAllGlobals());

describe('IndexNow URL and receipt boundary', () => {
  it.each([
    'ftp://hairpinns.com/a', 'file://hairpinns.com/a',
    'https://name:pass@hairpinns.com/a', 'https://name@hairpinns.com/a',
    'https://www.hairpinns.com/a', 'https://preview.hairpinns.com/a',
    'https://example.com/a', 'https://hairpinns.com.example.com/a',
    'https://hairpinns.com:444/a', 'not a URL',
  ])('rejects %s without a network request', async (url) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await handler(eventFor([url]))).statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('deduplicates fragments and preserves explicit removed-page notification', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const response = await handler(eventFor(['https://hairpinns.com/a#one', 'https://hairpinns.com/a#two', 'https://hairpinns.com/removed-page']));
    expect(JSON.parse(response.body)).toMatchObject({ submitted: 2, status: 200, validationPending: false });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.host).toBe('hairpinns.com');
    expect(sent.keyLocation).toBe(`https://hairpinns.com/${sent.key}.txt`);
    expect(sent.urlList).toEqual(['https://hairpinns.com/a', 'https://hairpinns.com/removed-page']);
  });

  it.each([200, 202])('distinguishes upstream receipt status %i', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status }));
    const response = await handler(eventFor(['https://hairpinns.com/a']));
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({ ok: true, status, validationPending: status === 202 });
  });

  it('keeps upstream rejection as failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => '' }));
    const response = await handler(eventFor(['https://hairpinns.com/a']));
    expect(response.statusCode).toBe(502);
    expect(JSON.parse(response.body).ok).toBe(false);
  });

  it('retains the500 URL cap without sending', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await handler(eventFor(Array.from({ length: 501 }, (_, n) => `https://hairpinns.com/${n}`)))).statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
