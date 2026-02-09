import { useState, useEffect } from "react";
import { ShoppingBag, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface RecentPurchase {
  productName: string;
  customerName: string;
  location: string;
  timeAgo: string;
  productHandle: string;
}

const RecentPurchases = () => {
  const [purchases, setPurchases] = useState<RecentPurchase[]>([]);

  useEffect(() => {
    // Simulated recent purchases - in production, this would come from analytics/API
    const simulatedPurchases: RecentPurchase[] = [
      {
        productName: "Hydrate & Restore Pack",
        customerName: "Sarah",
        location: "Sydney",
        timeAgo: "2 minutes ago",
        productHandle: "hydrate-restore-pack",
      },
      {
        productName: "Blonde Brilliance Pack",
        customerName: "Emma",
        location: "Melbourne",
        timeAgo: "5 minutes ago",
        productHandle: "blonde-brilliance-pack",
      },
      {
        productName: "Smoothing Treatment Kit",
        customerName: "Jessica",
        location: "Brisbane",
        timeAgo: "8 minutes ago",
        productHandle: "smoothing-treatment-kit",
      },
    ];

    // Rotate through purchases every 5 seconds
    let currentIndex = 0;
    setPurchases([simulatedPurchases[0]]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % simulatedPurchases.length;
      setPurchases([simulatedPurchases[currentIndex]]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (purchases.length === 0) return null;

  return (
    <div className="bg-accent/50 rounded-lg p-4 border border-border">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-heading mb-1">
            <span className="font-semibold">{purchases[0].customerName}</span> from{" "}
            <span className="font-semibold">{purchases[0].location}</span> just purchased
          </p>
          <Link
            to={`/products/${purchases[0].productHandle}`}
            className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
          >
            {purchases[0].productName}
            <span className="text-xs">→</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">{purchases[0].timeAgo}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentPurchases;
