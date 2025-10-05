import { Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FreeShippingBarProps {
  subtotal: number;
  threshold?: number;
}

const FreeShippingBar = ({ subtotal, threshold = 100 }: FreeShippingBarProps) => {
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const isQualified = subtotal >= threshold;

  return (
    <div className="bg-accent/20 rounded-card p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className={`w-5 h-5 ${isQualified ? 'text-[hsl(var(--success-fg))]' : 'text-brand-500'}`} />
        <p className="text-sm font-medium text-heading">
          {isQualified ? (
            <span className="text-[hsl(var(--success-fg))]">
              🎉 You've qualified for FREE shipping!
            </span>
          ) : (
            <>
              Add <span className="font-bold text-brand-500">${remaining.toFixed(2)}</span> more for FREE shipping
            </>
          )}
        </p>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>${subtotal.toFixed(2)}</span>
        <span>${threshold.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default FreeShippingBar;
