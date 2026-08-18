# Hair Pinns Stabilisation and Full Audit

**Audit date:** 18 August 2026

**Website:** <https://hairpinns.com>

**GitHub:** `ProLeadAppt/HairPinns`

**Netlify site:** `hairpinns` (`8b8dfc47-e567-4f64-83cc-4904571e2fff`)

**HighLevel location:** `KPqFSaNlJv2TZr2naF8b`

## Executive summary

Hair Pinns is live and its main public routes, product discovery, booking page, sitemap, robots file and real 404 response are operational. The chat widget and mobile floating controls had a confirmed implementation fault: the widget was deliberately made unclickable while HighLevel reported it inactive, loaded too late from a deferred footer, and competed for the same bottom-screen space as the mobile action dock and scroll-to-top button. Those faults have been corrected in code with a shared floating-layer contract, intent-based global widget loading, After-Hours styling, accessible targets and automated multi-browser coverage.

The audit also found material governance and operations debt. The public repository tracks `.env`, has no GitHub Actions, no main-branch protection and has Dependabot alerts disabled. Eight npm advisories affect build/development tooling; the production dependency audit is clean. HighLevel contains duplicated agents, knowledge bases and tags, legacy pipelines, zero-enrolment workflows and inconsistent reputation/reporting data. These HighLevel items are classified below, but none was changed, archived or deleted.

The production text-chat route has now passed a controlled synthetic-contact test: the all-in-one widget created one labelled QA contact and routed exactly one live-chat conversation to Isabella. The test also exposed a material knowledge defect: Isabella answered that Wednesday hours are 6pm–9pm, while the verified current hours are 4pm–9pm. Her active rich-text source is older again and states 9am–5pm, confirming conflicting/stale knowledge rather than a transport failure. Three approved authoritative FAQ entries for current hours, booking and information-only/no-forced-callback behaviour have been published. Retrieval now ranks the correct 4pm–9pm FAQ first, and Isabella correctly stopped requiring a phone/callback, but her internal agent test still answered 6pm–9pm. The remaining defect is therefore prompt/source precedence and still blocks production release. Sam's embedded web-call connection and greeting passed, but two-way speech, field capture, post-call actions and human handoff remain unverified because no real or invented phone data was used.

## Access, baseline and rollback

| System | Access and baseline | Rollback |
| --- | --- | --- |
| GitHub | Confirmed `ADMIN`; repository is public; baseline `87d0c55d73a14a19621a5d8ddf3ea8d24b82913a` | Revert the stabilisation commit or redeploy the baseline commit |
| Netlify | Authenticated and linked to existing `hairpinns` site; no replacement site created | Production deploy `6a71fec912629a00088fc16f`; immutable URL: <https://6a71fec912629a00088fc16f--hairpinns.netlify.app> |
| HighLevel | Authenticated agency UI access to Hair Pinns sub-account; approved all-in-one widget configuration update published | Widget settings can be restored from the recorded pre-change configuration; any later cleanup must be applied in small reversible batches |

The baseline Netlify deploy was `ready`, used four functions, 93 redirects and 26 header rules. Its recorded Lighthouse results were Performance 96, Accessibility 100, Best Practices 92 and SEO 100. Netlify's deploy secret scan reported no matches.

## Fixes implemented

### W-01 — Chat widget availability and clickability

- **Status:** Implemented and covered by regression tests.
- **Evidence:** The loader now lives at application scope in `src/components/LeadConnectorWidget.tsx`, loads after visitor intent or an eight-second fallback, and is skipped during prerender/headless runs. The footer no longer owns the script.
- **Correction:** Removed the CSS rule that disabled pointer events for `chat-widget[data-active="false"]`; pointer suppression now applies only to genuinely hidden states.
- **Business effect:** Visitors can open the widget without scrolling to the footer and the launch control is no longer intentionally inert.
- **Rollback:** Revert the stabilisation commit.
- **Verification:** Automated tests intercept the LeadConnector loader, assert early loading and verify the inactive launcher remains clickable.

### W-02 — Mobile action dock, widget and scroll-to-top collision

