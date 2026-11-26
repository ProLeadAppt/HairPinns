import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";

export interface ProductSeoOverride {
  title: string;
  description: string;
}

const PRODUCT_SEO_OVERRIDES: Record<string, ProductSeoOverride> = {
  "island-vibes-self-tanning-foam": {
    title: "Island Vibes Self-Tanning Foam | Shop AU | Hair Pinns",
    description: `Shop Island Vibes Self-Tanning Foam at Hair Pinns. Fast-drying, streak-free self-tanning foam shipped Australia-wide with free shipping over ${FREE_SHIPPING_THRESHOLD_DISPLAY}.`,
  },
};

/** Optional per-handle title and description. Missing handles keep the default product metadata. */
export const getProductSeoOverride = (handle: string | undefined): ProductSeoOverride | undefined =>
  handle ? PRODUCT_SEO_OVERRIDES[handle] : undefined;
