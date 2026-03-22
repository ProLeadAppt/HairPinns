import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Check } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { searchProducts, getProductByHandle } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { quickAddToCart, QuickAddProduct } from "@/lib/quickAdd";
import { toast } from "sonner";

interface FrequentlyBoughtTogetherProps {
  currentProductId: string;
  currentProductHandle: string;
}

const FrequentlyBoughtTogether = ({
  currentProductId,
  currentProductHandle,
}: FrequentlyBoughtTogetherProps) => {
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set([currentProductId]));
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current product
        const productData = await getProductByHandle(currentProductHandle);
        if (productData) {
          const firstImage = productData.images?.edges?.[0]?.node;
          const firstVariant = productData.variants?.edges?.[0]?.node;
          const price = parseFloat(firstVariant?.price?.amount || "0");
          setCurrentProduct({
            id: productData.id,
            slug: productData.handle,
            title: productData.title,
            price: price,
            currency: firstVariant?.price?.currencyCode || "AUD",
            image: firstImage?.url || "/placeholder.svg",
          });
        }

        // Fetch recommendations
        const result = await searchProducts("", 20);
        if (result?.products) {
          const products = result.products
            .filter((p: any) => p.id !== currentProductId && p.availableForSale && p.handle)
            .slice(0, 3)
            .map((product: any) => {
              const firstImage = product.images?.edges?.[0]?.node;
              const firstVariant = product.variants?.edges?.[0]?.node;
              const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
              return {
                id: product.id,
                slug: product.handle,
                title: product.title,
                price: price,
                currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                image: firstImage?.url || "/placeholder.svg",
                variantId: firstVariant?.id || "",
                availableForSale: product.availableForSale,
              };
            });
          setRecommendations(products);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentProductId, currentProductHandle]);

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleAddBundleToCart = async () => {
    if (selectedProducts.size === 0) return;

    setAddingToCart(true);
    try {
      const productsToAdd = recommendations.filter((p) => selectedProducts.has(p.id));
      
      for (const product of productsToAdd) {
        if (product.variantId) {
          await quickAddToCart(
            {
              variantId: product.variantId,
              productId: product.id,
              productTitle: product.title,
              price: product.price,
              currency: product.currency,
              quantity: 1,
            },
            false // Don't show toast for each item
          );
        }
      }
      
      toast.success(`Added ${productsToAdd.length} item(s) to cart!`);
      setSelectedProducts(new Set([currentProductId])); // Reset selection
    } catch (error) {
      console.error("Failed to add bundle to cart:", error);
      toast.error("Failed to add items to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const totalPrice = (currentProduct ? currentProduct.price : 0) +
    recommendations
      .filter((p) => selectedProducts.has(p.id))
      .reduce((sum, p) => sum + p.price, 0);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <Section className="bg-muted/30">
      <SectionHeader
        title="Frequently Bought Together"
        subtitle="Complete your hair care routine"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current Product (always selected) */}
          {currentProduct && (
            <div className="bg-card border-2 border-brand-500 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="gap-1">
                  <Check className="w-3 h-3" />
                  Included
                </Badge>
              </div>
              <Link to={`/products/${currentProductHandle}`} className="block">
                <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-sm text-heading mb-2 line-clamp-2">
                  {currentProduct.title}
                </h4>
                <p className="text-lg font-bold text-brand-500">
                  {formatPrice(currentProduct.price, currentProduct.currency)}
                </p>
              </Link>
            </div>
          )}

          {/* Recommended Products */}
          {recommendations.map((product) => {
            const isSelected = selectedProducts.has(product.id);
            return (
              <div
                key={product.id}
                className={`bg-card border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg relative ${
                  isSelected ? "border-brand-500" : "border-border"
                }`}
                onClick={() => toggleProduct(product.id)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="gap-1">
                      <Check className="w-3 h-3" />
                      Selected
                    </Badge>
                  </div>
                )}
                <Link to={`/products/${product.slug}`} onClick={(e) => e.stopPropagation()}>
                  <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-sm text-heading mb-2 line-clamp-2">
                    {product.title}
                  </h4>
                  <p className="text-lg font-bold text-brand-500">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bundle Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {selectedProducts.size} item(s) selected
                {currentProduct && " (including current product)"}
              </p>
              <p className="text-2xl font-bold text-heading">
                Bundle Total: {formatPrice(totalPrice, "AUD")}
              </p>
              {selectedProducts.size > (currentProduct ? 1 : 0) && (
                <p className="text-sm text-muted-foreground mt-1">
                  Save time and complete your routine
                </p>
              )}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddBundleToCart}
              disabled={addingToCart || selectedProducts.size === 0}
              className="gap-2"
            >
              {addingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add {selectedProducts.size} Item(s) to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FrequentlyBoughtTogether;
