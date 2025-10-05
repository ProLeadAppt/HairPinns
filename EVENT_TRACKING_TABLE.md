# Event Tracking Table

## Overview

This table documents every tracking event in the Hair Pinns system, showing where it fires, how it routes through Zapier, and what actions occur in GoHighLevel (GHL).

---

## Complete Event Tracking Table

| Event Name | Where It Fires | Form/Component Name | Zapier Path | GHL Action | Notes |
|------------|----------------|---------------------|-------------|------------|-------|
| **newsletter_subscription** | Footer, Blog, Any newsletter form | NewsletterForm (`newsletter_footer`) | Catch Hook → Filter by `event_name="newsletter_subscription"` | • Create/Update Contact<br>• Apply tag: `newsletter`<br>• Store attribution data<br>• Start "Welcome Newsletter" workflow (if double_opt_in=false)<br>• OR Apply tag: `pending_confirm` (if double_opt_in=true) | All newsletter signups across site |
| **lead_magnet_download** | Blog posts, Popups, Sidebars | LeadMagnetForm (dynamic `form_name`) | Catch Hook → Filter by `event_name="lead_magnet_download"` | • Create/Update Contact<br>• Apply tag: `lead_magnet_{magnet_title_slug}`<br>• Store `lead_magnet_title` in custom field<br>• Send lead magnet email via workflow<br>• Start nurture sequence | Different lead magnets have different tags (e.g., `lead_magnet_frizz7`) |
| **product_lead_capture** | Product Detail Page - Under cart | ProductDetail.tsx (`product_lead_magnet`) | Catch Hook → Filter by `event_name="product_lead_capture"` | • Create/Update Contact<br>• Apply tag: `lead_magnet_frizz7_pdp`<br>• Store `product_title` and `product_handle` in custom fields<br>• Send "7-Day Frizz-Free Plan" email<br>• Start product-specific nurture | Captures product interest + provides lead magnet |
| **contact_submission** | Contact Page | ContactForm (`contact_page`) | Catch Hook → Filter by `event_name="contact_submission"` | • Create/Update Contact<br>• Apply tag based on `topic`:<br>  - `inquiry_product` (Product question)<br>  - `inquiry_service` (Service question)<br>  - `inquiry_order_help` (Order help)<br>  - `inquiry_other` (Other)<br>• Create GHL Conversation<br>• Attach message as note<br>• Route to inbox<br>• **If topic=order_help:** Send Slack/Email alert to Jena | Routes based on topic field |
| **consult_request** | Services page, Product pages, Popups | ConsultMiniForm (`consult_request`) | Catch Hook → Filter by `event_name="consult_request"` | • Create/Update Contact<br>• Apply tag: `consult_request`<br>• Store `preferred_time` in custom field<br>• Send SMS: "Thanks! We'll text you within 24hrs to schedule."<br>• Create task in GHL for Jena to follow up<br>• (Optional) Auto-book on Fresha if integration exists | Also opens Fresha booking link on success |
| **email_confirmed** | `/confirm` page (Double opt-in) | Confirm.tsx | Catch Hook → Filter by `event_name="email_confirmed"` | • Find Contact by email<br>• Verify `confirmation_token` matches<br>• Remove tag: `pending_confirm`<br>• Apply tag: `subscribed`<br>• Update custom field: `subscription_confirmed_at`<br>• Start "Welcome Series" workflow<br>• Start "Product Education Cadence" workflow | Only fires when double_opt_in=true |
| **faq_feedback** | FAQ accordions (Services, Product pages) | FaqFeedbackWidget | Catch Hook → Filter by `event_name="faq_feedback"` | • Log to Google Sheets: FAQ Feedback Log<br>• **Optional:** If contact matched by `client_id`:<br>  - Create note in GHL: "FAQ feedback: {helpful/not helpful} for '{question}'"<br>  - Only if `helpful=false` (negative feedback) | Analytics-focused, minimal GHL action |
| **purchase_client** | Order Confirmation Page (`/order-confirmation`) | OrderConfirmation.tsx | Catch Hook → Filter by `event_name="purchase_client"` | • Log to Google Sheets: Client-side purchases log<br>• (Optional) No GHL action — server webhook is authoritative | Belt-and-braces for analytics; server webhook is source of truth |
| **purchase_server** | Shopify Webhook: Order Paid/Fulfilled | Shopify Admin → Webhooks → Zapier | Shopify Webhook → Zapier Catch Hook | **Authoritative purchase event**<br>• Create/Update Contact in GHL<br>• Apply tag: `purchaser`<br>• Calculate LTV and update custom field: `lifetime_value`<br>• Store order details:<br>  - `last_order_id`<br>  - `last_order_total`<br>  - `last_order_date`<br>• Create detailed order note<br>• Start "Post-Purchase Education" workflow<br>• Start "Re-Buy Cadence" workflow (time-delayed)<br>• **If order > $200:** Send Slack alert to Jena | See SHOPIFY_WEBHOOKS_SETUP.md for full details |
| **add_to_cart** | Product Detail Page - Add to Cart button | ProductDetail.tsx (Not yet implemented) | Catch Hook → Filter by `event_name="add_to_cart"` | • (Optional) Log to Google Sheets: Add to Cart events<br>• (Optional) No GHL action unless high-intent signal | Analytics only; consider abandoned cart workflow |
| **begin_checkout** | Checkout page load | Checkout flow (Not yet implemented) | Catch Hook → Filter by `event_name="begin_checkout"` | • (Optional) Log to Google Sheets: Checkout Started events<br>• (Optional) Create GHL contact if email captured<br>• Consider abandoned cart recovery workflow | Analytics + potential abandoned cart trigger |
| **test_submission** | Browser console (`window.__hpTest()`) | Console utility | Catch Hook → Filter by `event_name="test_submission"` | • No action (test data)<br>• Log to separate "Test Submissions" sheet for QA | For testing only |

