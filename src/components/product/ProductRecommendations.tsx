import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchProducts, getCollectionByHandle } from "@/lib/shopify";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";
import { formatPrice } from "@/lib/utils";

interface ProductRecommendationsProps {
  currentProductId?: string;
  currentCollectionHandle?: string;
  pairsWith?: Array<{
    title: string;
    price: number;
    handle: string;
  }>;
}

type RecommendationContext = "collection" | "catalogue" | "curated";

const ProductRecommendations = ({
  currentProductId,
  currentCollectionHandle,
  pairsWith,
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [context, setContext] = useState<RecommendationContext>("catalogue");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      try {
        let products: any[] = [];
        let nextContext: RecommendationContext = "catalogue";

        if (pairsWith && pairsWith.length > 0) {
          products = pairsWith.map((item) => ({
            slug: item.handle,
            title: item.title,
            price: item.price,
            currency: "AUD",
            image: "/placeholder.svg",
            availableForSale: true,
          }));
          nextContext = "curated";
        } else if (currentCollectionHandle) {
          const collection = await getCollectionByHandle(currentCollectionHandle);
          if (collection?.products?.edges) {
            products = collection.products.edges
              .map((edge: any) => edge.node)
              .filter((product: any) => product.id !== currentProductId && product.availableForSale && product.handle)
              .slice(0, 3)
              .map((product: any) => {
                const firstImage = product.images?.edges?.[0]?.node;
                const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
                  ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                  : undefined;
                return {
                  id: product.id,
                  slug: product.handle,
                  title: product.title,
                  price,
                  originalPrice: compareAtPrice,
                  currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                  image: firstImage?.url || "/placeholder.svg",
                  availableForSale: product.availableForSale,
                };
              });
            if (products.length > 0) nextContext = "collection";
          }
        }

        if (products.length === 0) {
          const result = await searchProducts("*", 3);
          if (result?.products) {
            products = result.products
              .filter((product: any) => product.id !== currentProductId && product.availableForSale && product.handle)
              .slice(0, 3)
              .map((product: any) => {
                const firstImage = product.images?.edges?.[0]?.node;
                const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
                  ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                  : undefined;
                return {
                  id: product.id,
                  slug: product.handle,
                  title: product.title,
                  price,
                  originalPrice: compareAtPrice,
                  currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                  image: firstImage?.url || "/placeholder.svg",
                  availableForSale: product.availableForSale,
                };
              });
          }
        }

        if (isMounted) {
          setRecommendations(products);
          setContext(nextContext);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecommendations();
    return () => {
      isMounted = false;
    };
  }, [currentProductId, currentCollectionHandle, pairsWith]);

  if (loading || recommendations.length === 0) return null;

  const heading = context === "collection"
    ? "More from this range"
    : context === "curated"
      ? "Selected to pair"
      : "More to browse";
  const note = context === "collection"
    ? "Available products from the same Shopify collection."
    : context === "curated"
      ? "A considered continuation for this product."
      : "Available products from across the Hair Pinns catalogue.";

  return (
    <section data-product-recommendations="" className="border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-paper))] py-14 sm:py-18 lg:py-24" aria-labelledby="product-recommendations-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">Continue / Product shelf</p>
            <h2 id="product-recommendations-heading" className="mt-3 max-w-[12ch] font-heading text-[clamp(2.45rem,5vw,4.8rem)] leading-[0.94] tracking-[-0.04em] text-[hsl(var(--after-hours-plum))]">{heading}</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.68)] md:justify-self-end">{note}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:mt-14">
          {recommendations.map((product, index) => {
            const priceText = formatPrice(product.price, product.currency);
            const compareAt = product.originalPrice && product.originalPrice > product.price
              ? product.originalPrice
              : undefined;
            const compareText = compareAt ? formatPrice(compareAt, product.currency) : "";
            const isRemoteImage = typeof product.image === "string" && product.image.startsWith("http");

            return (
              <article data-recommended-product="" key={product.slug || product.id} className="flex min-w-0 flex-col border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--after-hours-plum)/0.7)]">{String(index + 1).padStart(2, "0")}</p>
                <Link to={`/products/${product.slug}`} className="mt-3 block aspect-square overflow-hidden bg-[hsl(var(--after-hours-cream))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-plum))]">
                  <picture className="block h-full w-full">
                    {isRemoteImage && (
                      <source
                        type="image/webp"
                        srcSet={`${shopifyImageWebp(product.image, 240)} 240w, ${shopifyImageWebp(product.image, 480)} 480w, ${shopifyImageWebp(product.image, 720)} 720w`}
                        sizes="(max-width: 767px) 50vw, 33vw"
                      />
                    )}
                    <img
                      src={isRemoteImage ? shopifyImage(product.image, 720) : product.image}
                      alt={product.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                      width="720"
                      height="720"
                      sizes="(max-width: 767px) 50vw, 33vw"
                    />
                  </picture>
                </Link>

                <div className="flex flex-1 flex-col pt-4">
                  <h3 className="line-clamp-2 min-h-[2.6rem] font-heading text-base leading-tight text-[hsl(var(--after-hours-plum))] sm:text-xl">
                    <Link to={`/products/${product.slug}`} className="!text-[hsl(var(--after-hours-plum))] hover:underline hover:underline-offset-4">{product.title}</Link>
                  </h3>
                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    {priceText && <p className="text-sm font-semibold text-[hsl(var(--after-hours-plum))] sm:text-base">{priceText}</p>}
                    {compareText && <p className="text-xs text-[hsl(var(--after-hours-plum)/0.72)] line-through">{compareText}</p>}
                  </div>
                  <Link
                    to={`/products/${product.slug}`}
                    className="mt-auto inline-flex min-h-11 items-center border-b border-[hsl(var(--after-hours-plum)/0.35)] pt-4 text-sm font-semibold text-[hsl(var(--after-hours-plum))]"
                  >
                    View product
                  </Link>
                </div>
              </article>
            );
          })}

          <article data-recommendation-catalogue="" className="flex min-w-0 flex-col border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-3 md:hidden">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--after-hours-plum)/0.7)]">04</p>
            <div className="mt-3 flex aspect-square flex-col justify-between bg-[hsl(var(--after-hours-plum))] p-4 text-[hsl(var(--after-hours-cream))]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--after-hours-copper))]">All products</p>
              <p className="font-heading text-2xl leading-[0.95]">Keep browsing</p>
            </div>
            <Link
              to="/collections"
              className="mt-auto inline-flex min-h-11 items-center border-b border-[hsl(var(--after-hours-plum)/0.35)] pt-4 text-sm font-semibold !text-[hsl(var(--after-hours-plum))]"
            >
              Browse catalogue
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendations;
