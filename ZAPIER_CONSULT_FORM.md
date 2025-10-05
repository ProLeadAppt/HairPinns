# Consult Request Form - Zapier Integration

## Overview

The ConsultMiniForm component captures consultation requests and sends them to GoHighLevel via Zapier for contact management and automated SMS follow-up.

## Form Details

**Form Name**: `consult_request`

**Fields**:
- `name` (string, required) - Customer's full name
- `email` (string, required) - Email address
- `phone` (string, required) - Phone number
- `preferred_time` (string, required) - Selected time slot
- `preferred_time_label` (string) - Human-readable time label
- `consent_marketing` (boolean, required) - Marketing consent

**Time Slot Options**:
- `morning_weekday` - "Morning (9am-12pm) - Weekday"
- `afternoon_weekday` - "Afternoon (12pm-5pm) - Weekday"
- `evening_weekday` - "Evening (5pm-7pm) - Weekday"
- `morning_saturday` - "Morning (8am-12pm) - Saturday"
- `afternoon_saturday` - "Afternoon (12pm-5pm) - Saturday"
- `asap` - "ASAP - Any available time"

## Payload Example

```json
{
  "form_name": "consult_request",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(02) 1234 5678",
  "preferred_time": "morning_weekday",
  "preferred_time_label": "Morning (9am-12pm) - Weekday",
  "consent_marketing": true,
  "source_page": "https://hairpinns.com.au/services",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "utm_source": "google",
  "utm_campaign": "services_consult",
  "gclid": "abc123",
  "referrer": "https://google.com",
  "gdpr_region_detected": "AU",
  "timestamp_consent": "2025-01-15T14:30:00.000Z"
}
```

## User Experience

### Form Submission Flow

1. User fills out form (name, email, phone, preferred time)
2. Checks consent checkbox
3. Clicks "Request Free Consult"
4. Form submits to Zapier (non-blocking)
5. Success state shows with two CTAs:
   - Text confirmation message
   - Button to "Book Now on Fresha" (opens in new tab)

### Success Message

```
Thanks! We'll text you shortly.
You can also book instantly on Fresha for immediate confirmation.
[Book Now on Fresha Button]
Or call us: (02) 9555 0123
```

### Fresha Deep Link

**URL**: `https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127`

This link:
- Opens in a new tab automatically on form success
- Also available as a button in success state
- Deep links directly to Hair Pinns booking page

## Zapier Workflow Setup

### Trigger

**App**: Webhooks by Zapier  
**Event**: Catch Hook  
**URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

---

### Step 1: Create/Update Contact in GoHighLevel

**Action**: GoHighLevel - Find or Create Contact

**Search Fields**:
- Email: `{{email}}`
- Phone: `{{phone}}`

**If Not Found, Create With**:
- First Name: `{{name}}` (extract first word)
- Last Name: `{{name}}` (extract remaining words, or blank)
- Email: `{{email}}`
- Phone: `{{phone}}`

**Custom Fields to Update**:
- `client_id`: `{{client_id}}`
- `utm_source`: `{{utm_source}}`
- `utm_campaign`: `{{utm_campaign}}`
- `preferred_consult_time`: `{{preferred_time_label}}`
- `last_form_submission`: `{{timestamp}}`
- `consent_marketing`: `{{consent_marketing}}`
- `gdpr_region`: `{{gdpr_region_detected}}`

---

### Step 2: Apply Tag

**Action**: GoHighLevel - Add Tag to Contact

**Contact ID**: `{{contact_id}}` (from Step 1)

**Tag**: `consult_request`

**Purpose**: Segment contacts who've requested consultations for:
- Follow-up workflows
- Reporting and analytics
- Remarketing campaigns

---

### Step 3: Add to Pipeline (Optional)

**Action**: GoHighLevel - Create Opportunity

**Pipeline**: "Consultation Requests"

**Stage**: "New Request"

**Fields**:
- Contact ID: `{{contact_id}}` (from Step 1)
- Opportunity Name: "Consult - {{name}}"
- Opportunity Value: 0 (or expected consultation value)
- Notes: "Preferred time: {{preferred_time_label}}"
- Source: `{{utm_source}}`

**Purpose**: 
- Track consultation requests in sales pipeline
- Monitor conversion from consult → booking → service
- Assign to team members for follow-up

---

### Step 4: Send SMS via GoHighLevel

**Action**: GoHighLevel - Send SMS

**Recipient**: `{{phone}}` (from original webhook)

**From**: Hair Pinns business number (configured in GHL)

**Message Template**:
```
Hi {{name}}! 👋

Got your consult request—thanks for reaching out!

Here's the quick booking link to schedule your consultation with Jena:
https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127

Prefer to chat first? Just reply to this text or call us at (02) 9555 0123.

Looking forward to seeing you!
- Hair Pinns Bangor
```

**Timing**: Send immediately (within 1-2 minutes of form submission)

**Fallback**: If SMS fails, trigger email notification to salon

---

### Step 5: Notify Team (Optional)

