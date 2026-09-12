import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    jdgm?: Record<string, unknown>;
    jdgmCacheServer?: { reloadAll: () => void };
  }
}

/** Only the public widget token belongs here. Never use a Judge.me private API token. */
const WIDGET_SOURCE = "https://cdnwidget.judge.me/widget_preloader.js";

export default function ProductReviews({ productId, title }: { productId: string; title: string }) {
  const section = useRef<HTMLElement>(null);
  const widget = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const id = productId.split("/").pop();

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const followReviewLink = () => {
      if (window.location.hash === "#product-reviews" || new URLSearchParams(window.location.search).get("postProductReview") === "true") {
        setRequested(true);
        element.scrollIntoView({ block: "start" });
      }
    };
    followReviewLink();
    window.addEventListener("hashchange", followReviewLink);
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setRequested(true); }, { rootMargin: "250px" })
      : null;
    observer?.observe(element);
    return () => { observer?.disconnect(); window.removeEventListener("hashchange", followReviewLink); };
  }, []);

  useEffect(() => {
    if (!requested || !id || !/^\d+$/.test(id)) return;
    setStatus("loading");
    let disposed = false;
    const fail = () => { if (!disposed) setStatus("error"); };
    const ready = () => { if (!disposed) setScriptReady(true); };
    window.jdgm = { ...window.jdgm, SHOP_DOMAIN: "femtat-zu.myshopify.com", PLATFORM: "shopify", PUBLIC_TOKEN: "cgjYETTCP80x22qLz8BcehFuv0E" };
    let script = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SOURCE}"]`);
    if (window.jdgmCacheServer) {
      ready();
    } else if (!script) {
      script = document.createElement("script");
      script.src = WIDGET_SOURCE;
      script.async = true;
      script.dataset.cfasync = "false";
      script.addEventListener("load", ready, { once: true });
      script.addEventListener("error", fail);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", ready, { once: true });
      script.addEventListener("error", fail);
    }
    return () => {
      disposed = true;
      script?.removeEventListener("load", ready);
      script?.removeEventListener("error", fail);
    };
  }, [requested, id]);

  useEffect(() => {
    // Judge.me requires its preloader to execute before the widget HTML is added.
    if (!scriptReady || !widget.current) return;
    const target = widget.current;
    const markReady = () => {
      if (target.querySelector(".jdgm-rev-widg")) setStatus("ready");
    };
    const observeContent = new MutationObserver(markReady);
    observeContent.observe(target, { childList: true, subtree: true });
    window.jdgmCacheServer?.reloadAll();
    markReady();
    const timeout = window.setTimeout(() => setStatus("error"), 20000);
    return () => { clearTimeout(timeout); observeContent.disconnect(); };
  }, [scriptReady, id]);

  if (!id || !/^\d+$/.test(id)) return null;
  return (
    <section ref={section} id="product-reviews" aria-label="Product reviews" className="scroll-mt-28 border-y border-border bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-3xl text-heading">Tried it? Tell us what you think.</h2>
        <p className="mt-3 mb-6 text-foreground">Your honest review helps the next person choose what is right for their hair.</p>
        {status === "idle" && <button type="button" className="min-h-12 rounded-lg bg-primary px-6 text-primary-foreground" onClick={() => setRequested(true)}>Read or write a product review</button>}
        {status === "loading" && <p role="status">Loading product reviews…</p>}
        {status === "error" && <p role="status">Reviews could not load. Please refresh to try again, or <a className="underline" href="mailto:jena@hairpinns.com">contact Jena for help</a>.</p>}
        {scriptReady && <div ref={widget} className="jdgm-widget jdgm-review-widget jdgm-outside-widget" data-id={id} data-product-title={title} />}
      </div>
    </section>
  );
}