- **Status:** Implemented and covered at 344px, 390px, tablet and desktop widths.
- **Evidence:** `src/contexts/FloatingActionsContext.tsx` uses `IntersectionObserver` and `ResizeObserver` to publish `--mobile-action-dock-height` and `data-mobile-action-dock-visible`. The widget and scroll-to-top control consume that occupied-space contract.
- **Correction:** The mobile dock hides around closing CTAs/footer, the chat surface is offset above the measured dock plus safe-area inset, and the scroll-to-top control is positioned above the dock/widget prompt.
- **Business effect:** The three conversion controls no longer obscure one another or block page content.
- **Rollback:** Revert the stabilisation commit.
- **Verification:** Geometry tests require non-overlap and minimum 44px targets; a 390px visual capture confirms the intended stacking.

### W-03 — Outdated floating-control design

- **Status:** Implemented.
- **Evidence:** `src/components/home/StickyBookBar.tsx` and `src/components/ScrollToTopButton.tsx` now use the After-Hours cream/plum/copper tokens, square editorial geometry, visible focus states, reduced-motion handling and 48px controls.
- **Correction:** “Shop products” and “Book salon” remain simultaneously available at 344px.
- **Business effect:** The mobile conversion layer is consistent with the current site design and easier to operate by touch and keyboard.
- **Rollback:** Revert the stabilisation commit.
- **Verification:** Static design-system guards and browser tests.

### W-04 — Collection fallback stalls the full production build

- **Status:** Implemented after the audit reproduced it.
- **Evidence:** Eight Shopify-backed collection routes timed out because the fallback screen never emitted the prerender-ready marker.
- **Correction:** The fallback now publishes a canonical, no-index SEO state through `SEOHead`, which also signals prerender completion. A regression guard prevents its removal.
- **Business effect:** Temporary Shopify/API failures produce a valid fallback document instead of hanging route generation for 60 seconds and failing the release.
- **Rollback:** Revert the fallback change.
- **Verification:** Complete 275-route prerender build and SEO/link audits.

### W-05 — React browser warning

- **Status:** Implemented.
- **Evidence:** Seven image call sites used React's invalid camel-case DOM property `fetchPriority`.
- **Correction:** Changed the DOM attribute to `fetchpriority` without changing fetch behaviour.
- **Business effect:** Removes an actionable browser-console warning from the audited routes.
- **Rollback:** Revert the attribute-only edits.
- **Verification:** TypeScript, lint and browser console checks.

## Verification record

| Check | Result |
| --- | --- |
| TypeScript (`npx tsc --noEmit`) | Pass |
| Unit/function tests | 37 files, 151 tests passed |
| Quality regression suite | Pass across 387 files |
| Content trust audit | Pass across 341 source files and 60 active blog routes |
| ESLint | 0 errors; 18 pre-existing warnings |
| Focused responsive browser tests | Chromium, Firefox and WebKit passed; widths include 344, 390, 768 and 1440 |
| Live public route smoke test | Home, collections, product, booking, contact, robots and sitemap returned 200; unknown route returned 404; checkout GET returned expected 405 |
| Production dependency audit | 0 known vulnerabilities |
| Full production build | Pass: 275/275 prerendered, 275/275 SEO checks, 290 internal targets with 0 unresolved/indirect, crawler audit clean |
| Final floating-control browser matrix | 15/15 passed across Chromium, Firefox and WebKit |
| Netlify preview | Draft deploy `6a83c3ebc06bd92e34b72cd4`: <https://6a83c3ebc06bd92e34b72cd4--hairpinns.netlify.app> |
| Preview floating-control acceptance | 15/15 passed across Chromium, Firefox and WebKit |
| Broader preview Chromium suite | 32 passed before the runner lost network; 42 subsequent navigations failed with `ERR_INTERNET_DISCONNECTED`, so these are not recorded as application failures |
| HighLevel widget handoff | Pass: one synthetic name/email contact, no phone, one Live Chat conversation, exactly one Isabella response |
| Isabella knowledge answer | Fail: replied Wednesday 6pm–9pm; verified current hours are 4pm–9pm; active rich-text source says 9am–5pm |
| Authoritative KB correction | Published: three FAQs for current hours, booking URL and information-only/no-forced-callback behaviour; current-hours FAQ ranks first in retrieval |
| Isabella internal retest | Partial: correctly stated no phone/callback is required for information, but still answered Wednesday 6pm–9pm despite the first-ranked 4pm–9pm FAQ |
| Sam web call | Partial pass: connection and greeting succeeded; caller speech, capture, post-call workflow and handoff not yet verified |

No billable checkout, review request, real-customer contact mutation or external phone call was performed. The approved QA used `Hair Pinns QA 20260818` / `hairpinns.qa.20260818@example.com`, with no phone number, and sent one clearly labelled information-only message through the preview widget.

