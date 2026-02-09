import MiniCart from "./cart/MiniCart";

export default function MiniCartDrawer({
  open,
  onClose,
  cartId,
  subtotal,
}: {
  open: boolean;
  onClose: () => void;
  cartId: string;
  subtotal?: number;
}) {
  return <MiniCart open={open} onClose={onClose} cartId={cartId} subtotal={subtotal} />;
}
