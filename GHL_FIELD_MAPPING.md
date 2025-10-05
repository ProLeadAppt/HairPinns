# GHL Field Mapping Reference

## Overview

This document provides a complete reference for mapping standardized Zapier payload fields to GoHighLevel (GHL) contact fields and actions.

All form submissions now use a **standardized nested payload structure**, making Zapier → GHL mapping consistent and reliable across all events.

---

## Standardized Payload Structure

Every submission to Zapier follows this structure:

```json
{
  "contact": {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "0412345678"
  },
  "context": {
    "form_name": "newsletter_footer",
    "event_name": "newsletter_subscription",
    "source_page": "https://hairpinns.com/blog/post",
    "referrer": "https://google.com",
    "timestamp": "2025-10-05T12:34:56.789Z",
    "client_id": "abc123-uuid",
    "dedupe_key": "sha256hash...",
    "last_seen_page": "https://hairpinns.com/products/shampoo",
    "seconds_on_page": 45
  },
  "consent": {
    "marketing": true,
    "gdpr_region_detected": "AU",
    "timestamp_consent": "2025-10-05T12:34:56.789Z",
    "double_opt_in": true
  },
  "session": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring_sale",
    "utm_content": "ad_variant_a",
    "utm_term": "hair+products",
    "gclid": "abc123",
    "fbclid": "",
    "ttclid": ""
  },
  "first_touch": {
    "first_utm_source": "facebook",
    "first_utm_medium": "social",
    "first_utm_campaign": "awareness",
    "first_utm_content": "",
    "first_utm_term": "",
    "first_gclid": "",
    "first_fbclid": "xyz456",
    "first_ttclid": "",
    "first_referrer": "https://facebook.com",
    "first_landing_page": "https://hairpinns.com/?utm_source=facebook",
    "first_seen_timestamp": "2025-10-01T08:00:00.000Z"
  },
  "commerce": {
    "product_id": "12345",
    "product_title": "Juuce Shampoo",
    "product_handle": "juuce-shampoo",
    "price": "29.95",
    "currency": "AUD",
    "variant": "500ml",
    "quantity": "1",
    "cart_total": "29.95",
    "order_id": "1001",
    "items": [
      {
        "title": "Juuce Shampoo",
        "id": "12345",
        "qty": 1,
        "price": 29.95
      }
    ]
  },
  "free_text": {
    "message": "I have a question about this product...",
    "topic": "product_question",
    "topic_label": "Product Question",
    "preferred_time": "morning_weekday",
    "preferred_time_label": "Morning (9am-12pm) - Weekday"
  },
  "lead_magnet": {
    "title": "7-Day Frizz-Free Plan",
    "slug": "frizz7"
  }
}
```

**Note:** `commerce`, `free_text`, and `lead_magnet` are optional and only included when relevant.

---

## Core GHL Contact Fields

### Standard GHL Fields (Built-in)

| Zapier Path | GHL Field | Format | Example | Notes |
|-------------|-----------|--------|---------|-------|
| `contact.email` | **Email** | Email address | `jane@example.com` | Primary identifier |
| `contact.phone` | **Phone** | E.164 format preferred | `+61412345678` | Use formatter in Zapier if needed |
| `contact.first_name` | **First Name** | Text | `Jane` | |
| `contact.last_name` | **Last Name** | Text | `Smith` | May be empty |

---

## GHL Custom Fields

### Identifiers & Tracking

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `context.client_id` | **Client ID** | Text | `abc123-uuid` | Unique browser identifier (lifetime) |
| `context.dedupe_key` | **Dedupe Key** | Text | `sha256hash...` | Deduplication hash (form + email + date) |
| `context.form_name` | **Lead Source Form** | Text | `newsletter_footer` | Which form captured the lead |
| `context.source_page` | **Lead Source Page** | URL | `https://hairpinns.com/blog/post` | Exact page where form was submitted |
| `context.referrer` | **Referrer** | URL | `https://google.com` | Where user came from (last session) |
| `context.last_seen_page` | **Last Seen Page** | URL | `https://hairpinns.com/products/shampoo` | Previous page before form submission |
| `context.seconds_on_page` | **Seconds on Page** | Number | `45` | Time spent on previous page |