## Prioritised findings

### Critical and high priority

#### SEC-01 — Environment file is tracked in a public repository — High

- **Evidence:** `.env` is in `git ls-files` and has history across multiple commits even though `.gitignore:27` ignores it. Only variable names were inspected for this audit; values are not reproduced here.
- **Impact:** Any confidential value ever committed is available through public Git history. Storefront/public keys may be intentionally client-visible, but each historical value still requires classification.
- **Recommendation:** Inventory each value, rotate anything not expressly public, replace the tracked file with `.env.example`, remove `.env` from the index, and use GitHub/Netlify secret scanning. History rewriting should occur only under a separately approved coordination plan because it affects every clone and open branch.
- **Dependencies:** Shopify, Supabase, analytics and Netlify owners must classify and rotate credentials first.
- **Rollback:** Keep a private credential inventory and validate the replacement values before revocation; Git history rewrite requires a mirrored backup.
- **Verification:** `git ls-files .env` returns nothing; secret scans are clean; production checkout, analytics and forms pass smoke tests.

#### GOV-01 — No CI, branch protection or Dependabot monitoring — High

- **Evidence:** GitHub Actions returned no runs; the repository contains no tracked workflow files; the main branch protection API returned “Branch not protected”; Dependabot alerts are disabled.
- **Impact:** A public production site can accept unverified direct changes and receives no automated advisory signal.
- **Recommendation:** Add a CI workflow for install, typecheck, lint, unit tests, build and focused Playwright checks; enable dependency graph/Dependabot; protect `main` with pull-request and required-check rules; enable delete-branch-on-merge and add `SECURITY.md`.
- **Dependencies:** Confirm the repository's merge policy and Netlify deploy key/secrets.
- **Rollback:** Rules can be disabled individually; keep an administrator bypass for incident recovery.
- **Verification:** A pull request cannot merge until all required checks pass; a deliberately failing test blocks merge.

#### AI-01 — Voice AI safety escalation is incomplete — High

- **Evidence:** Sam's prompt instructs the agent to stop product use and mark chemical reactions urgent, but does not clearly direct callers to emergency services/Poison Information Centre or immediate medical assessment when severe symptoms are present.
- **Impact:** A caller with a serious reaction could receive an insufficiently urgent response.
- **Recommendation:** Add a narrowly scoped safety policy: do not diagnose; advise stopping exposure; for breathing difficulty, facial swelling, severe pain, collapse or rapidly worsening symptoms, direct the caller to Australian emergency services immediately; provide the Poisons Information Centre number where relevant; then notify a human.
- **Dependencies:** Salon approval of wording and HighLevel prompt update.
- **Rollback:** Export the existing prompt before change and restore it if call QA regresses.
- **Verification:** Controlled scripts for mild irritation, severe reaction, upset caller and human handoff; inspect transcript and notification without using real medical details.

#### AI-02 — Voice routing is only partially verified — High

- **Evidence:** Five Voice AI agents exist; four unassigned duplicates are legacy/FAQ variants. Sam is assigned to `0468 093 991` and the all-in-one webchat widget. His embedded web call connected and produced the expected greeting, but caller speech was unavailable and no post-call action was visible in the inspected action configuration. Isabella is the only enabled Conversation AI agent and one approved synthetic website chat routed to her exactly once, with no duplicate reply.
- **Impact:** Text ownership is now clear, but a real inbound voice path could still fail to capture fields, write notes, notify the salon or trigger `AI – Callback`.
- **Recommendation:** Preserve Isabella as text owner and Sam as voice owner. Complete a controlled two-way voice test with an authorised test number, then verify transcript, knowledge answers, field capture, contact notes, notification, callback workflow and human escalation.
- **Dependencies:** An authorised test phone number and action-time approval for the external call/recording/workflow effects.
- **Rollback:** Use a clearly labelled test contact and remove it only after approval; restore previous channel assignment from screenshots/export.
- **Verification:** Exactly one response owner per channel, correct notes and notification, no duplicate reply, successful human handoff.

#### OPS-01 — Reporting and attribution are materially incomplete — High

