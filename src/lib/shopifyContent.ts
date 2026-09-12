import { fetchShopify } from "@/lib/shopify";

export interface ShopifyArticleImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyPublicArticle {
  id: string;
  title: string;
  handle: string;
  excerpt?: string | null;
  excerptHtml?: string | null;
  contentHtml: string;
  publishedAt: string;
  image?: ShopifyArticleImage | null;
  author?: { name?: string | null } | null;
  seo?: { title?: string | null; description?: string | null } | null;
  tags?: string[];
}

export interface ShopifyPublicBlog {
  id: string;
  title: string;
  handle: string;
  articles: { nodes: ShopifyPublicArticle[] };
}

const BLOCKED_ELEMENTS = "script|style|iframe|object|embed|form|button|input|textarea|select|option|svg|math|meta|link|base";
const PRIVATE_QUERY_PARAM = /^(?:email|recipient|contact|customer|subscriber|unsubscribe|token|preview_token|_kx|mc_cid|mc_eid)$/i;

const decodeBasicEntities = (value: string) => value
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

const escapeAttribute = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

function sanitiseUrl(value: string, attribute: "href" | "src"): string | null {
  const decoded = decodeBasicEntities(value).trim();
  if (!decoded) return null;
  if (attribute === "href" && decoded.startsWith("#")) return decoded;
  if (/^(?:javascript|vbscript|data):/i.test(decoded)) return null;
  if (/^(?:mailto|tel):/i.test(decoded)) return attribute === "href" ? decoded : null;

  try {
    const isRelative = decoded.startsWith("/");
    const parsed = new URL(decoded, "https://hairpinns.com");
    if (!/^https?:$/.test(parsed.protocol)) return null;
    [...parsed.searchParams.keys()].forEach((key) => {
      if (PRIVATE_QUERY_PARAM.test(key)) parsed.searchParams.delete(key);
    });
    return isRelative
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Shopify article HTML is authored by a trusted store administrator, but it is
 * still treated as external content at the React boundary. This conservative
 * pass removes executable/interactive markup, inline styling and personal URL
 * tokens before a public web edition is rendered.
 */
export function sanitisePublicArticleHtml(html: string): string {
  let clean = String(html || "");
  clean = clean.replace(/<!--[^]*?-->/g, "");
  clean = clean.replace(new RegExp(`<\\s*(${BLOCKED_ELEMENTS})\\b[^>]*>[^]*?<\\s*\\/\\s*\\1\\s*>`, "gi"), "");
  clean = clean.replace(new RegExp(`<\\s*\\/?\\s*(?:${BLOCKED_ELEMENTS})\\b[^>]*>`, "gi"), "");
  clean = clean.replace(/\s(?:on[a-z]+|style|srcdoc|contenteditable)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  clean = clean.replace(/\s(href|src)\s*=\s*(["'])(.*?)\2/gi, (_match, rawAttribute, quote, rawValue) => {
    const attribute = rawAttribute.toLowerCase() as "href" | "src";
    const safeValue = sanitiseUrl(rawValue, attribute);
    return safeValue ? ` ${attribute}=${quote}${escapeAttribute(safeValue)}${quote}` : "";
  });

  clean = clean.replace(/<a\b([^>]*)>/gi, (_match, rawAttributes) => {
    const attributes = rawAttributes
      .replace(/\s(?:target|rel)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .trimEnd();
    return `<a${attributes} rel="nofollow noopener noreferrer">`;
  });

  return clean.trim();
}

export function publicExcerpt(excerpt: string | null | undefined, contentHtml: string, maxLength = 180): string {
  const source = excerpt?.trim() || contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const text = decodeBasicEntities(source);
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, Math.max(1, maxLength - 1));
  const wordBoundary = shortened.lastIndexOf(" ");
  return `${(wordBoundary > maxLength * 0.6 ? shortened.slice(0, wordBoundary) : shortened).trim()}…`;
}

const ARTICLE_FIELDS = `
  id
  title
  handle
  excerpt
  excerptHtml
  contentHtml
  publishedAt
  image { url altText width height }
  author { name }
  seo { title description }
  tags
`;

export async function getPublicBlog(handle: string, first = 50): Promise<ShopifyPublicBlog | null> {
  const query = `
    query publicBlog($handle: String!, $first: Int!) {
      blog(handle: $handle) {
        id
        title
        handle
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { ${ARTICLE_FIELDS} }
        }
      }
    }
  `;
  const data = await fetchShopify<{ blog: ShopifyPublicBlog | null }>(query, { handle, first });
  return data.blog;
}

export async function getPublicArticle(blogHandle: string, articleHandle: string): Promise<ShopifyPublicArticle | null> {
  const query = `
    query publicArticle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) { ${ARTICLE_FIELDS} }
      }
    }
  `;
  const data = await fetchShopify<{ blog: { articleByHandle: ShopifyPublicArticle | null } | null }>(query, {
    blogHandle,
    articleHandle,
  });
  return data.blog?.articleByHandle ?? null;
}
