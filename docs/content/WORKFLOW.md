# Hair Pinns draft content workflow

Source: owner-supplied **Hair-Pinns-52-Week-Content-Brief.md**, Library `libfile_81a18491f80c8191bf4e30a62fa8cb9b`, version 0. All 52 supplied weeks are retained in `editorial-plan.json`. This is a draft process, not a publishing or automation instruction.

## Select and verify before writing

1. Select the requested week from the owner's calendar. Read its keyword, intended outcome and proposed CTA. Do not generate 52 articles in bulk.
2. Read `article-inventory.json` and the proposed overlap candidates. Candidates are token-overlap hints, not confirmed duplicates. Read existing articles and decide whether to refresh an existing intent or write a distinct angle. Preserve approved concise articles; the new 1200–1500-word requirement does not retrospectively authorise expanding them.
3. Verify the actual service in the current `/services/` menu and Fresha. There is no standalone consultation route in this checkout; a consultation mentioned within a service is not a bookable consultation product. Do not invent balayage, keratin, gloss or extension services just because the brief proposes them. Use the shared `BOOK_URL` from `src/config/bookingConfig.ts` only after confirming the relevant current service. Record dates and supporting URLs in the draft.
4. Read current Shopify product data: title, vendor/explicit brand, description/directions, available variants, price and stock. Record exact handle and numeric variant ID. The existing article ProductModule supports variant-specific destination URLs; those links lead to product selection, not a direct cart mutation. A new embedded add-to-cart card is a separate implementation step requiring verified product/variant data and cart regressions. Do not label a normal product link “add to cart”. No draft validator can independently prove a recorded stock/service check: a reviewer must inspect its evidence.
5. Verify factual claims using manufacturer instructions and primary evidence. Proposed scalp diagnosis, growth, hair-density supplements, shedding prevention and bleach-burn treatment are review gates, not approved claims. Do not fabricate categories, products, reviews, qualifications, outcomes or a universal formula. Refer medical symptoms for suitable professional assessment rather than marketing a diagnosis or cure.

## Draft format and checks

Start with `draft.template.json`. Keep it outside routed `src/data/blog-posts` until reviewed. Its empty placeholders deliberately fail validation. Provide:

- 1200–1500 visible body words, keyword H 1, distinct short slug and SEO title.
- Explicit 140–155-character metaDescription. Existing posts retain their prior metadata fallback; new reviewed drafts can supply this exact field.
- H 2 sections; optional `subsections` render as H 3; `bullets` and `steps` render semantic lists.
- Verified `content.stylistTip`, rendered as a Pro Stylist Tip callout.
- A verified salon destination and retail product/variant destination. Existing BlogCTA accepts one CTA type; the article productModule supplies the second funnel. Never attach a fabricated consultation link.
- A dated fact review, intent-overlap decision, current catalogue/booking evidence and author review. Schema uses visible article word count, BlogPosting, breadcrumbs and the existing author entity. FAQPage is only emitted for the article's visible authored FAQs. Do not add medical, aggregate-rating, review or product-price schema without the corresponding verified data.

Run `node scripts/validate-content-draft.mjs path/to/draft.json`. A pass checks draft structure and declared review evidence; it does not publish, verify remote facts, grant approval or register a route. Review the actual content and evidence, then map reviewed content into the existing TSX post, summary index and route manifest using established repository patterns. Run unit tests, lint/types against baseline, full catalogue build, SEO/link checks, and mobile/desktop direct/refresh/repeated/Back UI checks. Approval to publish is a separate final step.

## Australian ordering

Preserve week IDs as stable brief identifiers, not fixed northern-hemisphere dates. Without an owner-approved start date, seasonal windows are proposals:

- October–November: review summer colour/UV/chlorine topics and gift/appointment lead time.
- November–December: gift guides and holiday appointment topics, then evidence-backed year review.
- December–February: summer protection and post-holiday care; avoid promised annual trend predictions without sources.
- March–May: evergreen colour, repair and routines, leading into winter preparation.
- June–August: winter/static topics. Winter shedding remains a medical/factual review gate.
- September–October: spring refresh and evergreen topics with verified services.

Interleave evergreen topics only after overlap review; do not create a forced 52-week date schedule or shift article publication dates to pretend they are new. Regenerate the inventory/plan with `node scripts/content-plan.mjs --brief <local-owner-brief>` when the source inventory changes.

## Email drafts and separate approvals

The brief proposes a four-email welcome sequence (immediate/day 3/day 6/day 9), three post-service emails (day 1/day 7/day 30), and 10% retail/15% service discounts. **None are authorised for activation.** Drafts may contain three subject options and 40–90-character preview text, short paragraphs and one CTA. Urgency must be real. Use placeholders for unapproved offers; never invent a code or promise an active discount. Appointment-personalised recommendations require actual service/product records and matching consent/context; no automated guess from an appointment type.

Commands such as “Run Task: Write Blog Post for WeekN” request a draft in this workflow. “Generate Sequence/EmailN” prepares copy only. An HTML export is still a draft and must preserve verified links/schema. Sending, scheduling, activating journeys, creating discounts and publishing require separate explicit approval of the concrete reviewed result. No external messages or email/commerce settings are changed by these scripts.

## Outstanding evidence limits

- Live PR 92 remains the preserved base. Website fixes in this branch are unpublished.
- Heat Shield variant 45170331549877 has Default Title, null SKU and null barcode; its Shopify description gives no size. The manufacturer page https://juucehair.com/products/heat-shield states 200°C while the current retailer description states 240°C. An exact catalogue-to-packaging identifier match is unavailable: size and temperature claims remain blocked for owner/manufacturer verification. No Shopify catalogue change is made.
- Fresh, repeated, SPA and Back visits each showed one Judge.me widget; duplication was not reproduced. Loaded reviews did acquire a false failure caption after 20 seconds. This branch checks for the loaded widget before showing timeout failure and adds a browser regression.
- An empty Shopify collection description does not supply authored copy. This draft omits an empty introduction instead of inventing one.
