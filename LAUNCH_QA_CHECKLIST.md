# Launch QA Checklist

## Overview

This document provides a comprehensive testing checklist for verifying all form submissions, Zapier workflows, GHL integrations, attribution tracking, and e-commerce functionality before launch.

---

## 1. Form Submission Tests

### Test Each Form: POST → 200 OK from Zapier

| Form | Location | Form Name | Expected Status | Test URL | Status |
|------|----------|-----------|----------------|----------|--------|
| Newsletter Footer | Footer (all pages) | `newsletter_footer` | 200 OK | Any page → scroll to footer | ☐ |
| Newsletter Popup | Homepage popup | `newsletter_popup` | 200 OK | Homepage (if popup enabled) | ☐ |
| Lead Magnet (Generic) | Blog posts, sidebars | `lead_magnet_{slug}` | 200 OK | Blog post with lead magnet | ☐ |
| Product Lead Magnet | Product Detail Page | `product_lead_magnet` | 200 OK | `/products/*` → under cart | ☐ |
| Contact Form | Contact page | `contact_page` | 200 OK | `/contact` | ☐ |
| Consult Request | Services, Popups | `consult_request` | 200 OK | `/services` or product pages | ☐ |

**How to Test:**
1. Open browser DevTools → Network tab
2. Submit each form with valid test data
3. Verify `POST` request to Zapier webhook returns `200 OK`
4. Check response body (if visible) for success confirmation
5. **Alternative:** Check `window.__hpErrors` is empty after submission

**Expected Outcome:**
- ✅ All forms return `200 OK` status
- ✅ Success message displayed to user
- ✅ No errors logged to `window.__hpErrors`

---

### Verify Payload Keys Present

For **every form submission**, open browser console and run:

```javascript
// Intercept the payload before submission
window.__lastPayload = null;

// Override postToZapier temporarily to log payload
const originalPost = window.hpCapture.postToZapier;
window.hpCapture.postToZapier = async function(payload, options) {
  window.__lastPayload = payload;
  console.log("📦 Captured payload:", payload);
  return originalPost.call(this, payload, options);
}

// Now submit a form, then check:
console.table(window.__lastPayload);
```

**Required Keys (All Forms):**

| Key | Type | Example Value | Present? |
|-----|------|---------------|----------|
| `form_name` | string | `newsletter_footer` | ☐ |
| `event_name` | string | `newsletter_subscription` | ☐ |
| `source_page` | string | `https://hairpinns.com/` | ☐ |
| `client_id` | string | `abc123-uuid` | ☐ |
| `timestamp` | ISO 8601 | `2025-10-05T12:34:56.789Z` | ☐ |
| `dedupe_key` | string (SHA-256) | `sha256(...)` | ☐ |
| `consent_marketing` | boolean | `true` | ☐ |
| `timestamp_consent` | ISO 8601 | `2025-10-05T12:34:56.789Z` | ☐ |

**UTM Parameters (Session/Last-Touch):**

| Key | Example | Present? |
|-----|---------|----------|
| `utm_source` | `google` | ☐ |
| `utm_medium` | `cpc` | ☐ |
| `utm_campaign` | `spring_sale` | ☐ |
| `utm_content` | `ad_variant_a` | ☐ |
| `utm_term` | `hair+products` | ☐ |

**Click IDs (Session/Last-Touch):**

| Key | Example | Present? |
|-----|---------|----------|
| `gclid` | `abc123` | ☐ |
| `fbclid` | `xyz456` | ☐ |
| `ttclid` | `tt_789` | ☐ |

**First-Touch Attribution:**

| Key | Example | Present? |
|-----|---------|----------|
| `first_utm_source` | `facebook` | ☐ |
| `first_utm_medium` | `social` | ☐ |
| `first_utm_campaign` | `awareness_q1` | ☐ |
| `first_referrer` | `https://facebook.com/` | ☐ |
| `first_landing_page` | `https://hairpinns.com/?utm_source=facebook` | ☐ |
| `first_seen_timestamp` | `2025-10-01T08:00:00.000Z` | ☐ |
| `first_gclid` | `gclid_first` | ☐ |
| `first_fbclid` | `fbclid_first` | ☐ |
| `first_ttclid` | `ttclid_first` | ☐ |

