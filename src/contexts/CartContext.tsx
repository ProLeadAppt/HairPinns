import { createContext, useContext, useState, useEffect } from "react";
import { getCartId, normalizeCartId } from "@/lib/cartManagement";
import MiniCartDrawer from "@/components/MiniCartDrawer";

interface CartContextValue {
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("hp:openMiniCart", handleOpen);
    return () => window.removeEventListener("hp:openMiniCart", handleOpen);
  }, []);

  return (
    <CartContext.Provider value={{ openCart, closeCart }}>
      {children}
      <MiniCartDrawer
        open={open}
        onClose={closeCart}
        cartId={normalizeCartId(getCartId()) || getCartId() || ""}
      />
    </CartContext.Provider>
  );
}
