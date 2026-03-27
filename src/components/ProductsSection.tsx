import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingBag, Loader2 } from "lucide-react";
import { searchProducts } from "@/lib/shopify";

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>;
  };
}

const ProductsSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    searchProducts("*", 3)
      .then(({ products: results }) => {
        setProducts(results);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error || (!loading && products.length === 0)) {
    return (
      <section id="products" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Check out our range of professional hair care.
          </p>
          <Button asChild variant="accent" size="lg">
            <Link to="/collections">
              <ShoppingBag className="w-5 h-5" />
              View All Products
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your salon experience home with products
            Jena uses and recommends.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {products.map((product) => {
              const imageUrl = product.images?.edges?.[0]?.node?.url;
              const imageAlt = product.images?.edges?.[0]?.node?.altText || `${product.title} professional hair care product`;
              const price = parseFloat(product.priceRange.minVariantPrice.amount);
              const currencyCode = product.priceRange.minVariantPrice.currencyCode;

              return (
                <Link key={product.id} to={`/products/${product.handle}`} className="group">
                  <Card className="shadow-soft hover:shadow-medium transition-smooth border-border overflow-hidden h-full">
                    <div className="aspect-square overflow-hidden bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={imageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent-color text-accent-color" />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-foreground">
                          {new Intl.NumberFormat('en-AU', { style: 'currency', currency: currencyCode }).format(price)}
                        </span>
                        <span className="text-sm font-medium text-accent-color group-hover:underline">
                          View Product
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Button asChild variant="accent" size="lg">
            <Link to="/collections">
              <ShoppingBag className="w-5 h-5" />
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
