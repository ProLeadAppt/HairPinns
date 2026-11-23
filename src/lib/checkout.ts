import { isCheckoutHost, sanitiseLinker } from '../../shared/campaignAttribution.js';
import { marketingAttributionAllowed } from './attributionConsent';

const GA_MEASUREMENT_ID = 'G-N6Y1TJMWGG';
const LINKER_WAIT_MS = 300;

interface GaBridge {
  generate?: (options: Record<string, unknown>) => string;
}

function linkerFromBridge(): string {
  const bridge = (window as Window & { google_tag_data?: { glBridge?: GaBridge } }).google_tag_data?.glBridge;
  if (typeof bridge?.generate !== 'function') return '';
  try {
    const generated = bridge.generate({});
    const match = typeof generated === 'string' ? generated.match(/(?:^|[?&])_gl=([^&]+)/) : null;
    return match ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
}

/** GA4 linker value for a checkout hop. Empty when marketing consent is denied or the tag is absent. */
export function readCheckoutLinker(timeoutMs = LINKER_WAIT_MS): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !marketingAttributionAllowed()) {
      resolve('');
      return;
    }
    const bridged = sanitiseLinker(linkerFromBridge());
    if (bridged) {
      resolve(bridged);
      return;
    }
    let settled = false;
    const finish = (value: string) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(sanitiseLinker(value));
    };
    const timer = window.setTimeout(() => finish(''), timeoutMs);
    const gtag = window.gtag;
    if (typeof gtag !== 'function') {
      finish('');
      return;
    }
    try {
      gtag('get', GA_MEASUREMENT_ID, 'linker_param', (param: unknown) => {
        if (typeof param !== 'string') {
          finish('');
          return;
        }
        finish(param.startsWith('_gl=') ? param.slice(4) : param);
      });
    } catch {
      finish('');
    }
  });
}

export async function decorateCheckoutUrl(url: string): Promise<string> {
  const linker = await readCheckoutLinker();
  if (!linker) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !isCheckoutHost(parsed.hostname)) return url;
    parsed.searchParams.set('_gl', linker);
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Frame-safe checkout navigation.
 * Handles navigation when the app is embedded in an iframe (preview/sandbox).
 */
export function gotoCheckout(url: string) {
  if (!url) return;

  const open = (destination: string) => {
    const navigate = () => {
      try {
        window.top!.location.assign(destination);
      } catch {
        window.location.assign(destination);
      }
    };
    if (window !== window.top) {
      try {
        navigate();
      } catch {
        window.open(destination, '_blank', 'noopener');
      }
    } else {
      navigate();
    }
  };

  void decorateCheckoutUrl(url).then(open, () => open(url));
}