---

## Event Categories

### 1. Form Submissions (Lead Capture)
- `newsletter_subscription`
- `lead_magnet_download`
- `product_lead_capture`
- `contact_submission`
- `consult_request`

**GHL Actions:**
- Always create/update contact
- Apply specific tags
- Store attribution data
- Trigger workflows

---

### 2. User Behavior (Analytics)
- `faq_feedback`
- `add_to_cart` (planned)
- `begin_checkout` (planned)

**GHL Actions:**
- Primarily log to Google Sheets
- Optional GHL notes for identified contacts

---

### 3. E-commerce (Transactional)
- `purchase_server` (authoritative)
- `purchase_client` (backup)

**GHL Actions:**
- `purchase_server`: Full contact update, LTV tracking, workflows
- `purchase_client`: Sheet logging only

---

### 4. Workflow Events (System)
- `email_confirmed`

**GHL Actions:**
- Update contact status
- Trigger nurture workflows

---

## Form Name → Event Name Mapping

| Form Name | Event Name | Purpose |
|-----------|------------|---------|
| `newsletter_footer` | `newsletter_subscription` | Newsletter signup (footer) |
| `newsletter_popup` | `newsletter_subscription` | Newsletter signup (popup) |
| `contact_page` | `contact_submission` | Contact form |
| `consult_request` | `consult_request` | Free consultation request |
| `product_lead_magnet` | `product_lead_capture` | PDP lead magnet opt-in |
| `lead_magnet_*` (dynamic) | `lead_magnet_download` | Blog/page lead magnets |
| N/A | `email_confirmed` | Email confirmation click |
| N/A | `faq_feedback` | FAQ helpful/not helpful |
| N/A | `purchase_client` | Client-side order tracking |
| N/A | `purchase_server` | Server-side order webhook |

---

## Zapier Workflow Routing

### Filter Structure

Each Zapier workflow uses filters to route events:

**Example: Newsletter Workflow**
```
Filter: Only continue if...
- event_name = "newsletter_subscription"
- email exists
- double_opt_in = false
```

**Example: Contact Form Workflow (Order Help)**
```
Filter: Only continue if...
- event_name = "contact_submission"
- topic = "order_help"
```

---

## GHL Tag Strategy

### Lead Source Tags
- `newsletter` - Subscribed to newsletter
- `lead_magnet_frizz7` - Downloaded "7-Day Frizz-Free Plan"
- `lead_magnet_{slug}` - Other lead magnets (dynamic)
- `consult_request` - Requested free consultation

### Inquiry Tags
- `inquiry_product` - Asked product question
- `inquiry_service` - Asked service question
- `inquiry_order_help` - Needs order help (high priority)
- `inquiry_other` - General inquiry

### Lifecycle Tags
- `pending_confirm` - Awaiting email confirmation (double opt-in)
- `subscribed` - Confirmed email subscription
- `purchaser` - Made at least one purchase

### Engagement Tags
- `faq_negative_feedback` - Left negative FAQ feedback (optional)

---

## GHL Custom Fields (Data Storage)

### Identifiers
- `client_id` - Browser UUID (for cross-session tracking)
- `dedupe_key` - Deduplication hash