- **Evidence:** Facebook Ads and Google Ads dashboard widgets error; Google Analytics widgets report no data/zero visitors; opportunity reporting is empty or AU$0. GBP reports 310 views, 44 website visits and 10 calls, showing real demand that is not represented in pipeline reporting. HighLevel's Shopify integration is not connected while the site uses headless Shopify.
- **Impact:** Marketing and sales decisions are being made without end-to-end attribution or reliable conversion reporting.
- **Recommendation:** Reconnect/replace failing ad and GA data sources, decide whether the native Shopify integration supports this headless architecture, and map website purchase/lead events into a single source and pipeline model.
- **Dependencies:** Analytics/admin access, consent review, Shopify/GHL integration design.
- **Rollback:** Preserve existing dashboard and workflow exports before reconnecting sources.
- **Verification:** Test events appear once in GA/ads/GHL; a non-billable test lead reaches the correct source/stage; dashboard totals reconcile to source reports.

### Medium priority

#### SEC-02 — Build-tool vulnerabilities — Medium

- **Evidence:** `npm audit` reports eight findings: seven high and one moderate. They affect Puppeteer/browser tooling, PostCSS and transitive build packages. `npm audit --omit=dev` reports zero production vulnerabilities.
- **Impact:** The deployed client bundle is not currently exposed through these advisories, but compromised/untrusted build inputs or CI agents have avoidable risk.
- **Recommendation:** Upgrade patched transitive packages and test Puppeteer 25 in a dedicated dependency change. Do not use blind `npm audit fix --force`.
- **Dependencies:** Full 275-route build and visual regression validation.
- **Rollback:** Lockfile revert.
- **Verification:** Both full and production-only audits return zero, and prerender remains green.

#### SEC-03 — Checkout function lacks abuse and shape limits — Medium

- **Evidence:** `netlify/functions/checkout.js:11-15` allows every origin; `:354-458` has no body-size/rate limit, no maximum line count and accepts any numeric quantity including unsafe ranges. Cart IDs and removal arrays are weakly bounded.
- **Impact:** Automated clients can consume function/Shopify API capacity and submit pathological cart mutations. Storefront tokens are public by design, so input and rate controls are the relevant boundary.
- **Recommendation:** Restrict allowed origins, add Netlify rate limiting, cap body size/line counts, require Shopify GID formats, and enforce integer quantities within a small positive range. Return generic upstream errors.
- **Dependencies:** Update function tests and verify cart create/add/remove/stale-cart behaviour.
- **Rollback:** Revert function-only commit.
- **Verification:** Boundary tests for origin, content type, size, quantity, line count and malformed IDs; ordinary cart smoke test remains green.

#### SEC-04 — CSP still permits unsafe script execution — Medium

- **Evidence:** `netlify.toml:585` permits both `'unsafe-inline'` and `'unsafe-eval'` for scripts and includes broad wildcard third-party origins.
- **Impact:** The policy provides less mitigation if an injection flaw or third-party compromise occurs.
- **Recommendation:** Inventory required widget/analytics behaviour, remove unused origins, eliminate `unsafe-eval`, and migrate first-party inline scripts to hashes/nonces. Introduce `Content-Security-Policy-Report-Only` before enforcement changes.
- **Dependencies:** LeadConnector Voice AI, Fresha, analytics and review widget compatibility.
- **Rollback:** Keep the current CSP text and restore it if report-only telemetry identifies a critical block.
- **Verification:** No CSP violations during full desktop/mobile smoke tests and widget voice/chat flows.

#### ENV-01 — Misnamed/malformed Netlify variable — Medium

- **Evidence:** `VITE_GHL_INBOUND_WEBHOOK_URL` contains an HTML widget script rather than a webhook URL and is scoped to non-production contexts. The secure server variable `GHL_INBOUND_WEBHOOK_URL` is separately present for production/preview functions.
- **Impact:** The misleading variable can cause accidental client-side disclosure or future configuration drift even though current code uses the same-origin relay.
- **Recommendation:** Confirm it has no active dependency, remove the malformed Vite variable and update environment documentation to refer only to the private server variable.
- **Dependencies:** Netlify configuration change approval and preview smoke test.
- **Rollback:** Record the existing variable metadata/value privately before removal.
- **Verification:** Repository search shows no reference; preview capture relay still returns expected validation responses.

#### CRM-01 — Contact and custom-field data quality — Medium

