import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuickAddToCart } from "@/hooks/useQuickAddToCart";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";
import useViewportImageGate from "@/hooks/useViewportImageGate";
import { mapCollectionProduct } from "@/lib/collectionProduct";

const buildShopifySrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImage(url, width)} ${width}w`).join(", ");

const buildShopifyWebpSrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImageWebp(url, width)} ${width}w`).join(", ");

const BestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { targetRef: sectionRef, imagesEnabled } = useViewportImageGate<HTMLElement>();

  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        const shopifyModule = await import("@/lib/shopify");
        const { getCollectionByHandle, getProductByHandle } = shopifyModule;
        const { HOMEPAGE_PICKS_COLLECTION_HANDLE, BEST_SELLERS_PRODUCT_HANDLES } = await import("@/config/featuredProducts");

        let productList: any[] = [];

        const collection = await getCollectionByHandle(HOMEPAGE_PICKS_COLLECTION_HANDLE);
        if (collection) {
          // Shopify's manual order is authoritative. An intentionally empty
          // collection hides the shelf; it must not refill itself with other stock.
          productList = (collection.products?.edges || []).map((edge: any) => edge.node).filter((p: any) => p?.handle).slice(0, 6);
        } else {
          // Preserve only Jena's existing approved picks during content migration.
          const results = await Promise.allSettled(BEST_SELLERS_PRODUCT_HANDLES.slice(0, 6).map(getProductByHandle));
          productList = results.flatMap(result => result.status === 'fulfilled' && result.value?.handle ? [result.value] : []);
        }

        if (!isMounted) return;

        const mappedProducts = productList.map((product: any) => {
          const card = mapCollectionProduct(product);
          return { ...card, slug: card.handle, variantId: card.quickAddVariantId };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBestSellers();

    return () => {
      isMounted = false;
    };
  }, []);

  const validProducts = products.filter(
    (product) => product.slug && typeof product.slug === "string"
  );

  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="bg-[hsl(var(--after-hours-paper))] py-16 sm:py-20 lg:py-28"
        aria-labelledby="popular-picks-title"
        aria-busy="true"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShelfHeader />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <div className="aspect-square animate-pulse bg-[hsl(var(--after-hours-cream))]" />
                <div className="mt-4 h-4 w-3/4 animate-pulse bg-[hsl(var(--after-hours-plum)/0.12)]" />
                <div className="mt-3 h-3 w-1/3 animate-pulse bg-[hsl(var(--after-hours-plum)/0.08)]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="bg-[hsl(var(--after-hours-paper))] py-16 sm:py-20 lg:py-28"
      aria-labelledby="popular-picks-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ShelfHeader />

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
            {validProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index + 1}
                aspectClass="aspect-square"
                imagesEnabled={imagesEnabled}
              />
            ))}
        </div>

        <div className="mt-8 flex justify-end border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-6">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="min-h-12 rounded-none border-b border-[hsl(var(--after-hours-plum))] px-0 font-semibold text-[hsl(var(--hp-ink))] hover:bg-transparent hover:text-[hsl(var(--after-hours-copper))]"
          >
            <Link to="/collections">Shop all products <span aria-hidden="true">→</span></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const ShelfHeader = () => (
  <header className="mb-12 grid gap-6 border-t border-[hsl(var(--after-hours-plum)/0.18)] pt-6 sm:mb-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-12">
    <div>
      <p className="mb-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--hp-ink)/0.76)]">
        02 / Jena’s shelf
      </p>
      <h2
        id="popular-picks-title"
        className="max-w-[13ch] font-heading text-[clamp(2.45rem,7vw,5.4rem)] font-normal leading-[0.95] tracking-[-0.045em] text-[hsl(var(--hp-ink))]"
      >
        Popular picks from the shelf
      </h2>
    </div>
    <p className="max-w-[38rem] text-[0.98rem] leading-7 text-[hsl(var(--hp-ink)/0.72)] lg:pb-1">
      The products clients ask about after the chair. Salon-tested, plainly explained, and selected by Jena.
    </p>
  </header>
);

