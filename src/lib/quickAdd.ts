/**
 * Quick Add to Cart Utility
 * Adds products to cart without page navigation
 * Shows toast notifications and optionally opens mini cart
 */

import { getCartId, saveCartId } from "./cartManagement";
import { trackAddToCart } from "./ecommerceTracking";
import { trackCartCreated } from "./cartAbandonment";
import { hpCapture } from "./hpCapture";
import { toast } from "sonner";

export interface QuickAddProduct {
  variantId: string;
  productId: string;
  productTitle: string;
  price: number;
  currency: string;
  quantity?: number;
}

/**
 * Quick add to cart - adds product without page navigation
 * @param product Product details to add
 * @param openMiniCart Whether to open mini cart drawer after adding
 * @returns Cart ID and checkout URL, or null if failed
 */
export async function quickAddToCart(
  product: QuickAddProduct,
  openMiniCart: boolean = true
): Promise<{ cartId: string; checkoutUrl: string } | null> {
  const { variantId, productId, productTitle, price, currency, quantity = 1 } = product;

  try {
    const existingCartId = getCartId();

    // Call Edge Function to add to cart
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lines: [{ merchandiseId: variantId, quantity }],
        ...(existingCartId && { cartId: existingCartId }),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    const { checkoutUrl, cartId } = await response.json();

    // Store cart ID for future additions
    if (cartId) {
      saveCartId(cartId);
    }

    // Track quick add clicked
    await hpCapture.trackQuickAddClicked(productId, productTitle, "hero").catch(() => {});

    // Track add_to_cart event
    await trackAddToCart({
      product_id: productId,
      title: productTitle,
      variant_id: variantId,
      price,
      currency,
      quantity,
    });

    // Track cart creation for abandonment recovery
    if (cartId && checkoutUrl) {
      await trackCartCreated(
        cartId,
        checkoutUrl,
        [{
          id: variantId,
          title: productTitle,
          price,
          quantity,
        }],
        price * quantity,
        currency
      );
    }

    // Show success toast
    toast.success(`${productTitle} added to bag!`, {
      description: openMiniCart ? "Opening cart..." : "Continue shopping",
      duration: 2000,
    });

    // Dispatch custom event to open mini cart if needed
    if (openMiniCart && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hp:openMiniCart', { detail: { cartId } }));
    }

    return { cartId, checkoutUrl };
  } catch (error) {
    console.error('Quick add failed:', error);
    toast.error("Couldn't add to bag", {
      description: "Please try again or visit the product page",
      duration: 3000,
    });
    return null;
  }
}
