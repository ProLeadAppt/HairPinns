import { useState, useEffect } from "react";
import { X, Plus, ShoppingBag, Star, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { quickAddToCart, QuickAddProduct } from "@/lib/quickAdd";
import { getProductByHandle } from "@/lib/shopify";
import { toast } from "sonner";
import EstimatedDelivery from "./EstimatedDelivery";

interface QuickViewModalProps {
  productHandle: string;
  open: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ productHandle, open, onClose }: QuickViewModalProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (open && productHandle) {
      setLoading(true);
      getProductByHandle(productHandle)
        .then((data) => {
          if (data) {
            setProduct(data);
            const firstAvailableVariant = data.variants?.edges?.find(
              (v: any) => v.node.availableForSale
            )?.node || data.variants?.edges?.[0]?.node;
            setSelectedVariantId(firstAvailableVariant?.id || null);
          }
        })
        .catch((error) => {
          console.error("Failed to load product:", error);
          toast.error("Failed to load product details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, productHandle]);

  const handleAddToCart = async () => {
    if (!selectedVariantId || !product) return;

    setAddingToCart(true);
    try {
      const firstVariant = product.variants?.edges?.find(
        (v: any) => v.node.id === selectedVariantId
      )?.node;

      if (firstVariant) {
        await quickAddToCart(
          {
            variantId: selectedVariantId,
            productId: product.id,
            productTitle: product.title,
            price: parseFloat(firstVariant.price?.amount || "0"),
            currency: firstVariant.price?.currencyCode || "AUD",
            quantity: 1,
          },
          true
        );
        toast.success("Added to cart!");
        onClose();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (!open) return null;

  const firstImage = product?.images?.edges?.[0]?.node;
  const price = product?.variants?.edges?.[0]?.node?.price?.amount
    ? parseFloat(product.variants.edges[0].node.price.amount)
    : 0;
  const currency = product?.variants?.edges?.[0]?.node?.price?.currencyCode || "AUD";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={firstImage?.url || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-heading font-bold text-heading mb-2">
                  {product.title}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[hsl(var(--star-color))] fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.8)</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-heading">
                {formatPrice(price, currency)}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 py-4 border-y border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-brand-500" />
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-brand-500" />
                  <span>14-day returns</span>
                </div>
              </div>

              {/* Estimated Delivery */}
              <EstimatedDelivery cartTotal={price} />

              {/* Description */}
              {product.description && (
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {product.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
                </div>
              )}

              {/* CTAs */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.availableForSale}
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="flex-1"
                >
                  <Link to={`/products/${productHandle}`} onClick={onClose}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Product not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
