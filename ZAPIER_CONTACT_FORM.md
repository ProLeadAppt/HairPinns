# Contact Form → Zapier Integration

## Overview
This document details the Contact Form component and its integration with Zapier → GoHighLevel (GHL).

**IMPORTANT**: The Contact Form sends a **nested JSON payload** to Zapier. Make sure your Zap filters and field mappings use the correct nested keys (see below).

---

## Form Details

**Component**: `ContactForm.tsx`  
**Location**: Used on `/contact`, `/product/:handle` (sidebar), `/blog/:slug` (footer), and anywhere a general contact form is needed.

**Form Name**: `contact_page`  
**Event Name**: `contact_form_submit`

**Webhook URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

---

## ⚠️ Nested Payload Structure

The Contact Form uses `hpCapture.postToZapier()`, which **automatically nests fields** into categories like `contact`, `context`, `consent`, `session`, `first_touch`, and `free_text`.

### Critical Zapier Setup Notes:

1. **Zapier Filters** must use nested keys:
   - ✅ `context.form_name` equals `contact_page`
   - ✅ `context.event_name` equals `contact_form_submit`
   - ❌ NOT `form_name` or `event_name` at root level

2. **Field Mapping** must use nested keys:
   - ✅ `contact.email` for email
   - ✅ `contact.phone` for phone
   - ✅ `contact.name` for full name
   - ✅ `free_text.message` for message content
   - ✅ `free_text.topic_label` for topic selection
   - ✅ `consent.consent_marketing` for marketing consent
   - ❌ NOT `email`, `phone`, `message` at root level

3. **Check your Zap Task History** to see the actual nested structure received.

---

## Form Fields

- `name` (string, required) - Customer's full name
- `email` (string, required) - Email address
- `phone` (string, optional) - Phone number
- `topic` (string, required when showTopic=true) - Selected inquiry topic
- `topic_label` (string) - Human-readable topic name
- `message` (string, required) - Customer's message
- `consent_marketing` (boolean, optional) - Marketing consent

**Topic Options**:
- `product_question` - "Product Question"
- `service_question` - "Service Question"
- `order_help` - "Order Help"
- `other` - "Other"

## Payload Example

The actual payload sent to Zapier is nested. Here's what you'll see in Zap Task History:

```json
{
  "contact": {
    "name": "Jane Smith",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "0468 020 624"
  },
  "context": {
    "form_name": "contact_page",
    "event_name": "contact_form_submit",
    "page_url": "https://hairpinns.com.au/contact",
    "timestamp": "2025-01-15T14:30:00.000Z"
  },
  "consent": {
    "consent_marketing": true,
    "gdpr_region_detected": "AU",
    "timestamp_consent": "2025-01-15T14:30:00.000Z"
  },
  "session": {
    "client_id": "550e8400-e29b-41d4-a716-446655440000",
    "utm_source": "google",
    "utm_campaign": "support",
    "gclid": "",
    "referrer": "https://google.com"
  },
  "first_touch": {
    "first_utm_source": "instagram",
    "first_landing_page": "https://hairpinns.com.au/",
    "first_referrer": "https://instagram.com",
    "first_seen_timestamp": "2025-01-10T10:00:00.000Z"
  },
  "free_text": {
    "message": "I haven't received my order yet. It was supposed to arrive yesterday. Can you help?",
    "topic": "order_help",
    "topic_label": "Order Help"
  }
}
```

## Zapier Workflow Setup

### Overview: Tagging Strategy

This workflow automatically tags contacts in GoHighLevel based on:
- **Topic** (general, appointment, product, order help, feedback)
- **Consent** (marketing consent vs none)
- **Attribution** (utm_source: instagram, facebook, google, email, organic)
- **Interest** (derived from message keywords: colour, smoothing, cuts, events, braids)
- **Priority** (urgent flag for order help)

#### Tag Categories Applied

| Category | Tags |
|----------|------|
| **Topic** | lead_general, lead_appointment, lead_product, lead_order_help, lead_feedback |
| **Consent** | consent_marketing, consent_none |
| **Source** | source_instagram, source_facebook, source_google, source_email, source_organic |
| **Interest** | interest_colour, interest_smoothing, interest_cuts, interest_events, interest_braids |
| **Priority** | priority_order_help, needs_immediate_response |

