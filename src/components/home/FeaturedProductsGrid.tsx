import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import UrgencyIndicator from "@/components/conversion/UrgencyIndicator";

const FeaturedProductsGrid = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      try {
        const result = await searchProducts("", 6);
        if (result?.products) {
          const products = result.products
            .filter((p: any) => p.availableForSale)
            .slice(0, 6)
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
                availableForSale: product.availableForSale,
              };
            });

          if (isMounted) {
            setProducts(products);
          }
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Section className="content-visibility-auto">
        <SectionHeader 
          title="Featured Products"
          subtitle="Shop our most popular items"
        />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </Section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title="Featured Products"
        subtitle="Shop our most popular items — handpicked by Jena"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" style={{ containIntrinsicSize: "0 2000px" }}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base group"
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                loading="lazy"
                width="300"
                height="300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {!product.availableForSale && (
                <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-[hsl(var(--star-color))] fill-current" />
                ))}
              </div>
              
              <h3 className="text-sm font-heading font-semibold text-heading mb-1 line-clamp-2 min-h-[2.5rem]">
                {product.title}
              </h3>
              
              <UrgencyIndicator
                productId={product.id}
                inStock={product.availableForSale}
                showRecentPurchases={false}
                className="mb-2"
              />
              
              <p className="text-lg font-bold text-brand-500 mb-2">
                {formatPrice(product.price, product.currency)}
              </p>
              
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full text-xs"
                disabled={!product.availableForSale}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/products/${product.slug}`;
                }}
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Add to Bag
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
};

export default FeaturedProductsGrid;

