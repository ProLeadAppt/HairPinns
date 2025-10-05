# Form Error Handling & QA Logging

## Overview

All forms now have consistent, robust error handling with visual feedback, retry mechanisms, and detailed logging for QA troubleshooting.

---

## User Experience Flow

### Loading State (During Submission)
- Submit button **disabled** to prevent double-submission
- **Spinner icon** shown with loading text
- Example: `"Subscribing..."`, `"Sending..."`, `"Processing..."`

### Success State
- **Persistent**: Success message stays visible until user navigates away or explicitly resets
- **Clear confirmation**: Large checkmark icon with success message
- **Next steps**: Clear call-to-action buttons
- **Does NOT auto-reset**: Form data is cleared but success state remains

### Error State
- **Clear messaging**: "Submission Failed" with user-friendly explanation
- **Retry button**: One-click to try again with same data
- **Contact fallback**: Link to `/contact` or phone number
- **Persistent until action**: Error state stays until user clicks retry or contact

---

## Forms Updated

All forms now follow this pattern:

1. **NewsletterForm** (`src/components/forms/NewsletterForm.tsx`)
2. **LeadMagnetForm** (`src/components/forms/LeadMagnetForm.tsx`)
3. **ContactForm** (`src/components/forms/ContactForm.tsx`)
4. **ConsultMiniForm** (`src/components/forms/ConsultMiniForm.tsx`)

---

## Technical Implementation

### State Management

Each form now has three states:

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [hasError, setHasError] = useState(false);
```

**State Flow:**
1. User clicks submit → `isSubmitting = true`
2. API call completes:
   - Success → `isSuccess = true`
   - Failure → `hasError = true`
3. Both set `isSubmitting = false`

### Conditional Rendering

Forms render in this order:

```tsx
// 1. Error state (highest priority)
if (hasError) {
  return <ErrorDisplay />;
}

// 2. Success state
if (isSuccess) {
  return <SuccessDisplay />;
}

// 3. Default form
return <FormInputs />;
```

---

## Error Logging to `window.__hpErrors`

### What Gets Logged

All submission failures are automatically logged to `window.__hpErrors` array for QA debugging.

**Log Entry Structure:**
```typescript
{
  timestamp: "2025-10-05T15:30:00Z",
  error: "HTTP 500 on attempt 1" | "Network error on attempt 1",
  status_code?: 500,           // HTTP status code (if available)
  response_text?: "...",       // Raw response text from server
  payload: {                   // Full payload that was sent
    form_name: "newsletter_footer",
    email: "user@example.com",
    // ... all other fields
  }
}
```

### How to Access Logs (QA/Debugging)

**In Browser Console:**
```javascript
// View all errors
console.table(window.__hpErrors)

// View most recent error
window.__hpErrors[window.__hpErrors.length - 1]

// Export to JSON for bug report
JSON.stringify(window.__hpErrors, null, 2)

// Clear logs
window.__hpErrors = []
```

**What Gets Logged:**
- ✅ HTTP status codes (500, 429, 503, etc.)
- ✅ Response text from Zapier
- ✅ Full payload sent (with sanitized data)
- ✅ Timestamp of each failure
- ✅ Retry attempt number
- ✅ Network/fetch errors (CORS, timeout, etc.)

**What Does NOT Get Logged:**
- ❌ Honeypot rejections (silently rejected)
- ❌ Client-side validation errors (no API call made)

---

## Error Messages

### User-Facing Messages

#### Network/API Failure
```
Title: Submission Failed
Message: We couldn't process your [subscription/request/message]. 
         This might be a temporary network issue.
