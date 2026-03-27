import { createContext, useContext, useState, useEffect } from "react";
import { getCartId, normalizeCartId } from "@/lib/cartManagement";
import MiniCartDrawer from "@/components/MiniCartDrawer";

interface CartContextValue {
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("hp:openMiniCart", handleOpen);
    return () => window.removeEventListener("hp:openMiniCart", handleOpen);
  }, []);

  // Track cart item count via custom event dispatched from MiniCart / add-to-cart flows
  useEffect(() => {
    const handleCountUpdate = (e: Event) => {
      const count = (e as CustomEvent).detail?.count ?? 0;
      setItemCount(count);
    };
    window.addEventListener("hp:cartCountUpdate", handleCountUpdate);
    return () => window.removeEventListener("hp:cartCountUpdate", handleCountUpdate);
  }, []);

  return (
    <CartContext.Provider value={{ openCart, closeCart, itemCount }}>
      {children}
      <MiniCartDrawer
        open={open}
        onClose={closeCart}
        cartId={normalizeCartId(getCartId()) || getCartId() || ""}
      />
    </CartContext.Provider>
  );
}
