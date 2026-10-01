import { createElement, type ReactNode } from "react";

const FORMATTING = new Set(["p", "br", "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "h2", "h3", "h4", "blockquote", "a"]);
const DROP_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "template", "svg", "math", "form", "input", "button", "textarea", "select", "meta", "link", "base"]);
const PRIVATE_QUERY_PARAM = /^(?:email|recipient|contact|customer|subscriber|unsubscribe|token|preview_token|_kx|mc_cid|mc_eid)$/i;
const FALLBACK = "Professional hair care product designed for great results at home.";

function safeHref(value: string | null): string | undefined {
  if (!value) return undefined;
  // DOMParser has already decoded HTML entities. URL handles embedded controls.
  try {
    const url = new URL(value, "https://hairpinns.com");
    if (!["https:", "http:", "mailto:", "tel:"].includes(url.protocol)) return undefined;
    for (const key of [...url.searchParams.keys()]) {
      if (PRIVATE_QUERY_PARAM.test(key)) url.searchParams.delete(key);
    }
    if (value.startsWith("#")) return url.hash;
    if (value.startsWith("/") && !value.startsWith("//")) return `${url.pathname}${url.search}${url.hash}`;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Rebuild external HTML as React elements; never forward arbitrary attributes. */
function renderNode(node: Node, key: number): ReactNode {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return null;
  const element = node as Element;
  const tag = element.localName.toLowerCase();
  if (DROP_CONTENT.has(tag)) return null;
  const children = Array.from(element.childNodes, renderNode);
  if (!FORMATTING.has(tag)) return children;
  if (tag === "br") return createElement("br", { key });
  const props = tag === "a"
    ? { key, href: safeHref(element.getAttribute("href")), rel: "nofollow noopener noreferrer" }
    : { key };
  return createElement(tag, props, children);
}

export function ProductDescription({ description, descriptionHtml }: {
  description?: string | null;
  descriptionHtml?: string | null;
}) {
  if (descriptionHtml?.trim() && typeof DOMParser !== "undefined") {
    const document = new DOMParser().parseFromString(descriptionHtml, "text/html");
    // Test meaningful content after removing unsafe elements, so empty HTML can
    // still use the complete plain-text description.
    for (const element of document.body.querySelectorAll([...DROP_CONTENT].join(","))) element.remove();
    if (document.body.textContent?.trim()) {
      return <div>{Array.from(document.body.childNodes, renderNode)}</div>;
    }
  }
  return <p className="whitespace-pre-line text-sm leading-relaxed">{description?.trim() || FALLBACK}</p>;
}
