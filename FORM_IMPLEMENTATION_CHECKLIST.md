# Form Implementation Checklist

## Overview

All forms in the Hair Pinns project follow a Zapier-first architecture. Every form submission goes through `hpCapture.postToZapier()` which automatically enriches the payload with hidden tracking fields.

---

## Required Architecture

### ✅ All Forms Must Use hpCapture

**Correct Implementation:**
```typescript
const { hpCapture } = await import("@/lib/hpCapture");

const success = await hpCapture.postToZapier(
  {
    form_name: "newsletter_footer",
    email: formData.email,
    first_name: formData.first_name,
    consent_marketing: formData.consent,
  },
  { event: "newsletter_subscription" }
);
```

**❌ NEVER do this:**
```typescript
// Direct GHL webhook - DO NOT USE
await fetch("https://services.leadconnectorhq.com/hooks/...", {
  method: "POST",
  mode: "no-cors",
  body: JSON.stringify({ email: "..." })
});
```

---

## Forms Inventory

| Component | Location | Form Name | Event Name | Status |
|-----------|----------|-----------|------------|--------|
| **NewsletterForm** | `src/components/forms/NewsletterForm.tsx` | `newsletter_footer` | `newsletter_subscription` | ✅ Zapier |
| **LeadMagnetForm** | `src/components/forms/LeadMagnetForm.tsx` | Dynamic (passed as prop) | `lead_magnet_download` | ✅ Zapier |
| **ContactForm** | `src/components/forms/ContactForm.tsx` | `contact_page` | `contact_submission` | ✅ Zapier |
| **ConsultMiniForm** | `src/components/forms/ConsultMiniForm.tsx` | `consult_request` | `consult_request` | ✅ Zapier |
| **ProductDetail Lead Capture** | `src/pages/ProductDetail.tsx` | `product_lead_magnet` | `product_lead_capture` | ✅ Zapier |

---

## Hidden Fields (Auto-Included)

These fields are **automatically added** by `hpCapture.postToZapier()`:

### Core Identifiers
- `client_id` - Unique browser UUID (persists in localStorage)
- `timestamp` - ISO 8601 timestamp of submission
- `page_url` - Full URL where form was submitted
- `referrer` - HTTP referrer (or "(direct)")

### Last-Touch Attribution (Session)
- `utm_source` - Last-touch campaign source
- `utm_medium` - Last-touch campaign medium
- `utm_campaign` - Last-touch campaign name
- `utm_content` - Last-touch campaign content
- `utm_term` - Last-touch campaign term
- `gclid` - Google Ads click ID (last-touch)
- `fbclid` - Facebook click ID (last-touch)
- `ttclid` - TikTok click ID (last-touch)

### First-Touch Attribution (Lifetime)
- `first_utm_source` - First-touch campaign source
- `first_utm_medium` - First-touch campaign medium
- `first_utm_campaign` - First-touch campaign name
- `first_utm_content` - First-touch campaign content
- `first_utm_term` - First-touch campaign term
- `first_gclid` - Google Ads click ID (first-touch)
- `first_fbclid` - Facebook click ID (first-touch)
- `first_ttclid` - TikTok click ID (first-touch)
- `first_referrer` - Referrer on first visit
- `first_landing_page` - Landing page URL on first visit
- `first_seen_timestamp` - Timestamp of first visit

### Page Tracking
- `last_seen_page` - URL of page where form was submitted
- `seconds_on_page` - Time spent on previous page (if available)

### Deduplication
- `dedupe_key` - SHA-256 hash of `client_id|form_name|email|date`

### GDPR Compliance
- `gdpr_region_detected` - Detected region (default: "AU")
- `timestamp_consent` - ISO timestamp when consent was given
- `double_opt_in` - Boolean flag from project config

---

## Form Name Conventions

Follow this naming pattern:

**Pattern:** `{placement}_{type}`

**Examples:**
- `newsletter_footer` - Newsletter signup in footer
- `newsletter_popup` - Newsletter popup modal
- `contact_page` - Contact form on contact page
- `consult_request` - Free consultation request
- `product_lead_magnet` - Lead magnet on product detail page
- `checkout_newsletter` - Newsletter opt-in at checkout

**Why This Matters:**
- Zapier can route different forms to different workflows
- Analytics can track conversion rates by form placement
- `dedupe_key` prevents duplicate submissions per form

---

## Event Name Conventions

Follow this naming pattern:

**Pattern:** `{action}_{object}`

**Examples:**
- `newsletter_subscription` - User subscribed to newsletter
- `lead_magnet_download` - User requested a lead magnet
- `contact_submission` - User submitted contact form
- `consult_request` - User requested a consultation
- `product_lead_capture` - User opted in on product page
- `email_confirmed` - User confirmed email (double opt-in)
- `faq_feedback` - User rated FAQ helpfulness
- `purchase_client` - Client-side order confirmation

**Why This Matters:**
- Event names are indexed in analytics
- Zapier filters use event names for routing
- Makes debugging easier in Zapier Task History

---

## Testing a Form (Console Utility)

### Run Test Submission

Open browser console and run:

```javascript
// Test default form
window.__hpTest()

// Test specific form
window.__hpTest('newsletter_footer')
window.__hpTest('contact_page')
window.__hpTest('product_lead_magnet')
```

### What It Does

1. Creates a test payload with dummy data
2. Logs payload to console
3. Calls `hpCapture.postToZapier()` with test data
4. Shows success/failure in console
5. Directs you to check Zapier Task History

### Example Output

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

### What to Verify in Zapier

