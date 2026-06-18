import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getCartId } from "@/lib/cartManagement";
import { trackAddToCart } from "@/lib/ecommerceTracking";

/**
 * Quick add-to-cart hook for product cards on the homepage, collections
 * pages, and anywhere else where the user should be able to add a product
 * to their bag without navigating to the PDP.
 *
 * Behaviour:
 *  - Calls POST /api/checkout Edge Function with the variantId
 *  - Stores the returned cartId in localStorage for follow-up adds
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
        const existingCartId = getCartId();
        let response: Response | null = null;
        let useCartId: string | null = existingCartId;
        for (let attempt = 0; attempt < 2; attempt++) {
          response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lines: [{ merchandiseId: opts.variantId, quantity: 1 }],
              ...(useCartId && { cartId: useCartId }),
            }),
          });
          if (response.ok) break;
          if (attempt === 0 && existingCartId) {
            useCartId = null;
            localStorage.removeItem("hp_cart_id");
          }
        }

        if (!response || !response.ok) {
          throw new Error("Failed to add to cart");
        }

        const { cartId } = await response.json();
        if (cartId) localStorage.setItem("hp_cart_id", cartId);

        trackAddToCart({
          product_id: opts.productId ?? opts.variantId,
          title: opts.title,
          variant_id: opts.variantId,
          price: opts.price,
          currency: opts.currency ?? "AUD",
          quantity: 1,
        });

        toast.success("Added to bag!");
        window.dispatchEvent(new CustomEvent("hp:openMiniCart"));
      } catch (err) {
        console.error("[useQuickAddToCart] add failed:", err);
        toast.error("Couldn't add to bag — please try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy]
  );

  return { addToCart, busy };
}
