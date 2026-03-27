import { useState, useEffect } from "react";
import { X, ShoppingBag, ArrowRight, Shield, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";
import FreeShippingBar from "@/components/conversion/FreeShippingBar";
import { Link } from "react-router-dom";
import { searchProducts, getCart } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import EstimatedDelivery from "@/components/product/EstimatedDelivery";
import { clearCartId } from "@/lib/cartManagement";
import { toast } from "sonner";

export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
  subtotal?: number; // Optional subtotal for free shipping bar
}

/**
 * MiniCart for headless Shopify checkout
 * Fetches and displays actual cart contents, redirects to Shopify checkout
 */
export default function MiniCart({ open, onClose, cartId, subtotal: propSubtotal = 0 }: MiniCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  // Fetch cart when drawer opens and we have a cartId
  useEffect(() => {
    if (open && cartId) {
      setCartLoading(true);
      setCartError(null);

      const fetchCart = async () => {
        try {
          let data = await getCart(cartId);
          if (!data) {
            // Retry once - Shopify carts can be temporarily unavailable
            await new Promise(r => setTimeout(r, 1000));
            data = await getCart(cartId);
          }
          if (data) {
            setCart(data);
            // Dispatch cart count for header badge
            const count = data?.lines?.edges?.reduce((sum: number, e: any) => sum + e.node.quantity, 0) ?? 0;
            window.dispatchEvent(new CustomEvent("hp:cartCountUpdate", { detail: { count } }));
          } else {
            setCartError("Your cart has expired. Please add items again.");
            setCart(null);
            clearCartId();
            window.dispatchEvent(new CustomEvent("hp:cartCountUpdate", { detail: { count: 0 } }));
          }
        } catch (err) {
          console.error("Failed to fetch cart:", err);
          setCartError("Could not load cart. Please try again.");
          setCart(null);
        } finally {
          setCartLoading(false);
        }
      };

      fetchCart();
    } else {
      setCart(null);
      setCartError(null);
    }
  }, [open, cartId]);

  // Fetch upsell products when drawer opens
  useEffect(() => {
    if (open) {
      const fetchUpsells = async () => {
        try {
          const result = await searchProducts("", 3);
          if (result?.products) {
            const products = result.products
              .filter((p: any) => p.availableForSale)
              .slice(0, 2)
              .map((product: any) => {
                const firstImage = product.images?.edges?.[0]?.node;
                const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                return {
                  id: product.id,
                  slug: product.handle,
                  title: product.title,
                  price: price,
                  currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                  image: firstImage?.url || "/placeholder.svg",
                };
              });
            setUpsellProducts(products);
          }
        } catch (error) {
          console.error("Failed to fetch upsells:", error);
        }
      };
      fetchUpsells();
    }
  }, [open]);

  const fetchCheckoutApi = async (body: object) => {
    const opts = {
      method: "POST" as const,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    let res = await fetch(new URL("/api/checkout", window.location.origin).href, opts);
    if (!res.ok && res.status === 404) {
      res = await fetch(new URL("/.netlify/functions/checkout", window.location.origin).href, opts);
    }
    return res;
  };

  const handleRemoveLine = async (lineId: string) => {
    if (!cartId) return;
    setRemovingLineId(lineId);
    try {
      const response = await fetchCheckoutApi({ cartId, removeLineIds: [lineId] });
      if (!response.ok) throw new Error("Failed to remove");
      const { cart: updatedCart } = await response.json();
      setCart(updatedCart);
      // Update header badge count
      const newCount = updatedCart?.lines?.edges?.reduce((sum: number, e: any) => sum + e.node.quantity, 0) ?? 0;
      window.dispatchEvent(new CustomEvent("hp:cartCountUpdate", { detail: { count: newCount } }));
      toast.success("Item removed");
    } catch {
      toast.error("Could not remove item");
    } finally {
      setRemovingLineId(null);
    }
  };

  const handleCheckout = async () => {
    if (!cartId) {
      toast.error("Your bag is empty");
      return;
    }
    setIsCheckingOut(true);

    try {
      const cartTotal = cart?.cost?.totalAmount?.amount
        ? parseFloat(cart.cost.totalAmount.amount)
        : 0;
      const itemCount = cart?.lines?.edges?.reduce((sum: number, e: any) => sum + e.node.quantity, 0) ?? 0;

      await trackBeginCheckout({
        cart_total: cartTotal,
        item_count: itemCount,
        currency: cart?.cost?.totalAmount?.currencyCode || "AUD",
      });

      // Use form POST with redirect - server returns 303, browser follows natively.
      // This avoids JS redirect issues, extensions, or URL corruption.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${window.location.origin}/.netlify/functions/checkout?redirect=true`;
      form.style.display = "none";

      const cartIdInput = document.createElement("input");
      cartIdInput.type = "hidden";
      cartIdInput.name = "cartId";
      cartIdInput.value = cartId;
      form.appendChild(cartIdInput);

      const linesInput = document.createElement("input");
      linesInput.type = "hidden";
      linesInput.name = "lines";
      linesInput.value = "[]";
      form.appendChild(linesInput);

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Unable to proceed to checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : propSubtotal;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-background shadow-2xl z-[61] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-border bg-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-heading">Your Bag</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-background/80"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close cart</span>
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cart Items */}
          {cartLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg border border-border animate-pulse">
                  <div className="w-16 h-16 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : cartError ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{cartError}</p>
              <p className="text-sm text-muted-foreground mt-2">Add items to get started.</p>
            </div>
          ) : cart?.lines?.edges?.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-heading">Your bag</h3>
              {cart.lines.edges.map((edge: any) => {
                const node = edge.node;
                const merch = node.merchandise;
                const price = parseFloat(merch?.price?.amount || "0");
                const currency = merch?.price?.currencyCode || "AUD";
                return (
                  <div
                    key={node.id}
                    className="flex gap-3 p-3 rounded-lg border border-border group"
                  >
                    {merch?.product?.handle ? (
                      <Link
                        to={`/products/${merch.product.handle}`}
                        onClick={onClose}
                        className="block w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                      >
                        <img
                          src={merch?.image?.url || "/placeholder.svg"}
                          alt={merch?.product?.title || ""}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={merch?.image?.url || "/placeholder.svg"}
                          alt={merch?.product?.title || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {merch?.product?.handle ? (
                        <Link
                          to={`/products/${merch.product.handle}`}
                          onClick={onClose}
                          className="text-sm font-semibold text-heading line-clamp-2 hover:underline"
                        >
                          {merch.product.title || "Product"}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-heading line-clamp-2">
                          {merch?.product?.title || "Product"}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                        Qty: {node.quantity}
                      </span>
                      <p className="text-sm font-bold text-brand-500 mt-1">
                        {formatPrice(price * node.quantity, currency)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveLine(node.id)}
                      disabled={removingLineId === node.id}
                      aria-label="Remove item"
                    >
                      {removingLineId === node.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : !cartId ? (
            <div className="text-center py-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add items to get started.</p>
              <Button asChild variant="primary" size="sm" className="mt-4">
                <Link to="/collections" onClick={onClose}>Browse Collections</Link>
              </Button>
            </div>
          ) : null}

          {/* Free Shipping Bar */}
          {subtotal > 0 && (
            <>
              <FreeShippingBar subtotal={subtotal} threshold={150} />
              <EstimatedDelivery cartTotal={subtotal} />
            </>
          )}

          {/* Upsell Products */}
          {upsellProducts.length > 0 && (
            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-semibold text-heading mb-4">
                You might also like
              </h4>
              <div className="space-y-3">
                {upsellProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex gap-3 p-3 rounded-lg border border-border hover:border-brand-300 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-heading line-clamp-1 mb-1">
                        {product.title}
                      </h5>
                      <p className="text-sm font-bold text-brand-500">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-brand-500" />
                <span>14-day returns</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-brand-500" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with checkout buttons */}
        <div className="border-t border-border p-6 space-y-3 bg-accent">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
            disabled={isCheckingOut || !cartId}
          >
            {isCheckingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Redirecting...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </div>
      </aside>
    </>
  );
}
