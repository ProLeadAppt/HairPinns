import { useEffect } from "react";

const LOADER_ID = "leadconnector-widget-loader";
const WIDGET_SELECTOR = "chat-widget#leadconnector-widget";
const WIDGET_ID = "69faa5663cc757c354898554";

/**
 * Loads Hair Pinns' LeadConnector widget from application scope so the widget
 * is available on every route without waiting for the deferred footer.
 */
const LeadConnectorWidget = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    if (userAgent.includes("HeadlessChrome") || userAgent.includes("HairPinnsPrerender")) return;
    if (document.getElementById(LOADER_ID) || document.querySelector(WIDGET_SELECTOR)) return;

    let loaded = false;
    const cleanupIntentListeners = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("touchstart", load);
      window.clearTimeout(idleTimer);
    };

    const load = () => {
      if (loaded || document.getElementById(LOADER_ID) || document.querySelector(WIDGET_SELECTOR)) return;
      loaded = true;

      const script = document.createElement("script");
      script.id = LOADER_ID;
      script.async = true;
      script.src = "https://beta.leadconnectorhq.com/loader.js";
      script.referrerPolicy = "strict-origin-when-cross-origin";
      script.setAttribute("data-resources-url", "https://beta.leadconnectorhq.com/chat-widget/loader.js");
      script.setAttribute("data-widget-id", WIDGET_ID);
      script.addEventListener("load", () => {
        document.documentElement.dataset.leadconnectorStatus = "loaded";
      }, { once: true });
      script.addEventListener("error", () => {
        document.documentElement.dataset.leadconnectorStatus = "error";
      }, { once: true });

      document.documentElement.dataset.leadconnectorStatus = "loading";
      document.body.appendChild(script);
      cleanupIntentListeners();
    };

    function onScroll() {
      if (window.scrollY > 200) load();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", load, { once: true });
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("touchstart", load, { once: true, passive: true });
    const idleTimer = window.setTimeout(load, 8000);

    return cleanupIntentListeners;
  }, []);

  return null;
};

export default LeadConnectorWidget;
