import { useEffect, useState } from "react";
import { ArrowRight, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { notify } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { clearCartId } from "@/lib/cartManagement";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";
import { getCart } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
  subtotal?: number;
}

const FREE_STANDARD_SHIPPING = 150;

export default function MiniCart({ open, onClose, cartId, subtotal: propSubtotal = 0 }: MiniCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !cartId) {
      setCart(null);
      setCartError(null);
      return;
    }

    let cancelled = false;
    const fetchCart = async () => {
      setCartLoading(true);
      setCartError(null);
      try {
        let data = await getCart(cartId);
        if (!data) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          data = await getCart(cartId);
        }
        if (cancelled) return;
        if (!data) {
          setCartError("This bag has expired. Add your products again to start a new one.");
          setCart(null);
          clearCartId();
          window.dispatchEvent(new CustomEvent("hp:cartCountUpdate", { detail: { count: 0 } }));
          return;
        }
        setCart(data);
        const count = data.lines?.edges?.reduce((sum: number, edge: any) => sum + edge.node.quantity, 0) ?? 0;
        window.dispatchEvent(new CustomEvent("hp:cartCountUpdate", { detail: { count } }));
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to fetch cart:", error);
        setCartError("Could not load your bag. Close it and try again.");
        setCart(null);
      } finally {
        if (!cancelled) setCartLoading(false);
      }
    };

    fetchCart();
    return () => {
      cancelled = true;
    };
  }, [open, cartId]);

  const fetchCheckoutApi = async (body: object) => {
    const options = {
      method: "POST" as const,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    let response = await fetch(new URL("/api/checkout", window.location.origin).href, options);
    if (!response.ok && response.status === 404) {
      response = await fetch(new URL("/.netlify/functions/checkout", window.location.origin).href, options);
    }
    return response;
  };

  const handleRemoveLine = async (lineId: string) => {
    if (!cartId) return;
    setRemovingLineId(lineId);
    try {
      const response = await fetchCheckoutApi({ cartId, removeLineIds: [lineId] });
      if (!response.ok) throw new Error("Failed to remove line");
      const { cart: updatedCart } = await response.json();
      setCart(updatedCart);
      const count = updatedCart?.lines?.edges?.reduce((sum: number, edge: any) => sum + edge.node.quantity, 0) ?? 0;
      window.dispatchEvent(new CustomEvent("hp:cartCountUpdate", { detail: { count } }));
      notify.success("Item removed");
    } catch {
      notify.error("Could not remove item");
    } finally {
      setRemovingLineId(null);
    }
  };

  const lines = cart?.lines?.edges ?? [];
  const hasItems = lines.length > 0;
  const itemCount = lines.reduce((sum: number, edge: any) => sum + edge.node.quantity, 0);
  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : propSubtotal;
  const currency = cart?.cost?.subtotalAmount?.currencyCode || "AUD";
  const remainingForShipping = Math.max(0, FREE_STANDARD_SHIPPING - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_STANDARD_SHIPPING) * 100);

  const handleCheckout = async () => {
    if (!cartId || !hasItems) {
      notify.error("Your bag is empty");
      return;
    }
    setIsCheckingOut(true);
    try {
      const cartTotal = cart?.cost?.totalAmount?.amount ? parseFloat(cart.cost.totalAmount.amount) : subtotal;
      await trackBeginCheckout({
        cart_total: cartTotal,
        item_count: itemCount,
        currency: cart?.cost?.totalAmount?.currencyCode || currency,
      });

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
      notify.error("Unable to proceed to checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        data-mini-cart=""
        className="flex w-full flex-col gap-0 border-l border-[hsl(var(--after-hours-plum)/0.28)] bg-[hsl(var(--after-hours-cream))] p-0 sm:max-w-[30rem] [&>button]:hidden"
      >
        <header className="flex min-h-24 items-center justify-between border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-5 py-4 text-[hsl(var(--after-hours-cream))] sm:px-7">
          <div>
            <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.66)]">Hair Pinns</p>
            <SheetTitle className="mt-1 font-heading text-3xl font-semibold text-[hsl(var(--after-hours-cream))]">
              Your bag{hasItems ? ` / ${itemCount}` : ""}
            </SheetTitle>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center border border-[hsl(var(--after-hours-cream)/0.34)]" aria-label="Close cart">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7" aria-busy={cartLoading}>
          {cartLoading ? (
            <div data-cart-loading="" className="space-y-5" aria-label="Loading bag">
              {[1, 2].map((item) => (
                <div key={item} className="grid animate-pulse grid-cols-[5rem_1fr] gap-4 border-b border-[hsl(var(--after-hours-plum)/0.18)] pb-5">
                  <div className="aspect-square bg-[hsl(var(--after-hours-plum)/0.1)]" />
                  <div className="space-y-3 pt-1">
                    <div className="h-4 w-4/5 bg-[hsl(var(--after-hours-plum)/0.1)]" />
                    <div className="h-3 w-2/5 bg-[hsl(var(--after-hours-plum)/0.08)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : cartError ? (
            <div data-cart-error="" className="border-y border-[hsl(var(--after-hours-plum)/0.25)] py-8 text-[hsl(var(--after-hours-plum))]">
              <p className="font-heading text-2xl font-semibold">Bag unavailable</p>
              <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">{cartError}</p>
              <Link to="/collections" onClick={onClose} className="mt-6 flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-plum)/0.4)] px-4 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>
                Browse products <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : hasItems ? (
            <div data-cart-lines="" className="text-[hsl(var(--after-hours-plum))]">
              <ol>
                {lines.map((edge: any, index: number) => {
                  const node = edge.node;
                  const merchandise = node.merchandise;
                  const price = parseFloat(merchandise?.price?.amount || "0");
                  const lineCurrency = merchandise?.price?.currencyCode || currency;
                  const productPath = merchandise?.product?.handle ? `/products/${merchandise.product.handle}` : null;
                  const variantTitle = merchandise?.title && merchandise.title !== "Default Title" ? merchandise.title : null;
                  return (
                    <li key={node.id} className="grid grid-cols-[5rem_minmax(0,1fr)_2.75rem] gap-4 border-b border-[hsl(var(--after-hours-plum)/0.2)] py-5 first:pt-0">
                      {productPath ? (
                        <Link to={productPath} onClick={onClose} className="block aspect-square bg-white p-1">
                          <img src={merchandise?.image?.url || "/placeholder.svg"} alt={merchandise?.image?.altText || merchandise?.product?.title || "Product"} className="h-full w-full object-contain" loading="lazy" decoding="async" width="160" height="160" />
                        </Link>
                      ) : (
                        <div className="aspect-square bg-white p-1">
                          <img src={merchandise?.image?.url || "/placeholder.svg"} alt={merchandise?.image?.altText || merchandise?.product?.title || "Product"} className="h-full w-full object-contain" loading="lazy" decoding="async" width="160" height="160" />
                        </div>
                      )}
                      <div className="min-w-0 pt-1">
                        <p className="font-mono text-[0.65rem] text-[hsl(var(--after-hours-plum)/0.62)]">{String(index + 1).padStart(2, "0")}</p>
                        {productPath ? (
                          <Link to={productPath} onClick={onClose} className="mt-2 block font-heading text-lg font-semibold leading-tight" style={{ color: "hsl(var(--after-hours-plum))" }}>{merchandise.product.title || "Product"}</Link>
                        ) : (
                          <p className="mt-2 font-heading text-lg font-semibold leading-tight">{merchandise?.product?.title || "Product"}</p>
                        )}
                        {variantTitle && <p className="mt-1 text-xs text-[hsl(var(--after-hours-plum)/0.7)]">{variantTitle}</p>}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span>Qty {node.quantity}</span>
                          <span className="font-semibold">{formatPrice(price * node.quantity, lineCurrency)}</span>
                        </div>
                      </div>
                      <button type="button" className="flex h-11 w-11 items-center justify-center self-start text-[hsl(var(--after-hours-plum)/0.7)] hover:text-destructive disabled:opacity-50" onClick={() => handleRemoveLine(node.id)} disabled={removingLineId === node.id} aria-label={`Remove ${merchandise?.product?.title || "item"} from bag`}>
                        {removingLineId === node.id ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <section data-cart-shipping="" className="border-b border-[hsl(var(--after-hours-plum)/0.2)] py-7" aria-label="Free standard shipping progress">
                <div className="flex items-start justify-between gap-4 text-sm font-semibold">
                  <p>{remainingForShipping === 0 ? "Free standard shipping unlocked" : `${formatPrice(remainingForShipping, currency)} until free standard shipping`}</p>
                  <span className="font-mono text-xs">$150</span>
                </div>
                <div className="mt-4 h-1 bg-[hsl(var(--after-hours-plum)/0.16)]" role="progressbar" aria-label="Free standard shipping progress" aria-valuemin={0} aria-valuemax={150} aria-valuenow={Math.min(subtotal, 150)}>
                  <div className="h-full bg-[hsl(var(--after-hours-copper))]" style={{ width: `${shippingProgress}%` }} />
                </div>
                <p className="mt-4 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.7)]">Standard shipping is $9.95. Free standard shipping applies from $150.</p>
                <Link to="/policies/shipping" onClick={onClose} className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4" style={{ color: "hsl(var(--after-hours-plum))" }}>Shipping details</Link>
              </section>

              <div className="py-6 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.72)]">
                <Link to="/policies/returns" onClick={onClose} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4" style={{ color: "hsl(var(--after-hours-plum))" }}>14-day returns on unopened products</Link>
              </div>
            </div>
          ) : (
            <div data-cart-empty="" className="py-10 text-[hsl(var(--after-hours-plum))]">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.66)]">Nothing here yet</p>
              <h3 className="mt-4 max-w-[9ch] font-heading text-4xl font-semibold leading-[0.95]">Your bag is empty.</h3>
              <p className="mt-5 max-w-[24rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.74)]">Browse Jena’s product shelf or shop the full catalogue.</p>
              <Link to="/collections" onClick={onClose} className="mt-7 flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                Browse products <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>

        <footer data-cart-checkout="" className="border-t border-[hsl(var(--after-hours-plum)/0.24)] bg-[#efe5df] px-5 py-5 text-[hsl(var(--after-hours-plum))] sm:px-7">
          {hasItems && (
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <span className="text-sm">Subtotal</span>
              <strong className="font-heading text-2xl">{formatPrice(subtotal, currency)}</strong>
            </div>
          )}
          <button type="button" className="flex min-h-12 w-full items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold text-[hsl(var(--after-hours-cream))] disabled:cursor-not-allowed disabled:opacity-45" onClick={handleCheckout} disabled={isCheckingOut || !hasItems}>
            <span>{isCheckingOut ? "Opening checkout…" : "Checkout"}</span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className="mt-2 flex min-h-11 w-full items-center justify-center text-sm font-semibold underline underline-offset-4" onClick={onClose}>Continue shopping</button>
          {hasItems && <p className="mt-3 text-center text-[0.68rem] leading-4 text-[hsl(var(--after-hours-plum)/0.66)]">Shipping and any taxes are confirmed in Shopify checkout.</p>}
        </footer>
      </SheetContent>
    </Sheet>
  );
}
