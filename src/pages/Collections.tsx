import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { BOOK_URL } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import {
  CHRISTMAS_PRODUCTS,
  SHOP_TAXONOMY,
  type CommerceDestination,
} from "@/config/commerceNavigation";
import { generateBreadcrumbSchema, generateStoreSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

type ShopPath = (typeof SHOP_TAXONOMY)[number]["id"];

const collectionImageSizes = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw";
const collectionImageWidths = [360, 480, 640, 800];

const buildShopifySrcSet = (url: string, webp = false) =>
  collectionImageWidths
    .map((width) => `${webp ? shopifyImageWebp(url, width) : shopifyImage(url, width)} ${width}w`)
    .join(", ");

const DestinationCard = ({ destination, index }: { destination: CommerceDestination; index: number }) => (
  <li className="min-w-0">
    <Link
      to={destination.href}
      className="group block h-full border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-3 text-[hsl(var(--after-hours-plum))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))] focus-visible:ring-offset-4"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[hsl(var(--after-hours-cream))]">
        <picture>
          <source type="image/webp" srcSet={buildShopifySrcSet(destination.image, true)} sizes={collectionImageSizes} />
          <img
            src={shopifyImage(destination.image, 800)}
            srcSet={buildShopifySrcSet(destination.image)}
            sizes={collectionImageSizes}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover transition duration-slow group-hover:opacity-90"
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
          />
        </picture>
        <span className="absolute left-3 top-3 bg-[hsl(var(--after-hours-plum))] px-2 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-[hsl(var(--after-hours-cream))]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl leading-tight transition-colors group-hover:text-[hsl(var(--after-hours-copper))] sm:text-2xl">
            {destination.name}
          </h3>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
        <p className="mt-2 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)]">{destination.description}</p>
      </div>
    </Link>
  </li>
);

const Collections = () => {
  const [activePath, setActivePath] = useState<ShopPath>("hair-need");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectAndFocusTab = (index: number) => {
    const group = SHOP_TAXONOMY[index];
    if (!group) return;
    setActivePath(group.id);
    tabRefs.current[index]?.focus();
  };
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % SHOP_TAXONOMY.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + SHOP_TAXONOMY.length) % SHOP_TAXONOMY.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = SHOP_TAXONOMY.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectAndFocusTab(nextIndex);
  };
  const schemas = [
    generateStoreSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Shop", url: "https://hairpinns.com/collections" },
    ]),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Shop Hair Products by Need, Product or Brand | Hair Pinns"
        description="Find salon-selected hair care by hair need, product type or brand. Shop Juuce, Pure, QIQI, Aromaganic, Wet Brush and more, with Australia-wide shipping."
        canonical="https://hairpinns.com/collections"
        ogImage={getOGImage("collection")}
        ogType="website"
        schemaJson={schemas}
        prerenderReady
      />

      <Header />
      <div className="border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-paper))]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        <section className="border-b border-[hsl(var(--after-hours-plum)/0.18)] bg-[hsl(var(--after-hours-cream))] py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.76)]">Shop / Hair Pinns</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end lg:gap-16">
              <h1 className="max-w-[9ch] font-heading text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.91] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">
                Find your hair care.
              </h1>
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5">
                <p className="text-lg font-semibold leading-7 text-[hsl(var(--after-hours-plum))]">Three simple ways to shop Jena's salon-selected shelf.</p>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.72)]">Start with your hair need, the product you want or a brand you already know.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-paper))] py-12 md:py-20" aria-labelledby="shop-path-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 border-b border-[hsl(var(--after-hours-plum)/0.2)] pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.72)]">01 / Choose your path</p>
                <h2 id="shop-path-heading" className="mt-3 font-heading text-4xl leading-none text-[hsl(var(--after-hours-plum))] md:text-5xl">How would you like to shop?</h2>
              </div>
              <div className="grid grid-cols-3 border border-[hsl(var(--after-hours-plum)/0.24)]" role="tablist" aria-label="Ways to shop" aria-orientation="horizontal">
                {SHOP_TAXONOMY.map((group, index) => {
                  const selected = activePath === group.id;
                  return (
                    <button
                      key={group.id}
                      id={`shop-tab-${group.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`shop-panel-${group.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActivePath(group.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      className={`min-h-12 border-r border-[hsl(var(--after-hours-plum)/0.2)] px-4 text-sm font-semibold last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--after-hours-copper))] ${selected ? "bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" : "bg-transparent text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-plum)/0.06)]"}`}
                    >
                      {group.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {SHOP_TAXONOMY.map((group) => (
              <div
                key={group.id}
                id={`shop-panel-${group.id}`}
                role="tabpanel"
                aria-labelledby={`shop-tab-${group.id}`}
                hidden={activePath !== group.id}
                className="pt-9"
              >
                <div className="mb-8 max-w-2xl">
                  <h2 className="font-heading text-3xl text-[hsl(var(--after-hours-plum))]">{group.heading}</h2>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)]">{group.description}</p>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4">
                  {group.destinations.map((destination, index) => (
                    <DestinationCard key={destination.handle} destination={destination} index={index} />
                  ))}
                </ul>
                {group.secondaryDestinations?.length ? (
                  <div className="mt-12 border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-6">
                    <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.72)]">More brands</p>
                    <ul className="mt-4 grid gap-0 border-t border-[hsl(var(--after-hours-plum)/0.16)] sm:grid-cols-3">
                      {group.secondaryDestinations.map((destination) => (
                        <li key={destination.handle} className="border-b border-[hsl(var(--after-hours-plum)/0.16)] sm:border-r sm:last:border-r-0">
                          <Link to={destination.href} className="flex min-h-12 items-center justify-between px-3 text-sm font-semibold text-[hsl(var(--after-hours-plum))] hover:text-[hsl(var(--after-hours-copper))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--after-hours-copper))]">
                            {destination.name}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[hsl(var(--after-hours-cream)/0.2)] bg-[hsl(var(--after-hours-plum))] py-12 text-[hsl(var(--after-hours-cream))] md:py-16" aria-labelledby="christmas-packs-heading">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Seasonal edit / Christmas</p>
              <h2 id="christmas-packs-heading" className="mt-4 max-w-[10ch] font-heading text-4xl leading-[0.96] md:text-5xl">Christmas packs are here.</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.72)]">Browse the current Juuce and Pure packs, plus the Festive Finish duo. Product pages show the latest options and availability.</p>
              <Link to="/collections/haircare-bundles-gift-sets" className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-[hsl(var(--after-hours-copper))] text-sm font-semibold text-[hsl(var(--after-hours-cream))] hover:text-[hsl(var(--after-hours-copper))]">
                Browse bundles & gifts<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ol className="border-t border-[hsl(var(--after-hours-cream)/0.24)]">
              {CHRISTMAS_PRODUCTS.map((product, index) => (
                <li key={product.handle} className="border-b border-[hsl(var(--after-hours-cream)/0.24)]">
                  <Link to={product.href} className="group flex min-h-16 items-center gap-4 py-3 text-[hsl(var(--after-hours-cream))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--after-hours-copper))]">
                    <span className="text-xs text-[hsl(var(--after-hours-copper))]">0{index + 1}</span>
                    <span className="font-heading text-xl sm:text-2xl">{product.name}</span>
                    <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-cream))] py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-end lg:gap-16 lg:px-8">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.72)]">Need a second opinion?</p>
              <h2 className="mt-4 max-w-[12ch] font-heading text-4xl leading-[0.98] text-[hsl(var(--after-hours-plum))] md:text-5xl">Not sure what's right for your hair?</h2>
            </div>
            <div className="border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5">
              <p className="text-base leading-7 text-[hsl(var(--after-hours-plum)/0.74)]">Chat with Isabella for product guidance or call Jena for personalised advice.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => {
                    const bubble = document.querySelector("[data-chat-bubble]") as HTMLElement;
                    bubble?.click();
                    window.hpCapture?.("chat_clicked", { source: "collections_cta" });
                  }}
                  className="min-h-11 w-full rounded-none bg-[hsl(var(--after-hours-plum))] px-8 text-[hsl(var(--after-hours-cream))] sm:w-auto"
                >
                  Chat with Isabella
                </Button>
                <Button variant="outline" size="lg" asChild className="min-h-11 w-full rounded-none border-[hsl(var(--after-hours-plum)/0.35)] px-8 sm:w-auto">
                  <a href={BUSINESS_NAP.phone.tel}>Call Jena now</a>
                </Button>
                <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium text-[hsl(var(--after-hours-plum))] underline underline-offset-4">Or book direct</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
