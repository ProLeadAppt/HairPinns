import { Truck, Shield, Star, TrendingUp } from "lucide-react";

/**
 * UrgencyBar Component
 * Sticky bar that appears below the header when scrolling
 * Positioned at top-16 (64px) to account for header height (h-16)
 * z-40 ensures it stays below the header (z-50)
 */
export default function UrgencyBar() {
  return (
    <div className="sticky top-16 z-40 bg-brand-500 text-white py-2.5 px-4 border-b border-brand-600 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-medium">
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4" />
          <span>Free Shipping Over $100</span>
        </div>
        <span className="hidden sm:inline text-brand-300">•</span>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          <span>Limited Stock on Best Sellers</span>
        </div>
        <span className="hidden sm:inline text-brand-300">•</span>
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>14-Day Returns</span>
        </div>
        <span className="hidden sm:inline text-brand-300">•</span>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-current" />
          <span>762+ Five-Star Reviews</span>
        </div>
      </div>
    </div>
  );
}

