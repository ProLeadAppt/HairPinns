# Variant landing page coverage

The build discovers every public Storefront product and variant instead of maintaining an allowlist. It excludes products already retired by the site contract. Both products and variants are paginated, and missing pages, repeated cursors, duplicate IDs, unsupported prices/currencies and missing sale/shipping state fail the build.

Each known variant has an internal snapshot. Each eligible handle also has an unavailable snapshot for invalid, empty or duplicate variant parameters. The edge function rewrites GET/HEAD requests to those files while preserving the visitor's original URL and arbitrary marketing parameters. Base product URLs and other methods retain their normal behavior. Public canonicals remain the base product URL; the Product Offer URL identifies the selected variant. Internal snapshots are not added to the sitemap.

Publication guards compare visible price, AUD schema price, selected variant URL, SKU, availability, shipping state and canonical with the catalogue read earlier in the same build. A price or availability change between discovery and prerender fails validation. The storefront and build use the same existing availability rules, including backorders and digital inventory.

Product-page reads bypass the browser's indefinite read cache, and paginated product variants are completed before rendering. A later SPA visit can therefore receive changed prices/availability, and selected variants beyond the first 100 are not silently lost.

## Freshness limits

Snapshots represent a catalogue read during a successful build, not a per-request live query. A catalogue edit after publication can leave initial HTML stale until a new production build is published. The existing Shopify catalogue webhook queues Netlify builds, but its configured branch/publication target must be verified separately before relying on it as an automatic freshness guarantee. This change does not alter webhook credentials, publication settings or commercial data.

An unknown/new variant on an already covered handle uses the unavailable snapshot until the next build rather than advertising a different variant. Hydration reads the current product and can then select a new valid option. Deleted products likewise require a catalogue rebuild to remove previously published static output. Merchant Center recrawl timing is outside this build's control.

## Verification and build cost

`product-variant-snapshot-report.json` is a generated public provenance artifact: catalogue timestamp, product/variant/route counts, request count, byte count and manifest digest. It contains no tokens. `prerender-report.json` records elapsed prerender seconds, UTF-8 output bytes and the number of verified variant snapshots.

The October 2 regression fixture records the 28 previously uncovered multi-variant handles and 177 variants, including twelve differently priced products. Fixture prices are test inputs; production values are always fetched afresh. Tests also cover future product discovery, pagination, retired products, invalid variants, stale state and normal product/checkout behavior.

At 127 eligible products and 315 variants, complete coverage requires 442 internal snapshots. Adding these to the existing 284 ordinary routes predicts 726 prerender routes, compared with the mask release's 337. Benchmark the complete preview and validate its catalogue against current Storefront data before production publication. Future catalogue growth increases prerender time and output storage; it does not make visitors download every snapshot.
