# Regional product shipping schema

Fresh browser checks on 7 October 2026 confirmed that Island Vibes Self-Tanning Foam and Qiqi Exploration Hair Care Set both had one nationwide `OfferShippingDetails` entry with an AUD 9.95 rate and return policy, but no deliveryTime. This was verified in raw HTML and hydrated JSON-LD. It is an HTML observation, not a Google enhancement or indexing verdict.

The current [shipping policy](https://hairpinns.com/policies/shipping/) establishes 1–2 business days for processing, followed by these standard transit estimates **after dispatch**:

| Destination | Transit business days |
| --- | --- |
| NSW | 1–3 |
| VIC | 3–5 |
| QLD | 3–5 |
| WA | 5–8 |
| SA | 4–6 |
| TAS | 5–8 |
| ACT | 2–4 |
| NT | 6–10 |

A cached web snapshot still contained the retired nationwide wording; the fresh browser policy and the approved source agree on the table above. Numeric estimates now live in shippingConfig and feed both visible state estimates and product schema. Rates, threshold and visible policy estimates are unchanged.

Both basic and enhanced Product schema emit eight regional standard-shipping entries. Each has `addressCountry: AU`, its subdivision in `addressRegion`, the existing AUD 9.95 rate (or zero when the offer price already meets the existing $150 threshold), and separate handlingTime/transitTime QuantitativeValues using unitCode DAY. [Google documents Australian subdivision codes and separate handling/transit fields](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#shipping). [Schema.org describes their timing semantics](https://schema.org/ShippingDeliveryTime).

These are policy estimates, not guaranteed delivery dates. No dispatch cutoff or operating weekday schedule is established, so neither is invented. No express timing is added. Unknown dispatch lead time on BackOrder, PreOrder or OutOfStock offers prevents a deliveryTime claim; those offers retain regional rates. Digital products continue to omit physical shipping. Existing return-policy markup remains unchanged. Product shipping labels now point to destination estimates instead of the stale nationwide 3–5/express 1–2 promises; their existing policy link is retained.

Local receipts are saved under task-2/evidence: shipping-schema-live.json (before), shipping-schema-candidate.json (hydrated draft), shipping-schema-build.log, shipping-schema-browser.log, shipping-schema-typecheck.log and shipping-schema-eslint.log. Final raw built HTML is separately checked for both affected products and catalogue-wide shipping entries. Earlier PR93 fixes remain preserved. This change does not publish, change fulfilment settings or imply a Google rich-result validation.