- **Evidence:** Contacts span roughly 102 pages at 20 per page. The visible aggregate/sample includes many records missing email/phone and social/guest identities. Sixty custom fields exist across seven folders, including generic snapshot-style names and legacy caller/callback/promotion fields.
- **Impact:** Duplicate/low-identity contacts weaken consent, segmentation, attribution and AI handoff reliability.
- **Recommendation:** Export aggregate data, define an identity/deduplication policy, classify consent provenance and field ownership, then merge/retire fields only after dependency mapping.
- **Dependencies:** Contact export, legal consent requirements and workflow field-usage scan.
- **Rollback:** Export before every batch and use merge logs.
- **Verification:** Duplicate rate, missing-channel rate and unowned-field count decline without reducing valid consent records.

#### CRM-02 — Pipeline sprawl and unreliable ownership — Medium

- **Evidence:** Three pipelines exist, not two: Sales/Marketing, Reviews, and `Xmas Packs & Sophia Calls`. The primary funnel has one new lead and AU$0; other stages are empty. HighLevel warns opportunity owners are decoupled from contact owners and workflow assignment may stop.
- **Impact:** Leads can be split across legacy structures or lose accountable ownership.
- **Recommendation:** Keep one defined sales pipeline, document whether Reviews needs a separate pipeline, dependency-check and archive the Christmas/Sophia pipeline, and explicitly set owner rules.
- **Dependencies:** Opportunity export and workflow trigger/action scan.
- **Rollback:** Export pipeline/stages and move records in small batches.
- **Verification:** Every test lead receives one owner, one pipeline and one valid stage; dashboards connect to those IDs.

#### CRM-03 — Workflow inventory contains stale and zero-use assets — Medium

- **Evidence:** Thirteen workflows span four folders. Several published workflows have zero enrolments, five campaigns/drafts are seasonal or old, and two timestamp-named draft workflows have zero enrolments.
- **Impact:** Operators cannot easily distinguish live automation from experiments; future triggers may collide.
- **Recommendation:** Add owner/purpose/trigger/dependency metadata, keep currently required capture/review/AI flows, archive expired campaigns and delete empty timestamp drafts only after dependency and execution-log checks.
- **Dependencies:** Workflow export and dependency map.
- **Rollback:** Duplicate/export before archive; wait through one business cycle before deletion.
- **Verification:** Test contacts traverse exactly one intended path; no orphaned references remain.

#### REP-01 — Reputation setup and metrics are inconsistent — Medium

- **Evidence:** Onboarding is 5/6, GBP and review link are connected, average rating is 4.96 across 77 reviews, but response sections show conflicting AI/unresponded counts and a 259-day average response time. The published review workflow shows zero enrolments.
- **Impact:** Review requests/responses may not be operating despite strong existing reputation.
- **Recommendation:** Reconcile the date range and eligibility definitions, inspect review workflow trigger/logs, define response SLA and owner, then run one approved review-request test.
- **Dependencies:** Action-time approval to send a request.
- **Rollback:** Export workflow and response settings before change.
- **Verification:** One approved test enrols, sends once and records the outcome; dashboard counts reconcile.

#### KB-01 — Knowledge-base duplication — Medium

- **Evidence:** Six knowledge bases exist; three use generic “Existing knowledge base”/timestamp naming and the primary Hair Pinns KB reports one gap. A controlled Isabella query returned Wednesday 6pm–9pm. The verified current hours are 4pm–9pm, while Isabella's active rich-text source states 9am–5pm, Thursday 9am–8pm and Saturday 8am–4pm. The same document tells the agent to collect a mobile and pivot to a callback for routine questions, and contains placeholders such as “use the salon number from GHL settings”. Three authoritative FAQs were published and the current-hours FAQ ranks first in retrieval, but Isabella's internal test continued to answer 6pm–9pm. Her information-only answer did correctly stop requiring a phone/callback after the FAQ update.
- **Impact:** This is a demonstrated production-answer defect. Conflicting facts can misdirect customers, and callback-first instructions create avoidable friction for information-only enquiries.
- **Recommendation:** Add a highest-priority current-hours/booking instruction at the start of Isabella's prompt, retest the complete agent, then replace the stale rich-text hours and crawler/footer copies in a governed source update. Map every agent to its active KB, merge approved facts into one governed source plus any genuinely specialised review KB, and archive duplicates after approval.
- **Dependencies:** Agent-to-KB dependency export and content-owner review.
- **Rollback:** Export all KB content before merge.
- **Verification:** Golden-question suite passes for salon, products, booking, delivery, returns, safety and unavailable information.

#### REPO-01 — Repository/build hygiene is weak — Medium

