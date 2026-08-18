import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { preferredScrollBehavior } from "@/lib/motion";
import { useFloatingActions } from "@/contexts/FloatingActionsContext";

const ScrollToTopButton = () => {
  const [passedScrollThreshold, setPassedScrollThreshold] = useState(false);
  const { scrollTopBlocked } = useFloatingActions();
  const isVisible = passedScrollThreshold && !scrollTopBlocked;

  useEffect(() => {
    let frame = 0;
    const updateScrollThreshold = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setPassedScrollThreshold(window.pageYOffset > 300);
      });
    };

    updateScrollThreshold();
    window.addEventListener("scroll", updateScrollThreshold, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollThreshold);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: preferredScrollBehavior(),
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="floating-scroll-top group fixed left-4 z-40 flex h-12 w-12 items-center justify-center rounded-none border border-[hsl(var(--after-hours-copper))] bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))] shadow-[0_10px_24px_-14px_hsl(var(--after-hours-near-black)/0.65)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[hsl(var(--after-hours-near-black))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-1 motion-reduce:group-hover:translate-y-0" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
