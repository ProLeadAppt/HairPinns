import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Sparkles, Check, ArrowRight, Star } from "lucide-react";
import { toast } from "sonner";
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
import { BUSINESS_NAP } from "@/config/businessConfig";
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

const BUNDLE_DISCOUNT = 0.1; // 10% off when all 3 are added

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
          trio.products.map(async (cfg) => {
            try {
              const data: any = await getProductByHandle(cfg.handle);
              if (!data) return null;
              const firstImage = data.images?.edges?.[0]?.node;
              const firstVariant = data.variants?.edges?.find(
                (v: any) => v.node.availableForSale
              )?.node || data.variants?.edges?.[0]?.node;
              const price = parseFloat(
                data.priceRange?.minVariantPrice?.amount || "0"
              );
              return {
                handle: data.handle,
                id: data.id,
                title: data.title,
                image: firstImage?.url || "/placeholder.svg",
                price,
                currency:
                  data.priceRange?.minVariantPrice?.currencyCode || "AUD",
                variantId: firstVariant?.id || "",
                vendor: data.vendor || "",
                availableForSale: !!data.availableForSale,
                url: `https://hairpinns.com/products/${data.handle}`,
                pitch: cfg.pitch,
                slot: cfg.slot,
                badge: cfg.badge,
                icon: cfg.icon,
              } as TrioProductLive;
            } catch (e) {
              console.warn(`[Trio] failed to load ${cfg.handle}`, e);
              return null;
            }
          })
        );
        if (cancelled) return;
        setProducts(live.filter((p): p is TrioProductLive => !!p));
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

  const subtotal = products.reduce((s, p) => s + p.price, 0);
  const bundlePrice = subtotal * (1 - BUNDLE_DISCOUNT);
  const savings = subtotal - bundlePrice;
  const allAvailable = products.length === 3 && products.every((p) => p.availableForSale);
  const bundleReady = !loading && allAvailable;

  const addOne = async (p: TrioProductLive) => {
    if (!p.variantId) {
      toast.error("Sorry, that one's temporarily out of stock.");
      return;
    }
    setAddingOne(p.handle);
    try {
      const existingCartId = localStorage.getItem("hp_cart_id");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ merchandiseId: p.variantId, quantity: 1 }],
          ...(existingCartId && { cartId: existingCartId }),
        }),
      });
      if (!res.ok) throw new Error("add failed");
      const { cartId } = await res.json();
      if (cartId) localStorage.setItem("hp_cart_id", cartId);
      window.dispatchEvent(new CustomEvent("hp:openMiniCart", { detail: { cartId } }));
      toast.success(`${p.title} added to bag`);
      fireAddToCart({
        currency: p.currency,
        value: p.price,
        items: [{ item_id: p.id, item_name: p.title, price: p.price, quantity: 1 }],
      });
    } catch (e) {
      console.error(e);
      toast.error("Couldn't add to bag — try again or visit the product page.");
    } finally {
      setAddingOne(null);
    }
  };

  const addAll = async () => {
    if (!allAvailable) {
      toast.error("One of the trio is unavailable right now.");
      return;
    }
    setAddingAll(true);
    try {
      const existingCartId = localStorage.getItem("hp_cart_id");
      const lines = products.map((p) => ({
        merchandiseId: p.variantId,
        quantity: 1,
      }));
      const res = await fetch("/api/checkout", {
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
      if (!res.ok) throw new Error("bundle add failed");
      const { cartId, checkoutUrl } = await res.json();
      if (cartId) localStorage.setItem("hp_cart_id", cartId);

      // Fire conversion signals
      const gaItems = products.map((p) => ({
        item_id: p.id,
        item_name: p.title,
        price: p.price,
        quantity: 1,
      }));
      fireAddToCart({ currency: "AUD", value: bundlePrice, items: gaItems });
      fireViewCart({ currency: "AUD", value: bundlePrice, items: gaItems });

      window.dispatchEvent(
        new CustomEvent("hp:openMiniCart", { detail: { cartId, checkoutUrl } })
      );
      toast.success("Trio added to bag — 10% saving applied.");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't add the trio — try again or add each separately.");
    } finally {
      setAddingAll(false);
    }
  };

  // Schema
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

  const productSchemas = products.map((p) =>
    generateProductSchema({
      name: p.title,
      description: p.pitch,
      image: p.image,
      price: p.price.toString(),
      currency: p.currency,
      sku: p.handle,
      brand: p.vendor,
      availability: p.availableForSale ? "InStock" : "OutOfStock",
    })
  );

  const bundleOffer = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: trio.name,
    description: trio.bundlePromise,
    url: "https://hairpinns.com/collections/jenas-daily-trio",
    priceCurrency: "AUD",
    price: bundlePrice.toFixed(2),
    availability:
      allAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    priceValidUntil: new Date(new Date().setMonth(new Date().getMonth() + 6))
      .toISOString()
      .split("T")[0],
    seller: { "@type": "Organization", name: "Hair Pinns" },
  };

  const schemas = [breadcrumb, webPage, faq, ...productSchemas, bundleOffer];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${trio.name} | 10% off the three Jena uses most | Hair Pinns`}
        description={trio.subheadline}
        canonical="https://hairpinns.com/collections/jenas-daily-trio"
        ogImage={getOGImage("collection")}
        ogType="product"
        hrefLang="en-AU"
        schemaJson={schemas}
      />
      <Header />

      <main id="main-content" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: trio.name },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-[hsl(var(--brand-500))] to-[hsl(var(--brand-700))] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {trio.eyebrow}
                </span>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl leading-[1.05] mb-4">
                  {trio.headline}
                </h1>
                <p className="speakable-trio-intro text-lg text-white/90 max-w-2xl mb-6">
                  {trio.subheadline}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                    10% off the bundle
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                    Free shipping over $150
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                    Same products Jena uses in the chair
                  </span>
                </div>
              </div>

              {/* Sticky price card */}
              <aside
                className="bg-white text-foreground rounded-2xl p-6 md:p-7 shadow-2xl ring-1 ring-black/5"
                aria-label="Bundle summary"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    The Trio · 3 products
                  </span>
                  <Badge className="bg-[hsl(var(--gold))]/20 text-heading border-[hsl(var(--gold))]/40 font-semibold">
                    Save 10%
                  </Badge>
                </div>

                {loading ? (
                  <div className="space-y-2 my-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-3 my-3">
                      <span className="text-4xl font-heading font-bold text-heading">
                        {formatPrice(bundlePrice, "AUD")}
                      </span>
                      {savings > 0 && (
                        <span className="text-base text-muted-foreground line-through decoration-muted-foreground/40">
                          {formatPrice(subtotal, "AUD")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-5">
                      You save <strong className="text-heading">{formatPrice(savings, "AUD")}</strong>{" "}
                      vs buying separately.
                    </p>
                  </>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mb-3 gap-2"
                  onClick={addAll}
                  disabled={loading || addingAll || !allAvailable}
                  data-cta="jenas-trio-add-all"
                  data-cta-placement="trio_hero"
                  data-cta-offer="jenas_daily_trio_10_off"
                >
                  {addingAll ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding trio…
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add all 3 to bag — save 10%
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => {
                    trackBookingClick("jenas_trio_hero", "/collections/jenas-daily-trio");
                    window.open(BOOK_URL, "_blank");
                  }}
                >
                  {BOOK_CTA_LABEL}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free shipping over $150 · 14-day returns · Afterpay & Zip
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* Why this bundle works */}
        <section className="py-14 md:py-20 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="eyebrow inline-block text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--gold))] mb-3">
                Built to convert
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading">
                Why people actually buy this trio
              </h2>
              <p className="text-muted-foreground mt-3">
                It removes the guesswork. This is the quickest path from “I need hair care” to “my hair is finally behaving.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Simple enough to stick with",
                  copy: "One shampoo, one conditioner, one leave-in. Easy to remember, easy to repurchase, easy to get right at home.",
                },
                {
                  title: "Targets the real damage",
                  copy: "Bond repair, smoothing slip, and frizz control cover the stuff that actually shows up in the Bangor chair: colour fade, humidity, and heat damage.",
                },
                {
                  title: "Feels curated, not random",
                  copy: "Jena picks this trio because it feels like a stylist-built routine — not a basket of unrelated products.",
                },
              ].map((card) => (
                <div key={card.title} className="bg-card border border-border rounded-card p-6 shadow-sm">
                  <h3 className="text-xl font-heading font-semibold text-heading mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed">{card.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div className="bg-white border border-border rounded-card p-5">
                <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-2">Best for</p>
                <p className="text-sm text-foreground leading-relaxed">
                  Colour-treated hair, humidity-prone hair, heat-styled hair, and anyone who wants one routine that does the job without a drawer full of backups.
                </p>
              </div>
              <div className="bg-white border border-border rounded-card p-5">
                <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-2">Not ideal if</p>
                <p className="text-sm text-foreground leading-relaxed">
                  Your hair is ultra-fine and oily or very curly — in those cases, Jena will usually tweak the conditioner before she sends you home with it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 products */}
        <section className="py-14 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="eyebrow inline-block text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--gold))] mb-3">
                What's inside
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading">
                The three products
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Jena's pick of one shampoo, one conditioner, and one leave-in
                treatment — chosen to cover 90% of the heads that sit in her chair.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-card border border-border rounded-card overflow-hidden"
                  >
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p, i) => (
                  <article
                    key={p.handle}
                    className="bg-card border border-border rounded-card overflow-hidden hover:shadow-xl transition-shadow duration-base flex flex-col"
                  >
                    <div className="relative aspect-square bg-muted">
                      <Link
                        to={`/products/${p.handle}`}
                        className="block w-full h-full"
                        aria-label={`View ${p.title}`}
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          width="800"
                          height="800"
                        />
                      </Link>
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur text-heading px-3 py-1 text-xs font-semibold shadow-sm">
                        <span aria-hidden="true">{p.icon}</span>
                        {p.badge}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-heading font-semibold text-heading mb-2">
                        <Link
                          to={`/products/${p.handle}`}
                          className="hover:text-brand-500 transition-colors"
                        >
                          {p.title}
                        </Link>
                      </h3>
                      {p.vendor && (
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                          {p.vendor}
                        </p>
                      )}
                      <p className="text-sm text-foreground mb-4 flex-1">
                        {p.pitch}
                      </p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-2xl font-bold text-brand-500">
                          {formatPrice(p.price, p.currency)}
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="default"
                        className="w-full gap-2"
                        onClick={() => addOne(p)}
                        disabled={!p.availableForSale || addingOne === p.handle}
                        data-cta="jenas-trio-add-one"
                        data-cta-placement="trio_product_card"
                        data-cta-product={p.handle}
                      >
                        {addingOne === p.handle ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Adding…
                          </>
                        ) : p.availableForSale ? (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            Add to bag
                          </>
                        ) : (
                          "Out of stock"
                        )}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Jena's story */}
        <section className="py-14 md:py-20 bg-muted/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/assets/images/jena-headshot-4lMGRCmj.webp"
                alt="Jena Pinn, owner of Hair Pinns Bangor"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[hsl(var(--gold))]"
                loading="lazy"
                decoding="async"
                width="160"
                height="160"
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Jena's note
                </p>
                <p className="text-lg font-heading font-semibold text-heading">
                  Why these three
                </p>
              </div>
            </div>
            <blockquote className="text-xl md:text-2xl text-heading font-heading leading-relaxed">
              "{trio.jenaStory}"
            </blockquote>
            <p className="text-sm text-muted-foreground mt-5">
              — Jena Pinn, owner &amp; senior stylist, Hair Pinns Bangor ·
              in the chair since 2009
            </p>
          </div>
        </section>

        {/* How to use */}
        <section className="py-14 md:py-20 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading text-center mb-10">
              How to use the trio
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Wash twice",
                  copy: "First wash lifts build-up, second wash actually cleans. Massage into the scalp for 60 seconds, rinse.",
                },
                {
                  step: "02",
                  title: "Condition mid-lengths to ends",
                  copy: "Leave for 60 seconds. The Aromaganic Smooth detangles in one pass — no need to rake through.",
                },
                {
                  step: "03",
                  title: "Leave-in on towel-dried hair",
                  copy: "A small amount of QIQI Bare Repair Oil through the ends before styling. Heat protection, frizz control, soft hold.",
                },
              ].map((s) => (
                <li
                  key={s.step}
                  className="bg-card border border-border rounded-card p-6"
                >
                  <span className="block text-3xl font-heading font-bold text-[hsl(var(--gold))] mb-2">
                    {s.step}
                  </span>
                  <h3 className="font-heading text-lg text-heading mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-foreground">{s.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {bundleReady && showStickyCta && (
          <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <div className="mx-auto max-w-xl rounded-2xl border border-border bg-background/95 backdrop-blur shadow-2xl p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Jena's Daily Trio</p>
                  <p className="text-sm text-heading font-semibold">
                    {formatPrice(bundlePrice, "AUD")} · save {formatPrice(savings, "AUD")}
                  </p>
                </div>
                <Badge className="bg-[hsl(var(--gold))]/20 text-heading border-[hsl(var(--gold))]/40 font-semibold">
                  10% off
                </Badge>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={addAll}
                disabled={addingAll || !allAvailable}
                data-cta="jenas-trio-add-all-mobile"
                data-cta-placement="trio_mobile_sticky"
                data-cta-offer="jenas_daily_trio_10_off"
              >
                {addingAll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding trio…
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add all 3 to bag
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-muted/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading text-center mb-10">
              Common questions
            </h2>
            <div className="space-y-4">
              {trio.faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-card border border-border rounded-card p-5 open:shadow-md transition-shadow"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <h3 className="font-heading text-lg text-heading">
                      {item.question}
                    </h3>
                    <span
                      className="text-2xl text-brand-500 transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-foreground mt-3 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 bg-gradient-to-r from-[hsl(var(--brand-500))] to-[hsl(var(--brand-600))] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 mb-4 text-[hsl(var(--gold))]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
              <span className="ml-2 text-sm text-white/90">
                4.9 / 5 from 762+ Google reviews
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Ready to start the trio?
            </h2>
            <p className="text-white/90 mb-7 max-w-xl mx-auto">
              The same products Jena uses on her Bangor clients — bundled at
              10% off, with free shipping over $150.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={addAll}
                disabled={loading || addingAll || !allAvailable}
                className="bg-white !text-brand-600 hover:bg-white"
                data-cta="jenas-trio-add-all-bottom"
                data-cta-placement="trio_bottom"
                data-cta-offer="jenas_daily_trio_10_off"
              >
                {addingAll ? "Adding…" : "Add all 3 to bag — save 10%"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  trackBookingClick("jenas_trio_bottom", "/collections/jenas-daily-trio");
                  window.open(BOOK_URL, "_blank");
                }}
                className="border-white text-white hover:bg-white/10"
              >
                {BOOK_CTA_LABEL}
              </Button>
            </div>
            <p className="text-sm text-white/75 mt-6">
              Or talk to Jena first —{" "}
              <a
                href={BUSINESS_NAP.phone.tel}
                className="underline underline-offset-2"
              >
                0416 037 663
              </a>{" "}
              ·{" "}
              <a
                href={`https://wa.me/61416037663?text=${encodeURIComponent(
                  "Hi Jena, I'd like to ask about the Daily Trio…"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JenasDailyTrioPage;
