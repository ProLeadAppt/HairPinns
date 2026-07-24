import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { ShoppingBag } from "lucide-react";
import { notify } from "@/hooks/use-toast";
import { JENAS_DAILY_TRIO, type JenasDailyTrio } from "@/data/jenasDailyTrio";
import { getProductByHandle } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { getOGImage } from "@/lib/sitemap";
import {
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateWebPageSchema,
  generateProductSchema,
} from "@/lib/schema";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const fireAddToCart = (data: {
  currency: string;
  value: number;
  items: { item_id: string; item_name: string; price: number; quantity: number }[];
}) => {
  try {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "add_to_cart", data);
    }
  } catch {}
};

const fireViewCart = (data: {
  currency: string;
  value: number;
  items: { item_id: string; item_name: string; price: number; quantity: number }[];
}) => {
  try {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "view_cart", data);
    }
  } catch {}
};

interface TrioProductLive {
  handle: string;
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  variantId: string;
  vendor: string;
  availableForSale: boolean;
  url: string;
  pitch: string;
  slot: JenasDailyTrio["products"][number]["slot"];
  badge: string;
  icon: string;
}

const BUNDLE_DISCOUNT = 0.1;

const routineSteps = [
  {
    step: "01",
    title: "Wash twice",
    copy: "The first wash lifts build-up. The second cleans. Massage the scalp for 60 seconds, then rinse.",
  },
  {
    step: "02",
    title: "Condition the lengths",
    copy: "Work through mid-lengths and ends, leave for 60 seconds, then rinse without overworking the hair.",
  },
  {
    step: "03",
    title: "Finish with leave-in",
    copy: "Use a small amount on towel-dried ends before styling for heat protection, frizz control, and softness.",
  },
];

const primaryActionClass = "flex min-h-12 w-full items-center justify-between gap-5 bg-[hsl(var(--after-hours-plum))] px-5 text-sm font-semibold text-[hsl(var(--after-hours-cream))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] disabled:cursor-not-allowed disabled:opacity-45";
const inverseActionClass = "flex min-h-12 w-full items-center justify-between gap-5 bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold text-[hsl(var(--after-hours-plum))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] disabled:cursor-not-allowed disabled:opacity-45";

