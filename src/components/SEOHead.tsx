import { Helmet } from "react-helmet";
import { ReactNode, useEffect } from "react";

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
  /** Additional children for custom meta tags */
  children?: ReactNode;
}

/**
 * SEOHead Component
 *
 * Centralized component for managing all SEO-related meta tags, OG tags, and structured data.
 * Prevents duplication of meta tags across pages and ensures consistency.
 *
 * Usage:
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   canonical="https://hairpinns.com/page"
 *   ogImage="https://hairpinns.com/og-image.jpg"
 *   schemaJson={schema}
 * />
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
  children,
}: SEOHeadProps) => {
  // Ensure canonical URL is clean and absolute
  const cleanCanonical = canonical.startsWith("http")
    ? canonical
    : `https://hairpinns.com${canonical}`;

  // Ensure OG image is absolute
  const cleanOgImage = ogImage.startsWith("http") ? ogImage : `https://hairpinns.com${ogImage}`;

  // Handle multiple schema objects
  const schemas = Array.isArray(schemaJson) ? schemaJson : schemaJson ? [schemaJson] : [];

  // Signal to prerender that the page is ready. Helmet updates head tags
  // synchronously in useEffect, so firing on the next microtask means tags
  // are in the DOM when puppeteer captures.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.dispatchEvent(new Event('prerender-ready'));
      });
    });
    return () => cancelAnimationFrame(id);
  }, [title, description, cleanCanonical]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL - prevents duplicate content issues */}
      <link rel="canonical" href={cleanCanonical} />

      {/* Language/Region for International SEO */}
      <link rel="alternate" hrefLang={hrefLang} href={cleanCanonical} />
      <meta httpEquiv="content-language" content="en-AU" />

      {/* Search Engine Control */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph (Social Media) Meta Tags - Critical for sharing and AEO */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={cleanCanonical} />
      <meta property="og:image" content={cleanOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_AU" />
      <meta property="og:site_name" content="Hair Pinns" />

      {/* Twitter Card Meta Tags - Critical for Twitter/X sharing and AEO */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={cleanOgImage} />
      <meta name="twitter:site" content="@hairpinns" />
      <meta name="twitter:creator" content="@hairpinns" />

      {/* JSON-LD Structured Data - Critical for AEO and rich snippets */}
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}

      {/* Additional custom meta tags */}
      {children}
    </Helmet>
  );
};

export default SEOHead;
