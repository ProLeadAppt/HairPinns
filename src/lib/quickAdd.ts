/**
 * Quick Add to Cart Utility
 * Adds products to cart without page navigation
 * Shows toast notifications and optionally opens mini cart
 */

import { addCartLines } from "./cartApi";
import { trackAddToCart } from "./ecommerceTracking";
import { trackCartCreated } from "./cartAbandonment";
import { getHpCapture } from "./loadHpCapture";
import { notify } from "@/hooks/use-toast";

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
    const cart = await addCartLines([{ merchandiseId: variantId, quantity }]);
    const cartId = cart.id;
    const checkoutUrl = cart.checkoutUrl;

    // Track quick add clicked
    const hpCapture = await getHpCapture();
    await hpCapture.trackQuickAddClicked(productId, productTitle, "hero").catch(() => {});

    // Track add_to_cart event
    void trackAddToCart({
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
    notify.success(`${productTitle} added to bag!`, {
      description: openMiniCart ? "Opening cart..." : "Continue shopping",
      duration: 2000,
    });

    // Dispatch custom event to open mini cart if needed
    if (openMiniCart && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hp:openMiniCart', { detail: { cart, cartId } }));
    }

    return { cartId, checkoutUrl };
  } catch (error) {
    console.error('Quick add failed:', error);
    notify.error("Couldn't add to bag", {
      description: "Please try again or visit the product page",
      duration: 3000,
    });
    return null;
  }
}