const JenasDailyTrioPage = () => {
  const trio = JENAS_DAILY_TRIO;
  const [products, setProducts] = useState<TrioProductLive[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);
  const [addingOne, setAddingOne] = useState<string | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const live = await Promise.all(
          trio.products.map(async (config) => {
            try {
              const data: any = await getProductByHandle(config.handle);
              if (!data) return null;
              const firstImage = data.images?.edges?.[0]?.node;
              const firstVariant = data.variants?.edges?.find((variant: any) => variant.node.availableForSale)?.node
                || data.variants?.edges?.[0]?.node;
              return {
                handle: data.handle,
                id: data.id,
                title: data.title,
                image: firstImage?.url || config.fallbackImage || "/placeholder.svg",
                price: parseFloat(data.priceRange?.minVariantPrice?.amount || "0"),
                currency: data.priceRange?.minVariantPrice?.currencyCode || "AUD",
                variantId: firstVariant?.id || "",
                vendor: data.vendor || "",
                availableForSale: !!data.availableForSale,
                url: `https://hairpinns.com/products/${data.handle}`,
                pitch: config.pitch,
                slot: config.slot,
                badge: config.badge,
                icon: config.icon,
              } as TrioProductLive;
            } catch (error) {
              console.warn(`[Trio] failed to load ${config.handle}`, error);
              return null;
            }
          }),
        );
        if (!cancelled) setProducts(live.filter((product): product is TrioProductLive => !!product));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [trio]);

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const subtotal = products.reduce((sum, product) => sum + product.price, 0);
  const bundlePrice = subtotal * (1 - BUNDLE_DISCOUNT);
  const savings = subtotal - bundlePrice;
  const allAvailable = products.length === 3 && products.every((product) => product.availableForSale);
  const bundleReady = !loading && allAvailable;

  const addOne = async (product: TrioProductLive) => {
    if (!product.variantId) {
      notify.error("Sorry, that one’s temporarily out of stock.");
      return;
    }
    setAddingOne(product.handle);
    try {
      const existingCartId = localStorage.getItem("hp_cart_id");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ merchandiseId: product.variantId, quantity: 1 }],
          ...(existingCartId && { cartId: existingCartId }),
        }),
      });
      if (!response.ok) throw new Error("add failed");
      const { cartId } = await response.json();
      if (cartId) localStorage.setItem("hp_cart_id", cartId);
      window.dispatchEvent(new CustomEvent("hp:openMiniCart", { detail: { cartId } }));
      notify.success(`${product.title} added to bag`);
      fireAddToCart({
        currency: product.currency,
        value: product.price,
        items: [{ item_id: product.id, item_name: product.title, price: product.price, quantity: 1 }],
      });
    } catch (error) {
      console.error(error);
      notify.error("Couldn’t add to bag. Try again or visit the product page.");
    } finally {
      setAddingOne(null);
    }
  };

  const addAll = async () => {
    if (!allAvailable) {
      notify.error("One of the trio is unavailable right now.");
      return;
    }
    setAddingAll(true);
    try {
      const existingCartId = localStorage.getItem("hp_cart_id");
      const lines = products.map((product) => ({ merchandiseId: product.variantId, quantity: 1 }));
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          ...(existingCartId && { cartId: existingCartId }),
          attributes: [
            { key: "_bundle", value: "jenas-daily-trio" },
            { key: "_bundle_discount_pct", value: String(BUNDLE_DISCOUNT * 100) },
          ],
        }),
      });
      if (!response.ok) throw new Error("bundle add failed");
      const { cartId, checkoutUrl } = await response.json();
      if (cartId) localStorage.setItem("hp_cart_id", cartId);
      const gaItems = products.map((product) => ({
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: 1,
      }));
      fireAddToCart({ currency: "AUD", value: bundlePrice, items: gaItems });
      fireViewCart({ currency: "AUD", value: bundlePrice, items: gaItems });
      window.dispatchEvent(new CustomEvent("hp:openMiniCart", { detail: { cartId, checkoutUrl } }));
      notify.success("Trio added to bag. Your 10% saving is included.");
    } catch (error) {
      console.error(error);
      notify.error("Couldn’t add the trio. Try again or add each product separately.");
    } finally {
      setAddingAll(false);
    }
  };

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "Collections", url: "https://hairpinns.com/collections" },
    { name: trio.name, url: "https://hairpinns.com/collections/jenas-daily-trio" },
  ]);
  const webPage = generateWebPageSchema({
    name: `${trio.name} — Curated by Jena | Hair Pinns`,
    description: trio.subheadline,
    url: "https://hairpinns.com/collections/jenas-daily-trio",
    speakable: { cssSelector: [".speakable-trio-intro"] },
  });
  const faq = generateFAQPageSchema(trio.faqItems);
  const productSchemas = products.map((product) => generateProductSchema({
    name: product.title,
    description: product.pitch,
    image: product.image,
    price: product.price.toString(),
    currency: product.currency,
    sku: product.handle,
    brand: product.vendor,
    availability: product.availableForSale ? "InStock" : "OutOfStock",
  }));
  const bundleOffer = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: trio.name,
    description: trio.bundlePromise,
    url: "https://hairpinns.com/collections/jenas-daily-trio",
    priceCurrency: "AUD",
    price: bundlePrice.toFixed(2),
    availability: allAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    priceValidUntil: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
    seller: { "@type": "Organization", name: "Hair Pinns" },
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))]">
      <SEOHead
        title={`${trio.name} | 10% off the three Jena uses most | Hair Pinns`}
        description={trio.subheadline}
        canonical="https://hairpinns.com/collections/jenas-daily-trio"
        ogImage={getOGImage("collection")}
        ogType="product"
        hrefLang="en-AU"
        schemaJson={[breadcrumb, webPage, faq, ...productSchemas, bundleOffer]}
      />
      <Header />

      <main id="main-content" tabIndex={-1} data-trio-page="">
        <div className="border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[78rem]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: trio.name }]} variant="dark" />
          </div>
        </div>

        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="trio-title">
          <div className="mx-auto grid max-w-[78rem] lg:min-h-[45rem] lg:grid-cols-[0.62fr_0.38fr]">
            <div className="flex flex-col justify-between px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:pr-16">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Jena’s shelf / Daily routine</p>
                <h1 id="trio-title" className="mt-6 max-w-[9ch] font-heading text-[clamp(3.6rem,9vw,8rem)] font-semibold leading-[0.87] tracking-[-0.06em] text-[hsl(var(--after-hours-cream))]">
                  {trio.headline}
                </h1>
                <p className="speakable-trio-intro mt-8 max-w-[42rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.76)] sm:text-lg sm:leading-8">
                  {trio.subheadline}
                </p>
              </div>
              <dl className="mt-12 grid grid-cols-3 border-y border-[hsl(var(--after-hours-cream)/0.22)] py-5">
                <div><dt className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.52)]">Routine</dt><dd className="mt-2 font-heading text-xl">3 steps</dd></div>
                <div className="border-l border-[hsl(var(--after-hours-cream)/0.18)] pl-4"><dt className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.52)]">Bundle</dt><dd className="mt-2 font-heading text-xl">10% off</dd></div>
                <div className="border-l border-[hsl(var(--after-hours-cream)/0.18)] pl-4"><dt className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.52)]">Chosen by</dt><dd className="mt-2 font-heading text-xl">Jena</dd></div>
              </dl>
            </div>

            <aside className="flex flex-col justify-between border-t border-[hsl(var(--after-hours-cream)/0.18)] bg-[hsl(var(--after-hours-cream))] p-6 text-[hsl(var(--after-hours-plum))] sm:p-10 lg:border-l lg:border-t-0 lg:p-12" aria-label="Bundle summary">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.62)]">The complete set</p>
                <div className="mt-6 border-t border-[hsl(var(--after-hours-plum)/0.22)]">
                  {trio.products.map((product, index) => (
                    <div key={product.handle} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-[hsl(var(--after-hours-plum)/0.18)] py-4">
                      <span className="font-mono text-[0.62rem] text-[hsl(var(--after-hours-plum)/0.52)]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-sm font-semibold">{product.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                {loading ? <div className="h-12 w-40 animate-pulse bg-[hsl(var(--after-hours-plum)/0.1)]" /> : subtotal > 0 ? (
                  <>
                    <div className="flex items-end justify-between gap-4 border-b border-[hsl(var(--after-hours-plum)/0.22)] pb-5">
                      <div><p className="text-[0.61rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.56)]">Bundle price</p><p className="mt-2 font-heading text-4xl">{formatPrice(bundlePrice, "AUD")}</p></div>
                      <p className="pb-1 text-sm text-[hsl(var(--after-hours-plum)/0.6)] line-through">{formatPrice(subtotal, "AUD")}</p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.68)]">You save {formatPrice(savings, "AUD")} against the three individual prices.</p>
                  </>
                ) : <p className="text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.68)]">Live pricing is loading. You can still view each product below.</p>}

                <button type="button" onClick={addAll} disabled={!bundleReady || addingAll} className={`${primaryActionClass} mt-7`} data-cta="jenas-trio-add-all" data-cta-placement="trio_hero" data-cta-offer="jenas_daily_trio_10_off">
                  <span>{addingAll ? "Adding trio…" : "Add all three to bag"}</span><ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </button>
                <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("jenas_trio_hero", "/collections/jenas-daily-trio")} className="mt-3 flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-plum)/0.34)] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">
                  {BOOK_CTA_LABEL}<span aria-hidden="true">↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-paper))] py-16 lg:py-24" aria-labelledby="trio-products-title">
          <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-5 md:grid-cols-[0.75fr_1.25fr] md:items-end">
              <div><p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.66)]">01 / Inside the trio</p><h2 id="trio-products-title" className="mt-4 max-w-[9ch] font-heading text-[clamp(2.8rem,7vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]">Three bottles. Three jobs.</h2></div>
              <p className="max-w-[40rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.66)] md:justify-self-end">A complete wash-day sequence without a crowded shelf. Each product has one clear role and earns its place in the routine.</p>
            </div>

            {loading ? (
              <div className="mt-12 grid gap-px bg-[hsl(var(--after-hours-plum)/0.2)] md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="bg-[hsl(var(--after-hours-paper))] p-5"><div className="aspect-[4/5] animate-pulse bg-[hsl(var(--after-hours-plum)/0.08)]" /><div className="mt-5 h-8 animate-pulse bg-[hsl(var(--after-hours-plum)/0.08)]" /></div>)}</div>
            ) : (
              <div className="mt-12 grid gap-px bg-[hsl(var(--after-hours-plum)/0.22)] md:grid-cols-3">
                {products.map((product, index) => (
                  <article key={product.handle} className="flex flex-col bg-[hsl(var(--after-hours-paper))] p-4 sm:p-6">
                    <Link to={`/products/${product.handle}`} className="group block overflow-hidden hover:no-underline" aria-label={`View ${product.title}`}>
                      <img src={product.image} alt={product.title} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading={index === 0 ? "eager" : "lazy"} decoding="async" width="800" height="1000" />
                    </Link>
                    <div className="flex flex-1 flex-col border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5">
                      <div className="flex items-center justify-between gap-4 text-[0.61rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.58)]"><span>{String(index + 1).padStart(2, "0")} / {product.badge}</span><span>{product.vendor}</span></div>
                      <h3 className="mt-4 max-w-[15ch] font-heading text-2xl font-normal leading-tight text-[hsl(var(--after-hours-plum))]"><Link to={`/products/${product.handle}`} className="!text-[hsl(var(--after-hours-plum))] hover:!text-[hsl(var(--after-hours-copper))] hover:no-underline">{product.title}</Link></h3>
                      <p className="mt-4 flex-1 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.68)]">{product.pitch}</p>
                      {product.price > 0 ? <p className="mt-6 border-t border-[hsl(var(--after-hours-plum)/0.18)] pt-4 font-heading text-2xl text-[hsl(var(--after-hours-plum))]">{formatPrice(product.price, product.currency)}</p> : null}
                      <button type="button" onClick={() => addOne(product)} disabled={!product.availableForSale || addingOne === product.handle} className={`${primaryActionClass} mt-5`} data-cta="jenas-trio-add-one" data-cta-placement="trio_product_card" data-cta-product={product.handle}>
                        <span>{addingOne === product.handle ? "Adding…" : product.availableForSale ? "Add to bag" : "Out of stock"}</span><span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-cream))] py-16 lg:py-24" aria-labelledby="jena-note-title">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 sm:px-6 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16 lg:px-8">
            <figure>
              <img src="/assets/images/jena-headshot-4lMGRCmj.webp" alt="Jena Pinn, owner of Hair Pinns Bangor" className="aspect-[4/5] w-full max-w-[18rem] object-cover" loading="lazy" decoding="async" width="400" height="500" />
              <figcaption className="border-b border-[hsl(var(--after-hours-plum)/0.24)] py-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.62)]">Jena Pinn / Bangor</figcaption>
            </figure>
            <div className="self-center border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-6">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.66)]">02 / Why these three</p>
              <blockquote id="jena-note-title" className="mt-6 max-w-[18ch] font-heading text-[clamp(2.3rem,5vw,4.7rem)] font-normal leading-[1.02] tracking-[-0.04em] text-[hsl(var(--after-hours-plum))]">“{trio.jenaStory}”</blockquote>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-near-black))] py-16 text-[hsl(var(--after-hours-cream))] lg:py-24" aria-labelledby="routine-title">
          <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
            <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">03 / The routine</p>
            <h2 id="routine-title" className="mt-5 max-w-[11ch] font-heading text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]">Wash day, made simple.</h2>
            <ol className="mt-12 grid gap-8 border-t border-[hsl(var(--after-hours-cream)/0.22)] pt-8 md:grid-cols-3 md:gap-10">
              {routineSteps.map((step) => <li key={step.step} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 md:block"><span className="pt-1 font-mono text-[0.62rem] tracking-[0.16em] text-[hsl(var(--after-hours-copper))]">{step.step}</span><div className="md:mt-5"><h3 className="font-heading text-2xl font-normal text-[hsl(var(--after-hours-cream))]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)]">{step.copy}</p></div></li>)}
            </ol>
          </div>
        </section>

        <section className="border-b border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-paper))] py-16 lg:py-24" aria-labelledby="value-title">
          <div className="mx-auto max-w-[65rem] px-4 sm:px-6 lg:px-8">
            <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.66)]">04 / The value</p>
            <h2 id="value-title" className="mt-5 max-w-[12ch] font-heading text-[clamp(2.8rem,6vw,5.5rem)] font-normal leading-[0.93] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]">The same routine, with less on the total.</h2>
            <div className="mt-12 grid border-y border-[hsl(var(--after-hours-plum)/0.24)] md:grid-cols-2">
              <div className="py-8 md:pr-10"><p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.56)]">Buying separately</p><p className="mt-6 font-heading text-4xl text-[hsl(var(--after-hours-plum))]">{formatPrice(subtotal, "AUD")}</p><p className="mt-3 text-sm text-[hsl(var(--after-hours-plum)/0.64)]">The current total of all three individual products.</p></div>
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.24)] bg-[hsl(var(--after-hours-cream))] py-8 md:border-l md:border-t-0 md:px-10"><p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">The trio / save 10%</p><p className="mt-6 font-heading text-4xl text-[hsl(var(--after-hours-plum))]">{formatPrice(bundlePrice, "AUD")}</p><p className="mt-3 text-sm text-[hsl(var(--after-hours-plum)/0.64)]">A saving of {formatPrice(savings, "AUD")} across the routine.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-cream))] py-16 lg:py-24" aria-labelledby="trio-faq-title">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 sm:px-6 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:px-8">
            <header><p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.66)]">05 / Before you buy</p><h2 id="trio-faq-title" className="mt-4 max-w-[10ch] font-heading text-[clamp(2.8rem,5vw,5rem)] font-normal leading-[0.94] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]">Questions about the trio.</h2></header>
            <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
              {trio.faqItems.map((item, index) => (
                <details key={item.question} className="group border-b border-[hsl(var(--after-hours-plum)/0.22)]">
                  <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 font-semibold text-[hsl(var(--after-hours-plum))] [&::-webkit-details-marker]:hidden"><span className="font-mono text-[0.62rem] text-[hsl(var(--after-hours-plum)/0.58)]">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><span className="transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
                  <p className="max-w-[44rem] pb-7 pl-11 text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.74)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.64fr_0.36fr] lg:gap-20 lg:px-8 lg:py-24">
            <div><p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">One routine / Three products</p><h2 className="mt-5 max-w-[11ch] font-heading text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]">Ready for a simpler wash day?</h2></div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-6"><button type="button" onClick={addAll} disabled={!bundleReady || addingAll} className={inverseActionClass} data-cta="jenas-trio-add-all-bottom" data-cta-placement="trio_bottom" data-cta-offer="jenas_daily_trio_10_off"><span>{addingAll ? "Adding trio…" : "Add all three to bag"}</span><span aria-hidden="true">→</span></button><a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("jenas_trio_bottom", "/collections/jenas-daily-trio")} className="mt-3 flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">{BOOK_CTA_LABEL}<span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        {bundleReady && showStickyCta ? (
          <div className="fixed bottom-3 left-3 right-3 z-50 border border-[hsl(var(--after-hours-cream)/0.24)] bg-[hsl(var(--after-hours-plum))] p-3 text-[hsl(var(--after-hours-cream))] shadow-xl md:hidden">
            <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-copper))]">Jena’s Daily Trio</p><p className="mt-1 text-sm">{formatPrice(bundlePrice, "AUD")} / save {formatPrice(savings, "AUD")}</p></div><span className="text-[0.61rem] font-semibold uppercase tracking-[0.12em]">10% off</span></div>
            <button type="button" onClick={addAll} disabled={addingAll || !allAvailable} className={inverseActionClass} data-cta="jenas-trio-add-all-mobile" data-cta-placement="trio_mobile_sticky" data-cta-offer="jenas_daily_trio_10_off"><span>{addingAll ? "Adding trio…" : "Add all three to bag"}</span><ShoppingBag className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default JenasDailyTrioPage;