**Page Tracking:**

| Key | Example | Present? |
|-----|---------|----------|
| `last_seen_page` | `https://hairpinns.com/blog/post` | ☐ |
| `seconds_on_page` | `45` | ☐ |

**GDPR Compliance:**

| Key | Example | Present? |
|-----|---------|----------|
| `gdpr_region_detected` | `AU` | ☐ |
| `double_opt_in` | `true` | ☐ |

---

### Verify Consent Captured

**Test:**
1. Submit each form **without** checking the consent checkbox
2. Verify submission is blocked with error message: "You must agree to marketing consent"
3. Check consent checkbox
4. Submit form
5. Verify `consent_marketing: true` in payload
6. Verify `timestamp_consent` is present and recent

**Checklist:**

| Form | Consent Blocked? | Consent Captured? | Timestamp Present? |
|------|------------------|-------------------|-------------------|
| Newsletter Footer | ☐ | ☐ | ☐ |
| Lead Magnet | ☐ | ☐ | ☐ |
| Product Lead Magnet | ☐ | ☐ | ☐ |
| Contact Form | ☐ | ☐ | ☐ |
| Consult Request | ☐ | ☐ | ☐ |

---

## 2. Zapier Workflow Tests

### Catch Hook → Filter/Paths → GHL Action

**For each event, verify:**
1. Zapier Task History shows submission
2. Filter correctly routes by `form_name` and/or `event_name`
3. GHL receives contact with correct data
4. Tags are applied
5. Workflows are triggered (if applicable)

---

### Newsletter Subscription Workflow

**Event:** `newsletter_subscription`  
**Form Name:** `newsletter_footer` or `newsletter_popup`

**Test Steps:**
1. Submit newsletter form with test email: `qa+newsletter@hairpinns.com`
2. Go to Zapier Task History → Find submission
3. Verify Filter passes: `event_name = "newsletter_subscription"`
4. Check GHL for contact

**Expected GHL Actions:**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact created/updated | Contact exists with email `qa+newsletter@hairpinns.com` | ☐ |
| Tag applied | `newsletter` tag present | ☐ |
| Custom field: `utm_source` | Populated (if UTM present) | ☐ |
| Custom field: `first_utm_source` | Populated | ☐ |
| Custom field: `client_id` | Populated | ☐ |
| Custom field: `referrer` | Populated | ☐ |
| **If `double_opt_in=false`** | "Welcome Newsletter" workflow started | ☐ |
| **If `double_opt_in=true`** | Tag: `pending_confirm` applied, confirmation email sent | ☐ |

---

### Lead Magnet Download Workflow

**Event:** `lead_magnet_download`  
**Form Name:** `lead_magnet_{slug}` (e.g., `lead_magnet_frizz7`)

**Test Steps:**
1. Submit lead magnet form with test email: `qa+leadmagnet@hairpinns.com`
2. Go to Zapier Task History → Find submission
3. Verify Filter passes: `event_name = "lead_magnet_download"`
4. Check GHL for contact

**Expected GHL Actions:**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact created/updated | Contact exists | ☐ |
| Tag applied | `lead_magnet_{slug}` (e.g., `lead_magnet_frizz7`) | ☐ |
| Custom field: `lead_magnet_title` | Title stored (e.g., "7-Day Frizz-Free Plan") | ☐ |
| Custom field: `lead_magnets_downloaded` | Comma-separated list updated | ☐ |
| Email sent | Lead magnet PDF/download link email delivered | ☐ |
| Workflow started | Lead nurture sequence started | ☐ |

---

### Product Lead Capture Workflow (PDP)