---

### Last-Touch Attribution (Session)

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `session.utm_source` | **Last UTM Source** | Text | `google` | Most recent campaign source |
| `session.utm_medium` | **Last UTM Medium** | Text | `cpc` | Most recent campaign medium |
| `session.utm_campaign` | **Last UTM Campaign** | Text | `spring_sale` | Most recent campaign name |
| `session.utm_content` | **Last UTM Content** | Text | `ad_variant_a` | Most recent ad variant |
| `session.utm_term` | **Last UTM Term** | Text | `hair+products` | Most recent search term |
| `session.gclid` | **Last GCLID** | Text | `abc123` | Google Ads Click ID (last session) |
| `session.fbclid` | **Last FBCLID** | Text | `xyz456` | Facebook Click ID (last session) |
| `session.ttclid` | **Last TTCLID** | Text | `tt_789` | TikTok Click ID (last session) |

---

### First-Touch Attribution (Lifetime)

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `first_touch.first_utm_source` | **First UTM Source** | Text | `facebook` | Original campaign source |
| `first_touch.first_utm_medium` | **First UTM Medium** | Text | `social` | Original campaign medium |
| `first_touch.first_utm_campaign` | **First UTM Campaign** | Text | `awareness` | Original campaign name |
| `first_touch.first_utm_content` | **First UTM Content** | Text | `post_123` | Original ad/post |
| `first_touch.first_utm_term` | **First UTM Term** | Text | `hair+tips` | Original search term |
| `first_touch.first_gclid` | **First GCLID** | Text | `gclid_first` | Google Ads Click ID (first visit) |
| `first_touch.first_fbclid` | **First FBCLID** | Text | `fbclid_first` | Facebook Click ID (first visit) |
| `first_touch.first_ttclid` | **First TTCLID** | Text | `ttclid_first` | TikTok Click ID (first visit) |
| `first_touch.first_referrer` | **First Referrer** | URL | `https://facebook.com` | Original referrer |
| `first_touch.first_landing_page` | **First Landing Page** | URL | `https://hairpinns.com/?utm_source=facebook` | Original entry URL |
| `first_touch.first_seen_timestamp` | **First Seen At** | ISO 8601 | `2025-10-01T08:00:00.000Z` | When user first visited site |

---

### Consent & GDPR

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `consent.marketing` | **Marketing Consent** | Boolean | `true` | User agreed to marketing |
| `consent.timestamp_consent` | **Consent Timestamp** | ISO 8601 | `2025-10-05T12:34:56.789Z` | When consent was given |
| `consent.gdpr_region_detected` | **GDPR Region** | Text | `AU` | Detected region |
| `consent.double_opt_in` | **Double Opt-In Required** | Boolean | `true` | If confirmation email needed |

---

### Lead Magnet Data

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `lead_magnet.title` | **Lead Magnet Title** | Text | `7-Day Frizz-Free Plan` | Most recent lead magnet downloaded |
| `lead_magnet.slug` | **Lead Magnet Slug** | Text | `frizz7` | Lead magnet identifier |

**Note:** For tracking multiple lead magnet downloads over time, you can append to a **Lead Magnets Downloaded** field using Zapier's "Append to CSV" formatter.

---

### Consultation Data

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `free_text.preferred_time` | **Preferred Time Slot** | Text | `morning_weekday` | When user prefers consultation |
| `free_text.preferred_time_label` | **Preferred Time (Readable)** | Text | `Morning (9am-12pm) - Weekday` | Human-readable time preference |
| `context.timestamp` | **Consult Requested At** | ISO 8601 | `2025-10-05T12:34:56.789Z` | When consult was requested |

---

