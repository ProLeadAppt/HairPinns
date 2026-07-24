import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getOGImage } from "@/lib/sitemap";
import { getAllLocationSlugs, getLocationData } from "@/data/locationPages";
import { BUSINESS_NAP } from "@/config/businessConfig";

const AreasIndex = () => {
  const locations = getAllLocationSlugs()
    .map((slug) => getLocationData(slug))
    .filter((location): location is NonNullable<ReturnType<typeof getLocationData>> => Boolean(location))
    .sort((a, b) => a.name.localeCompare(b.name));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hairpinns.com/" },
      { "@type": "ListItem", position: 2, name: "Areas We Serve", item: "https://hairpinns.com/areas" },
    ],
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))]">
      <SEOHead
        title="Areas We Serve – Hair Salon in Sutherland Shire | Hair Pinns"
        description="Hair Pinns serves the Sutherland Shire with colour, blonding, keratin smoothing, braids & cuts. Find your local area and book online today."
        canonical="https://hairpinns.com/areas"
        ogImage={getOGImage("suburb")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={[breadcrumbSchema]}
      />
      <Header />

      <div className="border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Areas" }]} variant="dark" />
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="areas-title">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[0.68fr_0.32fr] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Bangor / Sutherland Shire</p>
              <h1 id="areas-title" className="mt-5 max-w-[9ch] font-heading text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-[hsl(var(--after-hours-cream))]">
                Worth the short drive.
              </h1>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.28)] pt-6">
              <p className="text-base leading-7 text-[hsl(var(--after-hours-cream)/0.74)]">
                One-on-one colour, smoothing, cuts, and honest advice from Jena. Easy parking in Bangor, without the shopping-centre salon rush.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-[hsl(var(--after-hours-cream)/0.18)] pt-5">
                <div><dt className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.5)]">Studio</dt><dd className="mt-2 text-sm">60 Goorgool Rd</dd></div>
                <div><dt className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.5)]">Appointments</dt><dd className="mt-2 text-sm">Tuesday to Saturday</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-cream))] py-16 lg:py-24" aria-labelledby="area-directory-title">
          <div className="mx-auto max-w-[78rem] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 border-t border-[hsl(var(--after-hours-plum)/0.24)] pt-5 md:grid-cols-[0.72fr_1.28fr] md:items-end">
              <div>
                <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.64)]">01 / Local directory</p>
                <h2 id="area-directory-title" className="mt-5 max-w-[10ch] font-heading text-[clamp(2.8rem,6vw,5.7rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]">Find your way to Jena.</h2>
              </div>
              <p className="max-w-[39rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.66)] md:justify-self-end">
                Choose your suburb for local directions, travel time, service recommendations, and practical answers for your area.
              </p>
            </div>

            <div className="mt-12 grid border-t border-[hsl(var(--after-hours-plum)/0.28)] md:grid-cols-2 md:gap-x-12">
              {locations.map((location, index) => (
                <Link
                  key={location.slug}
                  to={`/areas/${location.slug}`}
                  className="group grid min-h-32 grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 border-b border-[hsl(var(--after-hours-plum)/0.22)] py-5 !text-[hsl(var(--after-hours-plum))] hover:no-underline sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                >
                  <span className="pt-1 font-mono text-[0.61rem] text-[hsl(var(--after-hours-plum)/0.48)]">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-heading text-2xl leading-tight transition-colors group-hover:text-[hsl(var(--after-hours-copper))]">{location.name}</span>
                    <span className="mt-2 block text-[0.61rem] font-semibold uppercase tracking-[0.13em] text-[hsl(var(--after-hours-plum)/0.52)]">{location.postcode} / {location.driveTime}</span>
                    <span className="mt-3 line-clamp-2 max-w-[42ch] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.66)]">{location.localIntro}</span>
                  </span>
                  <span className="pt-1 text-sm transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.65fr_0.35fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Outside the list?</p>
              <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]">Ask if the drive is right for you.</h2>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.28)] pt-6">
              <p className="text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)]">Clients visit from across Sydney for Jena’s one-on-one approach. Call or send a note before making the trip.</p>
              <a href={BUSINESS_NAP.phone.tel} className="mt-7 flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))] hover:no-underline">Call {BUSINESS_NAP.phone.display}<span aria-hidden="true">↗</span></a>
              <Link to="/contact" className="mt-3 flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">Send a note<span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AreasIndex;
