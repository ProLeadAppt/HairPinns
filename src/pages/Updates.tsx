import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { getOGImage } from "@/lib/sitemap";
import {
  getPublicBlog,
  publicExcerpt,
  type ShopifyPublicBlog,
} from "@/lib/shopifyContent";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/schema";

const UPDATES_URL = "https://hairpinns.com/updates";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Australia/Sydney",
}).format(new Date(value));

const Updates = () => {
  const [blog, setBlog] = useState<ShopifyPublicBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicBlog("updates")
      .then((result) => {
        if (active) setBlog(result);
      })
      .catch((error) => {
        console.error("Failed to load public updates:", error);
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const articles = useMemo(() => blog?.articles.nodes ?? [], [blog]);
  const schemas = useMemo(() => [
    generateWebPageSchema({
      name: "Updates from Jena | Hair Pinns",
      description: "Public Hair Pinns email editions, salon news and useful product updates from Jena in Bangor, NSW.",
      url: UPDATES_URL,
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "Updates", url: UPDATES_URL },
    ]),
    ...(articles.length ? [{
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Hair Pinns updates",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        item: UPDATES_URL + "/" + article.handle,
      })),
    }] : []),
  ], [articles]);

  return (
    <div className="editorial-route min-h-screen bg-[hsl(var(--hp-white))] text-[hsl(var(--hp-ink))]">
      <SEOHead
        title="Updates from Jena | Hair Pinns"
        description="Public Hair Pinns email editions, salon news and useful product updates from Jena in Bangor, NSW."
        canonical={UPDATES_URL}
        ogImage={getOGImage("blog")}
        schemaJson={schemas}
        prerenderReady={!loading}
      />
      <Header />
      <div className="border-b border-[hsl(var(--hp-ink)/0.14)] bg-[hsl(var(--hp-lavender))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Updates" }]} variant="dark" />
        </div>
      </div>
      <main id="main-content" tabIndex={-1} data-public-updates="">
        <section className="bg-[hsl(var(--hp-lavender))]" aria-labelledby="updates-title">
          <div className="mx-auto grid max-w-[78rem] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.66fr_0.34fr] lg:items-end lg:px-8 lg:py-24">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--hp-purple))]">Hair Pinns / Read online</p>
              <h1 id="updates-title" className="mt-5 max-w-[11ch] font-heading text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
                Notes from Jena, ready to share.
              </h1>
            </div>
            <p className="border-t border-[hsl(var(--hp-ink)/0.24)] pt-5 text-base leading-7 text-[hsl(var(--hp-ink)/0.74)]">
              The public versions of Hair Pinns emails, salon news, useful hair advice and product updates, without customer details or private tracking links.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[78rem] px-4 py-14 sm:px-6 sm:py-20 lg:px-8" aria-label="Published updates">
          {loading ? (
            <p className="text-sm text-[hsl(var(--hp-ink)/0.66)]" role="status">Loading the latest notes…</p>
          ) : failed ? (
            <div className="max-w-2xl border-l-2 border-[hsl(var(--hp-purple))] pl-5">
              <h2 className="font-heading text-3xl">The updates could not load just now.</h2>
              <p className="mt-3 leading-7 text-[hsl(var(--hp-ink)/0.72)]">The shop and booking pages are still available while we reconnect the archive.</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="grid gap-8 border-y border-[hsl(var(--hp-ink)/0.16)] py-10 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hp-purple))]">First edition coming soon</p>
                <h2 className="mt-4 font-heading text-4xl leading-tight">Jena is preparing the next Hair Pinns update.</h2>
                <p className="mt-4 max-w-2xl leading-7 text-[hsl(var(--hp-ink)/0.72)]">Until then, explore Jena’s practical hair guides or browse the products she uses and recommends behind the chair.</p>
              </div>
              <div className="grid gap-3">
                <Link to="/blog" className="flex min-h-12 items-center justify-between bg-[hsl(var(--hp-purple))] px-5 py-3 font-semibold text-white">Read the hair guides <span aria-hidden="true">→</span></Link>
                <Link to="/collections" className="flex min-h-12 items-center justify-between border border-[hsl(var(--hp-purple)/0.4)] px-5 py-3 font-semibold text-[hsl(var(--hp-ink))]">Shop Jena’s shelf <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <article key={article.id} className="flex h-full flex-col border-t border-[hsl(var(--hp-ink)/0.18)] pt-4">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--hp-purple))]">{String(index + 1).padStart(2, "0")} / {formatDate(article.publishedAt)}</p>
                  <h2 className="mt-4 font-heading text-3xl leading-tight">
                    <Link to={"/updates/" + article.handle} className="text-[hsl(var(--hp-ink))] hover:text-[hsl(var(--hp-purple))]">{article.title}</Link>
                  </h2>
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-[hsl(var(--hp-ink)/0.72)]">{publicExcerpt(article.excerpt, article.contentHtml)}</p>
                  <Link to={"/updates/" + article.handle} className="mt-auto inline-flex min-h-11 items-center pt-6 text-sm font-semibold text-[hsl(var(--hp-purple))]">Read this update <span className="ml-2" aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Updates;