### E-commerce Data

| Zapier Path | GHL Custom Field Name | Type | Example | Purpose |
|-------------|----------------------|------|---------|---------|
| `commerce.order_id` | **Last Order ID** | Text | `1001` | Most recent Shopify order ID |
| `commerce.order_total` | **Last Order Total** | Currency | `99.00` | Most recent order value |
| `context.timestamp` | **Last Order Date** | ISO 8601 | `2025-10-05T12:34:56.789Z` | When order was placed |
| (Calculated) | **Lifetime Value (LTV)** | Currency | `299.00` | Sum of all orders (calculate in Zapier) |
| (Calculated) | **Order Count** | Number | `3` | Total number of orders (increment in Zapier) |
| (Calculated) | **Average Order Value** | Currency | `99.67` | LTV / Order Count |

**How to Calculate in Zapier:**
1. Use "Get Contact" action to fetch existing `Lifetime Value` and `Order Count`
2. Add current order total to LTV
3. Increment Order Count by 1
4. Calculate AOV: `LTV / Order Count`
5. Update contact with new values

---

## GHL Tags

### Tag Strategy by Form/Event

| Event Name | Condition | Tag Applied | Purpose |
|------------|-----------|-------------|---------|
| `newsletter_subscription` | Always | `newsletter` | Newsletter subscriber |
| `newsletter_subscription` | If `consent.double_opt_in = true` | `pending_confirm` | Awaiting email confirmation |
| `email_confirmed` | Always | `subscribed` | Confirmed email address |
| `email_confirmed` | Always | Remove: `pending_confirm` | Confirmation complete |
| `lead_magnet_download` | Always | `lead_magnet_{slug}` | Downloaded specific lead magnet (e.g., `lead_magnet_frizz7`) |
| `product_lead_capture` | Always | `lead_magnet_frizz7_pdp` | Downloaded lead magnet from PDP |
| `consult_request` | Always | `consult_request` | Requested free consultation |
| `contact_submission` | `free_text.topic = "product_question"` | `inquiry_product` | Product question |
| `contact_submission` | `free_text.topic = "service_question"` | `inquiry_service` | Service question |
| `contact_submission` | `free_text.topic = "order_help"` | `inquiry_order_help` | Order help (high priority) |
| `contact_submission` | `free_text.topic = "other"` | `inquiry_other` | General inquiry |
| `purchase_server` | Always | `purchaser` | Made at least one purchase |

---

## GHL Workflows

### Workflow Triggers

| Event Name | Condition | Workflow Name | Purpose |
|------------|-----------|---------------|---------|
| `newsletter_subscription` | `consent.marketing = true` AND `consent.double_opt_in = false` | **Welcome Newsletter Series** | Immediate welcome email + nurture |
| `newsletter_subscription` | `consent.double_opt_in = true` | **Send Confirmation Email** | Email with confirmation link |
| `email_confirmed` | Always | **Welcome Series** | Post-confirmation welcome emails |
| `lead_magnet_download` | Always | **Send Lead Magnet Email** | Deliver PDF/download link |
| `lead_magnet_download` | Always | **Lead Nurture Sequence** | 7-day educational email series |
| `product_lead_capture` | Always | **Send Frizz-Free Plan** | Deliver "7-Day Frizz-Free Plan" email |
| `product_lead_capture` | Always | **Product-Specific Nurture** | Product education + upsells |
| `consult_request` | Always | **SMS: Consult Confirmation** | "Thanks! We'll text you within 24hrs..." |
| `purchase_server` | Always | **Post-Purchase Education** | Thank you + product usage tips |
| `purchase_server` | `commerce.order_total > 50` | **Re-Buy Cadence** | Time-delayed replenishment reminders |

---

## GHL Actions by Event

### Newsletter Subscription (`newsletter_subscription`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "newsletter_subscription"`
2. **GHL: Create/Update Contact**
   - Email: `contact.email`
   - First Name: `contact.first_name`
   - Phone: `contact.phone`
   - Custom Fields: All session/first-touch UTMs, client_id, referrer