### Attribution (Last-Touch)
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid` (Google Ads)
- `fbclid` (Facebook)
- `ttclid` (TikTok)
- `referrer`

### Attribution (First-Touch)
- `first_utm_source`
- `first_utm_medium`
- `first_utm_campaign`
- `first_utm_content`
- `first_utm_term`
- `first_gclid`
- `first_fbclid`
- `first_ttclid`
- `first_referrer`
- `first_landing_page`
- `first_seen_timestamp`

### Subscription Data
- `subscription_status` (pending/active/unsubscribed)
- `subscription_confirmed_at` (timestamp)
- `confirmation_token` (temporary, cleared after confirmation)
- `token_expires_at` (timestamp)

### Lead Magnet Data
- `lead_magnet_title` (most recent)
- `lead_magnets_downloaded` (comma-separated list)

### Consultation Data
- `preferred_time` (for consult requests)
- `consult_requested_at` (timestamp)

### E-commerce Data
- `lifetime_value` (LTV in dollars)
- `order_count` (total orders)
- `last_order_id`
- `last_order_total`
- `last_order_date`
- `first_order_date`
- `average_order_value`

### GDPR Compliance
- `gdpr_region_detected` (e.g., "AU")
- `timestamp_consent` (when consent was given)
- `double_opt_in` (true/false)

---

## Analytics Sheet Structure

### Sheet 1: FAQ Feedback Log
| Column | Source | Description |
|--------|--------|-------------|
| Timestamp | `timestamp` | When feedback was submitted |
| Question | `faq_question` | The FAQ question text |
| Helpful | `helpful` | true/false |
| Page URL | `page_url` | Where FAQ was viewed |
| Client ID | `client_id` | Unique browser ID |
| Referrer | `referrer` | Traffic source |
| UTM Source | `utms.utm_source` | Campaign source |
| UTM Campaign | `utms.utm_campaign` | Campaign name |
| First UTM Source | `first_touch.first_utm_source` | Original source |

### Sheet 2: Client-Side Purchases
| Column | Source | Description |
|--------|--------|-------------|
| Timestamp | `timestamp` | When page loaded |
| Order ID | `order_id` | Shopify order ID |
| Total | `total` | Order total |
| Subtotal | `subtotal` | Order subtotal |
| Currency | `currency` | Currency code |
| Items | `items` (JSON) | Order items array |
| Client ID | `client_id` | Browser ID |
| Page URL | `page_url` | Thank-you page URL |

### Sheet 3: Add to Cart Events (Optional)
| Column | Source | Description |
|--------|--------|-------------|
| Timestamp | `timestamp` | When added |
| Product Title | `product_title` | Product name |
| Product ID | `product_id` | Shopify ID |
| Quantity | `quantity` | Items added |
| Price | `price` | Product price |
| Client ID | `client_id` | Browser ID |
| UTM Source | `utms.utm_source` | Campaign source |

---

## Priority / Urgency Matrix

| Event | Priority | Urgency | Alert Needed? |
|-------|----------|---------|---------------|
| `contact_submission` (order_help) | 🔴 High | 🔥 Urgent (2hrs) | Yes - Slack/Email to Jena |
| `consult_request` | 🟡 Medium | ⏰ Same day | SMS confirmation only |
| `purchase_server` (>$200) | 🟡 Medium | 📊 FYI | Yes - Slack notification |
| `newsletter_subscription` | 🟢 Low | 📅 Automated | No |
| `lead_magnet_download` | 🟢 Low | 📅 Automated | No |
| `contact_submission` (other) | 🟢 Low | 📅 24hrs | No |

---

## Testing Each Event

Use the console test utility to verify:

```javascript
// Test form events
window.__hpTest('newsletter_footer')
window.__hpTest('contact_page')
window.__hpTest('consult_request')
window.__hpTest('product_lead_magnet')

// Test custom events
window.hpCapture.trackEvent('faq_feedback', {
  faq_question: "Test question",
  helpful: true
})

window.hpCapture.trackEvent('purchase_client', {
  order_id: '12345',
  total: 99.00,
  currency: 'AUD',
  items: [{ title: 'Test Product', qty: 1, price: 99.00 }]
})
```

---

## Zapier Task History Filtering

To debug specific events in Zapier:

1. Go to Zapier Task History
2. Use filters:
   - `event_name = "newsletter_subscription"`
   - `form_name = "contact_page"`
   - `topic = "order_help"`
3. Check payload for all required fields

---

## Related Documentation

- [FORM_IMPLEMENTATION_CHECKLIST.md](./FORM_IMPLEMENTATION_CHECKLIST.md) - Form architecture
- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - UTM & click ID tracking
- [SHOPIFY_WEBHOOKS_SETUP.md](./SHOPIFY_WEBHOOKS_SETUP.md) - E-commerce webhooks
- [DOUBLE_OPT_IN.md](./DOUBLE_OPT_IN.md) - Email confirmation workflow
- [FAQ_FEEDBACK_ZAPIER.md](./FAQ_FEEDBACK_ZAPIER.md) - FAQ tracking

---

## Summary

✅ **11 tracked events** (9 implemented, 2 planned)  
✅ **5 form submission events**  
✅ **2 e-commerce events**  
✅ **2 analytics events**  
✅ **1 workflow event**  
✅ **All events route through single Zapier webhook**  
✅ **Comprehensive GHL tagging and custom field strategy**