---

### Trigger

**App**: Webhooks by Zapier  
**Event**: Catch Hook  
**URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

---

### Step 1: Create/Update Contact in GoHighLevel

**Action**: GoHighLevel - Find or Create Contact

**Purpose**: Create base contact record with attribution data before applying tags

**Search Fields**:
- Email: `{{email}}`
- Phone: `{{phone}}`

**If Not Found, Create With**:
- First Name: `{{name}}` (extract first word)
- Last Name: `{{name}}` (extract remaining words, or blank)
- Email: `{{email}}`
- Phone: `{{phone}}`

**Custom Fields to Update**:
- `form_name`: `{{form_name}}`
- `client_id`: `{{client_id}}`
- `source_page`: `{{source_page}}`
- `topic`: `{{topic}}`
- `last_form_submit`: `{{timestamp}}`
- `utm_source`: `{{utm_source}}`
- `utm_medium`: `{{utm_medium}}`
- `utm_campaign`: `{{utm_campaign}}`
- `first_touch_source`: `{{first_touch_source}}`
- `first_touch_landing`: `{{first_touch_landing}}`
- `consent_marketing`: `{{consent_marketing}}`
- `gdpr_region`: `{{gdpr_region_detected}}`

---

### Step 2: Add Base Topic Tag

**Action**: GoHighLevel - Add Tag to Contact

**Contact ID**: Use output from Step 1

**Purpose**: Tag contact based on inquiry topic for segmentation

**Configuration** (use Zapier Formatter → Lookup Table):

| Input (topic field) | Output Tag |
|---------------------|------------|
| general | lead_general |
| appointment | lead_appointment |
| product | lead_product |
| product_question | lead_product |
| service_question | lead_general |
| order_help | lead_order_help |
| feedback | lead_feedback |
| other | lead_general |

```
Formatter by Zapier:
  Transform: Lookup Table
  Input: {{topic}}
  Lookup Table: (as above)
  Default Value: lead_general

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: {{Formatted Output}}
```

---

### Step 3: Add Consent Tag

**Action**: GoHighLevel - Add Tag to Contact

**Contact ID**: Use output from Step 1

**Purpose**: Track marketing consent for GDPR compliance and segmentation

**Configuration**:

```
Filter:
  Continue only if: consent_marketing (Exists)

Formatter by Zapier:
  Transform: Lookup Table
  Input: {{consent_marketing}}
  
  Lookup Table:
    true → consent_marketing
    false → consent_none
  
  Default: consent_none

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: {{Formatted Output}}
```

---

### Step 4: Add Attribution Source Tag

**Action**: GoHighLevel - Add Tag to Contact

**Contact ID**: Use output from Step 1

**Purpose**: Track where the lead came from for attribution reporting

**Configuration**:

```
Filter:
  Continue only if: utm_source (Exists)

Formatter by Zapier:
  Transform: Text
  Template: source_{{utm_source}}

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: {{Formatted Output}}
```

**Supported Source Tags**:
- source_instagram
- source_facebook
- source_google
- source_email
- source_organic

---

### Step 5: Add Interest Tags (Keyword Detection)

**Action**: Multiple parallel paths using GoHighLevel - Add Tag to Contact

**Contact ID**: Use output from Step 1

**Purpose**: Derive service interest from message content for targeted follow-up

Create **5 parallel paths**, each with a filter and tag action:

#### Path A: Colour Interest
```
Filter:
  Continue only if: message (Text Contains)
  Any of: blonde, foils, highlights, balayage, color, colour

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: interest_colour
```

#### Path B: Smoothing Interest
```
Filter:
  Continue only if: message (Text Contains)
  Any of: keratin, smoothing, straight, frizz, sleek

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: interest_smoothing
```

#### Path C: Cuts Interest
```
Filter:
  Continue only if: message (Text Contains)
  Any of: cut, trim, haircut, style, fringe, chop

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: interest_cuts
```

#### Path D: Events Interest
```
Filter:
  Continue only if: message (Text Contains)
  Any of: wedding, bridal, formal, upstyle, event

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: interest_events
```

#### Path E: Braids Interest
```
Filter:
  Continue only if: message (Text Contains)
  Any of: braid, cornrow, princess

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: interest_braids
```