3. **GHL: Add Tag:** `newsletter`
4. **Paths:**
   - **If `consent.double_opt_in = true`:**
     - Add tag: `pending_confirm`
     - Send confirmation email with token
   - **If `consent.double_opt_in = false`:**
     - Start workflow: "Welcome Newsletter Series"

---

### Lead Magnet Download (`lead_magnet_download`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "lead_magnet_download"`
2. **GHL: Create/Update Contact**
   - Email: `contact.email`
   - First Name: `contact.first_name`
   - Phone: `contact.phone`
   - Custom Fields: `lead_magnet.title`, `lead_magnet.slug`, UTMs
3. **GHL: Add Tag:** `lead_magnet_{lead_magnet.slug}`
4. **GHL: Update Custom Field:** Append `lead_magnet.title` to "Lead Magnets Downloaded" (CSV)
5. **Send Email:** Deliver lead magnet PDF
6. **Start Workflow:** "Lead Nurture Sequence"

---

### Product Lead Capture (`product_lead_capture`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "product_lead_capture"`
2. **GHL: Create/Update Contact**
   - Email: `contact.email`
   - First Name: `contact.first_name`
   - Phone: `contact.phone`
   - Custom Fields: `commerce.product_title`, `commerce.product_handle`, `commerce.product_id`
3. **GHL: Add Tag:** `lead_magnet_frizz7_pdp`
4. **Send Email:** "7-Day Frizz-Free Plan" with product recommendations
5. **Start Workflow:** "Product-Specific Nurture"

---

### Contact Submission (`contact_submission`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "contact_submission"`
2. **GHL: Create/Update Contact**
   - Email: `contact.email`
   - First Name: `contact.first_name`
   - Last Name: `contact.last_name`
   - Phone: `contact.phone`
3. **GHL: Add Tag** (based on `free_text.topic`):
   - `inquiry_product`
   - `inquiry_service`
   - `inquiry_order_help`
   - `inquiry_other`
4. **GHL: Create Conversation**
   - Attach `free_text.message` as note
   - Add `free_text.topic_label` to subject
5. **Paths:**
   - **If `free_text.topic = "order_help"`:**
     - Send Slack alert to Jena
     - Mark as high priority

---

### Consult Request (`consult_request`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "consult_request"`
2. **GHL: Create/Update Contact**
   - Email: `contact.email`
   - First Name: `contact.first_name`
   - Phone: `contact.phone`
   - Custom Fields: `free_text.preferred_time`, `free_text.preferred_time_label`
3. **GHL: Add Tag:** `consult_request`
4. **GHL: Send SMS:** "Thanks! We'll text you within 24hrs to schedule."
5. **GHL: Create Task:** Assign to Jena with preferred time details
6. **(Optional) Fresha Integration:** Auto-book appointment

---

### Email Confirmed (`email_confirmed`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "email_confirmed"`
2. **GHL: Find Contact** by `contact.email`
3. **GHL: Remove Tag:** `pending_confirm`
4. **GHL: Add Tag:** `subscribed`
5. **GHL: Update Custom Field:** `subscription_confirmed_at` = `context.timestamp`
6. **Start Workflow:** "Welcome Series"
7. **Start Workflow:** "Product Education Cadence"

---

### Purchase (Server Webhook) (`purchase_server`)

**Zapier Steps:**
1. **Filter:** Only continue if `context.event_name = "purchase_server"`
2. **GHL: Get Contact** by `contact.email`
3. **Calculate:**
   - New LTV = Existing LTV + `commerce.order_total`
   - New Order Count = Existing Order Count + 1
   - New AOV = New LTV / New Order Count
4. **GHL: Update Contact**
   - Custom Fields: `Last Order ID`, `Last Order Total`, `Last Order Date`, `Lifetime Value`, `Order Count`, `Average Order Value`
