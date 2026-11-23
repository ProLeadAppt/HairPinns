# Campaign attribution preview

Baseline: production commit `66f4bf2fc3638ed439fee4616cd5d2866e921ae5`, Netlify deploy `6aaf290dfad6ef0008677dde`.

This change preserves the landing visit across internal navigation, writes it as Shopify cart attributes and passes the public labels to hosted checkout on both bag checkout and Buy Now. Accepted values are the six bounded UTM fields, `gclid`, `fbclid`, `gbraid` and `wbraid`, plus the external referrer and the hairpinns.com landing path. A Google or Facebook visit with no UTM still records a source from the click ID or the external referrer. Contact details, recipient tokens and the hairpinns.com / Shopify hop itself are not copied. New visits replace previous labels together, expire after 30 minutes in the browser and use optional tab storage. Cart attributes preserve unrelated merchant data. Attribute update failure does not fail shopping, and is capped at 1.5 seconds.

Shopify still sets `referring_site` from the browser Referer of the checkout request, which is this storefront. The original referrer is the `hp_referrer` order note. `landing_site` on the Shopify domain is the checkout URL, so the UTM labels and click IDs are appended there. The GA4 linker parameter is added only when marketing measurement is allowed. Do not make hairpinns.com the Shopify primary domain to chase this; Merchant Center product links are corrected there.

These attributes provide inspectable campaign context. They are not a promise that Shopify Messaging will count storefront sessions or that a purchase will be attributed automatically. GA4 already receives tagged landing pages. Cross-domain session identity and the actual purchase event still require validation.

Shopify's September 2026 documentation describes a Storefront API proxy and updated tracking values for custom headless analytics, and explicitly notes that this custom configuration is not officially supported. Do not implement the retired `_shopify_y`/`_shopify_s` recipe or assume that appending UTMs replaces that integration:
https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/cookies-custom-setup

Native Shopify session measurement is a separate remaining integration involving the same-origin proxy, shop/channel identity, Customer Privacy API and consent propagation. No fabricated visitor identifiers or default opt-in has been added.

Preview acceptance: tagged arrival, internal navigation, correct variant and price, add-to-bag, cart attributes and checkout URL, Buy Now 303, unrelated parameters preserved, recipient parameters excluded, optional analytics failure, stale cart recovery. No billable order required.

Production remains on its existing deployment until Tyson approves the tested preview.
