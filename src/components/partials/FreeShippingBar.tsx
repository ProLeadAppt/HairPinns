import { Truck } from "lucide-react";
import { useMemo } from "react";

interface FreeShippingBarProps {
  cartTotal: number; // Current cart subtotal in dollars
  threshold?: number; // Free shipping threshold (default: 150)
  className?: string;
  variant?: "default" | "compact";
}

/**
 * FreeShippingBar Component
 * 
 * Dynamic free shipping progress indicator
 * Shows remaining amount needed for free shipping
 * 
 * @example
 * <FreeShippingBar cartTotal={65} threshold={150} />
 * <FreeShippingBar cartTotal={105} variant="compact" />
 */
export const FreeShippingBar = ({
  cartTotal,
  threshold = 99,
  className = "",
  variant = "default",
}: FreeShippingBarProps) => {
  const { remaining, progress, qualified } = useMemo(() => {
    const remaining = Math.max(0, threshold - cartTotal);
    const progress = Math.min(100, (cartTotal / threshold) * 100);
    const qualified = cartTotal >= threshold;
    
    return { remaining, progress, qualified };
  }, [cartTotal, threshold]);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Truck className={`w-4 h-4 ${qualified ? 'text-green-600' : 'text-brand-500'}`} />
        {qualified ? (
          <span className="text-green-600 font-semibold">
            You qualify for free AU shipping!
          </span>
        ) : (
          <span className="text-foreground">
            Spend <strong>${remaining.toFixed(2)}</strong> more for free AU shipping
          </span>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-accent border border-border rounded-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Truck className={`w-5 h-5 ${qualified ? 'text-green-600' : 'text-brand-500'}`} />
          {qualified ? (
            <span className="text-green-600 font-semibold">
              You qualify for free AU shipping! 🎉
            </span>
          ) : (
            <span className="text-foreground">
              Spend <strong className="text-brand-500">${threshold}</strong> for free AU shipping, you're <strong className="text-brand-500">${remaining.toFixed(2)}</strong> away
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            qualified ? 'bg-green-600' : 'bg-brand-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default FreeShippingBar;