5. **GHL: Add Tag:** `purchaser`
6. **GHL: Create Note:** Order details (items, total, order ID)
7. **Start Workflow:** "Post-Purchase Education"
8. **Paths:**
   - **If `commerce.order_total > 200`:**
     - Send Slack alert to Jena (high-value order)
9. **Delayed Path:** Wait 30 days → Start workflow: "Re-Buy Cadence"

---

## Zapier Filter Examples

### Filter by Event Name

```
Only continue if...
  context.event_name exactly matches "newsletter_subscription"
```

### Filter by Form Name

```
Only continue if...
  context.form_name exactly matches "contact_page"
```

### Filter by Topic (Contact Form)

```
Only continue if...
  context.event_name exactly matches "contact_submission"
  AND free_text.topic exactly matches "order_help"
```

### Filter by Commerce (High-Value Orders)

```
Only continue if...
  context.event_name exactly matches "purchase_server"
  AND commerce.order_total is greater than 200
```

### Filter by Consent (Double Opt-In)

```
Only continue if...
  context.event_name exactly matches "newsletter_subscription"
  AND consent.double_opt_in is true
```

---

## Phone Number Formatting

**GHL expects E.164 format:** `+61412345678`

If users submit phone numbers in other formats (e.g., `0412 345 678`, `(02) 1234 5678`), use Zapier's **Formatter** step:

1. Add **Formatter by Zapier** step
2. Choose **Phone Number → Format Phone Number**
3. Input: `contact.phone`
4. Country: `Australia (+61)`
5. Output: Use formatted phone number in GHL step

---

## Custom Field Data Types in GHL

When creating custom fields in GHL, use these data types:

| Field Type | GHL Data Type | Example |
|------------|---------------|---------|
| Text | Text | `Client ID`, `Last UTM Source` |
| URL | Text (GHL auto-detects) | `First Landing Page`, `Referrer` |
| Timestamp | Date/Time | `First Seen At`, `Consent Timestamp` |
| Boolean | Checkbox | `Marketing Consent`, `Double Opt-In Required` |
| Number | Number | `Order Count`, `Seconds on Page` |
| Currency | Number (format manually in GHL) | `Lifetime Value`, `Last Order Total` |

---

## Testing Payload Structure in Zapier

To verify the new nested structure is working:

1. Go to Zapier → Zap → Edit
2. Click "Test" on the Catch Hook trigger
3. Submit a form (or run `window.__hpTest('newsletter_footer')` in console)
4. View the payload in Zapier:
   - Expand `contact` → see `first_name`, `last_name`, `email`, `phone`
   - Expand `context` → see `form_name`, `event_name`, `source_page`, etc.
   - Expand `session` → see `utm_source`, `gclid`, etc.
   - Expand `first_touch` → see `first_utm_source`, etc.
5. In subsequent steps, reference fields as:
   - `1. contact: first_name`
   - `1. context: source_page`
   - `1. session: utm_source`
   - `1. first_touch: first_utm_source`

---

## Related Documentation

- [EVENT_TRACKING_TABLE.md](./EVENT_TRACKING_TABLE.md) - Complete event tracking reference
- [ZAPIER_IMPLEMENTATION_SUMMARY.md](./ZAPIER_IMPLEMENTATION_SUMMARY.md) - Technical implementation
- [LAUNCH_QA_CHECKLIST.md](./LAUNCH_QA_CHECKLIST.md) - Testing workflows
- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - Multi-touch attribution details

---

## Summary

✅ **Standardized nested payload structure** for all forms  
✅ **Clear Zapier paths** for every field (e.g., `contact.email`, `session.utm_source`)  
✅ **Complete GHL custom field mapping** (30+ fields)  
✅ **Tag strategy** for all events  
✅ **Workflow triggers** documented  
✅ **Phone formatting** instructions for E.164 compliance  
✅ **Filter examples** for common routing scenarios  
✅ **Testing instructions** for verifying nested structure in Zapier
