import { useEffect, useRef, useState } from "react";

const isPrerenderAgent = () =>
  typeof navigator === "undefined" || /HairPinnsPrerender/i.test(navigator.userAgent || "");

const useViewportImageGate = <T extends Element>() => {
  const targetRef = useRef<T>(null);
  const [imagesEnabled, setImagesEnabled] = useState(false);

  useEffect(() => {
    if (isPrerenderAgent()) return;

    const target = targetRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setImagesEnabled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImagesEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return { targetRef, imagesEnabled };
};

export default useViewportImageGate;
