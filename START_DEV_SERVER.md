# How to Start the Development Server

## Quick Start

### Option 1: Simple Vite Dev Server (Recommended for testing the site)

```powershell
npm run dev
```

- Opens at: `http://localhost:5173`
- ✅ Site works normally
- ⚠️ Checkout function won't work locally (expected - it needs Netlify Functions)

### Option 2: Netlify Dev (Full testing with functions)

```powershell
netlify dev
```

- Opens at: `http://localhost:8888`
- ✅ Site works
- ✅ Checkout function works (if environment variables are set)

## Troubleshooting

### If localhost doesn't load:

1. **Stop all running servers:**
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Check if ports are available:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
   Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue
   ```

3. **Try a different port:**
   ```powershell
   npm run dev -- --port 3000
   ```

### If you see environment variable errors:

The app needs these environment variables (with `VITE_` prefix for client-side):

- `VITE_SHOPIFY_MYSHOPIFY_DOMAIN` (e.g., `femtat-zu.myshopify.com`)
- `VITE_SF_STOREFRONT_TOKEN` (your storefront access token)
- `VITE_SF_API_VERSION` (e.g., `2025-01`)

Create a `.env` file in the project root:

```env
VITE_SHOPIFY_MYSHOPIFY_DOMAIN=femtat-zu.myshopify.com
VITE_SF_STOREFRONT_TOKEN=your_token_here
VITE_SF_API_VERSION=2025-01
```

**Note:** `.env` files are gitignored for security.

### If Netlify Dev doesn't work:

1. Make sure you have Netlify CLI installed:
   ```powershell
   npm install -g netlify-cli
   ```

2. For Netlify Functions, you also need non-prefixed variables in `.env`:
   ```env
   SHOPIFY_MYSHOPIFY_DOMAIN=femtat-zu.myshopify.com
   SF_STOREFRONT_TOKEN=your_token_here
   SF_API_VERSION=2025-01
   ```

## What Should Work

- ✅ Homepage loads
- ✅ Product pages load
- ✅ Collections load
- ✅ Navigation works
- ⚠️ "Add to Bag" might fail locally (needs Netlify Function)
- ⚠️ Checkout won't work locally (needs Netlify Function)

## Next Steps

Once the site loads, you can:
1. Test the UI and navigation
2. View products and collections
3. Test the checkout function by deploying to Netlify







