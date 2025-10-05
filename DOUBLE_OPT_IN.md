# Double Opt-In Configuration & Zapier Workflow

## Overview

Double opt-in ensures that contacts explicitly confirm their subscription before receiving marketing communications. This improves email deliverability, reduces spam complaints, and ensures GDPR/CASL compliance.

## Configuration

The double opt-in feature is controlled by a project-level config flag in `src/config/projectConfig.ts`:

```typescript
export const projectConfig = {
  double_opt_in: true,  // Set to false to disable
};
```

When `double_opt_in = true`, all form submissions automatically include this flag in their Zapier payload.

---

## How It Works

### 1. Form Submission
When a user submits any form (newsletter, contact, consult, lead magnet):

**Payload includes:**
```json
{
  "form_name": "newsletter_footer",
  "email": "user@example.com",
  "first_name": "Jane",
  "consent_marketing": true,
  "double_opt_in": true,
  "client_id": "abc-123",
  "timestamp": "2025-10-05T12:34:56Z",
  // ... other fields
}
```

### 2. Zapier Path A: Initial Contact Creation
**Trigger:** Catch Hook receives form submission with `double_opt_in = true`

**Actions:**
1. **Create/Update Contact in GHL**
   - Map fields: email, first name, phone, etc.
   - Store `client_id` in custom field for tracking
   - Store `first_utm_source`, `first_utm_campaign`, etc. in custom fields

2. **Apply Tag: `pending_confirm`**
   - Contact is created but NOT yet subscribed
   - Do NOT start nurture flows yet
   - Do NOT apply `subscribed` tag yet

3. **Generate Unique Confirmation Link**
   - Use Zapier's Code step or GHL workflow to generate a unique token
   - Example format: `https://yoursite.com/confirm?token={unique_token}&email={email}`
   - Store token in GHL custom field: `confirmation_token`
   - Set expiration timestamp (e.g., 48 hours from now)

4. **Send Confirmation Email/SMS**
   
   **Option A: Via GHL Workflow**
   - Trigger: Contact gets tag `pending_confirm`
   - Action: Send email template "Double Opt-In Confirmation"
   
   **Option B: Via Zapier + Resend/Twilio**
   - Use Resend API to send email
   - Use Twilio API to send SMS (if phone provided)

**Email Template Example:**
```html
Subject: Please confirm your subscription

Hi {{first_name}},

Thanks for subscribing! Please confirm your email address by clicking the link below:

[Confirm My Subscription](https://yoursite.com/confirm?token={{confirmation_token}}&email={{email}})

This link will expire in 48 hours.

If you didn't sign up, you can safely ignore this email.

Best,
Hair Pinns Team
```

---

### 3. User Clicks Confirmation Link

User clicks the confirmation link, which leads to:
- **Frontend page:** `/confirm?token={unique_token}&email={email}`
- **Page behavior:**
  1. Extracts `token` and `email` from URL
  2. Fires `hpCapture.trackEvent()` with `event_name="email_confirmed"`
  3. Displays success message to user

**Payload sent to Zapier:**
```json
{
  "event_name": "email_confirmed",
  "email": "user@example.com",
  "confirmation_token": "abc-xyz-123",
  "timestamp": "2025-10-05T14:15:00Z",
  "client_id": "abc-123"
}
```

---

### 4. Zapier Path B: Confirmation Handler

**Trigger:** Catch Hook receives `event_name = "email_confirmed"`

**Actions:**

1. **Lookup Contact in GHL**
   - Search by email
   - Verify `confirmation_token` matches
   - Check token hasn't expired

2. **Filter: Valid Confirmation**
   - If token invalid/expired → End flow (optional: send "Link expired" email)
   - If valid → Continue

3. **Remove Tag: `pending_confirm`**

4. **Apply Tag: `subscribed`**
   - This tag indicates the contact is fully opted-in

5. **Update GHL Custom Fields**
   - Set `subscription_confirmed_at` = current timestamp
   - Clear `confirmation_token` field
   - Set `subscription_status` = "active"

6. **Start Nurture Flows**
   - Trigger GHL workflow: "Welcome Series"
   - Trigger GHL workflow: "Product Education Cadence"
   - Add to email marketing lists in GHL

7. **Optional: Send Welcome Email**
   ```
   Subject: Welcome to Hair Pinns! 🎉
   
   Hi {{first_name}},
   
   Your subscription is confirmed! Here's what to expect...
   ```

