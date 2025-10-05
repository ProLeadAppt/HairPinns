import { Badge } from "@/components/ui/badge";
import { Flame, Package } from "lucide-react";

interface ProductBadgesProps {
  stock?: number;
  soldLast24h?: number;
  lowStockThreshold?: number;
  fastMovingThreshold?: number;
}

const ProductBadges = ({
  stock,
  soldLast24h,
  lowStockThreshold = 5,
  fastMovingThreshold = 10,
}: ProductBadgesProps) => {
  const isLowStock = stock !== undefined && stock <= lowStockThreshold && stock > 0;
  const isFastMoving = soldLast24h !== undefined && soldLast24h >= fastMovingThreshold;

  if (!isLowStock && !isFastMoving) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {isLowStock && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          Only {stock} left
        </Badge>
      )}
      {isFastMoving && (
        <Badge variant="default" className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600">
          <Flame className="w-3 h-3" />
          {soldLast24h}+ sold today
        </Badge>
      )}
    </div>
  );
};

export default ProductBadges;
