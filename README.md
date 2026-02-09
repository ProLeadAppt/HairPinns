# HairPinns - E-commerce Website

E-commerce website for HairPinns boutique salon, featuring product sales, blog content, and booking integration.

## Technologies

- **Frontend**: React 18, TypeScript, Vite 7
- **UI Framework**: shadcn/ui, Tailwind CSS
- **E-commerce**: Shopify Storefront API
- **Deployment**: Netlify
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Shopify store with Storefront API access

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd HairPinns
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `VITE_SHOPIFY_MYSHOPIFY_DOMAIN` - Your Shopify store domain (e.g., `your-store.myshopify.com`)
- `VITE_SF_STOREFRONT_TOKEN` - Shopify Storefront API access token (public, safe for client-side)
- `VITE_SF_API_VERSION` - Shopify API version (e.g., `2025-01`)
- `VITE_SHOP_DOMAIN` - Your store URL (e.g., `hairpinns.com`)
- `VITE_GHL_INBOUND_WEBHOOK_URL` - GoHighLevel webhook URL (optional, for form submissions)

4. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Shopify Integration

This site uses Shopify's Storefront API for product data and checkout. The integration follows this flow:

1. **Product Display**: Products are fetched from Shopify Storefront API via `src/lib/shopify.ts`
2. **Add to Cart**: Cart operations are handled server-side via `/api/checkout` Netlify function
3. **Checkout**: Users are redirected to Shopify's hosted checkout for payment
4. **Order Confirmation**: After payment, users can view order confirmation

### Environment Variables for Netlify

Set these in Netlify Dashboard → Site Settings → Environment Variables:

- `SHOPIFY_MYSHOPIFY_DOMAIN` - Shopify store domain
- `SF_STOREFRONT_TOKEN` - Storefront API token
- `SF_API_VERSION` - API version (e.g., `2025-01`)

## Project Structure

```
src/
├── components/     # React components
│   ├── cart/      # Cart-related components
│   ├── conversion/# Conversion optimization components
│   ├── home/      # Homepage components
│   └── product/   # Product-related components
├── lib/           # Utility libraries
│   ├── shopify.ts # Shopify API client
│   └── ...
├── pages/         # Page components
└── config/        # Configuration files

netlify/
└── functions/     # Netlify serverless functions
    └── checkout.js # Shopify checkout handler
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

The `netlify.toml` file contains build configuration and redirect rules.

## Features

- **E-commerce**: Full Shopify integration for products and checkout
- **Blog**: SEO-optimized blog with AI SEO support
- **Local SEO**: Suburb-specific pages for local search optimization
- **Conversion Optimization**: Trust badges, urgency bars, product recommendations
- **Analytics**: Custom tracking via hpCapture library

## License

Private project for HairPinns salon.
