import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCartId, normalizeCartId } from "@/lib/cartManagement";
import MiniCartDrawer from "@/components/MiniCartDrawer";

interface CartContextValue {
  openCart: (trigger?: HTMLElement) => void;
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
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const rememberTrigger = () => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  };
  const openCart = (trigger?: HTMLElement) => {
    if (trigger) returnFocusRef.current = trigger;
    else rememberTrigger();
    setOpen(true);
  };
  const closeCart = () => {
    setOpen(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 100);
  };

  useEffect(() => {
    const handleOpen = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setOpen(true);
    };
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