- **Evidence:** The checkout is about 729 MB with a 210.8 MB Git pack and includes 27 downloaded JavaScript artefacts under `src/assets`. Browserslist data is 14 months old. Full lint has 18 warnings.
- **Impact:** Slower clones/builds, unnecessary third-party code custody and noisy maintenance signals.
- **Recommendation:** Determine whether downloaded assets are referenced, remove them in a separate reviewed change if not, update browser data, and burn down warnings by category.
- **Dependencies:** Bundle/source-reference check and Git history strategy.
- **Rollback:** Normal Git revert for working-tree deletions; history compaction only under separate approval.
- **Verification:** Clean build, unchanged visual/runtime behaviour and smaller clone/bundle metrics.

#### CAL-01 — Calendar ownership is unclear — Medium

- **Evidence:** The HighLevel calendar settings iframe did not complete loading during the UI audit, while public booking is handled by Fresha.
- **Impact:** An unused/incomplete HighLevel calendar can confuse automation and reporting, or a hidden dependency may be missed.
- **Recommendation:** Identify all calendar-triggered workflows and appointment links; designate Fresha as authoritative unless a documented HighLevel dependency exists.
- **Dependencies:** Workflow/calendar export and booking owner confirmation.
- **Rollback:** Do not remove calendars until all dependencies are mapped.
- **Verification:** Every public booking link reaches the authoritative service and no workflow references an archived calendar.

## HighLevel inventory and cleanup register

This is a proposed register only. **No cleanup was executed.** “Delete” means delete only after dependency checks, export, an archive soak period and explicit approval.

| Classification | Assets | Rationale / required check |
| --- | --- | --- |
| **Keep** | Sam; Isabella; Hair Pinns Knowledge Base; Hair Pinns Sales/Marketing Pipeline; Reviews Pipeline pending purpose review; live GBP/review link; `Hair Pinns \| Known Contact Ecommerce Engagement`; secure website capture relay | These represent the intended production channels or current core data path. Verify ownership, routing and logs. |
| **Merge** | Exact duplicate promotion tags; three generic/timestamp knowledge bases into the governed primary KB; duplicate/generic custom fields where semantics match; duplicate Conversation AI definitions into Isabella's governed configuration | Replace references first, then merge. Preserve consent and historical reporting values. |
| **Archive** | Four unassigned Voice AI FAQ/legacy agents after Sam passes QA; two off generic Conversation AI agents; off Reputation Management agent if Reviews AI is the chosen owner; `Xmas Packs & Sophia Calls` pipeline; expired Black Friday/Hangover/Mother's Day campaigns; zero-enrolment legacy workflows after trigger review | Archive is reversible and should precede deletion through one business/reporting cycle. |
| **Delete** | Two timestamp-named empty draft workflows; surplus exact duplicate tag records after reference migration; confirmed unreferenced downloaded JS artefacts; archived agents/KBs only after approved retention period | Require zero references, zero useful logs/content, export and separate destructive approval. |

### Exact duplicate tag groups identified

- `promo:free-extra-2026-08:suppressed` — three records
- `promo:free-extra-2026-08:wave-1-clickers` — three records
- `promo:free-extra-2026-08:wave-2-openers` — two records
- `promo:free-extra-2026-08:wave-3-cold` — two records

There are 54 tags in total. Seasonal tags must be assessed by dependency and retention need, not deleted solely because they are old.

## Recommended sequence

1. Accept the Netlify preview after widget, dock, scroll, product, cart and booking smoke tests.
2. Run the separately approved Sam/Isabella controlled tests and record routing/handoff evidence.
3. Promote the identical reviewed commit to production and retain the baseline deploy URL for rollback.
4. Complete SEC-01 credential classification/rotation and establish GitHub CI/protection before broader optimisation.
5. Repair analytics/ads attribution and choose a single commerce-to-CRM data path.
6. Approve the HighLevel cleanup register, then execute **Merge**, **Archive** and finally **Delete** in separate reversible batches.

## Acceptance criteria

- The widget loads on every applicable route after intent or the eight-second fallback and is clickable.
- At 344px, 390px, tablet and desktop widths, no chat, dock or scroll control overlaps another; safe-area insets and reduced motion are respected.
- Product discovery, non-billable cart handoff, booking links, forms, reviews, redirects and functions pass preview smoke tests.
- Sam and Isabella have one documented channel each, with correct KB answers, notes, notification and human escalation.
- CI/typecheck/lint/tests/build are green and the production rollback deploy is recorded.
- No HighLevel asset is merged, archived or deleted without an approved register and export.
