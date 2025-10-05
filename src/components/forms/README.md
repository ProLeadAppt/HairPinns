# Hair Pinns Form Components

Reusable form components that integrate with the `hpCapture` tracking utility and POST to Zapier/GoHighLevel.

## Components

### NewsletterForm

Simple newsletter subscription form, ideal for footer or sidebar placement.

**Props:**
- `formName` (string, default: "newsletter_footer") - Identifier for this form instance
- `showFirstName` (boolean, default: false) - Show first name field
- `showPhone` (boolean, default: false) - Show phone field
- `buttonText` (string, default: "Subscribe") - Submit button text
- `successMessage` (string) - Message shown after successful submission
- `className` (string) - Additional CSS classes

**Usage:**
```tsx
import NewsletterForm from "@/components/forms/NewsletterForm";

<NewsletterForm 
  formName="newsletter_footer"
  showFirstName={false}
  showPhone={false}
  buttonText="Join Our Newsletter"
  successMessage="Welcome! Check your inbox for a special offer."
/>
```

### LeadMagnetForm

Feature-rich lead magnet download form with prominent styling.

**Props:**
- `formName` (string, required) - Identifier like "leadmagnet_frizz7_pdp"
- `magnetTitle` (string, required) - Title of the lead magnet
- `magnetDescription` (string, optional) - Description text
- `showFirstName` (boolean, default: true) - Show first name field
- `showPhone` (boolean, default: true) - Show phone field
- `buttonText` (string, default: "Get Free Guide") - Submit button text
- `successMessage` (string) - Message shown after successful submission
- `className` (string) - Additional CSS classes

**Usage:**
```tsx
import LeadMagnetForm from "@/components/forms/LeadMagnetForm";

<LeadMagnetForm 
  formName="leadmagnet_frizz7_pdp"
  magnetTitle="Frizz-Free in 7 Days"
  magnetDescription="Get Jena's proven 7-day plan delivered to your inbox + SMS"
  buttonText="Send Me the Guide"
  successMessage="Success! Your guide is on its way. Check your inbox in a moment."
/>
```

## Payload Structure

Both forms send the following payload structure to Zapier:

```json
{
  "form_name": "newsletter_footer",
  "first_name": "Ava",
  "email": "ava@email.com",
  "phone": "(02) 1234 5678",
  "consent_marketing": true,
  "source_page": "https://hairpinns.com.au/",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "utm_source": "instagram",
  "utm_medium": "bio",
  "utm_campaign": "xmas",
  "gclid": "",
  "fbclid": "abc123",
  "ttclid": "",
  "referrer": "https://instagram.com/hairpinns",
  "dedupe_key": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "gdpr_region_detected": "AU",
  "timestamp_consent": "2025-01-15T14:30:00.000Z"
}
```

## Zapier Workflow Instructions

### Path A: GoHighLevel (Primary)

**Create/Update Contact:**
1. Search for existing contact by email
2. If not found, create new contact with:
   - Email: `{{email}}`
   - Phone: `{{phone}}`
   - First Name: `{{first_name}}`
   - Custom Fields:
     - `client_id`: `{{client_id}}`
     - `utm_source`: `{{utm_source}}`
     - `utm_campaign`: `{{utm_campaign}}`
     - `consent_marketing`: `{{consent_marketing}}`
     - `gdpr_region`: `{{gdpr_region_detected}}`

3. Apply tag based on form_name:
   - If `form_name` contains "newsletter" → Tag: `newsletter_subscriber`
   - If `form_name` contains "leadmagnet_frizz7" → Tag: `leadmagnet_frizz7`
   - If `form_name` contains "leadmagnet" → Tag: `leadmagnet_subscriber`

4. Conditional workflow trigger:
   - **IF** `consent_marketing` = `true` **AND** `phone` is not empty **AND** `form_name` contains "leadmagnet_frizz7"
     - **THEN** Start Workflow: `Frizz-7-Day-SMS`
   
   - **IF** `consent_marketing` = `true` **AND** `form_name` contains "newsletter"
     - **THEN** Start Workflow: `Newsletter-Welcome-Email`

### Path B: Email Service (Optional)

**Send to Mailchimp/ConvertKit/etc:**
1. Add subscriber to list
2. Set tags from `form_name`
3. Trigger welcome automation

## Features

### Built-in Protection
- **Honeypot field** - Hidden "company" field rejects bot submissions
- **Consent validation** - Required checkbox prevents accidental submissions
- **Rate limiting** - hpCapture retry logic prevents spam
- **Idempotency** - dedupe_key prevents duplicate submissions

### Automatic Tracking
- **Session data** - UTM parameters, click IDs, referrer
- **Client ID** - Persistent user tracking
- **GDPR compliance** - Region detection and consent timestamp
- **Source attribution** - Full page URL and form identifier

### User Experience
- **Success state** - Clear confirmation message
- **Loading state** - Disabled button during submission
- **Error handling** - User-friendly error messages
- **Accessibility** - Proper labels, ARIA attributes, keyboard navigation

## Example Implementations

### Footer Newsletter
```tsx
// In Footer.tsx
<div className="bg-muted/30 p-6 rounded-card">
  <h3 className="text-h3 font-heading text-heading mb-3">
    Stay Updated
  </h3>
  <p className="text-foreground mb-4">
    Get hair care tips, exclusive offers, and appointment reminders.
  </p>
  <NewsletterForm 
    formName="newsletter_footer"
    showFirstName={false}
    showPhone={false}
    buttonText="Subscribe"
  />
</div>
```

### Product Page Lead Magnet
```tsx
// On product detail page
<LeadMagnetForm 
  formName="leadmagnet_frizz7_pdp"
  magnetTitle="Frizz-Free in 7 Days"
  magnetDescription="Download Jena's proven 7-day frizz elimination plan + daily SMS reminders"
  buttonText="Get Free Guide + SMS Support"
/>
```

### Blog Sidebar
```tsx
// In blog sidebar
<div className="sticky top-4">
  <NewsletterForm 
    formName="newsletter_blog_sidebar"
    showFirstName={true}
    showPhone={true}
    buttonText="Get Hair Care Tips"
    successMessage="You're subscribed! Watch your inbox for exclusive content."
  />
</div>
```

## Testing

### Test Newsletter Form
1. Fill out form with test email
2. Check browser console for `[hpCapture]` logs
3. Verify payload in Zapier webhook history
4. Confirm contact created in GHL
5. Verify welcome email sent

### Test Lead Magnet Form
1. Fill out form with test email + phone
2. Enable `consent_marketing` checkbox
3. Submit form
4. Verify contact tagged with `leadmagnet_frizz7`
5. Confirm SMS workflow triggered (if applicable)

### Test Bot Protection
1. Fill honeypot field via browser console:
   ```javascript
   document.querySelector('input[name="company"]').value = "test";
   ```
2. Submit form
3. Verify submission silently rejected in console
4. Confirm no data sent to Zapier

## Troubleshooting

**Form not submitting:**
- Check consent checkbox is checked
- Verify required fields filled
- Check browser console for errors

**Data not appearing in GHL:**
- Verify Zapier webhook URL is correct
- Check Zapier task history for errors
- Confirm GHL API connection active

**SMS workflow not triggering:**
- Verify `consent_marketing` = true
- Confirm phone number provided
- Check GHL workflow is published
- Verify workflow trigger conditions match
