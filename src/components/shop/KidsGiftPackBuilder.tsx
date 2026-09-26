import { useState } from "react";
import { Link } from "react-router-dom";
import { addCartLines, getCartSnapshot } from "@/lib/cartApi";
import { getCartId } from "@/lib/cartManagement";
import { buildGiftSelection, giftCategory, giftQuantitiesWereAdded, maxGiftQuantity, orderGiftProducts, sellableGiftVariants, type GiftCategory, type GiftChoice, type GiftProduct } from "@/lib/kidsGiftSelection";
import { notify } from "@/hooks/use-toast";

export default function KidsGiftPackBuilder({ products }: { products: GiftProduct[] }) {
  const [choices, setChoices] = useState<Record<string, GiftChoice>>({});
  const [activeCategory, setActiveCategory] = useState<GiftCategory | "all">("all");
  const [adding, setAdding] = useState(false);
  const sellableProducts = orderGiftProducts(products);
  const visibleProducts = activeCategory === "all" ? sellableProducts : sellableProducts.filter((product) => giftCategory(product) === activeCategory);
  const selection = buildGiftSelection(sellableProducts, choices);
  const itemCount = selection.lines.reduce((sum, line) => sum + line.quantity, 0);
  const hasUnavailableChoice = Object.keys(choices).length !== selection.lines.length;
  const price = new Intl.NumberFormat("en-AU", { style: "currency", currency: selection.currency }).format(selection.subtotal);

  const addSelection = async () => {
    if (!selection.lines.length || adding || hasUnavailableChoice) return;
    setAdding(true);
    try {
      const existingCartId = getCartId();
      const before = existingCartId ? await getCartSnapshot(existingCartId).catch(() => null) : null;
      const cart = await addCartLines(selection.lines);
      window.dispatchEvent(new CustomEvent("hp:openMiniCart", { detail: { cart, cartId: cart.id } }));
      if (giftQuantitiesWereAdded(before, cart, selection.lines)) notify.success(`${itemCount} ${itemCount === 1 ? "item" : "items"} added to your bag`);
      else notify.error("Shopify adjusted an item to available stock. Please check the quantities in your bag.");
    } catch {
      notify.error("We couldn't add your selection. Please check the options and try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="bg-[hsl(var(--hp-lavender))] py-10 md:py-14" aria-labelledby="kids-gift-builder-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[hsl(var(--hp-purple))]">Choose their favourites</p>
        <h2 id="kids-gift-builder-heading" className="mt-3 max-w-[18ch] font-heading text-3xl leading-tight text-[hsl(var(--hp-ink))] md:text-4xl">Make it their kind of gift.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--hp-ink))]">Pick the products and colours they will actually use. Jena will pack your selected items together as one gift. The exact choices go into your bag, with Shopify confirming the final total at checkout.</p>
        {sellableProducts.length === 0 ? (
          <p className="mt-8 text-sm">There are no items available to choose right now. <Link className="underline" to="/collections/haircare-bundles-gift-sets">Browse other gifts</Link>.</p>
        ) : (
          <>
            <div className="mt-7 flex flex-wrap gap-2" aria-label="Filter gift choices">
              {([ ["all", "All items"], ["brushes", "Brushes & combs"], ["ponytails", "Ponytails"], ["extras", "Little extras"] ] as const).map(([category, label]) => (
                <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`min-h-11 border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--hp-purple))] ${activeCategory === category ? "border-[hsl(var(--hp-purple))] bg-[hsl(var(--hp-purple))] text-white" : "border-[hsl(var(--hp-purple)/0.4)] bg-white text-[hsl(var(--hp-ink))]"}`}>{label}</button>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const variants = sellableGiftVariants(product);
                const choice = choices[product.id];
                const selectedVariant = variants.find((variant) => variant.id === choice?.variantId);
                const image = selectedVariant?.image?.url || product.images?.edges?.[0]?.node?.url;
                const imageAlt = selectedVariant?.image?.altText || product.images?.edges?.[0]?.node?.altText || product.title;
                return (
                  <article key={product.id} className="flex min-w-0 flex-col border border-[hsl(var(--hp-lilac))] bg-white p-4">
                    <Link to={`/products/${product.handle}`} className="block aspect-square bg-[hsl(var(--hp-lavender))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--hp-purple))]">
                      {image && <img src={image} alt={imageAlt} loading="lazy" width="480" height="480" className="h-full w-full object-contain" />}
                    </Link>
                    <h3 className="mt-4 font-heading text-xl leading-tight text-[hsl(var(--hp-ink))]">{product.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-[hsl(var(--hp-ink))]">{new Intl.NumberFormat("en-AU", { style: "currency", currency: variants[0].price.currencyCode }).format(Number(selectedVariant?.price.amount || variants[0].price.amount))}</p>
                    <div className="mt-auto pt-4">
                      <label htmlFor={`gift-option-${product.id}`} className="block text-sm font-medium text-[hsl(var(--hp-ink))]">{variants.length > 1 ? "Colour or style" : "Choose item"}</label>
                      <select
                        id={`gift-option-${product.id}`}
                        value={choice?.variantId || ""}
                        onChange={(event) => setChoices((current) => {
                          const next = { ...current };
                          const nextVariant = variants.find((variant) => variant.id === event.target.value);
                          if (nextVariant) next[product.id] = { variantId: nextVariant.id, quantity: Math.min(current[product.id]?.quantity || 1, maxGiftQuantity(nextVariant)) };
                          else delete next[product.id];
                          return next;
                        })}
                        className="mt-2 min-h-11 w-full border border-[hsl(var(--hp-purple)/0.5)] bg-white px-3 text-sm text-[hsl(var(--hp-ink))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--hp-purple))]"
                      >
                        <option value="">Not in my gift</option>
                        {variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.title === "Default Title" ? "Add this item" : variant.title}</option>)}
                      </select>
                      {choice && <div className="mt-3 flex items-center gap-3">
                        <label htmlFor={`gift-qty-${product.id}`} className="text-sm font-medium text-[hsl(var(--hp-ink))]">Quantity</label>
                        <select id={`gift-qty-${product.id}`} value={choice.quantity} onChange={(event) => setChoices((current) => ({ ...current, [product.id]: { ...current[product.id], quantity: Number(event.target.value) } }))} className="min-h-11 border border-[hsl(var(--hp-purple)/0.5)] bg-white px-3 text-[hsl(var(--hp-ink))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--hp-purple))]">
                          {Array.from({ length: selectedVariant ? maxGiftQuantity(selectedVariant) : 1 }, (_, index) => index + 1).map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}
                        </select>
                      </div>}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 border-t border-[hsl(var(--hp-lilac))] bg-white px-4 py-4 shadow-sm sm:px-6">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div aria-live="polite"><p className="font-semibold text-[hsl(var(--hp-ink))]">{itemCount} {itemCount === 1 ? "item" : "items"} selected · {price}</p><p className="text-xs text-[hsl(var(--hp-ink)/0.72)]">Subtotal before delivery and any eligible Shopify discount. Final total appears in your bag.</p>{hasUnavailableChoice && <p className="mt-1 text-sm font-semibold text-[hsl(var(--hp-ink))]">One option or quantity has changed. Please choose an available one before adding your gift.</p>}</div>
                <button type="button" disabled={!selection.lines.length || adding || hasUnavailableChoice} onClick={addSelection} className="min-h-12 bg-[hsl(var(--hp-purple))] px-8 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--hp-ink))] disabled:cursor-not-allowed disabled:opacity-50">{adding ? "Adding to bag…" : "Add my selection to bag"}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
