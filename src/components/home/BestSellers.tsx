import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuickAddToCart } from "@/hooks/useQuickAddToCart";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

const buildShopifySrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImage(url, width)} ${width}w`).join(", ");

const buildShopifyWebpSrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImageWebp(url, width)} ${width}w`).join(", ");

const BestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        const shopifyModule = await import("@/lib/shopify");
        const { getCollectionByHandle, getProductByHandle, searchProducts } = shopifyModule;
        const { FEATURED_PRODUCT_HANDLES, BEST_SELLERS_COLLECTION_HANDLE, BEST_SELLERS_PRODUCT_HANDLES } = await import("@/config/featuredProducts");

        let productList: any[] = [];

        // 1. Prefer BEST_SELLERS_PRODUCT_HANDLES when Jena provides the list (from analytics).
        //    Trust Jena's curation: drop the availableForSale filter so that a
        //    sold-out or paused Juuce product still shows (she picked it for
        //    a reason). This list is the AUTHORITATIVE source — if it returns
        //    any products at all, do NOT fall through to the collection.
        if (BEST_SELLERS_PRODUCT_HANDLES?.length > 0) {
          const results = await Promise.all(
            BEST_SELLERS_PRODUCT_HANDLES.slice(0, 6).map((handle) => getProductByHandle(handle))
          );
          productList = results.filter((p) => p?.handle);
          // If curated list returned ANY products, the `productList.length === 0`
          // guards below will short-circuit and prevent the Aromaganic-laden
          // best-sellers-nov collection from being used as a fallback.
        }

        // 2. Fallback: dedicated best-sellers collection when configured
        if (productList.length === 0 && BEST_SELLERS_COLLECTION_HANDLE) {
          try {
            const collection = await getCollectionByHandle(BEST_SELLERS_COLLECTION_HANDLE);
            if (collection?.products?.edges?.length) {
              productList = collection.products.edges
                .map((edge: any) => edge.node)
                .filter((p: any) => p.availableForSale)
                .slice(0, 6);
            }
          } catch {
            // Collection may not exist yet, fall through
          }
        }

        // 3. Fallback: featured product handles when configured
        if (productList.length === 0 && FEATURED_PRODUCT_HANDLES.length > 0) {
          const results = await Promise.all(
            FEATURED_PRODUCT_HANDLES.slice(0, 6).map((handle) => getProductByHandle(handle))
          );
          productList = results.filter(Boolean);
        }

        // 4. Fallback: Try "best sellers" or "featured" collection
        if (productList.length === 0) {
          const collections = await getAllCollections(20);
          const bestSellerCollection = collections.find((c: any) =>
            c.handle?.toLowerCase().includes('best') ||
            c.handle?.toLowerCase().includes('featured') ||
            c.handle?.toLowerCase().includes('popular')
          );
          if (bestSellerCollection) {
            const collection = await getCollectionByHandle(bestSellerCollection.handle);
            if (collection?.products?.edges) {
              productList = collection.products.edges
                .map((edge: any) => edge.node)
                .filter((p: any) => p.availableForSale)
                .slice(0, 6);
            }
          }
        }

        // 5. Fallback: Get any available products
        if (productList.length === 0) {
          const result = await searchProducts("", 20);
          productList = result.products
            .filter((p: any) => p.availableForSale)
            .slice(0, 6);
        }

        if (!isMounted) return;

        const mappedProducts = productList.map((product: any) => {
          const firstImage = product.images?.edges?.[0]?.node;
          const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
          const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
            : undefined;
          const firstVariant = product.variants?.edges?.[0]?.node;

          return {
            id: product.id,
            slug: product.handle,
            title: product.title,
            price: price,
            originalPrice: compareAtPrice,
            currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
            image: firstImage?.url || "/placeholder.svg",
            availableForSale: product.availableForSale,
            variantId: firstVariant?.id,
          };
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
        className="content-visibility-auto bg-[hsl(var(--after-hours-paper))] py-16 sm:py-20 lg:py-28"
        aria-labelledby="popular-picks-title"
        aria-busy="true"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShelfHeader />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className={index === 0 ? "col-span-2 lg:col-span-1" : ""}>
                <div className="aspect-[4/5] animate-pulse bg-[hsl(var(--after-hours-cream))]" />
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

  const leadProduct = validProducts[0];
  const sideProducts = validProducts.slice(1, 3);
  const bottomProducts = validProducts.slice(3, 6);

  return (
    <section
      className="content-visibility-auto bg-[hsl(var(--after-hours-paper))] py-16 sm:py-20 lg:py-28"
      aria-labelledby="popular-picks-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ShelfHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)] lg:gap-6">
          <ProductCard product={leadProduct} index={1} aspectClass="aspect-[5/6] sm:aspect-[4/5] lg:aspect-[6/7]" lead />

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-1 lg:gap-6">
            {sideProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index + 2}
                aspectClass="aspect-square"
              />
            ))}
          </div>
        </div>

        {bottomProducts.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:mt-12 lg:gap-x-6">
            {bottomProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index + 4}
                aspectClass="aspect-square"
              />
            ))}
            <Link
              to="/collections"
              className="flex aspect-square flex-col justify-between bg-[hsl(var(--after-hours-plum))] p-4 !text-[hsl(var(--after-hours-cream))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-plum))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--after-hours-copper))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--after-hours-paper))] sm:hidden"
            >
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em]">Continue</span>
              <span className="font-heading text-xl font-semibold leading-tight">
                Shop all products <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        )}

        <div className="mt-14 hidden justify-end border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-8 sm:flex">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="min-h-12 rounded-none border-b border-[hsl(var(--after-hours-plum))] px-0 font-semibold text-[hsl(var(--after-hours-plum))] hover:bg-transparent hover:text-[hsl(var(--after-hours-copper))]"
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
      <p className="mb-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">
        02 / Jena’s shelf
      </p>
      <h2
        id="popular-picks-title"
        className="max-w-[13ch] font-heading text-[clamp(2.45rem,7vw,5.4rem)] font-normal leading-[0.95] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]"
      >
        Popular picks from the shelf
      </h2>
    </div>
    <p className="max-w-[38rem] text-[0.98rem] leading-7 text-[hsl(var(--after-hours-plum)/0.72)] lg:pb-1">
      The products clients ask about after the chair. Salon-tested, plainly explained, and selected by Jena.
    </p>
  </header>
);