**Event:** `product_lead_capture`  
**Form Name:** `product_lead_magnet`

**Test Steps:**
1. Go to any product detail page
2. Submit lead magnet form under "Add to Cart"
3. Use test email: `qa+pdp@hairpinns.com`
4. Go to Zapier Task History → Find submission
5. Check GHL for contact

**Expected GHL Actions:**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact created/updated | Contact exists | ☐ |
| Tag applied | `lead_magnet_frizz7_pdp` | ☐ |
| Custom field: `product_title` | Product name stored | ☐ |
| Custom field: `product_handle` | Shopify product handle stored | ☐ |
| Email sent | "7-Day Frizz-Free Plan" email delivered | ☐ |
| Workflow started | Product-specific nurture started | ☐ |

---

### Contact Form Workflow

**Event:** `contact_submission`  
**Form Name:** `contact_page`

**Test Steps:**
1. Submit contact form with each `topic` option:
   - "Product question" → `inquiry_product`
   - "Service question" → `inquiry_service`
   - "Order help" → `inquiry_order_help`
   - "Other" → `inquiry_other`
2. Use test email: `qa+contact_{topic}@hairpinns.com`
3. Go to Zapier Task History → Find submissions
4. Verify routing by `topic` field

**Expected GHL Actions (All Topics):**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact created/updated | Contact exists | ☐ |
| Tag applied (based on topic) | `inquiry_product`, `inquiry_service`, etc. | ☐ |
| GHL Conversation created | New conversation in inbox | ☐ |
| Message attached as note | Message body visible in conversation | ☐ |

**Expected GHL Actions (Order Help Only):**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Slack/Email alert sent | Notification sent to Jena | ☐ |
| High-priority flag | Marked as urgent in GHL | ☐ |

---

### Consult Request Workflow

**Event:** `consult_request`  
**Form Name:** `consult_request`

**Test Steps:**
1. Submit consult mini-form with test email: `qa+consult@hairpinns.com`
2. Include `preferred_time` (e.g., "Morning")
3. Go to Zapier Task History → Find submission
4. Check GHL for contact

**Expected GHL Actions:**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact created/updated | Contact exists | ☐ |
| Tag applied | `consult_request` | ☐ |
| Custom field: `preferred_time` | "Morning" stored | ☐ |
| SMS sent | "Thanks! We'll text you within 24hrs..." | ☐ |
| Task created in GHL | Task assigned to Jena to follow up | ☐ |
| (Optional) Fresha booking | Auto-book if integration exists | ☐ |

---

### Email Confirmation Workflow (Double Opt-In)

**Event:** `email_confirmed`  
**Form Name:** N/A (triggered by `/confirm` page)

**Test Steps:**
1. Enable `double_opt_in: true` in `src/config/projectConfig.ts`
2. Submit newsletter form
3. Check email for confirmation link
4. Click confirmation link → redirects to `/confirm?token=...&email=...`
5. Go to Zapier Task History → Find `email_confirmed` event
6. Check GHL for contact

**Expected GHL Actions:**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact found by email | Existing contact matched | ☐ |
| Token validated | `confirmation_token` matches | ☐ |
| Tag removed | `pending_confirm` removed | ☐ |
| Tag added | `subscribed` added | ☐ |
| Custom field updated | `subscription_confirmed_at` timestamp set | ☐ |
| Workflow started | "Welcome Series" workflow triggered | ☐ |
| Workflow started | "Product Education Cadence" triggered | ☐ |

---

## 3. Deduplication Tests

### Test: Same Email, Same Day → No Duplicates

**Scenario 1: Same Form, Same Data**

1. Submit newsletter form with email: `qa+dedupe1@hairpinns.com`
2. Wait 5 seconds
3. Submit **same form** with **same email** again
4. Check Zapier Task History for both submissions
5. Verify both have **same `dedupe_key`**
6. Check GHL: Should only have **one contact** (not duplicated)

**Checklist:**

