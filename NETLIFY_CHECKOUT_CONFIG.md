# Netlify Configuration for Hair Pinns Checkout

## Required Environment Variables

Set these in **Netlify → Site configuration → Environment variables**:

| Variable | Value | Required |
|----------|-------|----------|
| `SHOPIFY_MYSHOPIFY_DOMAIN` | `zemtat.zurmy.myshopify.com` | Yes |
| `SF_STOREFRONT_TOKEN` | Your Storefront API token from Hair Pinns - Headless app | Yes |
| `SF_API_VERSION` | `2025-01` | No (defaults to 2025-01) |

## How to Find Values

- **SHOPIFY_MYSHOPIFY_DOMAIN**: Match exactly what appears in Shopify → Settings → Domains (the `.myshopify.com` domain)
- **SF_STOREFRONT_TOKEN**: Shopify → Settings → Apps → App development → Hair Pinns - Headless → API credentials → Storefront API access token

## Deploy Context

Ensure variables are set for **Production** (and optionally Deploy Previews if you test there).

## After Changing Variables

1. Save the environment variables
2. Go to **Deploys** → **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

## Checkout Flow

The checkout uses a **form POST** to `/.netlify/functions/checkout?redirect=true`. The server:
1. Fetches the cart from Shopify
2. Gets the checkout URL
3. Rewrites any custom-domain URL to the Shopify domain
4. Returns a **303 redirect** to Shopify checkout

The browser follows the redirect natively—no JavaScript redirect involved.