---

### Step 6: Priority Tag for Order Help

**Action**: GoHighLevel - Add Tag to Contact

**Contact ID**: Use output from Step 1

**Purpose**: Flag urgent order-related inquiries requiring immediate attention

**Configuration**:

```
Filter:
  Continue only if: topic (Text Exactly Matches) order_help

GoHighLevel → Add Tag to Contact:
  Contact ID: {{Step 1 Contact ID}}
  Tags: priority_order_help, needs_immediate_response
```

---

### Step 7: Create Note with Message Content

**Action**: GoHighLevel - Create Note

**Contact ID**: `{{contact_id}}` (from Step 1)

**Note Body**:
```
Topic: {{topic_label}}

Message:
{{message}}

---
Source: {{source_page}}
Timestamp: {{timestamp}}
Client ID: {{client_id}}
UTM: {{utm_source}} / {{utm_campaign}}
```

**Purpose**: 
- Preserve full message content
- Provide context for follow-up
- Track conversation history

---

### Step 8: Route to Conversations (GoHighLevel Inbox)

**Action**: GoHighLevel - Create Conversation

**Contact ID**: `{{contact_id}}` (from Step 1)

**Conversation Type**: SMS or Email (based on contact preference)

**Initial Message**:
```
New inquiry from {{name}}

Topic: {{topic_label}}
Message: {{message}}

Reply to this conversation to respond directly to the customer.
```

**Assign To**: 
- If `topic` = `order_help` → Assign to Jena (high priority)
- If `topic` = `service_question` → Assign to Jena
- If `topic` = `product_question` → Assign to Support Team
- If `topic` = `other` → Assign to Support Team

**Purpose**:
- Centralize all customer communications
- Enable quick response via GHL inbox
- Track response times and resolution

---

### Step 9: Conditional Alert for Order Help

**Filter**: Only continue if `topic` = `order_help`

**Action A**: Email by Zapier - Send Email

**To**: `jena@hairpinns.com`

**Subject**: `🚨 URGENT: Order Help Request - {{name}}`

**Body**:
```html
<h2>Urgent Order Help Request</h2>

<p><strong>Customer:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>

<p><strong>Source:</strong> {{source_page}}</p>
<p><strong>Time:</strong> {{timestamp}}</p>
<p><strong>UTM:</strong> {{utm_source}} / {{utm_campaign}}</p>

<p><a href="https://app.gohighlevel.com/contacts/{{contact_id}}">View in GHL</a></p>
```

**OR**

**Action B**: Slack - Send Direct Message

**Recipient**: `@jena` (or designated channel)

**Message**:
```
🚨 *URGENT: Order Help Request*

*Customer*: {{name}}
*Email*: {{email}}
*Phone*: {{phone}}

*Message*:
> {{message}}

*Source*: {{source_page}}
*Time*: {{timestamp}}

<https://app.gohighlevel.com/contacts/{{contact_id}}|View in GHL>
```

**Purpose**:
- Immediate notification for time-sensitive issues
- Ensure fast response time for order problems
- Escalate to owner/manager for urgent matters

---

### Step 10: Send Auto-Reply Email (Optional)

**Action**: Email by Zapier - Send Email

**To**: `{{email}}`

**From**: `hello@hairpinns.com`

**Subject**: `We received your message - Hair Pinns`

