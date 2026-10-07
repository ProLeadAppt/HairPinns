# IndexNow setup

The existing website integration uses the public host-verification key and root keyLocation defined in `netlify/functions/indexnow.js` and `scripts/submit-indexnow.js`. The matching text file is in `public/`; preserve this existing key and file. It is distinct from a Bing Webmaster API credential. The previously documented alternative key filename was stale.

The `/api/indexnow` function forwards explicitly supplied URLs on `hairpinns.com`. The manual `npm run submit-indexnow` script sends every URL in `public/sitemap.xml`; it does not select content changes or discover removed URLs. No automatic content-publish trigger or durable submission history was found in source. Running either sender is a submission action and requires approval in the current workflow.

Read-only inspection on 7 October 2026 confirmed the source-discovered root verification file responds HTTP200 as UTF-8 text and matches the existing public key. That verifies public file availability, not past API acceptance or indexing.

HTTP200 means receipt; HTTP202 means receipt with key validation pending. Neither proves crawling or indexing. See https://www.indexnow.org/documentation .

Future automation should reuse this integration, select only changed/added/verified-removed canonical page URLs, debounce events and persist release/response state. Activate only after the exact trigger, state storage, caller restrictions, production release and first URL batch are reviewed. Do not run the full sitemap on every build or trigger from visitor page views.
