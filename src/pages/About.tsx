import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/gallery/ImageGallery";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getOGImage } from "@/lib/sitemap";
import { generateFAQPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_NAP, SITE_URL } from "@/config/businessConfig";

import jenaFounderAvif540 from "@/assets/images/jena-founder-540w.avif";
import jenaFounderAvif1080 from "@/assets/images/jena-founder-1080w.avif";
import jenaFounderWebp540 from "@/assets/images/jena-founder-540w.webp";
import jenaFounderWebp1080 from "@/assets/images/jena-founder-1080w.webp";
import jenaWorkingAvif480 from "@/assets/images/jena-working-480w.avif";
import jenaWorkingAvif800 from "@/assets/images/jena-working-800w.avif";
import jenaWorkingAvif1170 from "@/assets/images/jena-working-1170w.avif";
import jenaWorkingWebp480 from "@/assets/images/jena-working-480w.webp";
import jenaWorkingWebp800 from "@/assets/images/jena-working-800w.webp";
import jenaWorkingWebp1170 from "@/assets/images/jena-working-1170w.webp";
import pureProducts from "@/assets/images/hair.pinns_1773699035_3854389326693067947_2244281067.avif";
import salonInterior from "@/assets/images/hair.pinns_1773312619_3851143514822403759_2244281067.avif";
import beforeAfter from "@/assets/images/hair.pinns_1773039624_3848857785505671354_2244281067.avif";
import blondeResult from "@/assets/images/hair.pinns_1765910087_3789049150835962518_2244281067.avif";
import curlsResult from "@/assets/images/hair.pinns_1762034298_3756538425064543892_2244281067.avif";
import bobResult from "@/assets/images/hair.pinns_1765870058_3788713832378613694_2244281067.avif";
import highlightResult from "@/assets/images/hair.pinns_1766442955_3793520917994535355_2244281067.avif";
import salonInteriorWebp from "@/assets/images/hair.pinns_1773312619_3851143514822403759_2244281067-fallback.webp";
import beforeAfterWebp from "@/assets/images/hair.pinns_1773039624_3848857785505671354_2244281067-fallback.webp";
import highlightResultWebp from "@/assets/images/hair.pinns_1766442955_3793520917994535355_2244281067-fallback.webp";
import blondeResultWebp from "@/assets/images/hair.pinns_1765910087_3789049150835962518_2244281067-fallback.webp";
import curlsResultWebp from "@/assets/images/hair.pinns_1762034298_3756538425064543892_2244281067-fallback.webp";
import bobResultWebp from "@/assets/images/hair.pinns_1765870058_3788713832378613694_2244281067-fallback.webp";

const standards = [
  {
    number: "01",
    title: "Listen before reaching for colour",
    body: "Your hair history, routine, budget, and the result you can maintain all shape the plan.",
  },
  {
    number: "02",
    title: "Recommend less when less will work",
    body: "If a smaller service will do the job, I’ll say so. The right appointment matters more than the biggest one.",
  },
  {
    number: "03",
    title: "Build hair you can live with",
    body: "A cut, colour, or treatment should still make sense when you are looking after it at home.",
  },
];

const specialties = [
  {
    title: "Colour correction and blonding",
    body: "Careful staging for box-dye corrections, brassiness, dimensional colour, and blonde work that cannot be rushed safely.",
  },
  {
    title: "Smoothing treatments",
    body: "QIQI and Straight Up options selected around your hair condition, texture, expectations, and Sydney humidity.",
  },
  {
    title: "Cuts that work with your hair",
    body: "Shape for curls, volume for fine hair, and a finish you can manage between appointments.",
  },
];

const galleryImages = [
  { src: salonInterior, fallbackSrc: salonInteriorWebp, alt: "Hair Pinns salon interior in Bangor" },
  { src: beforeAfter, fallbackSrc: beforeAfterWebp, alt: "Before and after smoothing treatment by Hair Pinns" },
  { src: highlightResult, fallbackSrc: highlightResultWebp, alt: "Dimensional highlight result by Hair Pinns" },
  { src: blondeResult, fallbackSrc: blondeResultWebp, alt: "Blonde foil result by Hair Pinns" },
  { src: curlsResult, fallbackSrc: curlsResultWebp, alt: "Bouncy curl styling result by Hair Pinns" },
  { src: bobResult, fallbackSrc: bobResultWebp, alt: "Layered bob and blow-dry result by Hair Pinns" },
];

