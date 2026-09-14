import { Truck } from "lucide-react";

interface EstimatedDeliveryProps {
  cartTotal?: number;
}

const EstimatedDelivery = (_props: EstimatedDeliveryProps) => {
  // Order value cannot predict dispatch, particularly for preorder items.

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Truck className="w-4 h-4 text-brand-500" />
      <span>
        Delivery time starts after dispatch. Check product availability and the shipping policy for preorder details.
      </span>
    </div>
  );
};

export default EstimatedDelivery;
