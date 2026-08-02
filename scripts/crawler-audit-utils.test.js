import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  auditDocuments,
  extractPageSignals,
  resolveScriptRoot,
  textSimilarity,
} from "./crawler-audit-utils.js";

const page = ({
  title = "Useful page | Hair Pinns",
  description = "A useful and truthful page description for Hair Pinns visitors in Australia.",
  canonical = "https://hairpinns.com/useful/",
  body = '<h1>Useful page</h1><a href="/other/">Other</a>',
  schemaType = "WebPage",
  schemaNode,
} = {}) => `<!doctype html><html><head>
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [schemaNode ?? { "@type": schemaType, "@id": `${canonical}#page` }] })}</script>
</head><body>${body}</body></html>`;

describe("crawler audit utilities", () => {
  it("resolves a script root when the file URL contains spaces", () => {
    const projectRoot = resolve("tmp", "Hair Pinns");
    const metaUrl = pathToFileURL(resolve(projectRoot, "scripts", "crawler-hardening-audit.mjs")).href;

    expect(resolveScriptRoot(metaUrl)).toBe(projectRoot);
  });

  it("extracts metadata, links and a connected schema graph", () => {
    const signals = extractPageSignals(page(), "/useful/");
    expect(signals.title).toBe("Useful page | Hair Pinns");
    expect(signals.description).toContain("truthful page description");
    expect(signals.links).toContain("/other/");
    expect(signals.schemas).toHaveLength(1);
    expect(signals.schemas[0]["@graph"]).toHaveLength(1);
  });

  it("preserves apostrophes inside double-quoted metadata attributes", () => {
    const signals = extractPageSignals(
      page({ description: "In today's guide, Jena explains a practical Australian hair-care routine." }),
      "/guide/",
    );
    expect(signals.description).toBe("In today's guide, Jena explains a practical Australian hair-care routine.");
  });

  it("detects forbidden schema, duplicate canonical URLs and orphan routes", () => {
    const result = auditDocuments([
      { route: "/", html: page({ canonical: "https://hairpinns.com/", body: "<h1>Home</h1>" }) },
      { route: "/bad/", html: page({ canonical: "https://hairpinns.com/shared/", schemaType: "QAPage", body: "<h1>Bad</h1>" }) },
      { route: "/other/", html: page({ canonical: "https://hairpinns.com/shared/", body: "<h1>Other</h1>" }) },
    ]);

    expect(result.errors.join("\n")).toContain("forbidden schema type QAPage");
    expect(result.errors.join("\n")).toContain("duplicate canonical");
    expect(result.errors.join("\n")).toContain("orphan route /bad/");
  });

  it("rejects meta descriptions below the configured quality floor", () => {
    const result = auditDocuments([{ route: "/", html: page({ description: "Too short for a useful search result." }) }]);
    expect(result.errors.join("\n")).toContain("short meta description");
  });

  it("rejects nested contexts and empty FAQPage nodes", () => {
    const result = auditDocuments([{ route: "/", html: page({
      schemaNode: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] },
    }) }]);
    expect(result.errors.join("\n")).toContain("nested @context");
    expect(result.errors.join("\n")).toContain("empty FAQPage");
  });

  it("measures near-duplicate rendered text", () => {
    expect(textSimilarity("one two three four", "one two three four")).toBe(1);
    expect(textSimilarity("one two three four", "completely different words here")).toBeLessThan(0.5);
  });
});
