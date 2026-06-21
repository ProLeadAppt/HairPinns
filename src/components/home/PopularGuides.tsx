import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";
import { homeFeaturedGuides } from "@/data/homeFeaturedGuides";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

const buildShopifySrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImage(url, width)} ${width}w`).join(", ");

const buildShopifyWebpSrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImageWebp(url, width)} ${width}w`).join(", ");

// Renders 6 non-archived posts ranked by commercial intent + recency, skipping
// the same 3 the BlogTrio above already shows so the homepage doesn't surface
// the same card twice. If a high-intent "Smoothing / Colour / Products /
// Treatments" post is recent, it shows here even if BlogTrio took a different
// one, but in practice they share the same pool.
const PopularGuides = () => {
  const posts = homeFeaturedGuides;

  return (
    <Section className="content-visibility-auto">
      <SectionHeader
        title="Popular Guides"
        subtitle="Real questions my clients ask me, with straight answers"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <picture className="block w-full h-full">
                <source
                  type="image/webp"
                  srcSet={buildShopifyWebpSrcSet(p.image, [480, 800, 960])}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <source
                  srcSet={buildShopifySrcSet(p.image, [480, 800, 960])}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <img
                  src={shopifyImage(p.image, 800)}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </picture>
              <div className="absolute top-3 left-3">
                <Badge variant="accent">{p.category}</Badge>
              </div>
            </div>
            <div className="flex-1 flex flex-col p-5">
              <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                {p.hook}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {p.readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:translate-x-0.5 transition-transform">
                  Read guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          See all guides
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
};

export default PopularGuides;
