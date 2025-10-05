# Contact Form - Zapier Integration

## Overview

The ContactForm component on the /contact page captures customer inquiries and routes them to GoHighLevel for proper handling, conversation management, and priority alerts.

## Form Details

**Form Name**: `contact_page`

**Fields**:
- `name` (string, required) - Customer's full name
- `email` (string, required) - Email address
- `phone` (string, optional) - Phone number
- `topic` (string, required) - Selected inquiry topic
- `topic_label` (string) - Human-readable topic name
- `message` (string, required) - Customer's message
- `consent_marketing` (boolean, required) - Marketing consent

**Topic Options**:
- `product_question` - "Product Question"
- `service_question` - "Service Question"
- `order_help` - "Order Help"
- `other` - "Other"

## Payload Example

```json
{
  "form_name": "contact_page",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(02) 1234 5678",
  "topic": "order_help",
  "topic_label": "Order Help",
  "message": "I haven't received my order yet. It was supposed to arrive yesterday. Can you help?",
  "consent_marketing": true,
  "source_page": "https://hairpinns.com.au/contact",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "utm_source": "google",
  "utm_campaign": "support",
  "gclid": "",
  "referrer": "https://google.com",
  "gdpr_region_detected": "AU",
  "timestamp_consent": "2025-01-15T14:30:00.000Z"
}
```

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
- `last_contact_topic`: `{{topic_label}}`
- `last_form_submission`: `{{timestamp}}`
- `consent_marketing`: `{{consent_marketing}}`
- `gdpr_region`: `{{gdpr_region_detected}}`

**Tags to Apply**:
- Based on topic:
  - If `topic` = `product_question` → Tag: `inquiry_product`
  - If `topic` = `service_question` → Tag: `inquiry_service`
  - If `topic` = `order_help` → Tag: `inquiry_order_help`
  - If `topic` = `other` → Tag: `inquiry_other`

---

### Step 2: Create Note with Message Content

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

### Step 3: Route to Conversations (GoHighLevel Inbox)

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

### Step 4: Conditional Alert for Order Help

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

### Step 5: Send Auto-Reply Email (Optional)

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
   - Tag `inquiry_service` applied

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
   - Tag `inquiry_order_help` applied
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