---

## Frontend Implementation

### Create Confirmation Page

**File:** `src/pages/Confirm.tsx`

```tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { hpCapture } from "@/lib/hpCapture";
import { Button } from "@/components/ui/button";

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please try again or contact support.');
        return;
      }

      try {
        // Fire confirmation event to Zapier
        const success = await hpCapture.trackEvent('email_confirmed', {
          email,
          confirmation_token: token,
        });

        if (success) {
          setStatus('success');
          setMessage('Your subscription is confirmed! Welcome to Hair Pinns.');
        } else {
          throw new Error('Failed to confirm');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again or contact support.');
      }
    };

    confirmSubscription();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-heading text-heading">Confirming...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-heading text-heading">Subscription Confirmed!</h1>
            <p className="text-foreground">{message}</p>
            <Button asChild variant="primary" size="lg">
              <a href="/">Return to Home</a>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-heading text-heading">Confirmation Failed</h1>
            <p className="text-foreground">{message}</p>
            <Button asChild variant="outline" size="lg">
              <a href="/contact">Contact Support</a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Confirm;
```

**Add route to `src/App.tsx`:**
```tsx
<Route path="/confirm" element={<Confirm />} />
```

---

## Zapier Setup Guide

### Zap 1: Form Submission Handler (Double Opt-In)

1. **Trigger:** Webhooks by Zapier - Catch Hook
   - Copy webhook URL to `src/lib/hpCapture.ts`

2. **Filter:** Only Continue If...
   - `double_opt_in` = `true`
   - `email` exists

3. **Action:** GoHighLevel - Create/Update Contact
   - Email: `{{email}}`
   - First Name: `{{first_name}}`
   - Phone: `{{phone}}`
   - Custom Field `client_id`: `{{client_id}}`
   - Custom Field `first_utm_source`: `{{first_touch.first_utm_source}}`
   - Custom Field `confirmation_token`: (generate in next step)

