import {
  createContext,
  type PropsWithChildren,
  type RefCallback,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DOCK_BLOCKERS = ["[data-home-booking-close]", "[data-home-footer]"] as const;
const SCROLL_BLOCKERS = [
  ...DOCK_BLOCKERS,
  "[data-product-detail-core]",
  "[data-product-share-close]",
  "[data-product-recommendations]",
] as const;
const EDITORIAL_ROUTES = "[data-about-page], [data-services-page], [data-service-detail], [data-booking-page], [data-contact-page]";

type FloatingActionsContextValue = {
  dockBlocked: boolean;
  scrollTopBlocked: boolean;
  dockRef: RefCallback<HTMLDivElement>;
  setDockVisible: (visible: boolean) => void;
};

const FloatingActionsContext = createContext<FloatingActionsContextValue | null>(null);

export const FloatingActionsProvider = ({ children }: PropsWithChildren) => {
  const [dockBlocked, setDockBlocked] = useState(false);
  const [scrollTopBlocked, setScrollTopBlocked] = useState(false);
  const [dockElement, setDockElement] = useState<HTMLDivElement | null>(null);
  const [dockVisible, setDockVisible] = useState(false);

  const dockRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    setDockElement(node);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!dockElement || !dockVisible) {
      root.style.setProperty("--mobile-action-dock-height", "0px");
      root.dataset.mobileActionDockVisible = "false";
      return;
    }

    const publishHeight = () => {
      const height = Math.ceil(dockElement.getBoundingClientRect().height);
      root.style.setProperty("--mobile-action-dock-height", `${height}px`);
      root.dataset.mobileActionDockVisible = height > 0 ? "true" : "false";
    };

    publishHeight();
    const resizeObserver = new ResizeObserver(publishHeight);
    resizeObserver.observe(dockElement);

    return () => {
      resizeObserver.disconnect();
      root.style.setProperty("--mobile-action-dock-height", "0px");
      root.dataset.mobileActionDockVisible = "false";
    };
  }, [dockElement, dockVisible]);

  useEffect(() => {
    const visibleElements = new Map<Element, boolean>();
    const observedElements = new Set<Element>();

    const publishBlockerState = () => {
      const hasVisibleMatch = (selectors: readonly string[]) => selectors.some((selector) => (
        Array.from(document.querySelectorAll(selector)).some((element) => visibleElements.get(element) === true)
      ));

      setDockBlocked(hasVisibleMatch(DOCK_BLOCKERS));
      setScrollTopBlocked(
        hasVisibleMatch(SCROLL_BLOCKERS) || Boolean(document.querySelector(EDITORIAL_ROUTES)),
      );
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibleElements.set(entry.target, entry.isIntersecting));
      publishBlockerState();
    });

    const refreshObservedElements = () => {
      document.querySelectorAll([...SCROLL_BLOCKERS, EDITORIAL_ROUTES].join(", ")).forEach((element) => {
        if (observedElements.has(element)) return;
        observedElements.add(element);
        visibleElements.set(element, false);
        intersectionObserver.observe(element);
      });

      observedElements.forEach((element) => {
        if (element.isConnected) return;
        intersectionObserver.unobserve(element);
        observedElements.delete(element);
        visibleElements.delete(element);
      });

      publishBlockerState();
    };

    refreshObservedElements();
    const mountObserver = new MutationObserver(refreshObservedElements);
    mountObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mountObserver.disconnect();
    };
  }, []);

  const value = useMemo(() => ({
    dockBlocked,
    scrollTopBlocked,
    dockRef,
    setDockVisible,
  }), [dockBlocked, dockRef, scrollTopBlocked]);

  return (
    <FloatingActionsContext.Provider value={value}>
      {children}
    </FloatingActionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFloatingActions = () => {
  const context = useContext(FloatingActionsContext);
  if (!context) throw new Error("useFloatingActions must be used within FloatingActionsProvider");
  return context;
};
