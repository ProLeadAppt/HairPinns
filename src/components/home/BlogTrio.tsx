import { Link } from "react-router-dom";
import { homeFeaturedGuides, type HomeFeaturedGuide } from "@/data/homeFeaturedGuides";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";
import useViewportImageGate from "@/hooks/useViewportImageGate";

const buildShopifySrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImage(url, width)} ${width}w`).join(", ");

const buildShopifyWebpSrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImageWebp(url, width)} ${width}w`).join(", ");

const GuideImage = ({
  post,
  lead = false,
  imagesEnabled,
}: {
  post: HomeFeaturedGuide;
  lead?: boolean;
  imagesEnabled: boolean;
}) => {
  const widths = lead ? [480, 720, 960] : [240, 360, 480];
  const sizes = lead
    ? "(max-width: 767px) calc(100vw - 2rem), 58vw"
    : "(max-width: 767px) 7rem, (max-width: 1023px) 10rem, 12rem";

  return (
    <picture className="block h-full w-full overflow-hidden bg-[hsl(var(--after-hours-plum)/0.08)]">
      <source
        type="image/webp"
        srcSet={imagesEnabled ? buildShopifyWebpSrcSet(post.image, widths) : undefined}
        sizes={sizes}
      />
      <source srcSet={imagesEnabled ? buildShopifySrcSet(post.image, widths) : undefined} sizes={sizes} />
      <img
        src={imagesEnabled ? shopifyImage(post.image, lead ? 720 : 360) : undefined}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        loading="lazy"
        decoding="async"
        width={lead ? 960 : 480}
        height={lead ? 600 : 480}
        data-image-pending={imagesEnabled ? undefined : "true"}
      />
    </picture>
  );
};

const GuideMeta = ({ post }: { post: HomeFeaturedGuide }) => (
  <p className="text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.68)]">
    {post.category} <span aria-hidden="true">/</span> {post.readTime}
  </p>
);

const BlogTrio = () => {
  const [leadPost, ...supportingPosts] = homeFeaturedGuides.slice(0, 3);
  const { targetRef: sectionRef, imagesEnabled } = useViewportImageGate<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="bg-[hsl(var(--after-hours-paper))] py-16 text-[hsl(var(--after-hours-plum))] sm:py-20 lg:py-28"
      aria-labelledby="guide-desk-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 grid gap-6 border-t border-[hsl(var(--after-hours-plum)/0.2)] pt-6 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-12">
          <div>
            <p className="mb-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.76)]">
              04 / Read, learn, ask
            </p>
            <h2
              id="guide-desk-title"
              className="max-w-[12ch] font-heading text-[clamp(2.7rem,8vw,5.8rem)] font-normal leading-[0.94] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]"
            >
              Notes from behind the chair.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-md text-base leading-7 text-[hsl(var(--after-hours-plum)/0.72)] sm:text-lg sm:leading-8">
              Straight answers to the hair questions that come up in Jena’s chair, written to help between appointments.
            </p>
            <Link
              to="/blog"
              className="mt-6 hidden min-h-11 items-center justify-between border-b border-[hsl(var(--after-hours-plum)/0.45)] text-sm font-semibold !text-[hsl(var(--after-hours-plum))] transition-colors hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))] lg:flex"
            >
              <span>View all guides</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Link
            to={`/blog/${leadPost.slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))] focus-visible:ring-offset-4 lg:col-span-7"
          >
            <article>
              <div className="aspect-[8/5] overflow-hidden border border-[hsl(var(--after-hours-plum)/0.18)] p-2 sm:p-3">
                <GuideImage post={leadPost} lead imagesEnabled={imagesEnabled} />
              </div>
              <div className="border-b border-[hsl(var(--after-hours-plum)/0.22)] pb-7 pt-6">
                <GuideMeta post={leadPost} />
                <h3 className="mt-3 max-w-[18ch] font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.025em] !text-[hsl(var(--after-hours-plum))] sm:text-4xl">
                  {leadPost.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.72)] sm:text-base sm:leading-7">
                  {leadPost.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-3 text-sm font-semibold !text-[hsl(var(--after-hours-plum))]">
                  Read guide <span aria-hidden="true">→</span>
                </span>
              </div>
            </article>
          </Link>

          <div className="grid content-start border-t border-[hsl(var(--after-hours-plum)/0.22)] lg:col-span-5">
            {supportingPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block border-b border-[hsl(var(--after-hours-plum)/0.22)] py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--after-hours-copper))] sm:py-7"
              >
                <article className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[11rem_minmax(0,1fr)]">
                  <div className="aspect-square overflow-hidden border border-[hsl(var(--after-hours-plum)/0.18)] p-1.5">
                    <GuideImage post={post} imagesEnabled={imagesEnabled} />
                  </div>
                  <div className="min-w-0 py-1">
                    <div className="flex items-start justify-between gap-3">
                      <GuideMeta post={post} />
                      <span className="hidden text-[0.61rem] font-semibold tracking-[0.16em] text-[hsl(var(--after-hours-copper))] sm:block" aria-hidden="true">
                        0{index + 2}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-[1.15rem] font-semibold leading-[1.08] tracking-[-0.015em] !text-[hsl(var(--after-hours-plum))] sm:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[0.78rem] leading-5 text-[hsl(var(--after-hours-plum)/0.7)] sm:text-sm sm:leading-6">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 hidden items-center gap-2 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] sm:inline-flex">
                      Read guide <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/blog"
          className="mt-10 flex min-h-12 items-center justify-between border-b border-t border-[hsl(var(--after-hours-plum)/0.34)] text-sm font-semibold !text-[hsl(var(--after-hours-plum))] transition-colors hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))] lg:hidden"
        >
          <span>View all guides</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
};

export default BlogTrio;
