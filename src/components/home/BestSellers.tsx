import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, TrendingUp, Users } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { getAllCollections, searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import UrgencyIndicator from "@/components/conversion/UrgencyIndicator";

const BestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBestSellers = async () => {
      try {
        // Try to get products from a "best sellers" collection first
        // If that doesn't exist, fetch products and show first 6
        const collections = await getAllCollections(20);
        let bestSellerCollection = collections.find((c: any) => 
          c.handle?.toLowerCase().includes('best') || 
          c.handle?.toLowerCase().includes('featured') ||
          c.handle?.toLowerCase().includes('popular')
        );

        let productList: any[] = [];
        
        if (bestSellerCollection) {
          // Import getCollectionByHandle dynamically
          const shopifyModule = await import("@/lib/shopify");
          const { getCollectionByHandle } = shopifyModule;
          const collection = await getCollectionByHandle(bestSellerCollection.handle);
          if (collection?.products?.edges) {
            productList = collection.products.edges
              .map((edge: any) => edge.node)
              .filter((p: any) => p.availableForSale)
              .slice(0, 6);
          }
        }

        // Fallback: Get any available products
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

        setProducts(mappedProducts);
      } catch (error) {
        console.error("❌ Failed to fetch best sellers:", error);
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

  if (loading) {
    return (
      <Section className="content-visibility-auto">
        <SectionHeader 
          title="Best Sellers"
          subtitle="Our most popular products, handpicked by Jena"
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
        title="Our Most Loved Products (762+ Five-Star Reviews)"
        subtitle="Handpicked by Jena — trusted by thousands Australia-wide"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ containIntrinsicSize: "0 2000px" }}>
        {products.map((product) => (
          <div 
            key={product.id}
            className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base group"
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                loading="lazy"
                width="600"
                height="600"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {!product.availableForSale && (
                <Badge variant="destructive" className="absolute top-3 left-3">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <div className="p-6">
              {/* Social Proof */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[hsl(var(--star-color))] fill-current" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4.9/5</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">762+ reviews</span>
              </div>

              <h3 className="text-xl font-heading font-semibold text-heading mb-2">
                {product.title}
              </h3>
              
              {/* Urgency Indicator */}
              <div className="mb-3">
                <UrgencyIndicator 
                  productId={product.id}
                  inStock={product.availableForSale}
                  stockLevel={product.availableForSale ? Math.floor(Math.random() * 15) + 1 : 0}
                  showRecentPurchases={true}
                />
              </div>

              <p className="text-2xl font-bold text-brand-500 mb-2">
                {formatPrice(product.price, product.currency)}
              </p>

              {/* Customer Count */}
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{Math.floor(Math.random() * 50) + 50} people bought this week</span>
              </p>
              
              <Link 
                to={`/products/${product.slug}`} 
                className="flex-1"
              >
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full group-hover:scale-105 transition-transform"
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

      <div className="text-center mt-12">
        <Link to="/collections">
          <Button variant="accent" size="lg">
            Shop Best Sellers Now
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default BestSellers;

