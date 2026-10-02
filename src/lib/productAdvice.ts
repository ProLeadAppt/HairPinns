export type ProductAdvice = { heading: string; text: string };

/** Plain-text advice authored in the Shopify product description, not duplicate catalogue data. */
export function getProductAdvice(html: string): ProductAdvice[] {
  const result: ProductAdvice[] = [];
  const allowed = new Set(["Who it suits", "What it does", "How to use it"]);
  for (const match of html.matchAll(/<h3\b[^>]*>([^<]+)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const heading = match[1].trim();
    if (!allowed.has(heading) || result.some(item => item.heading === heading)) continue;
    const text = match[2].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").trim();
    if (text) result.push({ heading, text });
  }
  return result;
}