1. Go to Zapier Task History
2. Find the task with `form_name: "newsletter_footer"` (or your test form)
3. Verify payload contains:
   - ✅ All custom fields you passed
   - ✅ Hidden fields (client_id, timestamp, utm_*, etc.)
   - ✅ First-touch attribution data
   - ✅ Last-touch attribution data
   - ✅ Page tracking data

---

## Adding a New Form

### Step 1: Create Form Component

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const MyNewForm = () => {
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { hpCapture } = await import("@/lib/hpCapture");
      
      const success = await hpCapture.postToZapier(
        {
          form_name: "my_new_form",      // ← Define your form name
          email: formData.email,
          name: formData.name,
          consent_marketing: true,
        },
        { event: "my_new_submission" }   // ← Define your event name
      );

      if (success) {
        toast({ title: "Success!", description: "Thank you!" });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};
```

### Step 2: Test in Console

```javascript
window.__hpTest('my_new_form')
```

### Step 3: Create Zapier Workflow

1. **Trigger:** Webhooks by Zapier - Catch Hook
2. **Filter:** `form_name = "my_new_form"`
3. **Actions:** Your workflow steps (GHL, Sheets, etc.)

### Step 4: Document

Add entry to this checklist with form details.

---

## Common Mistakes

### ❌ Mistake 1: Direct API Calls
```typescript
// DON'T DO THIS
await fetch("https://services.leadconnectorhq.com/...", {
  method: "POST",
  body: JSON.stringify({ email: "..." })
});
```

**Fix:** Always use `hpCapture.postToZapier()`

---

### ❌ Mistake 2: Missing form_name
```typescript
// DON'T DO THIS
await hpCapture.postToZapier(
  { email: "test@example.com" },
  { event: "newsletter_subscription" }
);
```

**Fix:** Always include `form_name`
```typescript
await hpCapture.postToZapier(
  { 
    form_name: "newsletter_footer",  // ← Required
    email: "test@example.com" 
  },
  { event: "newsletter_subscription" }
);
```

---

### ❌ Mistake 3: Using mode: "no-cors"
```typescript
// DON'T DO THIS
await fetch(ZAPIER_URL, {
  method: "POST",
  mode: "no-cors",  // ← This prevents error handling
  body: JSON.stringify({...})
});
```

**Fix:** Let `hpCapture` handle CORS properly
- Zapier webhooks support CORS by default
- If using custom endpoints, set proper CORS headers
- Don't use `no-cors` mode (it hides errors)

---

### ❌ Mistake 4: Not Testing
```typescript
// You built a new form but didn't test it
```

**Fix:** Always test with console utility
```javascript
window.__hpTest('your_form_name')
```

---

## Zapier Webhook URL

All forms post to this single webhook:

```
https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/
```

**Important:**
- This URL is defined in `src/lib/hpCapture.ts`
- All forms use the SAME webhook URL
- Zapier routes by `form_name` and `event_name` using Filters
- This allows centralized tracking and easier debugging

---

## Payload Structure Reference

### Example Full Payload (Auto-Generated)

```json
{
  // Custom fields (you provide these)
  "form_name": "newsletter_footer",
  "email": "user@example.com",
  "first_name": "Jane",
  "consent_marketing": true,
  
  // Auto-added by hpCapture
  "client_id": "abc-123-def-456",
  "timestamp": "2025-10-05T15:30:00Z",
  "page_url": "https://hairpinns.com/",
  "referrer": "https://google.com",
  "event_name": "newsletter_subscription",
  
  // Last-touch attribution (current session)
  "utms": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "hair_services_q4",
    "utm_content": "ad_variant_a",
    "utm_term": "hair salon sydney"
  },
  "click_ids": {
    "gclid": "abc123def456",
    "fbclid": "",
    "ttclid": ""
  },
  
  // First-touch attribution (lifetime)
  "first_touch": {
    "first_utm_source": "facebook",
    "first_utm_medium": "social",
    "first_utm_campaign": "brand_awareness_sept",
    "first_utm_content": "",
    "first_utm_term": "",
    "first_referrer": "https://facebook.com",
    "first_landing_page": "https://hairpinns.com/services",
    "first_seen_timestamp": "2025-09-15T10:20:00Z"
  },
  "first_touch_click_ids": {
    "first_gclid": "",
    "first_fbclid": "xyz789",
    "first_ttclid": ""
  },
  
  // Page tracking
  "last_seen_page": "https://hairpinns.com/",
  "seconds_on_page": 45,
  
  // GDPR & Config
  "gdpr_region_detected": "AU",
  "timestamp_consent": "2025-10-05T15:30:00Z",
  "double_opt_in": true,
  
  // Deduplication
  "dedupe_key": "a1b2c3d4e5f6..."
}
```

---

## Related Documentation

- [hpCapture.ts](./src/lib/hpCapture.ts) - Core tracking library
- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - Multi-touch attribution
- [FORM_ERROR_HANDLING.md](./FORM_ERROR_HANDLING.md) - Error states & logging
- [DOUBLE_OPT_IN.md](./DOUBLE_OPT_IN.md) - Email confirmation workflow

---

## Summary Checklist

### For QA/Testing
- [ ] All forms POST to Zapier webhook (not direct GHL)
- [ ] All forms include `form_name` field
- [ ] All forms include `event_name` in options
- [ ] Test each form with `window.__hpTest('form_name')`
- [ ] Verify hidden fields appear in Zapier Task History
- [ ] Check `window.__hpErrors` for any logged failures

### For Developers
- [ ] Never use direct API calls to GHL
- [ ] Always import and use `hpCapture.postToZapier()`
- [ ] Always include `form_name` and `event` parameters
- [ ] Test new forms with console utility before deploying
- [ ] Document new forms in this checklist
