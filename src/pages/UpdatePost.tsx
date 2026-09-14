import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { getOGImage } from "@/lib/sitemap";
import {
  getPublicArticle,
  publicExcerpt,
  sanitisePublicArticleHtml,
  type ShopifyPublicArticle,
} from "@/lib/shopifyContent";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from "@/lib/schema";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Australia/Sydney",
}).format(new Date(value));

const UpdatePost = ({ blogHandle = "updates", basePath = "/updates" }: { blogHandle?: string; basePath?: string }) => {
  const params = useParams();
  const handle = params.handle || params.slug;
  const sectionLabel = basePath === "/blog" ? "Journal" : "Updates";
  const [article, setArticle] = useState<ShopifyPublicArticle | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "failed">("loading");

  useEffect(() => {
    let active = true;
    if (!handle) {
      setStatus("missing");
      return () => { active = false; };
    }
    getPublicArticle(blogHandle, handle)
      .then((result) => {
        if (!active) return;
        setArticle(result);
        setStatus(result ? "ready" : "missing");
      })
      .catch((error) => {
        console.error("Failed to load public update:", error);
        if (active) setStatus("failed");
      });
    return () => { active = false; };
  }, [handle, blogHandle]);

  const cleanHtml = useMemo(
    () => sanitisePublicArticleHtml(article?.contentHtml || ""),
    [article?.contentHtml],
  );

  if (status === "missing") return <Navigate to="/404" replace />;

  if (status === "loading" || !article) {
    const failed = status === "failed";
    return (
      <div className="editorial-route min-h-screen bg-[hsl(var(--hp-white))] text-[hsl(var(--hp-ink))]">
        <SEOHead
          title={failed ? "Update temporarily unavailable | Hair Pinns" : "Loading update | Hair Pinns"}
          description="Hair Pinns updates from Jena in Bangor, NSW."
          canonical={"https://hairpinns.com" + basePath + "/" + (handle || "")}
          noIndex
          prerenderReady={failed}
        />
        <Header />
        <main id="main-content" tabIndex={-1} className="mx-auto min-h-[55vh] max-w-[78rem] px-4 py-16 sm:px-6 lg:px-8">
          {failed ? (
            <>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hp-purple))]">Hair Pinns / Read online</p>
              <h1 className="mt-4 max-w-xl font-heading text-5xl leading-tight">This update is temporarily unavailable.</h1>
              <p className="mt-5 max-w-2xl leading-7 text-[hsl(var(--hp-ink)/0.72)]">Please try again shortly, or return to all Hair Pinns updates.</p>
              <Link to="/updates" className="mt-8 inline-flex min-h-12 items-center bg-[hsl(var(--hp-purple))] px-5 py-3 font-semibold text-white">View all updates</Link>
            </>
          ) : (
            <p role="status" className="text-sm text-[hsl(var(--hp-ink)/0.66)]">Loading Jena’s update…</p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const canonical = "https://hairpinns.com" + basePath + "/" + article.handle;
  const description = article.seo?.description || publicExcerpt(article.excerpt, cleanHtml, 155);
  const author = article.author?.name || "Jena Pinn";
  const wordCount = cleanHtml.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const schemas = [
    generateOrganizationSchema(),
    generateBlogPostSchema({
      title: article.title,
      description,
      author,
      datePublished: article.publishedAt,
      image: article.image?.url || getOGImage("blog"),
      url: canonical,
      wordCount,
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: sectionLabel, url: "https://hairpinns.com" + basePath },
      { name: article.title, url: canonical },
    ]),
  ];

  return (
    <div className="editorial-route min-h-screen bg-[hsl(var(--hp-white))] text-[hsl(var(--hp-ink))]">
      <SEOHead
        title={article.seo?.title || article.title}
        description={description}
        canonical={canonical}
        ogImage={article.image?.url || getOGImage("blog")}
        ogType="article"
        schemaJson={schemas}
      />
      <Header />
      <div className="border-b border-[hsl(var(--hp-ink)/0.14)] bg-[hsl(var(--hp-lavender))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: sectionLabel, href: basePath }, { label: article.title }]} variant="dark" />
        </div>
      </div>
      <main id="main-content" tabIndex={-1} data-public-update="">
        <article>
          <header className="bg-[hsl(var(--hp-lavender))]">
            <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.62fr_0.38fr] lg:items-end lg:px-8 lg:py-24">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--hp-purple))]">Hair Pinns / {sectionLabel}</p>
                <h1 className="mt-5 max-w-[15ch] font-heading text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]">{article.title}</h1>
              </div>
              <dl className="grid grid-cols-2 border-y border-[hsl(var(--hp-ink)/0.2)] py-5 text-sm">
                <div><dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--hp-ink)/0.56)]">From</dt><dd className="mt-2">{author}</dd></div>
                <div className="border-l border-[hsl(var(--hp-ink)/0.16)] pl-4"><dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--hp-ink)/0.56)]">Published</dt><dd className="mt-2">{formatDate(article.publishedAt)}</dd></div>
              </dl>
            </div>
          </header>

          {article.image?.url ? (
            <figure className="mx-auto max-w-[78rem] border-x border-b border-[hsl(var(--hp-ink)/0.12)] bg-[hsl(var(--hp-lavender))]">
              <img
                src={article.image.url}
                alt={article.image.altText || article.title}
                width={article.image.width || 1600}
                height={article.image.height || 900}
                className="max-h-[46rem] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </figure>
          ) : null}

          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,46rem)_16rem] lg:justify-between lg:px-8">
            <div
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[hsl(var(--hp-ink))] prose-a:text-[hsl(var(--hp-purple))] prose-a:underline prose-a:underline-offset-4 prose-strong:text-[hsl(var(--hp-ink))]"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
            <aside className="h-fit border-t border-[hsl(var(--hp-purple))] pt-5">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--hp-purple))]">Useful next step</p>
              <p className="mt-4 text-sm leading-6 text-[hsl(var(--hp-ink)/0.72)]">Browse Jena’s salon-tested products or book a personalised consultation in Bangor.</p>
              <div className="mt-6 grid gap-3">
                <Link to="/collections" className="flex min-h-12 items-center justify-between bg-[hsl(var(--hp-purple))] px-4 py-3 text-sm font-semibold text-white">Shop products <span aria-hidden="true">→</span></Link>
                <Link to="/booking" className="flex min-h-12 items-center justify-between border border-[hsl(var(--hp-purple)/0.4)] px-4 py-3 text-sm font-semibold text-[hsl(var(--hp-ink))]">Book salon <span aria-hidden="true">↗</span></Link>
              </div>
            </aside>
          </div>
        </article>
        <section className="bg-[hsl(var(--hp-lavender))]">
          <div className="mx-auto flex max-w-[78rem] flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="max-w-2xl text-sm leading-6 text-[hsl(var(--hp-ink)/0.72)]">This public edition is designed to be shared. It contains no recipient details, unsubscribe token or private preview link.</p>
            <Link to={basePath} className="inline-flex min-h-11 items-center font-semibold text-[hsl(var(--hp-purple))]">Back to the {sectionLabel.toLowerCase()} <span className="ml-2" aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatePost;