| Test | Result | Verified? |
|------|--------|-----------|
| Both submissions logged in Zapier | Yes | ☐ |
| Both have identical `dedupe_key` | Yes | ☐ |
| GHL contact count | 1 (not 2) | ☐ |
| GHL contact not duplicated | Yes | ☐ |

---

**Scenario 2: Different Forms, Same Email, Same Day**

1. Submit newsletter form with email: `qa+dedupe2@hairpinns.com`
2. Wait 5 seconds
3. Submit **contact form** with **same email**
4. Check Zapier Task History
5. Verify `dedupe_key` is **different** (because `form_name` differs)
6. Check GHL: Should have **one contact** with **multiple tags**

**Checklist:**

| Test | Result | Verified? |
|------|--------|-----------|
| Both submissions logged in Zapier | Yes | ☐ |
| `dedupe_key` values are **different** | Yes | ☐ |
| GHL contact count | 1 (not 2) | ☐ |
| GHL contact has both tags | `newsletter` + `inquiry_*` | ☐ |

---

**Scenario 3: Same Email, Different Days**

1. Submit newsletter form with email: `qa+dedupe3@hairpinns.com`
2. Change system date to next day (or wait 24hrs)
3. Submit **same form** with **same email**
4. Verify `dedupe_key` is **different** (because date differs)
5. Check GHL: Should still be **one contact** (updated, not duplicated)

**Checklist:**

| Test | Result | Verified? |
|------|--------|-----------|
| Both submissions logged in Zapier | Yes | ☐ |
| `dedupe_key` values are **different** | Yes | ☐ |
| GHL contact count | 1 (not 2) | ☐ |
| Contact updated timestamp | Recent | ☐ |

---

## 4. UTM & Click ID Persistence Tests

### Test: UTM Parameters Persist Across Session

**Test Steps:**
1. Clear browser storage: `localStorage.clear(); sessionStorage.clear();`
2. Navigate to site with UTM params: `https://hairpinns.com/?utm_source=test&utm_medium=qr&utm_campaign=launch_qa&gclid=test_gclid`
3. Navigate to different pages (no UTMs in URL)
4. Submit any form
5. Check payload for UTM parameters

**Expected Outcome:**

| Field | Expected Value | Present? |
|-------|---------------|----------|
| `utm_source` | `test` | ☐ |
| `utm_medium` | `qr` | ☐ |
| `utm_campaign` | `launch_qa` | ☐ |
| `gclid` | `test_gclid` | ☐ |
| `first_utm_source` | `test` | ☐ |
| `first_utm_medium` | `qr` | ☐ |
| `first_utm_campaign` | `launch_qa` | ☐ |
| `first_gclid` | `test_gclid` | ☐ |

---

### Test: First-Touch vs Last-Touch Attribution

**Test Steps:**
1. **Clear storage:** `localStorage.clear(); sessionStorage.clear();`
2. **Visit 1 (First-Touch):**
   - Navigate to: `https://hairpinns.com/?utm_source=facebook&utm_medium=social&fbclid=fb123`
   - Do NOT submit any forms yet
3. **Visit 2 (Last-Touch) - New Session:**
   - Close browser
   - Reopen and navigate to: `https://hairpinns.com/?utm_source=google&utm_medium=cpc&gclid=gc456`
4. **Submit form**
5. **Check payload**

**Expected Outcome:**

| Field | Expected Value | Present? |
|-------|---------------|----------|
| **Last-Touch (Session)** | | |
| `utm_source` | `google` | ☐ |
| `utm_medium` | `cpc` | ☐ |
| `gclid` | `gc456` | ☐ |
| `fbclid` | `` (empty) | ☐ |
| **First-Touch (Lifetime)** | | |
| `first_utm_source` | `facebook` | ☐ |
| `first_utm_medium` | `social` | ☐ |
| `first_gclid` | `` (empty) | ☐ |
| `first_fbclid` | `fb123` | ☐ |

---

## 5. Error Handling Tests

