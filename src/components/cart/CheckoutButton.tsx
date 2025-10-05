import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { trackBeginCheckout, CartItem } from "@/lib/cartTracking";

interface CheckoutButtonProps {
  cartItems: CartItem[];
  cartTotal: number;
  onCheckout?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Checkout button that tracks "begin_checkout" event
 * Use this component wherever checkout is initiated
 */
const CheckoutButton = ({
  cartItems,
  cartTotal,
  onCheckout,
  disabled = false,
  className = "",
}: CheckoutButtonProps) => {
  const handleCheckout = async () => {
    // Fire non-blocking tracking event
    trackBeginCheckout(cartItems, cartTotal);

    // Execute checkout callback
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleCheckout}
      disabled={disabled || cartItems.length === 0}
      className={className}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Proceed to Checkout
    </Button>
  );
};

export default CheckoutButton;
