import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LocationProductsProps {
  suburb: string;
  climate?: string; // e.g., "humidity", "coastal", "hard-water"
}

const LocationProducts = ({ suburb, climate }: LocationProductsProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products based on climate/need
        let searchTerm = "";
        if (climate === "humidity") {
          searchTerm = "frizz smoothing";
        } else if (climate === "coastal") {
          searchTerm = "protection";
        } else if (climate === "hard-water") {
          searchTerm = "clarifying";
        }

        const result = await searchProducts(searchTerm, 3);
        if (result?.products) {
          const mappedProducts = result.products
            .filter((p: any) => p.availableForSale)
            .slice(0, 3)
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
              };
            });
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch location products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [climate]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-heading font-bold text-heading mb-2">
            Recommended Products for {suburb}
          </h3>
          <p className="text-muted-foreground">
            Products specially selected for your local climate and hair care needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/products/${product.slug}`} className="block aspect-square bg-muted relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
              </Link>
              <div className="p-4">
                <h4 className="font-semibold text-heading mb-2 line-clamp-2">
                  <Link to={`/products/${product.slug}`} className="hover:text-brand-500 transition-colors">
                    {product.title}
                  </Link>
                </h4>
                <p className="text-xl font-bold text-brand-500 mb-4">
                  {formatPrice(product.price, product.currency)}
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/products/${product.slug}`}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Product
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationProducts;
