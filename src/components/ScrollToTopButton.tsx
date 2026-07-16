import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const toggleVisibility = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const salonClose = document.querySelector<HTMLElement>("[data-home-booking-close]");
        const salonRect = salonClose?.getBoundingClientRect();
        const salonIsVisible = Boolean(
          salonRect && salonRect.bottom > 0 && salonRect.top < window.innerHeight,
        );
        const footer = document.querySelector<HTMLElement>("[data-home-footer]");
        const footerRect = footer?.getBoundingClientRect();
        const footerIsVisible = Boolean(
          footerRect && footerRect.bottom > 0 && footerRect.top < window.innerHeight,
        );
        const productCore = document.querySelector<HTMLElement>("[data-product-detail-core]");
        const productCoreRect = productCore?.getBoundingClientRect();
        const productCoreIsVisible = Boolean(
          productCoreRect && productCoreRect.bottom > 0 && productCoreRect.top < window.innerHeight,
        );
        const productShareClose = document.querySelector<HTMLElement>("[data-product-share-close]");
        const productShareRect = productShareClose?.getBoundingClientRect();
        const productShareIsVisible = Boolean(
          productShareRect && productShareRect.bottom > 0 && productShareRect.top < window.innerHeight,
        );
        const productRecommendations = document.querySelector<HTMLElement>("[data-product-recommendations]");
        const productRecommendationsRect = productRecommendations?.getBoundingClientRect();
        const productRecommendationsAreVisible = Boolean(
          productRecommendationsRect && productRecommendationsRect.bottom > 0 && productRecommendationsRect.top < window.innerHeight,
        );
        setIsVisible(window.pageYOffset > 300 && !salonIsVisible && !footerIsVisible && !productCoreIsVisible && !productShareIsVisible && !productRecommendationsAreVisible);
      });
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    window.addEventListener("resize", toggleVisibility);

    const mountObserver = new MutationObserver(toggleVisibility);
    mountObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", toggleVisibility);
      mountObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 left-4 z-40 w-12 h-12 rounded-full bg-brand-500 !text-white shadow-2xl hover:bg-brand-600 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