**Action A**: Email by Zapier - Send Email

**To**: `jena@hairpinns.com` (or team inbox)

**Subject**: `New Consult Request - {{name}}`

**Body**:
```
New consultation request received:

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Preferred Time: {{preferred_time_label}}

Source: {{utm_source}} / {{utm_campaign}}
Page: {{source_page}}
Timestamp: {{timestamp}}

Client ID: {{client_id}}

View in GHL: [Link to contact]
```

**OR**

**Action B**: Slack - Send Channel Message

**Channel**: `#bookings` or `#consults`

**Message**:
```
🗓️ New Consult Request

*Name*: {{name}}
*Phone*: {{phone}}
*Time*: {{preferred_time_label}}
*Source*: {{utm_source}}
```

---

## Implementation

### Using the Component

```tsx
import ConsultMiniForm from "@/components/forms/ConsultMiniForm";

// Default usage
<ConsultMiniForm />

// Custom title/description
<ConsultMiniForm 
  title="Not sure what service you need?"
  description="Book a free 15-minute consultation with Jena to discuss your hair goals."
  className="max-w-md"
/>
```

### Placement Suggestions

1. **Services Page** - Below service categories
2. **Homepage** - As a conversion-focused section
3. **About Page** - After Jena's bio
4. **Blog Posts** - As inline CTA for relevant content
5. **Product Pages** - For customers unsure about purchases

### Example: Services Page

```tsx
// In Services.tsx
import ConsultMiniForm from "@/components/forms/ConsultMiniForm";

<Section className="py-xl">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div>
      <h2 className="text-h2 font-heading mb-4">
        Not Sure Which Service You Need?
      </h2>
      <p className="text-foreground mb-6">
        Every head of hair is different. Jena offers free 15-minute consultations 
        to assess your hair, understand your goals, and recommend the perfect 
        service—no pressure, no obligation.
      </p>
      <ul className="space-y-2 text-foreground">
        <li>✓ Personalized service recommendations</li>
        <li>✓ Honest pricing and timeline expectations</li>
        <li>✓ Product suggestions for at-home care</li>
      </ul>
    </div>
    <ConsultMiniForm />
  </div>
</Section>
```

## Testing

### Test the Form

1. Navigate to page with ConsultMiniForm
2. Fill out all fields:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "(02) 1234 5678"
   - Time: Select any option
   - Check consent checkbox
3. Click "Request Free Consult"
4. Verify:
   - Success state appears
   - Fresha link opens in new tab
   - Toast notification shows

### Test Zapier Workflow

1. Check Zapier task history for webhook trigger
2. Verify payload includes all fields
3. Check GHL:
   - Contact created/updated
   - Tag `consult_request` applied
   - Opportunity created (if enabled)
4. Verify SMS sent to phone number
5. Check team notification (email/Slack if enabled)

### Test SMS Content

Send test SMS to your own number:
```
Hi Test! 👋

Got your consult request—thanks for reaching out!

Here's the quick booking link to schedule your consultation with Jena:
https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127

Prefer to chat first? Just reply to this text or call us at (02) 9555 0123.

Looking forward to seeing you!
- Hair Pinns Bangor
```

## Conversion Optimization Tips

### Form Copy
- **Headline**: Emphasize "free" and "no obligation"
- **Description**: Address common objections (time, cost, uncertainty)
- **Button**: Use action-oriented language ("Request Free Consult")

### Time Slots
- Offer flexible options (morning/afternoon/evening)
- Include Saturday availability
- Add "ASAP" option for urgent needs

### Success State
- Immediate gratification: "We'll text you shortly"
- Secondary CTA: Fresha booking link
- Fallback option: Phone number

### Trust Signals
- Display average response time ("Within 24 hours")
- Show social proof ("47 consultations this month")
- Highlight Jena's credentials

## Analytics Tracking

The form automatically includes:
- `client_id` for user tracking
- UTM parameters for attribution
- Referrer for traffic source
- Page URL for context

These fields enable:
- Campaign performance analysis
- Conversion funnel tracking
- Customer journey mapping
- ROI measurement

## Privacy & Compliance

**Data Collected**:
- Name (required)
- Email (required)
- Phone (required)
- Preferred time (required)
- Marketing consent (required)

**Consent Requirements**:
- Explicit opt-in via checkbox
- Link to Privacy Policy
- Clear unsubscribe option in SMS

**GDPR Compliance**:
- Region detected automatically (AU)
- Consent timestamp recorded
- Data processing agreement with GHL required

## Troubleshooting

**Form not submitting:**
- Check all required fields filled
- Verify consent checkbox checked
- Check browser console for errors

**SMS not received:**
- Verify phone number format correct
- Check GHL SMS credits available
- Verify business number configured in GHL
- Check spam/blocked numbers list

**Contact not created in GHL:**
- Verify Zapier-GHL connection active
- Check API permissions in GHL
- Review Zapier error logs

**Fresha link not opening:**
- Check popup blocker settings
- Verify URL is correct
- Test in different browsers
