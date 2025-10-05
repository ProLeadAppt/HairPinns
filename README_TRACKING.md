# Hair Pinns Tracking & Analytics

## Overview

The `hpCapture` utility provides comprehensive tracking and analytics for all forms and events on the Hair Pinns website. All data is sent to GoHighLevel via Zapier webhook.

## Configuration

**Zapier Webhook URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

This URL is configured as a project constant in `/src/lib/hpCapture.ts`.

## Features

### 1. Automatic Session Tracking
- **Client ID**: Unique UUIDv4 stored in localStorage for user identification
- **UTM Parameters**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- **Click IDs**: `gclid` (Google), `fbclid` (Facebook), `ttclid` (TikTok)
- **Referrer**: Original referrer URL

### 2. Form & Event Tracking
Every submission includes:
- `page_url`: Current page URL
- `form_name` or `event_name`: Identifier for the action
- `timestamp`: ISO 8601 timestamp
- All session data (client_id, UTMs, click IDs, referrer)
- Form-specific fields (name, email, phone, message, etc.)

### 3. Idempotency
Prevents duplicate submissions using `dedupe_key`:
- Generated via SHA-256 hash
- Format: `sha256(client_id + form_name + normalized_identifier + date)`
- Ensures same user submitting same form on same day = same dedupe_key

### 4. Retry Logic
- Automatic retry on failure: 3 attempts
- Exponential backoff: 1s → 3s → 10s
- Soft error handling: toast notification + error logging

### 5. Error Logging
Failed submissions are logged to `window.__hpErrors[]` for debugging:
```javascript
// Access error log in browser console
console.log(window.__hpErrors);
```

## Usage

### Basic Form Submission
```typescript
import { hpCapture } from '@/lib/hpCapture';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const success = await hpCapture.postToZapier(
    {
      form_name: "contact_form",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(02) 1234 5678",
      message: "I'd like to book an appointment"
    },
    { event: "contact_submission" }
  );
  
  if (success) {
    // Show success message
  } else {
    // Show error message
  }
};
```

### Custom Event Tracking
```typescript
import { hpCapture } from '@/lib/hpCapture';

// Track button click
await hpCapture.trackEvent('booking_button_click', {
  button_location: 'hero_section',
  button_text: 'Book Now'
});

// Track video play
await hpCapture.trackEvent('video_play', {
  video_id: 'tutorial_1',
  video_title: 'How to Care for Blonde Hair'
});
```

### Get Session Data
```typescript
import { hpCapture } from '@/lib/hpCapture';

const session = hpCapture.getSession();
console.log(session);
// {
//   client_id: "550e8400-e29b-41d4-a716-446655440000",
//   utm_source: "google",
//   utm_campaign: "spring_promo",
//   gclid: "abc123",
//   referrer: "https://google.com"
// }
```

## Integrated Forms

The following forms are already integrated:

1. **Blog Lead Magnet** (`blog_lead_magnet`)
   - Email subscription box in blog posts
   - Captures: email, phone (optional)

2. **SMS Opt-in** (`sms_optin`)
   - SMS subscription form on contact page
   - Captures: phone

3. **Contact Jena** (`contact_jena`)
   - Main contact form
   - Captures: name, email, phone, message

## Zapier Payload Structure

Every submission to Zapier includes:

```json
{
  "page_url": "https://hairpinns.com.au/contact",
  "form_name": "contact_form",
  "event_name": "contact_submission",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "spring_promo",
  "utm_content": "ad_variant_a",
  "utm_term": "hair_salon_bangor",
  "gclid": "abc123xyz",
  "fbclid": null,
  "ttclid": null,
  "referrer": "https://google.com/search?q=hair+salon+bangor",
  "dedupe_key": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(02) 1234 5678",
  "message": "I'd like to book an appointment"
}
```

## Debugging

### Check Session Data
```javascript
// In browser console
const { hpCapture } = await import('/src/lib/hpCapture.ts');
console.log(hpCapture.getSession());
```

### View Error Log
```javascript
// In browser console
console.log(window.__hpErrors);
```

### Test Webhook
```javascript
// In browser console
const { hpCapture } = await import('/src/lib/hpCapture.ts');
await hpCapture.trackEvent('test_event', { test: true });
```

## Best Practices

1. **Always use `async/await`** when calling `hpCapture.postToZapier()`
2. **Handle failure gracefully** with user-friendly error messages
3. **Include form_name** for all form submissions
4. **Include event_name** for custom events
5. **Use meaningful identifiers** for dedupe_key generation (email or phone)

## Performance

- Session data cached in `sessionStorage` (per-session persistence)
- Client ID cached in `localStorage` (permanent persistence)
- Lazy imports used in components to reduce initial bundle size
- Retry logic includes exponential backoff to avoid hammering the server

## Privacy & Compliance

- No personally identifiable information (PII) is stored in localStorage except client_id
- UTM and click ID parameters are stored only for the session duration
- Users can opt out of SMS by replying "STOP" to any message
- Email subscribers can unsubscribe via link in emails
