import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Truck, Shield, Star } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { getCollectionByHandle } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const ProductSpotlight = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        console.log("🔍 Fetching gift-packs collection...");
        const collection = await getCollectionByHandle("gift-packs");
        console.log("✅ Collection fetched:", collection);
        
        if (!isMounted) {
          console.log("⚠️ Component unmounted, skipping state update");
          return;
        }
        
        if (collection?.products?.edges && Array.isArray(collection.products.edges)) {
          const mappedProducts = collection.products.edges.slice(0, 8).map((edge: any) => {
            const product = edge.node;
            const firstImage = product.images.edges[0]?.node;
            const price = parseFloat(product.priceRange.minVariantPrice.amount);
            const currency = product.priceRange.minVariantPrice.currencyCode || "AUD";
            
            return {
              slug: product.handle,
              title: product.title,
              price: price,
              currency: currency,
              image: firstImage?.url || "/placeholder.svg",
              availableForSale: product.availableForSale,
              bullets: [
                product.description?.substring(0, 40) || "Premium hair care",
                "Professional formula",
                "Picked by Jena, 15+ years experience"
              ]
            };
          });
          
          console.log("✅ Mapped products:", mappedProducts.length);
          setProducts(mappedProducts);
        } else {
          console.warn("⚠️ No products found in collection");
        }
      } catch (error) {
        console.error("❌ Failed to fetch gift packs:", error);
      } finally {
        if (isMounted) {
          console.log("✅ Setting loading to false");
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
      console.log("🧹 ProductSpotlight cleanup");
    };
  }, []);

  if (loading) {
    return (
      <Section className="content-visibility-auto">
        <SectionHeader 
          title="Gift Packs"
          subtitle="Hair care bundles picked by Jena. Perfect for gifting or treating yourself. Limited stock available."
        />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </Section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title="Gift Packs"
        subtitle="Hair care bundles picked by Jena. Perfect for gifting or treating yourself"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ containIntrinsicSize: "0 2000px" }}>
        {products.map((product) => (
          <div 
            key={product.slug}
            className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base group"
          >
            <Link
              to={`/products/${product.slug}`}
              className="block aspect-square bg-muted relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset"
            >
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                loading="lazy"
                width="600"
                height="600"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              <p className="text-2xl font-bold text-brand-500 mb-2">
                {formatPrice(product.price, product.currency)}
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Truck className="w-3 h-3 text-brand-500" />
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-brand-500" />
                  <span>14-day returns</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {product.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-2">
                <Link to={`/products/${product.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Quick View
                  </Button>
                </Link>
                <Link to={`/products/${product.slug}`} className="flex-1">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    disabled={!product.availableForSale}
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Add to Bag
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/collections/gift-packs">
          <Button variant="accent" size="lg">
            View All Gift Packs
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default ProductSpotlight;
