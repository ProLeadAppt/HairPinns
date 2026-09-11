import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { clearCartId, getCartId, normalizeCartId } from "@/lib/cartManagement";
import {
  getCartSnapshot,
  isStaleCartError,
  prepareCartCheckout,
  removeCartLines,
  type CartSnapshot,
} from "@/lib/cartApi";

const loadMiniCartDrawer = () => import("@/components/MiniCartDrawer");
const MiniCartDrawer = lazy(loadMiniCartDrawer);

interface CartContextValue {
  openCart: (trigger?: HTMLElement) => void;
  closeCart: () => void;
  itemCount: number;
  cart: CartSnapshot | null;
  cartLoading: boolean;
  cartError: string | null;
  refreshCart: (cartId?: string | null) => Promise<CartSnapshot | null>;
  removeLine: (lineId: string) => Promise<CartSnapshot | null>;
  prepareCheckout: (discountCodes?: string[]) => Promise<CartSnapshot>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const countItems = (cart: CartSnapshot | null) =>
  cart?.totalQuantity
  ?? cart?.lines?.edges?.reduce((total, edge) => total + (edge.node?.quantity || 0), 0)
  ?? 0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [drawerRequested, setDrawerRequested] = useState(false);
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const requestRevisionRef = useRef(0);

  const acceptCart = useCallback((nextCart: CartSnapshot | null) => {
    setCart(nextCart);
    setCartError(null);
  }, []);

  const refreshCart = useCallback(async (requestedCartId?: string | null) => {
    const storedCartId = normalizeCartId(getCartId()) || getCartId();
    const cartId = normalizeCartId(requestedCartId || null) || requestedCartId || storedCartId;
    if (!cartId) {
      acceptCart(null);
      return null;
    }

    const revision = ++requestRevisionRef.current;
    setCartLoading(true);
    setCartError(null);
    try {
      const snapshot = await getCartSnapshot(cartId);
      if (requestRevisionRef.current === revision) acceptCart(snapshot);
      return snapshot;
    } catch (error) {
      if (requestRevisionRef.current !== revision) return null;
      if (isStaleCartError(error)) {
        clearCartId();
        acceptCart(null);
        return null;
      }
      setCartError("Could not load your bag. Close it and try again.");
      throw error;
    } finally {
      if (requestRevisionRef.current === revision) setCartLoading(false);
    }
  }, [acceptCart]);

  useEffect(() => {
    void refreshCart().catch((error) => {
      console.warn("[Cart] Could not hydrate the saved bag", error);
    });
  }, [refreshCart]);

  const showDrawer = useCallback((trigger?: HTMLElement) => {
    returnFocusRef.current = trigger
      || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setDrawerRequested(true);
    void loadMiniCartDrawer();
    setOpen(true);
  }, []);

  const openCart = useCallback((trigger?: HTMLElement) => {
    showDrawer(trigger);
    void refreshCart().catch(() => undefined);
  }, [refreshCart, showDrawer]);

  const closeCart = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => returnFocusRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ cart?: CartSnapshot; cartId?: string }>).detail;
      showDrawer();
      if (detail?.cart?.id) {
        requestRevisionRef.current += 1;
        acceptCart(detail.cart);
        setCartLoading(false);
        return;
      }
      void refreshCart(detail?.cartId).catch(() => undefined);
    };
    window.addEventListener("hp:openMiniCart", handleOpen);
    return () => window.removeEventListener("hp:openMiniCart", handleOpen);
  }, [acceptCart, refreshCart, showDrawer]);

  const removeLine = useCallback(async (lineId: string) => {
    if (!cart?.id) return null;
    try {
      const snapshot = await removeCartLines(cart.id, [lineId]);
      acceptCart(snapshot);
      return snapshot;
    } catch (error) {
      if (isStaleCartError(error)) {
        acceptCart(null);
        return null;
      }
      throw error;
    }
  }, [acceptCart, cart?.id]);

  const prepareCheckout = useCallback(async (discountCodes?: string[]) => {
    if (!cart?.id) throw new Error("Your bag is empty.");
    const snapshot = await prepareCartCheckout(cart.id, discountCodes);
    acceptCart(snapshot);
    return snapshot;
  }, [acceptCart, cart?.id]);

  const value = useMemo<CartContextValue>(() => ({
    openCart,
    closeCart,
    itemCount: countItems(cart),
    cart,
    cartLoading,
    cartError,
    refreshCart,
    removeLine,
    prepareCheckout,
  }), [cart, cartError, cartLoading, closeCart, openCart, prepareCheckout, refreshCart, removeLine]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {drawerRequested ? (
        <Suspense fallback={null}>
          <MiniCartDrawer open={open} onClose={closeCart} />
        </Suspense>
      ) : null}
    </CartContext.Provider>
  );
}
