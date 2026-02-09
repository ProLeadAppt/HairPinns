import { Clock, Users, Package, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface UrgencyIndicatorProps {
  productId?: string;
  inStock?: boolean;
  stockLevel?: number;
  showRecentPurchases?: boolean;
  isPopular?: boolean;
  soldLast24h?: number;
  className?: string;
}

export default function UrgencyIndicator({
  productId,
  inStock = true,
  stockLevel,
  showRecentPurchases = true,
  isPopular = false,
  soldLast24h,
  className = "",
}: UrgencyIndicatorProps) {
  const [recentPurchases, setRecentPurchases] = useState<number | null>(null);
  const [isLowStock, setIsLowStock] = useState(false);
  const [isVeryLowStock, setIsVeryLowStock] = useState(false);

  useEffect(() => {
    // Simulate recent purchases (in production, fetch from API)
    if (showRecentPurchases) {
      const purchases = soldLast24h || Math.floor(Math.random() * 20) + 1;
      setRecentPurchases(purchases);
    }

    // Determine stock levels
    if (stockLevel !== undefined) {
      setIsVeryLowStock(stockLevel < 5 && stockLevel > 0);
      setIsLowStock(stockLevel < 10 && stockLevel > 0 && !isVeryLowStock);
    }
  }, [productId, stockLevel, showRecentPurchases, soldLast24h]);

  if (!inStock && stockLevel === 0) {
    return (
      <Badge variant="destructive" className={`gap-1.5 ${className}`}>
        <Package className="w-3 h-3" />
        Out of Stock
      </Badge>
    );
  }

  // Multiple badges can appear together
  const badges = [];

  if (isVeryLowStock) {
    badges.push(
      <Badge key="very-low" variant="destructive" className="gap-1.5">
        <Clock className="w-3 h-3" />
        Only {stockLevel} left!
      </Badge>
    );
  } else if (isLowStock) {
    badges.push(
      <Badge key="low" variant="warning" className="gap-1.5">
        <Clock className="w-3 h-3" />
        Only {stockLevel} left in stock
      </Badge>
    );
  }

  if (isPopular || (soldLast24h && soldLast24h >= 10)) {
    badges.push(
      <Badge key="popular" variant="secondary" className="gap-1.5">
        <TrendingUp className="w-3 h-3" />
        Popular this week
      </Badge>
    );
  }

  if (showRecentPurchases && recentPurchases && recentPurchases > 5) {
    badges.push(
      <Badge key="viewers" variant="secondary" className="gap-1.5">
        <Users className="w-3 h-3" />
        {recentPurchases} viewing now
      </Badge>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {badges}
    </div>
  );
}

