import { useState, useCallback } from "react";
import { notify } from "@/hooks/use-toast";
import { addCartLines } from "@/lib/cartApi";
import { trackAddToCart } from "@/lib/ecommerceTracking";

/**
 * Quick add-to-cart hook for product cards on the homepage, collections
 * pages, and anywhere else where the user should be able to add a product
 * to their bag without navigating to the PDP.
 *
 * Behaviour:
 *  - Adds through the authoritative server cart boundary
 *  - Dispatches hp:openMiniCart so the MiniCartDrawer slides in
 *  - Tracks add_to_cart via the same ecommerceTracking module the PDP uses
 *  - Surfaces toast feedback (success / error)
 *
 * The PDP uses the same primitives — this hook is the card-context wrapper.
 */
export function useQuickAddToCart() {
  const [busy, setBusy] = useState(false);

  const addToCart = useCallback(
    async (opts: {
      variantId: string;
      productId?: string;
      title: string;
      price: number;
      currency?: string;
    }) => {
      if (busy) return;
      setBusy(true);
      try {
        const cart = await addCartLines([{ merchandiseId: opts.variantId, quantity: 1 }]);

        void trackAddToCart({
          product_id: opts.productId ?? opts.variantId,
          title: opts.title,
          variant_id: opts.variantId,
          price: opts.price,
          currency: opts.currency ?? "AUD",
          quantity: 1,
        });

        notify.success("Added to bag!");
        window.dispatchEvent(new CustomEvent("hp:openMiniCart", { detail: { cart, cartId: cart.id } }));
      } catch (err) {
        console.error("[useQuickAddToCart] add failed:", err);
        notify.error("Couldn't add to bag — please try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy]
  );

  return { addToCart, busy };
}