const ProductCard = ({
  product,
  index,
  aspectClass,
  imagesEnabled,
}: {
  product: any;
  index: number;
  aspectClass: string;
  imagesEnabled: boolean;
}) => {
  const { addToCart, busy } = useQuickAddToCart();
  const canQuickAdd = product.availableForSale && product.variantId && !busy;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canQuickAdd) return;
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
    });
  };

  const imageSizes = "(max-width: 1023px) 50vw, 30vw";

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        to={`/products/${product.slug}`}
        className={`relative block ${aspectClass} overflow-hidden border border-[hsl(var(--after-hours-plum)/0.12)] bg-[hsl(var(--after-hours-cream))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--after-hours-copper))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--after-hours-paper))]`}
      >
        <picture className="block h-full w-full">
          <source
            type="image/webp"
            srcSet={imagesEnabled ? buildShopifyWebpSrcSet(product.image, [480, 800, 1200]) : undefined}
            sizes={imageSizes}
          />
          <source
            srcSet={imagesEnabled ? buildShopifySrcSet(product.image, [480, 800, 1200]) : undefined}
            sizes={imageSizes}
          />
          <img
            src={imagesEnabled ? product.image : undefined}
            alt={product.title}
            className="h-full w-full object-contain p-3 transition-transform duration-slow group-hover:scale-[1.025] sm:p-5"
            loading="lazy"
            decoding="async"
            width="600"
            height="600"
            data-image-pending={imagesEnabled ? undefined : "true"}
          />
        </picture>
        <span className="absolute left-3 top-3 bg-[hsl(var(--after-hours-paper)/0.94)] px-2.5 py-1.5 text-[0.58rem] font-semibold tracking-[0.16em] text-[hsl(var(--hp-ink))] backdrop-blur-sm sm:left-4 sm:top-4">
          {String(index).padStart(2, "0")}
        </span>
        {!product.availableForSale && (
          <Badge variant="destructive" className="absolute bottom-3 left-3 rounded-none sm:bottom-4 sm:left-4">
            Out of Stock
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-[0.98rem] sm:text-lg min-w-0 font-heading font-semibold leading-tight text-[hsl(var(--hp-ink))]">
          <Link
            to={`/products/${product.slug}`}
            className="!text-[hsl(var(--hp-ink))] transition-colors hover:!text-[hsl(var(--after-hours-copper))]"
          >
            {product.title}
          </Link>
        </h3>

        {(() => {
          const compareAt =
            product.originalPrice && product.originalPrice > product.price
              ? product.originalPrice
              : undefined;
          const priceText = formatPrice(product.price, product.currency);
          const compareText = compareAt
            ? formatPrice(compareAt, product.currency)
            : "";

          if (!priceText) return null;
          return (
            <div className="mb-4 mt-2 flex items-baseline gap-2">
              <p className="text-sm sm:text-base font-semibold tabular-nums text-[hsl(var(--after-hours-copper))]">
                {product.pricePrefix}{priceText}
              </p>
              {compareText && (
                <p className="text-xs font-medium text-[hsl(var(--hp-ink)/0.52)] line-through decoration-[hsl(var(--after-hours-plum)/0.25)]">
                  {compareText}
                </p>
              )}
            </div>
          );
        })()}

        {product.hasMultipleVariants ? (
          <Button asChild variant="primary" size="sm" className="mt-auto min-h-11 w-full rounded-none">
            <Link to={`/products/${product.slug}`} aria-label={`Choose options for ${product.title}`}>Choose options</Link>
          </Button>
        ) : product.availableForSale && product.variantId ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={busy}
            className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-none border border-[hsl(var(--after-hours-plum))] bg-[hsl(var(--after-hours-plum))] px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {busy ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ShoppingBag className="mr-1 h-4 w-4" aria-hidden="true" />
            )}
            {busy ? "Adding…" : "Add to Bag"}
            <span className="sr-only"> {product.title}</span>
          </button>
        ) : (
          <Button asChild variant="primary" size="sm" className="mt-auto min-h-11 w-full rounded-none">
            <Link to={`/products/${product.slug}`} className="flex-1">
              View Details
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
};

export default BestSellers;
