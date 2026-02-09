# Environment Variables Configuration

This document lists all required environment variables for the Hair Pinns website.

## Required Environment Variables

### GoHighLevel (GHL) Integration

```bash
VITE_GHL_INBOUND_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
```

**Where to get it:**
1. Log into your GoHighLevel account
2. Navigate to: Settings > Integrations > Webhooks > Inbound
3. Copy the inbound webhook URL

**Purpose:** All form submissions and event tracking are sent to this webhook.

---

### Shopify Storefront API

```bash
VITE_SHOPIFY_MYSHOPIFY_DOMAIN=femtat-zu.myshopify.com
VITE_SF_STOREFRONT_TOKEN=your_storefront_token_here
VITE_SF_API_VERSION=2025-01
VITE_SHOP_DOMAIN=hairpinns.com
```

**Where to get it:**
1. Log into Shopify Admin
2. Navigate to: Settings > Apps and sales channels > Develop apps
3. Create a new app or use existing app
4. Enable Storefront API access
5. Generate Storefront API access token
6. Copy the token and API version

**Purpose:** Used for product catalog, collections, and cart functionality.

---

### Google Analytics 4

```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Where to get it:**
1. Log into Google Analytics
2. Navigate to: Admin > Property Settings > Data Streams
3. Select your web data stream
4. Copy the Measurement ID (starts with G-)

**Purpose:** Website analytics and conversion tracking.

---

### Meta Pixel (Facebook)

```bash
VITE_META_PIXEL_ID=000000000000000
```

**Where to get it:**
1. Log into Facebook Business Manager
2. Navigate to: Events Manager > Data Sources
3. Select your Pixel or create a new one
4. Copy the Pixel ID

**Purpose:** Facebook/Instagram ad conversion tracking and retargeting.

---

### Google Tag Manager (Optional)

```bash
VITE_GTM_CONTAINER_ID=GTM-KFH27CHQ
```

**Where to get it:**
1. Log into Google Tag Manager
2. Navigate to: Admin > Container Settings
3. Copy the Container ID (starts with GTM-)

**Purpose:** Centralized tag management (already configured in App.tsx).

---

## Setting Up Environment Variables

### Local Development

1. Create a `.env` file in the project root
2. Copy the variables above and fill in your values
3. Restart the development server

**Example `.env` file:**
```bash
VITE_GHL_INBOUND_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/abc123
VITE_SHOPIFY_MYSHOPIFY_DOMAIN=femtat-zu.myshopify.com
VITE_SF_STOREFRONT_TOKEN=your_token_here
VITE_SF_API_VERSION=2025-01
VITE_SHOP_DOMAIN=hairpinns.com
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=000000000000000
VITE_GTM_CONTAINER_ID=GTM-KFH27CHQ
```

### Netlify Production

1. Log into Netlify Dashboard
2. Navigate to your site: Site settings > Environment variables
3. Add each variable with its value
4. Ensure "Deploy settings" > "Build command" is set to `npm run build`
5. Redeploy your site

**Note:** Variables prefixed with `VITE_` are exposed to the client-side code. Never put sensitive API keys (like Shopify Admin API tokens) in `VITE_` variables.

---

## Security Notes

- ✅ Safe for client-side: Storefront API tokens, GA4 IDs, Meta Pixel IDs, GHL webhook URLs
- ❌ Never expose: Shopify Admin API tokens, GHL API keys, database credentials

The current configuration only uses client-safe variables. All sensitive operations are handled server-side.

