import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { getAllCollections, searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

        // 1. Prefer BEST_SELLERS_PRODUCT_HANDLES when Jena provides the list (from analytics)
        if (BEST_SELLERS_PRODUCT_HANDLES?.length > 0) {
          const results = await Promise.all(
            BEST_SELLERS_PRODUCT_HANDLES.slice(0, 6).map((handle) => getProductByHandle(handle))
          );
          productList = results.filter((p) => p?.handle && p?.availableForSale);
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

          return {
            id: product.id,
            slug: product.handle,
            title: product.title,
            price: price,
            originalPrice: compareAtPrice,
            currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
            image: firstImage?.url || "/placeholder.svg",
            availableForSale: product.availableForSale,
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
      <Section className="content-visibility-auto">
        <SectionHeader
          title="What's selling right now"
          subtitle="Loading the good stuff..."
        />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </Section>
    );
  }

  if (validProducts.length === 0) {
    return null;
  }

  const leadProduct = validProducts[0];
  const sideProducts = validProducts.slice(1, 3);
  const bottomProducts = validProducts.slice(3, 6);

  return (
    <Section className="content-visibility-auto">
      <SectionHeader
        title="What's selling right now"
        subtitle="The products my clients keep reordering"
      />

      {/* Editorial asymmetric layout — top row */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
        {/* Lead product — tall card */}
        <ProductCard product={leadProduct} aspectClass="aspect-[3/4]" />

        {/* Side stack — products 2 & 3 */}
        <div className="flex flex-col gap-6">
          {sideProducts.map((product) => (
            <ProductCard key={product.id} product={product} aspectClass="aspect-square" />
          ))}
        </div>
      </div>

      {/* Bottom row — remaining products */}
      {bottomProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {bottomProducts.map((product) => (
            <ProductCard key={product.id} product={product} aspectClass="aspect-square" />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link to="/collections">
          <Button variant="accent" size="lg">
            Shop All Products
          </Button>
        </Link>
      </div>
    </Section>
  );
};

const ProductCard = ({
  product,
  aspectClass,
}: {
  product: any;
  aspectClass: string;
}) => {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base group">
      <Link
        to={`/products/${product.slug}`}
        className={`block ${aspectClass} bg-muted relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset`}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
          loading="lazy"
          width="600"
          height="600"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
        />
        {!product.availableForSale && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            Out of Stock
          </Badge>
        )}
      </Link>

      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold text-heading mb-2">
          <Link
            to={`/products/${product.slug}`}
            className="hover:text-brand-500 transition-colors"
          >
            {product.title}
          </Link>
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-2xl font-bold text-brand-500">
            {formatPrice(product.price, product.currency)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
              {formatPrice(product.originalPrice, product.currency)}
            </p>
          )}
        </div>

        <Link to={`/products/${product.slug}`} className="flex-1">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            disabled={!product.availableForSale}
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            {product.availableForSale ? "Add to Bag" : "View Details"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BestSellers;
