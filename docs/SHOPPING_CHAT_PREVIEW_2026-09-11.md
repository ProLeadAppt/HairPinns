# Shopping and chat repair — stage 1 preview

This branch deliberately excludes the unfinished white/lavender visual refresh.
It retains the current approved colour system while repairing shopping behaviour.

## Included

- Variant-specific photographs, selectors, price, availability and Add to Bag stay synchronised.
- Shared gallery photographs do not silently select another variant.
- Explicit sold-out variant URLs stay sold out; invalid variants cannot be added.
- Multi-option featured products use “Choose options”.
- Consistent two-column mobile shelf, matching skeleton geometry and safe button hover states.
- A named Shopify homepage-picks collection is supported; until the merchant collection is created, only the previous approved product list is used as fallback.
- Real LeadConnector middle-right panel clamped to the mobile visual viewport, including smaller heights and scrollbar width. The close control remains reachable.
- Sticky dock and scroll-to-top yield while chat is expanded. No transform is applied to the vendor host.

## Observed evidence

The real widget used host ID `leadconnector-widget-loader`, `data-active` for open state, a 340px-wide panel and `right:80px`. On a 390px screen its panel began at x=-36px. The guarded panel begins at x=32px and y=12px with the real widget. Opening, closing and reopening were verified without sending a message or starting a call.

The guard depends on the inspected vendor shadow DOM IDs. Re-test it when LeadConnector changes the widget; it does not alter conversation, voice or routing settings.

Deployed smoke testing also reproduced an invisible collapsed-chat wrapper intercepting the purchase button. Its 301px-wide wrapper included 70px of empty padding. A regression test failed with “chat-widget intercepts pointer events”; the guard now makes only the actual launcher, prompt and expanded panel interactive, allowing empty padding to pass clicks through.

The first preview build passed and the original 45 focused Chromium/Firefox/WebKit checks passed. Public homepage, collections, Wet Brush and Pure Christmas pages returned 200 with production canonicals; sitemap returned 200. The follow-up click-through fix requires a fresh preview and real server-backed cart acceptance before release.

## Release boundaries

- Production rollback: `6a9c03d359d7260f22463756` (approved brand update).
- `main` reconciled at `b3c1703`; identical tree to approved `14c1aa0`.
- Production auto publishing is temporarily locked; no new design is approved for production.
- No customer data, products, campaign settings or integrations are changed by this preview.
- Cart/checkout acceptance must use this deployed preview's server functions, not the plain Vite development server.
- Actual iPhone Safari acceptance and Jena's review remain required.

Visual refresh, Shopify blogs/public email editions, migration, email templates and self-service handover are separate remaining stages, not completed by this branch.
