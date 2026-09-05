import MiniCart from "./cart/MiniCart";

export default function MiniCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <MiniCart open={open} onClose={onClose} />;
}