const aboutFaqs = [
  {
    question: "How long has Jena been doing hair?",
    answer: "Jena started working in salons at 13, qualified at 17, and established Hair Pinns in December 2009. She runs the boutique salon in Bangor for clients across the Sutherland Shire.",
  },
  {
    question: "What does Hair Pinns specialise in?",
    answer: "Hair Pinns focuses on colour and blonding, smoothing treatments, precision cuts, and styling. The salon also stocks professional hair care selected through Jena’s work behind the chair.",
  },
  {
    question: "Where is Hair Pinns located?",
    answer: `Hair Pinns is at ${BUSINESS_NAP.address.full}, in Sydney’s Sutherland Shire.`,
  },
  {
    question: "Do I need to book in advance?",
    answer: `Hair Pinns operates by appointment. Book online through Fresha or call ${BUSINESS_NAP.phone.display}.`,
  },
  {
    question: "Can I buy products without visiting the salon?",
    answer: "Yes. The Hair Pinns online store ships professional hair care Australia-wide.",
  },
];

const About = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "About", url: `${SITE_URL}/about` },
  ]);
  const faqSchema = generateFAQPageSchema(aboutFaqs);
  const jenaPersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jena Pinn",
    jobTitle: "Founder and Hairdresser",
    description: "Founder of Hair Pinns boutique salon in Bangor, NSW. Behind the chair at Hair Pinns since 2009, with a focus on colour, blonding, smoothing treatments, cutting, and styling.",
    image: `${SITE_URL}${jenaFounderWebp1080}`,
    url: `${SITE_URL}/about`,
    worksFor: {
      "@type": "Organization",
      name: BUSINESS_NAP.name,
      url: SITE_URL,
    },
    knowsAbout: ["Hair colouring", "Hair blonding", "Hair smoothing", "Hair cutting", "Hair styling"],
    areaServed: {
      "@type": "City",
      name: "Sutherland Shire",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))]">
      <SEOHead
        title="About Jena & Hair Pinns Bangor | Boutique Hair Salon"
        description="Meet Jena, founder and hairdresser at Hair Pinns in Bangor. Behind the chair since 2009, with honest advice on colour, smoothing, cuts, and professional hair care."
        canonical={`${SITE_URL}/about`}
        ogImage={getOGImage("default")}
        ogType="website"
        schemaJson={[jenaPersonSchema, breadcrumbSchema, faqSchema]}
      />
      <Header />

      <div className="border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-paper))]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        </div>
      </div>

      <main id="main-content" data-about-page="" tabIndex={-1}>
        <section data-about-hero="" className="overflow-hidden bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="about-title">
          <div className="mx-auto grid max-w-7xl lg:min-h-[760px] lg:grid-cols-[1.04fr_0.96fr]">
            <div className="flex flex-col justify-between px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20 xl:pl-8 xl:pr-16">
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">About / Jena Pinn</p>
                <h1 id="about-title" className="mt-6 max-w-[10ch] font-heading text-[clamp(3.5rem,12vw,7.4rem)] font-normal leading-[0.88] tracking-[-0.055em] text-[hsl(var(--after-hours-cream))]">
                  Hair care, without the hard sell.
                </h1>
                <p className="mt-8 max-w-[42rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.76)] sm:text-lg sm:leading-8">
                  I’m Jena, founder and hairdresser at Hair Pinns in Bangor. I started in salons at 13, qualified at 17, and opened my own home salon in December 2009.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("about_hero", "/about")}
                  className="inline-flex min-h-12 items-center justify-between gap-6 bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] transition-colors hover:bg-[hsl(var(--after-hours-copper))] sm:min-w-52"
                >
                  <span>{BOOK_CTA_LABEL}</span><span aria-hidden="true">↗</span>
                </a>
                <Link to="/collections" className="inline-flex min-h-12 items-center gap-3 border-b border-[hsl(var(--after-hours-cream)/0.48)] text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))]">
                  Shop Jena’s shelf <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <figure className="relative min-w-0 border-t border-[hsl(var(--after-hours-cream)/0.18)] lg:border-l lg:border-t-0">
              <picture className="block aspect-[4/5] h-full min-h-[500px] overflow-hidden bg-[hsl(var(--after-hours-cream)/0.08)] lg:aspect-auto">
                <source type="image/avif" srcSet={`${jenaFounderAvif540} 540w, ${jenaFounderAvif1080} 1080w`} sizes="(max-width: 1023px) 100vw, 48vw" />
                <source type="image/webp" srcSet={`${jenaFounderWebp540} 540w, ${jenaFounderWebp1080} 1080w`} sizes="(max-width: 1023px) 100vw, 48vw" />
                <img src={jenaFounderWebp1080} alt="Jena, founder and hairdresser at Hair Pinns in Bangor" width="1080" height="1080" className="h-full w-full object-cover object-[center_38%]" fetchPriority="high" decoding="async" />
              </picture>
              <figcaption className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 bg-[hsl(var(--after-hours-near-black)/0.9)] px-4 py-4 backdrop-blur-sm sm:px-6">
                <span className="font-heading text-xl">Jena</span>
                <span className="text-right text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-copper))]">Founder / hairdresser</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-cream))] py-16 lg:py-24" aria-labelledby="about-story-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
            <figure className="lg:col-span-5">
              <picture className="block aspect-[4/5] overflow-hidden bg-[hsl(var(--after-hours-paper))]">
                <source type="image/avif" srcSet={`${jenaWorkingAvif480} 480w, ${jenaWorkingAvif800} 800w, ${jenaWorkingAvif1170} 1170w`} sizes="(max-width: 1023px) calc(100vw - 2rem), 38vw" />
                <source type="image/webp" srcSet={`${jenaWorkingWebp480} 480w, ${jenaWorkingWebp800} 800w, ${jenaWorkingWebp1170} 1170w`} sizes="(max-width: 1023px) calc(100vw - 2rem), 38vw" />
                <img src={jenaWorkingWebp1170} alt="Jena working with a client at Hair Pinns" width="1170" height="1463" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </picture>
              <figcaption className="border-b border-[hsl(var(--after-hours-plum)/0.22)] py-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.7)]">Behind the chair / Bangor</figcaption>
            </figure>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.72)]">01 / The story</p>
              <h2 id="about-story-title" className="mt-5 max-w-[11ch] font-heading text-[clamp(2.8rem,7vw,6rem)] leading-[0.92] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">A small salon built around listening.</h2>
              <div className="mt-8 max-w-[42rem] space-y-5 text-base leading-7 text-[hsl(var(--after-hours-plum)/0.78)]">
                <p>Hair Pinns began as a home salon and grew through clients returning, referring friends, and trusting me with the long work of getting their hair right.</p>
                <p>Beautiful hair starts with understanding what you want, what your hair can safely do, and what will still work in your real routine. Sometimes that means a transformation. Sometimes it means doing less.</p>
                <p>The salon is still intentionally personal. You are not passed through a production line, and I do not recommend a service or product just because it is the most expensive option.</p>
              </div>
              <dl className="mt-10 grid grid-cols-3 border-y border-[hsl(var(--after-hours-plum)/0.22)] py-5 text-[hsl(var(--after-hours-plum))]">
                <div><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.64)]">Opened</dt><dd className="mt-2 font-heading text-2xl">2009</dd></div>
                <div className="border-l border-[hsl(var(--after-hours-plum)/0.18)] pl-4"><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.64)]">Salon</dt><dd className="mt-2 font-heading text-2xl">Bangor</dd></div>
                <div className="border-l border-[hsl(var(--after-hours-plum)/0.18)] pl-4"><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-plum)/0.64)]">Orders</dt><dd className="mt-2 font-heading text-2xl">Australia</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-plum))] py-16 text-[hsl(var(--after-hours-cream))] lg:py-24" aria-labelledby="standards-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">02 / How I work</p>
            <h2 id="standards-title" className="mt-5 max-w-[15ch] font-heading text-[clamp(2.8rem,7vw,6rem)] leading-[0.92] tracking-[-0.045em] text-[hsl(var(--after-hours-cream))]">The right plan is better than the biggest appointment.</h2>
            <ol className="mt-12 grid gap-8 border-t border-[hsl(var(--after-hours-cream)/0.22)] pt-8 md:grid-cols-3 md:gap-10">
              {standards.map((standard) => (
                <li key={standard.number} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 md:block">
                  <span className="pt-1 text-[0.62rem] font-semibold tracking-[0.18em] text-[hsl(var(--after-hours-copper))]">{standard.number}</span>
                  <div className="md:mt-5">
                    <h3 className="font-heading text-xl leading-tight text-[hsl(var(--after-hours-cream))]">{standard.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.7)]">{standard.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section data-about-work="" className="border-b border-[hsl(var(--after-hours-plum)/0.16)] bg-[hsl(var(--after-hours-paper))] py-16 lg:py-24" aria-labelledby="work-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 border-t border-[hsl(var(--after-hours-plum)/0.22)] pt-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.72)]">03 / Work from the chair</p>
                <h2 id="work-title" className="mt-4 font-heading text-[clamp(2.8rem,7vw,6rem)] leading-[0.92] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">The work.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)] md:justify-self-end">Salon, colour, smoothing, cutting, and styling from Hair Pinns in Bangor.</p>
            </div>
            <div className="mt-10 lg:mt-14">
              <ImageGallery columns={3} images={galleryImages} variant="editorial" />
            </div>
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-cream))] py-16 lg:py-24" aria-labelledby="specialties-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-plum)/0.72)]">04 / Behind the shelf</p>
              <h2 id="specialties-title" className="mt-5 max-w-[11ch] font-heading text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.92] tracking-[-0.045em] text-[hsl(var(--after-hours-plum))]">Products earn their place here.</h2>
              <p className="mt-7 max-w-[38rem] text-base leading-7 text-[hsl(var(--after-hours-plum)/0.76)]">I stock the brands and formulas I am prepared to use behind the chair. The online shelf is deliberately smaller than a warehouse catalogue because selection is part of the service.</p>
              <Link to="/collections" className="mt-8 inline-flex min-h-12 items-center justify-between gap-8 border-b border-[hsl(var(--after-hours-plum)/0.42)] text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:border-[hsl(var(--after-hours-copper))] sm:min-w-56">
                Shop the shelf <span aria-hidden="true">→</span>
              </Link>
            </div>
            <figure className="lg:col-span-7">
              <img src={pureProducts} alt="Professional hair care selected for Hair Pinns" width="1200" height="800" className="aspect-[4/3] h-full w-full object-cover" loading="lazy" decoding="async" />
            </figure>
          </div>

          <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="font-heading text-2xl text-[hsl(var(--after-hours-plum))]">What I work on most</h3>
            <div className="mt-6 grid gap-x-8 md:grid-cols-3">
              {specialties.map((specialty) => (
                <article key={specialty.title} className="border-t border-[hsl(var(--after-hours-plum)/0.22)] py-5">
                  <h4 className="font-heading text-xl text-[hsl(var(--after-hours-plum))]">{specialty.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.7)]">{specialty.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-about-close="" className="bg-[hsl(var(--after-hours-near-black))] py-16 text-[hsl(var(--after-hours-cream))] lg:py-24" aria-labelledby="about-close-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">05 / Visit or ask</p>
              <h2 id="about-close-title" className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.92] tracking-[-0.045em] text-[hsl(var(--after-hours-cream))]">Ready to talk about your hair?</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[hsl(var(--after-hours-cream)/0.72)]">Book through Fresha, call the salon, or browse the professional hair care I stock.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("about_close", "/about")} className="inline-flex min-h-12 items-center justify-between gap-6 bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))] sm:min-w-52">
                  <span>{BOOK_CTA_LABEL}</span><span aria-hidden="true">↗</span>
                </a>
                <a href={BUSINESS_NAP.phone.tel} className="inline-flex min-h-12 items-center border-b border-[hsl(var(--after-hours-cream)/0.44)] text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:!text-[hsl(var(--after-hours-copper))]">{BUSINESS_NAP.phone.display}</a>
              </div>
              <address className="mt-8 not-italic text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)]">{BUSINESS_NAP.address.full}</address>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h3 className="border-b border-[hsl(var(--after-hours-cream)/0.24)] pb-4 font-heading text-2xl text-[hsl(var(--after-hours-cream))]">Frequently asked</h3>
              <div className="divide-y divide-[hsl(var(--after-hours-cream)/0.2)]">
                {aboutFaqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-[hsl(var(--after-hours-cream))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))]">
                      <span>{faq.question}</span><span className="text-[hsl(var(--after-hours-copper))] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="pb-2 pr-8 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.7)]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
