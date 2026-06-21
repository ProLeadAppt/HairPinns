import { useEffect, useState } from "react";

type LoadedComponents = {
  TrackingScripts?: React.ComponentType;
  TrackingInitializer?: React.ComponentType;
  ScrollTracker?: React.ComponentType;
};

const isPrerenderOrHeadless = () => {
  if (typeof navigator === "undefined") return true;
  return /HeadlessChrome|HairPinnsPrerender/i.test(navigator.userAgent || "");
};

const TrackingGate = () => {
  const [loaded, setLoaded] = useState<LoadedComponents>({});

  useEffect(() => {
    if (isPrerenderOrHeadless()) return;

    const loadTracking = async () => {
      const [scripts, initializer, scroll] = await Promise.all([
        import("./TrackingScripts"),
        import("./TrackingInitializer"),
        import("@/components/analytics/ScrollTracker"),
      ]);

      setLoaded({
        TrackingScripts: scripts.default,
        TrackingInitializer: initializer.default,
        ScrollTracker: scroll.default,
      });
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => number;
    };

    let cancelled = false;
    const run = () => {
      if (!cancelled) {
        void loadTracking().catch((error) => {
          console.warn("[TrackingGate] Failed to load tracking modules:", error);
        });
      }
    };

    let handle: number | undefined;
    if (typeof w.requestIdleCallback === "function") {
      handle = w.requestIdleCallback(run, { timeout: 3500 });
    } else {
      handle = window.setTimeout(run, 3500);
    }

    return () => {
      cancelled = true;
      if (typeof handle === "number" && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(handle);
      }
      if (typeof handle === "number") {
        window.clearTimeout(handle);
      }
    };
  }, []);

  const TrackingScripts = loaded.TrackingScripts;
  const TrackingInitializer = loaded.TrackingInitializer;
  const ScrollTracker = loaded.ScrollTracker;

  return (
    <>
      {TrackingScripts ? <TrackingScripts /> : null}
      {TrackingInitializer ? <TrackingInitializer /> : null}
      {ScrollTracker ? <ScrollTracker /> : null}
    </>
  );
};

export default TrackingGate;