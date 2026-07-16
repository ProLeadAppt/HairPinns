import { Link } from "react-router-dom";
import jenaFounderAvif540 from "@/assets/images/jena-founder-540w.avif";
import jenaFounderAvif1080 from "@/assets/images/jena-founder-1080w.avif";
import jenaFounderWebp540 from "@/assets/images/jena-founder-540w.webp";
import jenaFounderWebp1080 from "@/assets/images/jena-founder-1080w.webp";

const standards = [
  {
    index: "01",
    title: "Behind the chair since 2009",
    body: "More than fifteen years of cutting, colouring, and treating real hair in a Bangor salon.",
  },
  {
    index: "02",
    title: "Only what I use",
    body: "Every product earns its place on client hair before it reaches the online shelf.",
  },
  {
    index: "03",
    title: "Packed at Hair Pinns",
    body: "Your order is picked, packed, and posted from the salon in Bangor.",
  },
];

const JenaPromise = () => {
  return (
    <section
      className="content-visibility-auto overflow-hidden bg-[hsl(var(--after-hours-plum))] py-16 text-[hsl(var(--after-hours-cream))] sm:py-20 lg:py-28"
      aria-labelledby="jena-proof-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12 lg:gap-y-16">
          <header className="lg:col-span-7 lg:pb-4">
            <p className="mb-6 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
              03 / Why this shelf
            </p>
            <h2
              id="jena-proof-title"
              className="max-w-[12ch] font-heading text-[clamp(2.8rem,11vw,6.4rem)] font-normal leading-[0.93] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]"
            >
              A short shelf, chosen by a working hairdresser.
            </h2>
            <p className="mt-7 max-w-[42rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.74)] sm:text-lg sm:leading-8">
              I’ve worked behind the chair since 2009. Everything here has to make real hair easier to understand, care for, or style before I recommend it to you.
            </p>
          </header>

          <figure className="lg:col-span-5">
            <div className="relative border border-[hsl(var(--after-hours-cream)/0.28)] p-2 sm:p-3">
              <picture className="block aspect-square overflow-hidden bg-[hsl(var(--after-hours-cream)/0.08)]">
                <source
                  type="image/avif"
                  srcSet={`${jenaFounderAvif540} 540w, ${jenaFounderAvif1080} 1080w`}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 36vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${jenaFounderWebp540} 540w, ${jenaFounderWebp1080} 1080w`}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 36vw"
                />
                <img
                  src={jenaFounderWebp1080}
                  alt="Jena, owner and hairdresser at Hair Pinns in Bangor"
                  width="1080"
                  height="1080"
                  className="h-full w-full object-cover object-[center_42%]"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <span
                className="absolute right-0 top-0 bg-[hsl(var(--after-hours-copper))] px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum))]"
                aria-hidden="true"
              >
                Founder / hairdresser
              </span>
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 border-b border-[hsl(var(--after-hours-cream)/0.22)] pb-4">
              <span className="font-heading text-xl text-[hsl(var(--after-hours-cream))]">Jena</span>
              <span className="text-right text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-copper))]">
                Hair Pinns · Bangor
              </span>
            </figcaption>
          </figure>

          <ol className="grid gap-8 border-t border-[hsl(var(--after-hours-cream)/0.22)] pt-8 sm:grid-cols-3 sm:gap-6 lg:col-span-12 lg:gap-10">
            {standards.map((standard) => (
              <li key={standard.index} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 sm:block">
                <span className="pt-1 text-[0.61rem] font-semibold tracking-[0.18em] text-[hsl(var(--after-hours-copper))]">
                  {standard.index}
                </span>
                <div className="sm:mt-5">
                  <h3 className="font-heading text-xl font-semibold leading-tight text-[hsl(var(--after-hours-cream))]">
                    {standard.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)] sm:text-[0.95rem]">
                    {standard.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <nav
            className="flex flex-col gap-5 border-t border-[hsl(var(--after-hours-cream)/0.22)] pt-8 sm:flex-row sm:items-center sm:gap-8 lg:col-span-12"
            aria-label="Jena’s shelf links"
          >
            <Link
              to="/collections"
              className="inline-flex min-h-12 items-center justify-between gap-6 bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] sm:min-w-56"
            >
              <span>Shop the shelf</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-11 items-center gap-3 border-b border-[hsl(var(--after-hours-cream)/0.5)] text-sm font-semibold !text-[hsl(var(--after-hours-cream))] transition-colors hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))] sm:min-h-0"
            >
              Read Jena’s story <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default JenaPromise;