Actions: [Try Again] [Contact Us]
```

#### Validation Error (Pre-submission)
```
Title: Consent Required
Message: Please agree to receive updates to continue.
```

```
Title: Topic Required  
Message: Please select what you need help with.
```

### Console Logging

All forms log to console for developer visibility:

```javascript
console.error("Newsletter form error:", error);
// Automatically logs to window.__hpErrors as well
```

---

## Retry Logic

### Built-in Retry (hpCapture.ts)

The `hpCapture.postToZapier()` function already includes exponential backoff retry:

- **Attempt 1:** Immediate
- **Attempt 2:** Wait 1 second
- **Attempt 3:** Wait 3 seconds
- **Attempt 4:** Wait 10 seconds (if retryAttempts = 4)

**Default:** 3 retry attempts total

If all retries fail → returns `false` → form shows error state

### User-Initiated Retry

After seeing error state, user can click **"Try Again"** button:

- Form resets to default view
- Keeps existing form data (pre-filled)
- User can edit and resubmit
- New retry cycle begins (another 3 automatic attempts)

---

## Success State Behavior

### Newsletter & Lead Magnet Forms

**Success View:**
- Shows large checkmark icon
- Confirms action completed
- **Stays visible until user navigates away**

**User Actions:**
- Navigate to another page → success state persists on original page
- Refresh page → success state cleared (expected)
- Return to page via back button → success state still visible (until refresh)

### Contact & Consult Forms

**Success View:**
- Shows confirmation message
- Provides **"Send Another Message"** button

**User Actions:**
- Click "Send Another" → resets to empty form (but stays on success view until new submission)
- Navigate away → success state cleared on return

---

## Testing Checklist

### Happy Path
- [ ] Form submits successfully
- [ ] Submit button shows spinner during submission
- [ ] Submit button is disabled while submitting
- [ ] Success state appears after submission
- [ ] Success state persists on page (doesn't auto-clear)
- [ ] User can navigate away and back (success still visible)

### Error Handling
- [ ] Simulate network failure (DevTools → Network → Offline)
- [ ] Error state appears with clear message
- [ ] "Try Again" button is present and clickable
- [ ] Contact link/phone number is present
- [ ] Click "Try Again" → form reappears with data intact
- [ ] Resubmit → new attempt with retry logic

### QA Logging
- [ ] Open browser console
- [ ] Trigger an error (e.g., network offline)
- [ ] Check `window.__hpErrors` has new entry
- [ ] Verify entry contains:
  - [ ] `timestamp`
  - [ ] `error` message
  - [ ] `payload` with form data
  - [ ] `status_code` (if HTTP error)
  - [ ] `response_text` (if available)

### Edge Cases
- [ ] Submit form twice rapidly → only one submission (button disabled)
- [ ] Close tab during submission → no orphaned state
- [ ] Submit with consent unchecked → shows validation error (not API error)

---

## Common QA Scenarios

### Scenario 1: Zapier Hook Down (HTTP 500)
**Logged to `window.__hpErrors`:**
```json
{
  "timestamp": "2025-10-05T15:30:00Z",
  "error": "HTTP 500 on attempt 1",
  "status_code": 500,
  "response_text": "Internal Server Error",
  "payload": { "form_name": "newsletter_footer", "email": "user@example.com" }
}
```

**User Sees:**
- Error state with "Try Again" and "Contact Us" buttons

**QA Action:**
- Check Zapier task history for failed tasks
- Verify retry attempts logged (3 entries in `__hpErrors`)

---

### Scenario 2: CORS / Network Timeout
**Logged to `window.__hpErrors`:**
```json
{
  "timestamp": "2025-10-05T15:30:00Z",
  "error": "Network error on attempt 1: TypeError: Failed to fetch",
  "payload": { "form_name": "contact_page", "email": "user@example.com" }
}
```

**User Sees:**
- Error state with "This might be a temporary network issue"

**QA Action:**
- Check user's network connection
- Verify no browser extensions blocking requests
- Check if Zapier webhook URL is correct

---

### Scenario 3: Honeypot Triggered (Bot)
**Logged to `window.__hpErrors`:**
```json
{
  "timestamp": "2025-10-05T15:30:00Z",
  "error": "Honeypot field filled - potential bot",
  "payload": { "company": "[REDACTED]" }
}
```

**User Sees:**
- Success state (fake success to not alert bot)

**QA Action:**
- Verify submission did NOT reach Zapier
- Check that only bots fill honeypot field

---

## Future Enhancements

### Potential Additions
1. **Rate Limiting UI:**
   - Detect HTTP 429 (Too Many Requests)
   - Show specific message: "You've submitted too many forms. Please try again in 5 minutes."

2. **Offline Detection:**
   - Check `navigator.onLine` before submission
   - Show warning: "You appear to be offline. Please check your connection."

3. **Error Analytics:**
   - Send `window.__hpErrors` to analytics on page unload
   - Track error rates by form type

4. **Progressive Enhancement:**
   - Save form data to localStorage during typing
   - Auto-recover form data after error/refresh

---

## Related Documentation

- [hpCapture.ts](./src/lib/hpCapture.ts) - Core tracking & submission logic
- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - Session & attribution data
- [DOUBLE_OPT_IN.md](./DOUBLE_OPT_IN.md) - Email confirmation workflow
- [ZAPIER_CONTACT_FORM.md](./ZAPIER_CONTACT_FORM.md) - Contact form Zapier setup

---

## Summary

✅ All forms have consistent loading, success, and error states  
✅ Submit buttons disabled during submission with spinner  
✅ Success states persist until user navigates away  
✅ Error states show retry and contact options  
✅ All failures logged to `window.__hpErrors` with detailed info  
✅ QA can access logs in browser console for debugging
