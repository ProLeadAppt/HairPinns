import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { SHOP_BY_CONCERN } from "@/config/commerceNavigation";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

const ShopByConcern = () => (
  <Section
    number={{ index: "01", label: "find your shelf" }}
    padding="editorial"
    variant="muted"
    className="overflow-hidden"
  >
    <SectionHeader
      tagline="Not sure where to start?"
      title="Start with what your hair needs."
      subtitle="Shop Jena's salon-tested shelf by concern, then narrow it down from there."
      display
    />

    <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5">
      {SHOP_BY_CONCERN.map((concern) => (
        <li key={concern.handle} className="min-w-[78%] snap-start sm:min-w-0">
          <Link
            to={concern.href}
            aria-label={`Shop ${concern.name.toLowerCase()}`}
            className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${shopifyImageWebp(concern.image, 480)} 480w, ${shopifyImageWebp(concern.image, 720)} 720w`}
                  sizes="(max-width: 639px) 78vw, (max-width: 1023px) 50vw, 20vw"
                />
                <img
                  src={shopifyImage(concern.image, 720)}
                  alt=""
                  aria-hidden="true"
                  width="720"
                  height="540"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </picture>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-xl text-heading">{concern.name}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{concern.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>

    <div className="mt-8 text-center">
      <Link
        to="/collections"
        className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4"
      >
        Browse every collection
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </Section>
);

export default ShopByConcern;
