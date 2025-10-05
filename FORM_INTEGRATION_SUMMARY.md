# Form Integration Summary

All forms across the Hair Pinns site use the standardized `hpCapture.postToZapier()` integration pattern.

## Integration Pattern

Every form follows this structure:

```typescript
const success = await hpCapture.postToZapier(
  {
    form_name: "unique_form_identifier",
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    phone: formData.phone,
    consent_marketing: formData.consent,
    // Additional form-specific fields...
  },
  { event: "event_name" }
);
```

## Hidden Fields (Auto-Populated)

The `hpCapture.postToZapier()` function **automatically** adds these hidden fields to every submission:

### Context Fields
- `source_page` - Full URL where form was submitted
- `timestamp` - ISO 8601 timestamp
- `client_id` - Unique visitor ID (persists across sessions)
- `dedupe_key` - SHA-256 hash for deduplication (format: `client_id|form_name|identifier|date`)
- `referrer` - Last-touch referrer
- `last_seen_page` - Previous page URL
- `seconds_on_page` - Time spent on previous page

### Session Data (Last-Touch Attribution)
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid` (Google Click ID)
- `fbclid` (Facebook Click ID)
- `ttclid` (TikTok Click ID)

### First-Touch Attribution (Lifetime)
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

### GDPR/Consent
- `gdpr_region_detected` (from `projectConfig.gdpr_region`)
- `timestamp_consent` (timestamp when marketing consent given)
- `double_opt_in` (from `projectConfig.double_opt_in`)

## Form Inventory

### 1. Newsletter Form
**Component**: `src/components/forms/NewsletterForm.tsx`

**Form Name**: `newsletter_footer` (configurable)

**Event Name**: `newsletter_subscription`

**Fields**:
- `first_name` (optional)
- `email` (required)
- `phone` (optional)
- `consent_marketing` (required)

**Success State**: "Thanks! Check your inbox shortly."

**Usage Locations**:
- Footer (site-wide)
- Blog sidebar (optional)

---

### 2. Contact Form
**Component**: `src/components/forms/ContactForm.tsx`

**Form Name**: `contact_page` (configurable)

**Event Name**: `contact_submission`

**Fields**:
- `name` (required) - auto-split into `first_name` / `last_name`
- `email` (required)
- `phone` (optional)
- `topic` (required if `showTopic=true`)
- `topic_label` (human-readable topic)
- `message` (required)
- `consent_marketing` (required)

**Success State**: "Message Received! We'll get back to you within 24 hours."

**Usage Locations**:
- `/contact` page

---

### 3. Consult Request Form
**Component**: `src/components/forms/ConsultMiniForm.tsx`

**Form Name**: `consult_request`

**Event Name**: `consult_request`

**Fields**:
- `name` (required) - auto-split into `first_name` / `last_name`
- `email` (required)
- `phone` (required)
- `preferred_time` (required)
- `preferred_time_label` (human-readable time slot)
- `consent_marketing` (required)

**Success State**: "Thanks—link sent, or book on Fresha now."

**Post-Submit Action**: Opens Fresha booking link in new tab

**Usage Locations**:
- `/services` page
- Home page (optional)

---

### 4. Lead Magnet Form
**Component**: `src/components/forms/LeadMagnetForm.tsx`

**Form Name**: Configurable (e.g., `lead_magnet_frizz7`)

**Event Name**: `lead_magnet_download`

**Fields**:
- `first_name` (optional)
- `email` (required)
- `phone` (optional)
- `lead_magnet_title` (e.g., "7-Day Frizz-Free Plan")
- `lead_magnet_slug` (e.g., "frizz7")
- `consent_marketing` (required)

**Success State**: "Sent! Watch your email/SMS."

**Usage Locations**:
- Blog posts (inline modules)
- Lead magnet landing pages

---

### 5. Exit-Intent Modal
**Component**: `src/components/conversion/ExitIntentModal.tsx`

**Form Name**: `exit_intent_offer`

**Event Names**:
- `exit_intent_seen` (when modal appears)
- `exit_intent_submitted` (when form submitted)

**Fields**:
- `email` (required)
- `phone` (required)
- `lead_magnet_title` - "7-Day Frizz-Free Plan + 5% off"
- `lead_magnet_slug` - "exit_intent_frizz7"
- `consent_marketing` (implicit: true)

**Success State**: "Check your email for your 7-Day Plan and discount code."

**Usage Locations**:
- Product Detail Pages (PDP)
- Collection pages

---

### 6. Product Lead Capture (PDP)
**Location**: `src/pages/ProductDetail.tsx` (inline form)

**Form Name**: `product_lead_magnet`

**Event Name**: `product_lead_capture`

**Fields**:
- `email` (required)
- `product_handle` (e.g., "hydrate-restore-pack")
- `product_title` (e.g., "Hydrate & Restore Pack")
- `product_id` (if available)
- `price` (product price)
- `currency` - "AUD"
- `lead_magnet_title` - "7-Day Frizz-Free Plan"
- `lead_magnet_slug` - "frizz7_pdp"
- `consent_marketing` (implicit: true)

**Success State**: "Success! Check your inbox. We've sent you Jena's 7-Day Frizz-Free Plan."

**Usage Locations**:
- All Product Detail Pages (below Add to Cart section)

---

## Success & Error Handling

### Success States
All forms display:
- ✅ Success icon (CheckCircle2)
- Custom success message
- Option to submit again or navigate

### Error States
All forms include:
- ❌ Error icon (AlertCircle)
- User-friendly error message
- "Try Again" button (resets form)
- Fallback: "Contact Us" link or phone number
- Error logging to `window.__hpErrors[]` for debugging

### Retry/Backoff Logic
Built into `hpCapture.postToZapier()`:

```typescript
const backoffDelays = [1000, 3000, 10000]; // 1s, 3s, 10s

