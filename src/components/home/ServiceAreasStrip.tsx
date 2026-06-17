import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import Section from "@/components/design-system/Section";
import { suburbPages } from "@/data/suburbPages";

/**
 * ServiceAreasStrip
 * -----------------
 * A compact, gold-bordered trust bar shown after the hero that:
 *  - names the 6 closest suburbs to the Bangor salon
 *  - links each to its /areas/:slug page (real internal links, no orphans)
 *  - drops a geo signal + LocalBusiness-areaServed reinforcement
 *
 * Why: every visitor within ~20km of Bangor is the prime customer. Naming
 * the suburbs they live in (with proper page links) is the fastest way to
 * convert "is this for me?" into "they're 6 minutes from me — yes."
 */

const ANCHOR_SUBURBS: { slug: string; distance: string }[] = [
  { slug: "bangor", distance: "home salon" },
  { slug: "menai", distance: "4 min" },
  { slug: "illawong", distance: "5 min" },
  { slug: "alfords-point", distance: "6 min" },
  { slug: "barden-ridge", distance: "7 min" },
  { slug: "sutherland", distance: "12 min" },
];

const ServiceAreasStrip = () => {
  return (
    <Section
      padding="sm"
      variant="transparent"
      maxWidth="xl"
      className="border-y border-gold/30 bg-gold-soft/30"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-wider text-heading">
              Serving the Sutherland Shire
            </p>
            <p className="text-sm text-muted-foreground">
              Based in Bangor. Most clients drive 5–15 minutes. Booked in your suburb every week.
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-2">
          {ANCHOR_SUBURBS.map(({ slug, distance }) => {
            const suburb = suburbPages[slug];
            if (!suburb) return null;
            return (
              <li key={slug}>
                <Link
                  to={`/areas/${slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-background px-3 py-1.5 text-xs font-medium text-heading transition hover:border-gold hover:bg-gold/10"
                >
                  <span>{suburb.name}</span>
                  <span className="text-muted-foreground">· {distance}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              to="/areas"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-gold underline-offset-4 hover:underline"
            >
              All 18 suburbs <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>
    </Section>
  );
};

export default ServiceAreasStrip;