### Test: Simulate 500 Error from Zapier → Retries Fire

**How to Simulate:**

Unfortunately, you cannot force Zapier to return a 500 error easily. Instead:

1. **Temporarily break the Zapier webhook URL:**
   - Open `src/lib/hpCapture.ts`
   - Change `ZAPIER_WEBHOOK_URL` to a broken URL (e.g., `https://hooks.zapier.com/hooks/catch/INVALID`)
2. **Submit a form**
3. **Watch browser console for retry attempts**

**Expected Console Logs:**

```
[hpCapture] Attempt 1 failed with error: ...
[hpCapture] Retrying in 1000ms...
[hpCapture] Attempt 2 failed with error: ...
[hpCapture] Retrying in 2000ms...
[hpCapture] Attempt 3 failed with error: ...
[hpCapture] All retry attempts failed
```

**Checklist:**

| Test | Expected Result | Verified? |
|------|--------|-----------|
| Attempt 1 fires immediately | Yes | ☐ |
| Attempt 2 fires after 1 second | Yes | ☐ |
| Attempt 3 fires after 2 more seconds | Yes | ☐ |
| Total retries = 3 | Yes | ☐ |
| Error logged to `window.__hpErrors` | Yes | ☐ |

---

### Test: User Messaging on Failure

**Test Steps:**
1. Keep broken webhook URL from previous test
2. Submit a form
3. Wait for all retries to fail
4. Observe UI

**Expected UI Behavior:**

| Element | Expected State | Verified? |
|---------|---------------|-----------|
| Submit button | Re-enabled (not stuck in loading) | ☐ |
| Error message displayed | "Sorry, something went wrong. Please try again or contact us directly." | ☐ |
| Retry button visible | "Try Again" button present | ☐ |
| Link to /contact visible | "Contact Us" link present | ☐ |

**Test Retry Button:**
1. Click "Try Again" button
2. Verify form resets to editable state
3. Verify form data is still populated
4. **Fix webhook URL** in `src/lib/hpCapture.ts`
5. Click "Try Again" again
6. Verify submission succeeds this time

**Checklist:**

| Test | Result | Verified? |
|------|--------|-----------|
| Error message displayed | Yes | ☐ |
| Retry button works | Yes | ☐ |
| Form data persists on retry | Yes | ☐ |
| Successful submission after fix | Yes | ☐ |

---

### Test: Error Logged to `window.__hpErrors`

**Test Steps:**
1. Trigger a failed submission (broken webhook URL)
2. Open browser console
3. Run: `console.table(window.__hpErrors)`

**Expected Log Entry:**

| Field | Expected Value | Present? |
|-------|---------------|----------|
| `timestamp` | ISO 8601 timestamp | ☐ |
| `error` | "Failed to submit after all retry attempts" | ☐ |
| `status_code` | (if available) | ☐ |
| `response_text` | (if available) | ☐ |
| `payload` | Full payload object | ☐ |

---

## 6. Shopify Webhook Tests

### Test: Order Webhook Received in Zapier

**Prerequisites:**
- Shopify store configured with webhooks pointing to Zapier
- See [SHOPIFY_WEBHOOKS_SETUP.md](./SHOPIFY_WEBHOOKS_SETUP.md) for setup

