import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { searchProducts, getCollectionByHandle } from "@/lib/shopify";
import { formatPrice, synthesiseCompareAt } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductRecommendationsProps {
  currentProductId?: string;
  currentCollectionHandle?: string;
  pairsWith?: Array<{
    title: string;
    price: number;
    handle: string;
  }>;
}

const ProductRecommendations = ({
  currentProductId,
  currentCollectionHandle,
  pairsWith,
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      try {
        let products: any[] = [];

        // If pairsWith provided, use those
        if (pairsWith && pairsWith.length > 0) {
          // Convert pairsWith to product format
          products = pairsWith.map((item) => ({
            slug: item.handle,
            title: item.title,
            price: item.price,
            currency: "AUD",
            image: "/placeholder.svg", // Would need to fetch actual images
            availableForSale: true,
          }));
        } else if (currentCollectionHandle) {
          // Get products from same collection
          const collection = await getCollectionByHandle(currentCollectionHandle);
          if (collection?.products?.edges) {
            products = collection.products.edges
              .map((edge: any) => edge.node)
              .filter((p: any) => p.id !== currentProductId && p.availableForSale && p.handle)
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
                  price: price,
                  originalPrice: compareAtPrice,
                  currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                  image: firstImage?.url || "/placeholder.svg",
                  availableForSale: product.availableForSale,
                };
              });
          }
        }

        // Fallback: Get any available products
        if (products.length === 0) {
          const result = await searchProducts("*", 3);
          if (result?.products) {
            products = result.products
              .filter((p: any) => p.id !== currentProductId && p.availableForSale && p.handle)
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
                  price: price,
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
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [currentProductId, currentCollectionHandle, pairsWith]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title={pairsWith ? "Frequently Bought Together" : "Complete the Set"}
        subtitle={pairsWith ? "These items pair perfectly" : "You might also like"}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ containIntrinsicSize: "0 2000px" }}>
        {recommendations.map((product) => (
          <div 
            key={product.slug || product.id}
            className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base group"
          >
            <Link to={`/products/${product.slug}`} className="block aspect-square bg-muted relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                loading="lazy"
                width="600"
                height="600"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {!product.availableForSale && (
                <Badge variant="destructive" className="absolute top-3 left-3">
                  Out of Stock
                </Badge>
              )}
            </Link>
            
            <div className="p-6">
              <h3 className="text-xl font-heading font-semibold text-heading mb-2">
                <Link to={`/products/${product.slug}`} className="hover:text-brand-500 transition-colors">
                  {product.title}
                </Link>
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                {(() => {
                  const priceText = formatPrice(product.price, product.currency);
                  if (!priceText) return null;
                  const compareAt =
                    product.originalPrice && product.originalPrice > product.price
                      ? product.originalPrice
                      : synthesiseCompareAt(product.price);
                  const compareText = compareAt
                    ? formatPrice(compareAt, product.currency)
                    : "";
                  return (
                    <>
                      <p className="text-2xl font-bold text-brand-500">{priceText}</p>
                      {compareText && (
                        <p className="text-sm font-semibold text-muted-foreground line-through decoration-muted-foreground/30">
                          {compareText}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
              
              <Link to={`/products/${product.slug}`}>
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
        ))}
      </div>
    </Section>
  );
};

export default ProductRecommendations;

