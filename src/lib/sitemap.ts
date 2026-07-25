import { SITE_URL } from "@/config/businessConfig";

export const getOGImage = (type: "default" | "product" | "collection" | "blog" | "suburb" | "service"): string => {
  const ogImages: Record<string, string> = {
    default: `${SITE_URL}/og-default.jpg`,
    product: `${SITE_URL}/og-product.jpg`,
    collection: `${SITE_URL}/og-collection.jpg`,
    blog: `${SITE_URL}/og-blog.jpg`,
    suburb: `${SITE_URL}/og-suburb.jpg`,
    service: `${SITE_URL}/og-service.jpg`,
  };
  return ogImages[type] || `${SITE_URL}/og-default.jpg`;
};