const ProductCard = ({
  product,
  index,
  aspectClass,
  lead = false,
}: {
  product: any;
  index: number;
  aspectClass: string;
  lead?: boolean;
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

  const imageSizes = lead
    ? "(max-width: 1023px) 100vw, 58vw"
    : "(max-width: 1023px) 50vw, 30vw";

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        to={`/products/${product.slug}`}
        className={`relative block ${aspectClass} overflow-hidden border border-[hsl(var(--after-hours-plum)/0.12)] bg-[hsl(var(--after-hours-cream))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--after-hours-copper))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--after-hours-paper))]`}
      >
        <picture className="block h-full w-full">
          <source
            type="image/webp"
            srcSet={buildShopifyWebpSrcSet(product.image, [480, 800, 1200])}
            sizes={imageSizes}
          />
          <source
            srcSet={buildShopifySrcSet(product.image, [480, 800, 1200])}
            sizes={imageSizes}
          />
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain p-3 transition-transform duration-slow group-hover:scale-[1.025] sm:p-5"
            loading="lazy"
            decoding="async"
            width="600"
            height="600"
          />
        </picture>
        <span className="absolute left-3 top-3 bg-[hsl(var(--after-hours-paper)/0.94)] px-2.5 py-1.5 text-[0.58rem] font-semibold tracking-[0.16em] text-[hsl(var(--after-hours-plum))] backdrop-blur-sm sm:left-4 sm:top-4">
          {String(index).padStart(2, "0")}
        </span>
        {!product.availableForSale && (
          <Badge variant="destructive" className="absolute bottom-3 left-3 rounded-none sm:bottom-4 sm:left-4">
            Out of Stock
          </Badge>
        )}
      </Link>

      <div className={lead ? "pt-5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-8" : "flex flex-1 flex-col pt-4"}>
        <h3 className={`${lead ? "text-xl sm:text-2xl" : "text-[0.98rem] sm:text-lg"} min-w-0 font-heading font-semibold leading-tight text-[hsl(var(--after-hours-plum))]`}>
          <Link
            to={`/products/${product.slug}`}
            className="!text-[hsl(var(--after-hours-plum))] transition-colors hover:!text-[hsl(var(--after-hours-copper))]"
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
            <div className={`${lead ? "sm:col-start-2 sm:row-start-1 sm:justify-end" : "mb-4"} mt-2 flex items-baseline gap-2`}>
              <p className={`${lead ? "text-lg" : "text-sm sm:text-base"} font-semibold tabular-nums text-[hsl(var(--after-hours-copper))]`}>
                {priceText}
              </p>
              {compareText && (
                <p className="text-xs font-medium text-[hsl(var(--after-hours-plum)/0.52)] line-through decoration-[hsl(var(--after-hours-plum)/0.25)]">
                  {compareText}
                </p>
              )}
            </div>
          );
        })()}

        {product.availableForSale && product.variantId ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={busy}
            className={`${lead ? "mt-4 sm:col-span-2" : "mt-auto"} inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-none border border-[hsl(var(--after-hours-plum))] bg-[hsl(var(--after-hours-plum))] px-3 text-xs font-semibold text-[hsl(var(--after-hours-cream))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] hover:text-[hsl(var(--after-hours-plum))] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm`}
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
          <Button asChild variant="primary" size="sm" className={`${lead ? "sm:col-span-2" : ""} mt-4 w-full rounded-none`}>
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
