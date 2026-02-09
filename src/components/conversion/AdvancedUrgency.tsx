import { useState, useEffect } from "react";
import { Clock, Users, TrendingUp, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface AdvancedUrgencyProps {
  productId?: string;
  productTitle?: string;
  stockLevel?: number;
  recentSalesCount?: number;
  viewingCount?: number;
  lastPurchaseTime?: number; // minutes ago
  timeUntilEnd?: number; // hours until offer ends
  offerEndsAt?: Date;
  className?: string;
}

const AdvancedUrgency = ({
  productId,
  productTitle,
  stockLevel,
  recentSalesCount,
  viewingCount,
  lastPurchaseTime,
  timeUntilEnd,
  offerEndsAt,
  className = "",
}: AdvancedUrgencyProps) => {
  const [displayStock, setDisplayStock] = useState<number | null>(null);
  const [displaySales, setDisplaySales] = useState<number | null>(null);
  const [displayViewing, setDisplayViewing] = useState<number | null>(null);
  const [displayLastPurchase, setDisplayLastPurchase] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Simulate data if not provided
    if (stockLevel === undefined) {
      setDisplayStock(Math.floor(Math.random() * 20) + 1);
    } else {
      setDisplayStock(stockLevel);
    }

    if (recentSalesCount === undefined) {
      setDisplaySales(Math.floor(Math.random() * 15) + 5);
    } else {
      setDisplaySales(recentSalesCount);
    }

    if (viewingCount === undefined) {
      setDisplayViewing(Math.floor(Math.random() * 10) + 3);
    } else {
      setDisplayViewing(viewingCount);
    }

    if (lastPurchaseTime === undefined) {
      setDisplayLastPurchase(Math.floor(Math.random() * 30) + 1);
    } else {
      setDisplayLastPurchase(lastPurchaseTime);
    }

    // Calculate time remaining for offers
    if (offerEndsAt) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const diff = offerEndsAt.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours > 0) {
          setTimeRemaining(hours);
        } else {
          setTimeRemaining(null);
        }
      };
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
      return () => clearInterval(interval);
    } else if (timeUntilEnd !== undefined) {
      setTimeRemaining(timeUntilEnd);
    }
  }, [stockLevel, recentSalesCount, viewingCount, lastPurchaseTime, timeUntilEnd, offerEndsAt]);

  const badges = [];

  // Stock Level Urgency
  if (displayStock !== null) {
    if (displayStock === 0) {
      badges.push(
        <Badge key="out-of-stock" variant="destructive" className="gap-1.5 animate-pulse">
          <ShoppingBag className="w-3 h-3" />
          Out of Stock
        </Badge>
      );
    } else if (displayStock < 5) {
      badges.push(
        <Badge key="very-low-stock" variant="destructive" className="gap-1.5">
          <Clock className="w-3 h-3" />
          Only {displayStock} left in stock!
        </Badge>
      );
    } else if (displayStock < 10) {
      badges.push(
        <Badge key="low-stock" variant="warning" className="gap-1.5">
          <Clock className="w-3 h-3" />
          Only {displayStock} left in stock
        </Badge>
      );
    }
  }

  // Recent Sales
  if (displaySales !== null && displaySales > 10) {
    badges.push(
      <Badge key="recent-sales" variant="secondary" className="gap-1.5">
        <TrendingUp className="w-3 h-3" />
        {displaySales}+ sold in last 24h
      </Badge>
    );
  }

  // Viewing Count
  if (displayViewing !== null && displayViewing > 5) {
    badges.push(
      <Badge key="viewing" variant="secondary" className="gap-1.5">
        <Users className="w-3 h-3" />
        {displayViewing} people viewing now
      </Badge>
    );
  }

  // Last Purchase Notification
  if (displayLastPurchase !== null && displayLastPurchase < 10) {
    badges.push(
      <Badge key="last-purchase" variant="secondary" className="gap-1.5">
        <ShoppingBag className="w-3 h-3" />
        Last purchased {displayLastPurchase} min ago
      </Badge>
    );
  }

  // Time-Sensitive Offer
  if (timeRemaining !== null && timeRemaining > 0) {
    badges.push(
      <Badge key="time-offer" variant="warning" className="gap-1.5 animate-pulse">
        <Clock className="w-3 h-3" />
        Offer ends in {timeRemaining}h
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
};

export default AdvancedUrgency;
