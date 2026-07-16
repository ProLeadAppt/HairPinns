import { Link } from "react-router-dom";
import { blogSummaries } from "@/data/blogSummaries";
import { serviceDetailData } from "@/data/serviceDetails";
import {
  type TopicSlug,
  getTopic,
  relatedBlogsForTopic,
  relatedServicesForTopic,
  relatedCollectionsForTopic,
} from "@/data/topicMap";

interface RelatedContentProps {
  /** The topic(s) this page belongs to. */
  topics: TopicSlug[];
  /** Which content types to show. Defaults to all three. */
  show?: Array<"blog" | "service" | "collection">;
  /** Max items per type. */
  limit?: number;
  /** Heading override. */
  heading?: string;
  /** Slug to exclude (e.g. current page). */
  excludeSlug?: string;
  /** Route-scoped visual treatment. */
  variant?: "default" | "editorial";
}

/**
 * Cross-content-type "related" block. Pulls blog posts, services, and
 * collection pages from the topicMap so every page feeds traffic into
 * its topic cluster. Renders nothing if no matches — safe to drop in
 * anywhere.
 */
const RelatedContent = ({
  topics,
  show = ["blog", "service", "collection"],
  limit = 3,
  heading = "Keep reading",
  excludeSlug,
  variant = "default",
}: RelatedContentProps) => {
  const blogSlugs = new Set<string>();
  const serviceSlugs = new Set<string>();
  const collectionSlugs = new Set<string>();

  for (const topic of topics) {
    if (show.includes("blog")) {
      relatedBlogsForTopic(topic, limit).forEach((s) => {
        if (s !== excludeSlug) blogSlugs.add(s);
      });
    }
    if (show.includes("service")) {
      relatedServicesForTopic(topic, limit).forEach((s) => {
        if (s !== excludeSlug) serviceSlugs.add(s);
      });
    }
    if (show.includes("collection")) {
      relatedCollectionsForTopic(topic, limit).forEach((s) => {
        if (s !== excludeSlug) collectionSlugs.add(s);
      });
    }
  }

  const blogItems = Array.from(blogSlugs)
    .slice(0, limit)
    .map((slug) => blogSummaries.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p && !p.archived);

  const serviceItems = Array.from(serviceSlugs)
    .slice(0, limit)
    .map((path) => {
      const [cat, svc] = path.split("/");
      const category = serviceDetailData.find((c) => c.slug === cat);
      const service = category?.services.find((s) => s.slug === svc);
      return service && category ? { category, service, path } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const collectionItems = Array.from(collectionSlugs).slice(0, limit);

  const total = blogItems.length + serviceItems.length + collectionItems.length;
  if (total === 0) return null;

  const topicNames = topics
    .map((t) => getTopic(t)?.name)
    .filter(Boolean)
    .join(", ");

  const editorial = variant === "editorial";
  const itemClass = editorial
    ? "group block min-h-32 border-t border-[hsl(var(--after-hours-plum)/0.22)] py-4 text-[hsl(var(--after-hours-plum))] transition-colors hover:border-[hsl(var(--after-hours-copper))]"
    : "group block rounded-md border border-border bg-card p-4 hover:border-brand-500 transition-colors";
  const labelClass = editorial
    ? "text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--after-hours-plum)/0.7)]"
    : "text-xs uppercase tracking-wide text-brand-500 font-medium";
  const titleClass = editorial
    ? "mt-3 font-heading text-xl leading-tight text-[hsl(var(--after-hours-plum))] group-hover:underline group-hover:underline-offset-4"
    : "mt-2 text-base font-semibold text-foreground group-hover:text-brand-500 transition-colors";
  const metaClass = editorial
    ? "mt-2 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.66)]"
    : "mt-1 text-sm text-muted-foreground";

  return (
    <section className={editorial ? "border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-cream))] py-14 lg:py-20" : "py-lg border-t border-border"} aria-labelledby="related-content-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="related-content-heading" className={editorial ? "max-w-[18ch] font-heading text-[clamp(2.3rem,4vw,4rem)] leading-[0.96] tracking-[-0.035em] text-[hsl(var(--after-hours-plum))]" : "text-h2 font-heading text-heading mb-2"}>
          {heading}
        </h2>
        {topicNames && (
          <p className={editorial ? "mb-8 mt-3 text-sm text-[hsl(var(--after-hours-plum)/0.66)]" : "text-sm text-muted-foreground mb-6"}>More on {topicNames}</p>
        )}

        <div className={editorial ? "grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
          {blogItems.map((post) => (
            <Link
              key={`blog-${post.slug}`}
              to={`/blog/${post.slug}`}
              className={itemClass}
            >
              <span className={labelClass}>
                {post.category}
              </span>
              <h3 className={titleClass}>
                {post.title}
              </h3>
              <p className={`${metaClass} line-clamp-2`}>{post.excerpt}</p>
            </Link>
          ))}

          {serviceItems.map(({ category, service, path }) => (
            <Link
              key={`service-${path}`}
              to={`/services/${path}`}
              className={itemClass}
            >
              <span className={labelClass}>
                Service
              </span>
              <h3 className={titleClass}>
                {service.title}
              </h3>
              <p className={metaClass}>{category.title}</p>
            </Link>
          ))}

          {collectionItems.map((slug) => (
            <Link
              key={`collection-${slug}`}
              to={`/collections/${slug}`}
              className={itemClass}
            >
              <span className={labelClass}>
                Shop
              </span>
              <h3 className={`${titleClass} capitalize`}>
                {slug.replace(/-/g, " ")}
              </h3>
              <p className={metaClass}>Browse the collection</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedContent;
