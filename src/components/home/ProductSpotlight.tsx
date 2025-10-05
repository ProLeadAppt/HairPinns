import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { getCollectionByHandle } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";

const ProductSpotlight = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        console.log("🔍 Fetching christmas-gift-packs collection...");
        const collection = await getCollectionByHandle("christmas-gift-packs");
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
            
            return {
              slug: product.handle,
              title: product.title,
              price: `$${price.toFixed(2)}`,
              image: firstImage?.url || "/placeholder.svg",
              availableForSale: product.availableForSale,
              bullets: [
                product.description?.substring(0, 40) || "Premium hair care",
                "Professional salon formula",
                `Starting at $${price.toFixed(2)}`
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
          title="Christmas Gift Packs"
          subtitle="Curated hair care bundles — perfect for gifting or treating yourself"
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
        title="Christmas Gift Packs"
        subtitle="Curated hair care bundles — perfect for gifting or treating yourself"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ containIntrinsicSize: "0 2000px" }}>
        {products.map((product) => (
          <div 
            key={product.slug}
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
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {!product.availableForSale && (
                <Badge variant="destructive" className="absolute top-3 left-3">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-heading font-semibold text-heading mb-2">
                {product.title}
              </h3>
              <p className="text-2xl font-bold text-brand-500 mb-4">
                {product.price}
              </p>
              
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
                    View Details
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
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/collections/christmas-gift-packs">
          <Button variant="accent" size="lg">
            View All Gift Packs
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default ProductSpotlight;