for (let attempt = 0; attempt < 3; attempt++) {
  try {
    const response = await fetch(ZAPIER_CATCH_HOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload),
    });
    
    if (response.ok) return true;
    
    // Wait before retry (except last attempt)
    if (attempt < 2) {
      await sleep(backoffDelays[attempt]);
    }
  } catch (error) {
    // Log and retry
  }
}

return false; // All attempts failed
```

**Retry Attempts**: 3 total attempts
**Backoff Strategy**: Exponential (1s → 3s → 10s)
**Error Logging**: All failures logged to `window.__hpErrors[]`

---

## Payload Structure

Every submission to Zapier follows this nested structure:

```json
{
  "contact": {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "+61412345678"
  },
  "context": {
    "form_name": "newsletter_footer",
    "event_name": "newsletter_subscription",
    "source_page": "https://hairpinns.com/blog/frizz-guide",
    "referrer": "https://google.com/search?q=frizz+hair",
    "timestamp": "2025-10-15T14:32:18.123Z",
    "client_id": "a1b2c3d4-e5f6-4a89-b0c1-d2e3f4a5b6c7",
    "dedupe_key": "7f8e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
    "last_seen_page": "https://hairpinns.com/blog",
    "seconds_on_page": 47
  },
  "consent": {
    "marketing": true,
    "gdpr_region_detected": false,
    "timestamp_consent": "2025-10-15T14:32:18.123Z",
    "double_opt_in": false
  },
  "session": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "spring_sale",
    "utm_content": "video_ad_1",
    "utm_term": "frizzy_hair_treatment",
    "gclid": "",
    "fbclid": "IwAR3abc123xyz",
    "ttclid": ""
  },
  "first_touch": {
    "first_utm_source": "google",
    "first_utm_medium": "organic",
    "first_utm_campaign": "",
    "first_utm_content": "",
    "first_utm_term": "",
    "first_gclid": "",
    "first_fbclid": "",
    "first_ttclid": "",
    "first_referrer": "https://google.com/search?q=hair+salon+bangor",
    "first_landing_page": "https://hairpinns.com/",
    "first_seen_timestamp": "2025-10-12T09:15:42.000Z"
  },
  "lead_magnet": {
    "title": "7-Day Frizz-Free Plan",
    "slug": "frizz7"
  }
}
```

---

## Zapier Endpoint

**URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

**Method**: POST

**Content-Type**: application/json

**CORS**: Enabled

---

## Debugging Failed Submissions

### Check Error Log
All failed submissions are logged to `window.__hpErrors`:

```javascript
// Open browser console
console.log(window.__hpErrors);
```

**Error Log Structure**:
```json
{
  "timestamp": "2025-10-15T14:32:18.123Z",
  "error": "HTTP 400 on attempt 3",
  "status_code": 400,
  "response_text": "Bad Request",
  "payload": { /* full payload that failed */ }
}
```

### Common Issues

1. **Network Error / CORS**
   - User's network blocks Zapier webhook
   - Corporate firewall blocking external POST requests
   - **Solution**: Retry logic will attempt 3 times

2. **Validation Error (400)**
   - Missing required field
   - Invalid email format
   - **Solution**: Check payload structure

3. **Zapier Webhook Disabled (403/404)**
   - Webhook URL changed or disabled
   - **Solution**: Update `ZAPIER_CATCH_HOOK_URL` in `hpCapture.ts`

4. **Rate Limiting (429)**
   - Too many requests to Zapier
   - **Solution**: Zapier will queue excess requests

---

## Testing Forms

### Test Checklist

For each form, verify:

- [ ] Form submits successfully with valid data
- [ ] Success state displays correct message
- [ ] Error state displays when network fails
- [ ] Retry logic attempts 3 times before showing error
- [ ] Hidden fields populate correctly (check Zapier history)
- [ ] UTM parameters captured correctly
- [ ] Consent checkbox required before submit
- [ ] Client ID persists across sessions
- [ ] Dedupe key generated correctly
- [ ] Form resets after successful submission (if applicable)

### Test with Invalid Data

- Submit without consent → Should show "Consent Required" error
- Submit without required fields → Should show validation error
- Submit with invalid email → Should show "Invalid email" error
- Simulate network failure → Should retry 3 times, then show error state

---

## GHL Integration

Once submissions reach Zapier, they are mapped to GoHighLevel (GHL) fields using the mapping defined in `GHL_FIELD_MAPPING.md`.

**Key Mappings**:
- `contact.email` → GHL Contact Email
- `contact.phone` → GHL Contact Phone
- `contact.first_name` → GHL First Name
- `contact.last_name` → GHL Last Name
- `context.form_name` → GHL Custom Field "Lead Source"
- `session.utm_source` → GHL Custom Field "Last UTM Source"
- `first_touch.first_utm_source` → GHL Custom Field "First UTM Source"

**Tags Applied** (based on `form_name`):
- `newsletter_footer` → Tag: "Newsletter Subscriber"
- `consult_request` → Tag: "Consult Lead"
- `lead_magnet_*` → Tag: "Lead Magnet - [Title]"
- `exit_intent_offer` → Tag: "Exit Intent 5% Off"
- `contact_page` → Tag: "Contact Form"
- `product_lead_magnet` → Tag: "Product Lead - [Product]"

---

## Performance

### Submission Speed
- **Average**: 300-500ms (successful submission)
- **With Retries**: Up to 15 seconds (3 attempts with backoff)
- **Non-Blocking**: Form submission doesn't block UI

### Optimization
- Forms use dynamic imports: `const { hpCapture } = await import("@/lib/hpCapture")`
- Zapier calls run in background (non-blocking)
- User sees immediate feedback (loading state)

---

## Security

### Honeypot Protection
All forms include a hidden `company` field:
- Legitimate users never fill this field
- Bots often auto-fill all fields
- If `company` field is filled → submission silently rejected

### Rate Limiting
- Client-side: None (relies on Zapier rate limits)
- Zapier: 100 requests/minute (Starter plan)
- GHL: API rate limits apply

### Data Privacy
- PII (email, phone) only sent to Zapier on form submit
- Event tracking (`hpCapture.trackEvent`) excludes PII
- All tracking respects GDPR consent
- Privacy Policy linked on all forms

---

## Maintenance

### When Adding New Forms

1. Use existing form component as template
2. Define unique `form_name` (e.g., "new_form_name")
3. Define unique `event` name (e.g., "new_event_name")
4. Include all required fields: `email`, `consent_marketing`
5. Add success/error states with user-friendly messages
6. Update this document with new form details
7. Update `GHL_FIELD_MAPPING.md` if new fields added
8. Test with real data and verify in Zapier history

### When Debugging Issues

1. Check browser console for errors
2. Check `window.__hpErrors` for failed submissions
3. Check Zapier webhook history for received data
4. Check GHL for contact creation/updates
5. Verify all hidden fields populated correctly
6. Test with different UTM parameters

---

## Related Documentation

- `GHL_FIELD_MAPPING.md` - Field mapping to GoHighLevel
- `ZAPIER_IMPLEMENTATION_SUMMARY.md` - Zapier integration overview
- `CONVERSION_PATTERNS.md` - Exit-intent and conversion features
- `hpCapture.ts` - Core tracking and submission library