4. **Action:** Code by Zapier - Generate Confirmation Token
   ```javascript
   const crypto = require('crypto');
   const token = crypto.randomBytes(32).toString('hex');
   const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
   
   output = {
     token: token,
     expires_at: expiresAt,
     confirmation_url: `https://yoursite.com/confirm?token=${token}&email=${inputData.email}`
   };
   ```

5. **Action:** GoHighLevel - Update Contact
   - Update the contact created in step 3
   - Custom Field `confirmation_token`: `{{token}}`
   - Custom Field `token_expires_at`: `{{expires_at}}`

6. **Action:** GoHighLevel - Add Tag to Contact
   - Tag: `pending_confirm`

7. **Action:** Resend - Send Email (or use GHL email template)
   - To: `{{email}}`
   - Subject: "Please confirm your subscription"
   - HTML Body: Use template above with `{{confirmation_url}}`

---

### Zap 2: Email Confirmation Handler

1. **Trigger:** Webhooks by Zapier - Catch Hook
   - Use same webhook URL (it handles multiple event types)

2. **Filter:** Only Continue If...
   - `event_name` = `email_confirmed`
   - `email` exists
   - `confirmation_token` exists

3. **Action:** GoHighLevel - Find Contact
   - Search by: Email = `{{email}}`

4. **Filter:** Only Continue If...
   - Contact found
   - Contact's `confirmation_token` matches `{{confirmation_token}}`
   - Contact's `token_expires_at` is in the future

5. **Action:** GoHighLevel - Remove Tag from Contact
   - Tag: `pending_confirm`

6. **Action:** GoHighLevel - Add Tag to Contact
   - Tag: `subscribed`

7. **Action:** GoHighLevel - Update Contact
   - Custom Field `subscription_confirmed_at`: `{{timestamp}}`
   - Custom Field `subscription_status`: `active`
   - Clear `confirmation_token` field

8. **Action:** GoHighLevel - Add Contact to Workflow
   - Workflow: "Welcome Series"

9. **Action:** GoHighLevel - Add Contact to Workflow
   - Workflow: "Product Education Cadence"

10. **Action (Optional):** Resend - Send Email
    - Send welcome email

---

## Testing the Double Opt-In Flow

### 1. Test Form Submission
1. Set `double_opt_in = true` in `projectConfig.ts`
2. Submit a test newsletter signup
3. Check Zapier Task History:
   - ✓ Webhook received with `double_opt_in: true`
   - ✓ Contact created in GHL
   - ✓ Tag `pending_confirm` applied
   - ✓ Confirmation email sent

4. Check GHL:
   - ✓ Contact exists
   - ✓ Has tag `pending_confirm`
   - ✓ Does NOT have tag `subscribed`
   - ✓ Custom field `confirmation_token` is populated

### 2. Test Confirmation
1. Copy confirmation link from test email
2. Click the link (or visit URL manually)
3. Check browser:
   - ✓ Loads `/confirm` page
   - ✓ Shows "Confirming..." spinner
   - ✓ Shows success message

4. Check Zapier Task History:
   - ✓ Webhook received with `event_name: "email_confirmed"`
   - ✓ Contact found in GHL
   - ✓ Token validated
   - ✓ Tag `pending_confirm` removed
   - ✓ Tag `subscribed` applied
   - ✓ Workflows triggered

5. Check GHL:
   - ✓ Tag `pending_confirm` removed
   - ✓ Tag `subscribed` applied
   - ✓ Custom field `subscription_confirmed_at` populated
   - ✓ Contact entered nurture workflows

### 3. Test Expired Token
1. Manually set `token_expires_at` to a past date in GHL
2. Try to confirm with that token
3. Verify Zapier flow stops at expiration filter
4. (Optional) Verify "Link expired" email sent

---

## Error Handling

### Invalid/Expired Token
- Zapier filter stops the flow
- Optional: Send "Link expired" email with option to resend

### Email Already Confirmed
- Check if contact already has `subscribed` tag
- If yes, show "Already confirmed" message on frontend

### Missing Token/Email in URL
- Frontend shows error message
- Directs user to contact support

---

## Single Opt-In Mode

To disable double opt-in and immediately subscribe contacts:

1. Set `double_opt_in = false` in `projectConfig.ts`

2. Update Zapier flows:
   - Add filter in Zap 1: Only run double-opt-in path if `double_opt_in = true`
   - Add alternate path in Zap 1 for `double_opt_in = false`:
     - Immediately apply `subscribed` tag
     - Immediately start nurture workflows
     - No confirmation email sent

---

## Best Practices

1. **Token Security**
   - Use cryptographically secure random tokens (32+ bytes)
   - Set reasonable expiration (24-48 hours)
   - Clear token after successful confirmation

2. **User Experience**
   - Clear messaging: "Check your email to confirm"
   - Resend option if email not received
   - Mobile-friendly confirmation page

3. **Compliance**
   - Required for GDPR (EU residents)
   - Required for CASL (Canadian residents)
   - Recommended for all regions to improve deliverability

4. **Analytics**
   - Track confirmation rates
   - Monitor expired tokens
   - A/B test confirmation email subject lines

5. **Monitoring**
   - Set up Zapier error alerts
   - Monitor GHL for contacts stuck in `pending_confirm`
   - Clean up unconfirmed contacts after 7 days

---

## Related Documentation

- [ZAPIER_CONTACT_FORM.md](./ZAPIER_CONTACT_FORM.md) - Contact form Zapier setup
- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - Multi-touch attribution
- [SHOPIFY_WEBHOOKS_SETUP.md](./SHOPIFY_WEBHOOKS_SETUP.md) - Order webhooks
- Form components:
  - `src/components/forms/NewsletterForm.tsx`
  - `src/components/forms/ContactForm.tsx`
  - `src/components/forms/LeadMagnetForm.tsx`
  - `src/components/forms/ConsultMiniForm.tsx`

---

## Summary Checklist

### Configuration
- [ ] Set `double_opt_in` flag in `projectConfig.ts`
- [ ] Create `/confirm` page in frontend
- [ ] Add route to `App.tsx`

### Zapier Setup
- [ ] Create Zap 1: Form submission → pending_confirm → send confirmation email
- [ ] Create Zap 2: Confirmation event → subscribed → start nurture
- [ ] Set up error notifications
- [ ] Test both happy path and edge cases

### GHL Setup
- [ ] Create custom fields: `confirmation_token`, `token_expires_at`, `subscription_confirmed_at`
- [ ] Create tags: `pending_confirm`, `subscribed`
- [ ] Create workflows: "Welcome Series", "Product Education Cadence"
- [ ] Design confirmation email template

### Testing
- [ ] Test form submission
- [ ] Test confirmation link click
- [ ] Test expired token
- [ ] Test already confirmed
- [ ] Test single opt-in mode (if applicable)
