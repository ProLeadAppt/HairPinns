import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { searchProducts } from "@/lib/shopify";

const ProductCountBadge = () => {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const result = await searchProducts("", 250);
        if (result?.products) {
          const availableProducts = result.products.filter((p: any) => p.availableForSale);
          setProductCount(availableProducts.length);
        }
      } catch (error) {
        console.warn("Failed to fetch product count:", error);
      }
    };

    fetchProductCount();
  }, []);

  if (!productCount) return null;

  return (
    <Badge variant="secondary" className="gap-2 text-sm font-semibold">
      <Package className="w-4 h-4" />
      Shop {productCount}+ Products
    </Badge>
  );
};

export default ProductCountBadge;
