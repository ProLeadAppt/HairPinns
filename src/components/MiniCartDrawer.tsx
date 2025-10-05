import { useEffect, useState } from "react";
import { getCheckoutUrl } from "@/lib/cartManagement";
import { fetchShopify } from "@/lib/shopify";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";

type Line = { qty: number; title: string; variant: string };

export default function MiniCartDrawer({
  open,
  onClose,
  cartId,
}: {
  open: boolean;
  onClose: () => void;
  cartId: string;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [subtotal, setSubtotal] = useState<string>("0.00");
  const [subtotalAmount, setSubtotalAmount] = useState<number>(0);
  const [checkout, setCheckout] = useState<string>("");

  useEffect(() => {
    if (!open || !cartId) return;
    (async () => {
      const q = `
      query($id:ID!){
        cart(id:$id){
          checkoutUrl
          cost{ subtotalAmount{ amount currencyCode } }
          lines(first:20){
            nodes{
              quantity
              merchandise{ ... on ProductVariant{
                id title product{ title }
              }}
            }
          }
        }
      }`;
      const d = await fetchShopify<any>(q, { id: cartId });
      const c = d.cart;
      setCheckout(c.checkoutUrl);
      setSubtotal(
        `${c.cost.subtotalAmount.amount} ${c.cost.subtotalAmount.currencyCode}`
      );
      setSubtotalAmount(parseFloat(c.cost.subtotalAmount.amount));
      setLines(
        c.lines.nodes.map((n: any) => ({
          qty: n.quantity,
          title: `${n.merchandise.product.title} — ${n.merchandise.title}`,
          variant: n.merchandise.id,
        }))
      );
    })();
  }, [open, cartId]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    // Validate checkout URL exists
    if (!checkout) {
      console.error("❌ No checkout URL available");
      return;
    }

    setIsCheckingOut(true);

    // Track begin_checkout to Zapier (non-blocking)
    try {
      await trackBeginCheckout({
        cart_total: subtotalAmount,
        item_count: lines.length,
        currency: "AUD",
      });
      console.log("✅ Checkout tracking successful");
    } catch (error) {
      console.warn("⚠️ Tracking failed, but proceeding to checkout:", error);
    }

    // Redirect to Shopify checkout
    console.log("🛒 Redirecting to checkout:", checkout);
    window.location.href = checkout;
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-card shadow-xl p-6 flex flex-col">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-heading">Your bag</h2>
          <button onClick={onClose} className="text-sm underline text-foreground">
            Close
          </button>
        </header>
        <div className="flex-1 space-y-3 overflow-auto">
          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          ) : (
            lines.map((l, i) => (
              <div key={i} className="border border-border rounded-card p-3">
                <div className="text-sm text-heading">{l.title}</div>
                <div className="text-xs text-muted-foreground">Qty: {l.qty}</div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foreground">Subtotal</span>
            <strong className="text-sm text-heading">{subtotal}</strong>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || lines.length === 0}
            className="block w-full text-center py-3 rounded-card bg-brand-500 text-primary-foreground font-semibold hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? "Redirecting..." : "Checkout"}
          </button>
        </div>
      </aside>
    </div>
  );
}