**Test Steps:**
1. Go to Shopify Admin → Orders
2. Create a test order (you can use Shopify's Bogus Gateway for testing)
3. Mark order as "Paid"
4. Go to Zapier Task History
5. Search for `event_name = "purchase_server"`

**Expected Zapier Payload:**

| Field | Expected | Present? |
|-------|----------|----------|
| `event_name` | `purchase_server` | ☐ |
| `order_id` | Shopify order ID | ☐ |
| `order_number` | Order number (e.g., #1001) | ☐ |
| `total` | Order total (e.g., 99.00) | ☐ |
| `subtotal` | Subtotal | ☐ |
| `currency` | `AUD` | ☐ |
| `email` | Customer email | ☐ |
| `first_name` | Customer first name | ☐ |
| `last_name` | Customer last name | ☐ |
| `phone` | Customer phone | ☐ |
| `line_items` | Array of products | ☐ |
| `order_status` | `paid` or `fulfilled` | ☐ |

---

### Test: GHL Contact Updated from Purchase Webhook

**Test Steps:**
1. Use test order from previous test
2. Go to GHL → Contacts
3. Search for customer email
4. Verify contact exists and is updated

**Expected GHL Actions:**

| Action | Expected Result | Verified? |
|--------|----------------|-----------|
| Contact created/updated | Contact exists with order email | ☐ |
| Tag applied | `purchaser` | ☐ |
| Custom field: `lifetime_value` | Order total (e.g., `99.00`) | ☐ |
| Custom field: `order_count` | `1` (or incremented) | ☐ |
| Custom field: `last_order_id` | Shopify order ID | ☐ |
| Custom field: `last_order_total` | Order total | ☐ |
| Custom field: `last_order_date` | Order date | ☐ |
| Custom field: `first_order_date` | Order date (if first order) | ☐ |
| Custom field: `average_order_value` | Calculated AOV | ☐ |
| Workflow started | "Post-Purchase Education" workflow | ☐ |
| Workflow started | "Re-Buy Cadence" workflow (delayed) | ☐ |

---

### Test: High-Value Order Alert

**Test Steps:**
1. Create a test order in Shopify with total **> $200**
2. Mark as "Paid"
3. Check Slack/Email for alert notification

**Expected Alert:**

| Field | Expected | Verified? |
|-------|----------|----------|
| Slack notification sent | Yes (to #orders channel or Jena DM) | ☐ |
| Alert contains order ID | Yes | ☐ |
| Alert contains customer name | Yes | ☐ |
| Alert contains order total | Yes | ☐ |
| Alert is marked urgent | Yes | ☐ |

---

## 7. Console Test Utility (`window.__hpTest`)

### Test: Console Utility Works for Each Form

**Test Steps:**
1. Open browser console
2. Run: `window.__hpTest('newsletter_footer')`
3. Check console output
4. Go to Zapier Task History
5. Verify test submission received

**Forms to Test:**

| Form Name | Command | Zapier Received? | Payload Correct? |
|-----------|---------|------------------|------------------|
| `newsletter_footer` | `window.__hpTest('newsletter_footer')` | ☐ | ☐ |
| `contact_page` | `window.__hpTest('contact_page')` | ☐ | ☐ |
| `consult_request` | `window.__hpTest('consult_request')` | ☐ | ☐ |
| `product_lead_magnet` | `window.__hpTest('product_lead_magnet')` | ☐ | ☐ |
| Default (no args) | `window.__hpTest()` | ☐ | ☐ |

**Expected Console Output:**

```
[hpCapture] Testing form submission: newsletter_footer
[hpCapture] Test payload: {
  form_name: "newsletter_footer",
  email: "test@hairpinns.com",
  first_name: "Test",
  phone: "0412345678",
  message: "This is a test submission from the console",
  consent_marketing: true
}
✅ [hpCapture] Test submission successful!
Check Zapier Task History to verify webhook received
```

---

## 8. End-to-End Integration Test

### Complete User Journey Test

**Scenario:** New visitor → Newsletter signup → Lead magnet download → Purchase

**Test Steps:**

1. **Clear all browser storage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **First Visit (Attribution):**
   - Navigate to: `https://hairpinns.com/?utm_source=instagram&utm_medium=story&utm_campaign=frizz_guide`
   - Browse site for 30+ seconds
   - Note `client_id` from console: `window.hpCapture.getSession().client_id`

3. **Newsletter Signup:**
   - Scroll to footer
   - Submit newsletter with email: `qa+journey@hairpinns.com`
   - Verify success message
   - **Check GHL:** Contact created with tag `newsletter`

4. **Lead Magnet Download:**
   - Navigate to a blog post with lead magnet
   - Submit lead magnet form with **same email**
   - Verify success message
   - **Check GHL:** Same contact updated with tag `lead_magnet_{slug}`

5. **Product Purchase:**
   - Add product to cart
   - Complete checkout in Shopify (use Bogus Gateway)
   - **Check Zapier:** `purchase_server` event received
   - **Check GHL:** Same contact updated with tag `purchaser`, LTV populated

**Final Verification:**

| Check | Expected Result | Verified? |
|-------|----------------|-----------|
| GHL contact count | **1 contact only** (no duplicates) | ☐ |
| Tags on contact | `newsletter`, `lead_magnet_{slug}`, `purchaser` | ☐ |
| `client_id` matches | Same `client_id` across all events | ☐ |
| `first_utm_source` | `instagram` | ☐ |
| `first_utm_medium` | `story` | ☐ |
| `first_utm_campaign` | `frizz_guide` | ☐ |
| LTV calculated | Order total | ☐ |
| Workflows triggered | Post-purchase, Re-buy | ☐ |

---

## 9. Cross-Browser & Device Testing

| Browser/Device | Newsletter | Lead Magnet | Contact | Consult | PDP Opt-In | Purchase |
|----------------|------------|-------------|---------|---------|-----------|----------|
| Chrome Desktop | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Safari Desktop | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Firefox Desktop | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Chrome Mobile | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Safari iOS | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Samsung Internet | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 10. Final Pre-Launch Checklist

### Configuration

| Item | Verified? |
|------|-----------|
| Zapier webhook URL is production URL (not test) | ☐ |
| `double_opt_in` setting is correct in `projectConfig.ts` | ☐ |
| GHL workspace is production (not sandbox) | ☐ |
| Shopify webhooks point to production Zapier | ☐ |
| All Zapier Zaps are **ON** (not paused) | ☐ |

### Data Integrity

| Item | Verified? |
|------|-----------|
| No test data in production GHL | ☐ |
| No test submissions in production Zapier history | ☐ |
| All test emails prefixed with `qa+` are removed/archived | ☐ |

### Monitoring

| Item | Verified? |
|------|-----------|
| Zapier Task History monitored for failures | ☐ |
| GHL inbox monitored for high-priority inquiries | ☐ |
| Slack alerts configured for high-value orders | ☐ |
| Error logging to `window.__hpErrors` documented for support team | ☐ |

### Performance

| Item | Verified? |
|------|-----------|
| Form submission time < 2 seconds | ☐ |
| No console errors on any page | ☐ |
| All images optimized and loading | ☐ |

---

## Summary

✅ **7 forms tested** (POST → 200 OK, payload keys, consent)  
✅ **6 Zapier workflows verified** (filters, GHL actions, tags, workflows)  
✅ **Deduplication tested** (same email, same day)  
✅ **Attribution tracking verified** (UTMs, click IDs, first-touch vs last-touch)  
✅ **Error handling tested** (retries, user messaging, logging)  
✅ **Shopify webhooks tested** (order received, GHL updated)  
✅ **Console test utility verified** (`window.__hpTest`)  
✅ **End-to-end journey tested** (visitor → lead → customer)

---

## Related Documentation

- [EVENT_TRACKING_TABLE.md](./EVENT_TRACKING_TABLE.md) - Complete event reference
- [FORM_IMPLEMENTATION_CHECKLIST.md](./FORM_IMPLEMENTATION_CHECKLIST.md) - Form architecture
- [FORM_ERROR_HANDLING.md](./FORM_ERROR_HANDLING.md) - Error states & logging
- [SHOPIFY_WEBHOOKS_SETUP.md](./SHOPIFY_WEBHOOKS_SETUP.md) - E-commerce setup
- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - Multi-touch attribution
- [ZAPIER_IMPLEMENTATION_SUMMARY.md](./ZAPIER_IMPLEMENTATION_SUMMARY.md) - Zapier architecture