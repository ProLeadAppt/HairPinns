import { ReactNode, useEffect, useMemo } from "react";

interface SEOHeadProps {
  /** Page title (used for <title> and og:title) */
  title: string;
  /** Page description (used for meta description and og:description) */
  description: string;
  /** Canonical URL (absolute URL for this page) */
  canonical: string;
  /** OG image URL (absolute URL, defaults to hairpinns.com/og-default.jpg) */
  ogImage?: string;
  /** OG type (defaults to 'website') */
  ogType?: string;
  /** Whether to add robots noindex meta tag */
  noIndex?: boolean;
  /** Alternate language link (hrefLang) */
  hrefLang?: string;
  /** JSON-LD schema markup */
  schemaJson?: Record<string, any> | Record<string, any>[];
  /** Kept for back-compat; ignored — add custom tags via the imperative API */
  children?: ReactNode;
}

/**
 * SEOHead Component
 *
 * Centralises all SEO-related head tags. We bypass react-helmet entirely and
 * inject tags directly into document.head via DOM APIs because:
 *
 *   1. react-helmet's async flush race-conditions with Puppeteer prerender —
 *      especially on pages with many tags (e.g. the homepage with 9 schemas).
 *   2. react-helmet silently drops <script> tags with string content during
 *      client render, so JSON-LD never lands in the DOM.
 *   3. Imperative DOM writes are synchronous; the marker fires instantly
 *      once every tag is present, eliminating timing bugs.
 *
 * Each tag we own is marked with data-seohead="true" so we can clear the
 * previous set before re-injecting on navigation.
 */
export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = "https://hairpinns.com/og-default.jpg",
  ogType = "website",
  noIndex = false,
  hrefLang = "en-AU",
  schemaJson,
}: SEOHeadProps) => {
  // Normalise inputs to absolute URLs
  const cleanCanonical = canonical.startsWith("http")
    ? canonical
    : `https://hairpinns.com${canonical}`;
  const cleanOgImage = ogImage.startsWith("http")
    ? ogImage
    : `https://hairpinns.com${ogImage}`;

  const schemas = Array.isArray(schemaJson) ? schemaJson : schemaJson ? [schemaJson] : [];
  const schemaJSON = useMemo(() => schemas.map((s) => JSON.stringify(s)), [schemas]);

  useEffect(() => {
    const head = document.head;
    const OWN = 'data-seohead';

    // Clear any tags we previously owned
    head.querySelectorAll(`[${OWN}="true"]`).forEach((el) => el.remove());

    // <title>
    document.title = title;

    const addMeta = (attrs: Record<string, string>) => {
      const el = document.createElement('meta');
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.setAttribute(OWN, 'true');
      head.appendChild(el);
    };

    const addLink = (attrs: Record<string, string>) => {
      const el = document.createElement('link');
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.setAttribute(OWN, 'true');
      head.appendChild(el);
    };

    const addScript = (json: string) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute(OWN, 'true');
      el.setAttribute('data-seohead-schema', 'true');
      el.textContent = json;
      head.appendChild(el);
    };

    // Primary meta
    addMeta({ name: 'description', content: description });
    addMeta({ 'http-equiv': 'content-language', content: 'en-AU' });

    // Canonical + hreflang.
    //   - en-AU: primary (Australian audience, spelling, prices)
    //   - en: generic English fallback for global English searches
    //   - x-default: served when no better locale match exists
    addLink({ rel: 'canonical', href: cleanCanonical });
    addLink({ rel: 'alternate', hreflang: hrefLang, href: cleanCanonical });
    if (hrefLang === 'en-AU') {
      addLink({ rel: 'alternate', hreflang: 'en', href: cleanCanonical });
      addLink({ rel: 'alternate', hreflang: 'x-default', href: cleanCanonical });
    }

    // Robots
    if (noIndex) {
      addMeta({ name: 'robots', content: 'noindex, nofollow' });
    }

    // Open Graph
    addMeta({ property: 'og:type', content: ogType });
    addMeta({ property: 'og:title', content: title });
    addMeta({ property: 'og:description', content: description });
    addMeta({ property: 'og:url', content: cleanCanonical });
    addMeta({ property: 'og:image', content: cleanOgImage });
    addMeta({ property: 'og:image:width', content: '1200' });
    addMeta({ property: 'og:image:height', content: '630' });
    addMeta({ property: 'og:locale', content: 'en_AU' });
    addMeta({ property: 'og:site_name', content: 'Hair Pinns' });

    // Twitter
    addMeta({ name: 'twitter:card', content: 'summary_large_image' });
    addMeta({ name: 'twitter:title', content: title });
    addMeta({ name: 'twitter:description', content: description });
    addMeta({ name: 'twitter:image', content: cleanOgImage });
    addMeta({ name: 'twitter:site', content: '@hairpinns' });
    addMeta({ name: 'twitter:creator', content: '@hairpinns' });

    // JSON-LD schemas
    schemaJSON.forEach(addScript);

    // Prerender-ready marker — everything is in the DOM NOW because these
    // are synchronous DOM writes, so we can set it on the next frame with
    // no race conditions.
    if (!document.getElementById('prerender-ready-marker')) {
      const marker = document.createElement('div');
      marker.id = 'prerender-ready-marker';
      marker.style.display = 'none';
      document.body.appendChild(marker);
    }

    return () => {
      head.querySelectorAll(`[${OWN}="true"]`).forEach((el) => el.remove());
      const marker = document.getElementById('prerender-ready-marker');
      if (marker) marker.remove();
    };
  }, [
    title,
    description,
    cleanCanonical,
    cleanOgImage,
    ogType,
    noIndex,
    hrefLang,
    schemaJSON,
  ]);

  return null;
};

export default SEOHead;
