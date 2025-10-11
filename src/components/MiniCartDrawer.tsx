import MiniCart from "./cart/MiniCart";

export default function MiniCartDrawer({
  open,
  onClose,
  cartId,
}: {
  open: boolean;
  onClose: () => void;
  cartId: string;
}) {
  return <MiniCart open={open} onClose={onClose} cartId={cartId} />;
}