**Body**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thanks for reaching out!</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      
      <p>We've received your message about <strong>{{topic_label}}</strong> and we'll get back to you within 24 hours.</p>
      
      <p><strong>Your message:</strong><br>
      <em>{{message}}</em></p>
      
      {{#if topic equals "order_help"}}
      <div style="background: #fee; padding: 15px; border-left: 4px solid #c00; margin: 20px 0;">
        <strong>Order Help - Priority Response</strong><br>
        Jena has been notified and will respond within 2 hours during business hours.
      </div>
      {{/if}}
      
      <p>In the meantime:</p>
      <ul>
        <li>📅 <a href="https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127">Book an appointment</a></li>
        <li>📞 Call us: <a href="tel:+61295550123">(02) 9555 0123</a></li>
        <li>💬 Reply to this email with any additional details</li>
      </ul>
      
      <p>Looking forward to helping you!</p>
      <p><strong>- Jena & the Hair Pinns Team</strong></p>
    </div>
    <div class="footer">
      <p>Hair Pinns | 123 River Road, Bangor NSW 2234<br>
      (02) 9555 0123 | hello@hairpinns.com</p>
    </div>
  </div>
</body>
</html>
```

**Purpose**:
- Confirm receipt of inquiry
- Set expectations for response time
- Provide alternative contact methods
- Build trust with immediate acknowledgment

---

## Implementation

### Using the Component

```tsx
import ContactForm from "@/components/forms/ContactForm";

// On contact page with topic selection
<ContactForm
  formName="contact_page"
  title="Send Us a Message"
  description="We're here to help with any questions about our products or services."
  showTopic={true}
/>

// Simple contact form without topic
<ContactForm
  formName="footer_contact"
  title="Get in Touch"
  showTopic={false}
/>
```

### Placement Examples

**1. Main Contact Page** (Current Implementation)
```tsx
<Section variant="muted" padding="xl">
  <div className="max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2>Message Jena</h2>
      <p>We'll reply within 24 hours.</p>
    </div>
    <ContactForm
      formName="contact_page"
      showTopic={true}
    />
  </div>
</Section>
```

**2. Footer Quick Contact**
```tsx
<ContactForm
  formName="footer_contact"
  title="Quick Question?"
  showTopic={false}
  className="max-w-md"
/>
```

**3. Product Page Inquiry**
```tsx
<ContactForm
  formName="product_inquiry"
  title="Questions about this product?"
  description="Ask us anything - we're happy to help!"
  showTopic={false}
/>
```

## Response Time SLAs

Based on topic:
- **Order Help**: 2 hours (business hours) - Jena notified immediately
- **Service Question**: 24 hours - Routed to Jena
- **Product Question**: 24 hours - Routed to support team
- **Other**: 24 hours - Routed to support team

## Testing

### Test General Inquiry

1. Fill out contact form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "(02) 1234 5678"
   - Topic: "Service Question"
   - Message: "What's the difference between balayage and highlights?"
   - Check consent

2. Submit form

3. Verify:
   - Success message appears
   - Contact created/updated in GHL
   - Note attached with message
   - Conversation created in GHL Inbox
   - Tags applied: `lead_general`, `consent_marketing`, `interest_colour` (from "balayage" keyword)

### Test Order Help (Priority Alert)

1. Fill out contact form:
   - Name: "Urgent Customer"
   - Email: "urgent@example.com"
   - Phone: "(02) 9999 9999"
   - Topic: "Order Help"
   - Message: "Haven't received my order. Help!"
   - Check consent

2. Submit form

3. Verify:
   - Success message mentions 2-hour response
   - Contact created in GHL
   - Tags applied: `lead_order_help`, `priority_order_help`, `needs_immediate_response`, `consent_marketing`
   - **Email sent to Jena** with 🚨 URGENT prefix
   - **Slack notification sent** (if configured)
   - Conversation created and assigned to Jena

## Analytics & Reporting

Track the following metrics:
- **Topic Distribution**: Which topics are most common?
- **Response Times**: Average time to first response by topic
- **Resolution Times**: Time from inquiry to resolution
- **Conversion Rate**: Inquiries that lead to bookings/sales
- **UTM Attribution**: Which campaigns drive most inquiries

## Common Issues & Solutions

**Issue**: Contact not created in GHL  
**Solution**: Check API permissions and connection in Zapier

**Issue**: Jena not receiving order help alerts  
**Solution**: Verify email address and Slack username in workflow

**Issue**: Notes not attaching to contacts  
**Solution**: Ensure contact_id from Step 1 passes to Step 2

**Issue**: Auto-reply emails going to spam  
**Solution**: Set up SPF/DKIM records for sending domain

## Privacy & Compliance

**Data Collected**:
- Name, email, phone (required for contact)
- Topic and message (for routing)
- Session data (UTMs, client_id) for attribution

**Consent**:
- Explicit marketing consent required
- Link to Privacy Policy in consent checkbox
- Timestamp of consent recorded

**GDPR**:
- Region auto-detected (AU)
- Data stored securely in GHL
- Right to erasure available on request
