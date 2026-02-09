import { Truck, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface EstimatedDeliveryProps {
  cartTotal?: number;
}

const EstimatedDelivery = ({ cartTotal = 0 }: EstimatedDeliveryProps) => {
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  useEffect(() => {
    // Calculate estimated delivery date (typically 3-5 business days for AU)
    const today = new Date();
    let businessDays = 3; // Default
    
    if (cartTotal >= 100) {
      businessDays = 2; // Faster for free shipping orders
    }

    let count = 0;
    let date = new Date(today);
    
    while (count < businessDays) {
      date.setDate(date.getDate() + 1);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        count++;
      }
    }

    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    setDeliveryDate(date.toLocaleDateString('en-AU', options));
  }, [cartTotal]);

  if (!deliveryDate) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Truck className="w-4 h-4 text-brand-500" />
      <span>
        Estimated delivery: <strong className="text-heading">{deliveryDate}</strong>
      </span>
    </div>
  );
};

export default EstimatedDelivery;
