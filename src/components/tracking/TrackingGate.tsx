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

    let cancelled = false;
    let started = false;
    let delayHandle: number | undefined;
    const run = () => {
      if (cancelled || started) return;
      started = true;
      if (typeof delayHandle === "number") window.clearTimeout(delayHandle);
      void loadTracking().catch((error) => {
        console.warn("[TrackingGate] Failed to load tracking modules:", error);
      });
    };

    const scheduleAfterLoad = () => {
      delayHandle = window.setTimeout(run, 4000);
    };

    if (document.readyState === "complete") {
      scheduleAfterLoad();
    } else {
      window.addEventListener("load", scheduleAfterLoad, { once: true });
    }
    window.addEventListener("pointerdown", run, { once: true, passive: true });
    window.addEventListener("keydown", run, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleAfterLoad);
      window.removeEventListener("pointerdown", run);
      window.removeEventListener("keydown", run);
      if (typeof delayHandle === "number") window.clearTimeout(delayHandle);
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