import { useState } from "react";
import { ArrowRight, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { notify } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";
import { formatPrice } from "@/lib/utils";
import { gotoCheckout } from "@/lib/checkout";
import { useCart } from "@/contexts/CartContext";
import {
  FREE_EXTRA_PROMOTION,
  getActivePromotion,
  getActiveSitewidePromotion,
  getCheckoutDiscountCodes,
  getPromotionCartState,
} from "@/config/promotions";
import { usePromotionNow } from "@/hooks/use-promotion-now";

export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  subtotal?: number;
}

const FREE_STANDARD_SHIPPING = 150;

export default function MiniCart({ open, onClose, subtotal: propSubtotal = 0 }: MiniCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);
  const { cart, cartLoading, cartError, removeLine, prepareCheckout } = useCart();
  const cartId = cart?.id || "";

  const handleRemoveLine = async (lineId: string) => {
    if (!cartId) return;
    setRemovingLineId(lineId);
    try {
      const updatedCart = await removeLine(lineId);
      notify.success(updatedCart ? "Item removed" : "Your previous bag expired. You can start a new one.");
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
  const promotionNow = usePromotionNow();
  const activePromotion = getActivePromotion(promotionNow);
  const activeSitewidePromotion = getActiveSitewidePromotion(promotionNow);
  const promotionCartState = getPromotionCartState(
    lines.map((edge: any) => ({
      quantity: edge.node.quantity,
      productTags: edge.node.merchandise?.product?.tags ?? [],
      productHandle: edge.node.merchandise?.product?.handle,
    })),
  );
  const promotionMessage = promotionCartState.unapprovedGiftUnits > 0
    ? "That item is not one of the three listed gifts. Choose one travel bottle, soft head towel or purple wide-tooth comb."
    : promotionCartState.giftUnits > FREE_EXTRA_PROMOTION.maximumDiscountedGiftsPerOrder
      ? `Choose exactly one free extra. Remove ${promotionCartState.giftUnits - FREE_EXTRA_PROMOTION.maximumDiscountedGiftsPerOrder} ${promotionCartState.giftUnits - FREE_EXTRA_PROMOTION.maximumDiscountedGiftsPerOrder === 1 ? "extra" : "extras"} before the offer can apply.`
    : promotionCartState.shouldApplyCode
      ? "Offer ready. We’ll confirm the free extra before checkout."
      : promotionCartState.qualifyingUnits >= 2
        ? "Your two eligible products are in. Choose and add one free extra."
        : `Add ${2 - promotionCartState.qualifyingUnits} more eligible hair ${2 - promotionCartState.qualifyingUnits === 1 ? "product" : "products"}, then choose one free extra.`;

  const handleCheckout = async () => {
    if (!cartId || !hasItems) {
      notify.error("Your bag is empty");
      return;
    }
    setIsCheckingOut(true);
    try {
      const checkoutNow = new Date();
      const checkoutPromotion = getActivePromotion(checkoutNow);
      const existingDiscountCodes = (cart?.discountCodes ?? []).map((discount: any) => discount.code);
      const discountCodes = getCheckoutDiscountCodes({
        existingCodes: existingDiscountCodes,
        promotionEligible: promotionCartState.shouldApplyCode,
        now: checkoutNow,
      });
      const shouldApplyPromotion = Boolean(
        checkoutPromotion && discountCodes.includes(FREE_EXTRA_PROMOTION.discountCode),
      );
      const discountedCart = await prepareCheckout(discountCodes);

      if (shouldApplyPromotion && checkoutPromotion) {
        const applied = discountedCart?.discountCodes?.some(
          (discount: any) => discount.code === checkoutPromotion.discountCode && discount.applicable,
        );
        if (!applied) {
          await prepareCheckout(existingDiscountCodes);
          notify.error("The free extra could not be applied. Check the offer items in your bag and try again.");
          setIsCheckingOut(false);
          return;
        }
      }

      const checkoutCartTotal = discountedCart?.cost?.totalAmount?.amount ?? cart?.cost?.totalAmount?.amount;
      const cartTotal = checkoutCartTotal ? parseFloat(checkoutCartTotal) : subtotal;
      void trackBeginCheckout({
        cart_total: cartTotal,
        item_count: itemCount,
        currency: discountedCart?.cost?.totalAmount?.currencyCode || cart?.cost?.totalAmount?.currencyCode || currency,
        items: lines.map((edge: any) => {
          const merchandise = edge.node.merchandise;
          return {
            product_id: merchandise?.product?.id || merchandise?.id,
            variant_id: merchandise?.id,
            title: merchandise?.product?.title || merchandise?.title || "Product",
            price: parseFloat(merchandise?.price?.amount || "0"),
            currency: merchandise?.price?.currencyCode || currency,
            quantity: edge.node.quantity,
          };
        }),
      });

      if (!discountedCart.checkoutUrl) throw new Error("Checkout URL unavailable");
      gotoCheckout(discountedCart.checkoutUrl);
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
              {activeSitewidePromotion && (
                <section
                  data-cart-sitewide-promotion=""
                  aria-label="Site-wide buy two get one free offer"
                  className="mb-6 border border-[hsl(var(--after-hours-copper)/0.65)] bg-[#f3e8df] p-4"
                >
                  <p className="after-hours-kicker text-[hsl(var(--after-hours-plum))]">Site-wide sale</p>
                  <p className="mt-2 font-heading text-xl font-semibold">Buy 2 products. Get the cheapest of your 3 free.</p>
                  <p className="mt-2 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.74)]">
                    Add any three products to your bag, then enter code <strong>SALE</strong> at checkout. Cannot be combined with another discount.
                  </p>
                  <Link
                    to={activeSitewidePromotion.landingPath}
                    onClick={onClose}
                    className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4"
                    style={{ color: "hsl(var(--after-hours-plum))" }}
                  >
                    Add another product
                  </Link>
                </section>
              )}
              {activePromotion && (
                <section
                  data-cart-promotion=""
                  aria-label="Free extra offer"
                  className="mb-6 border border-[hsl(var(--after-hours-copper)/0.65)] bg-[#f3e8df] p-4"
                >
                  <p className="font-heading text-xl font-semibold">Your free extra is waiting.</p>
                  <p className="mt-2 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.74)]">
                    {promotionMessage} One free extra per order. The discount is applied automatically when the offer is valid.
                  </p>
                  <Link
                    to={activePromotion.landingPath}
                    onClick={onClose}
                    className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold underline underline-offset-4"
                    style={{ color: "hsl(var(--after-hours-plum))" }}
                  >
                    See eligible products and gifts
                  </Link>
                </section>
              )}
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
              {activeSitewidePromotion && (
                <section
                  data-cart-sitewide-promotion=""
                  aria-label="Site-wide buy two get one free offer"
                  className="mb-8 border border-[hsl(var(--after-hours-copper)/0.65)] bg-[#f3e8df] p-4"
                >
                  <p className="after-hours-kicker text-[hsl(var(--after-hours-plum))]">Site-wide sale</p>
                  <p className="mt-2 font-heading text-xl font-semibold">Pick any three. The cheapest is free.</p>
                  <p className="mt-2 text-xs leading-5 text-[hsl(var(--after-hours-plum)/0.74)]">
                    Add any three products to your bag, then enter code <strong>SALE</strong> at checkout. Cannot be combined with another discount.
                  </p>
                </section>
              )}
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
          <button type="button" className="flex min-h-12 w-full items-center justify-between bg-[hsl(var(--after-hours-plum))] px-5 py-3 text-sm font-semibold text-[hsl(var(--after-hours-cream))] disabled:cursor-not-allowed disabled:opacity-45" onClick={handleCheckout} disabled={isCheckingOut || cartLoading || !!cartError || !hasItems}>
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
