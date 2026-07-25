import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/forms/ContactForm";
import SEOHead from "@/components/SEOHead";
import { getOGImage } from "@/lib/sitemap";
import { generateFAQPageSchema, generateBreadcrumbSchema, generateLocalBusinessSchema } from "@/lib/schema";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_HOURS_DISPLAY, BUSINESS_NAP } from "@/config/businessConfig";
import { ENTITY_REGISTRY } from "@/config/entityRegistry";

const MAP_URL = ENTITY_REGISTRY.profiles.google.directionsUrl;
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ENTITY_REGISTRY.contact.address.fullForMaps)}&output=embed`;

const contactFaqs = [
  {
    question: "What is the best way to contact Hair Pinns?",
    answer: `Call or text Jena on ${BUSINESS_NAP.phone.display}, email ${BUSINESS_NAP.email}, or use the contact form on this page.`,
  },
  {
    question: "Can I book an appointment from this page?",
    answer: "Use the Book now link to open Hair Pinns in Fresha and view live appointment availability. You can also call Jena if you need help choosing a service.",
  },
  {
    question: "What are the salon opening hours?",
    answer: BUSINESS_HOURS_DISPLAY.join("; "),
  },
  {
    question: "Where is Hair Pinns located?",
    answer: `Hair Pinns is at ${BUSINESS_NAP.address.full}. Open the map on this page for directions or call before visiting if you have an access or parking question.`,
  },
];

const localBusinessSchema = {
  ...generateLocalBusinessSchema(),
  email: BUSINESS_NAP.email,
  hasMap: MAP_URL,
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-cream))]">
      <SEOHead
        title="Contact Hair Pinns | Bangor Hair Salon"
        description={`Contact Hair Pinns at ${BUSINESS_NAP.address.full}. Call or text ${BUSINESS_NAP.phone.display}, email Jena, open directions, or leave a message.`}
        canonical="https://hairpinns.com/contact"
        ogImage={getOGImage("default")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={[
          localBusinessSchema,
          generateFAQPageSchema(contactFaqs),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://hairpinns.com" },
            { name: "Contact", url: "https://hairpinns.com/contact" },
          ]),
        ]}
      />
      <Header />

      <main id="main-content" tabIndex={-1} data-contact-page="">
        <div className="border-b border-[hsl(var(--after-hours-cream)/0.14)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[78rem]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} variant="dark" />
          </div>
        </div>

        <section data-contact-hero="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[minmax(0,0.67fr)_minmax(19rem,0.33fr)] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.76)]">Hair Pinns / Bangor</p>
              <h1 className="mt-5 max-w-[11ch] font-heading text-[clamp(3.4rem,7vw,7.2rem)] font-semibold leading-[0.89] tracking-[-0.06em] text-[hsl(var(--after-hours-cream))]">
                Come by. Call. Or leave a note.
              </h1>
              <p className="mt-8 max-w-[42rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.82)] sm:text-lg sm:leading-8">
                Find the Bangor studio, contact Jena directly, or send a message through the form below.
              </p>
            </div>

            <aside className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="Primary contact actions">
              <a href={BUSINESS_NAP.phone.tel} className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>
                Call {BUSINESS_NAP.phone.display}
                <span aria-hidden="true">↗</span>
              </a>
              <a href={BUSINESS_NAP.phone.sms} className="mt-3 flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                Send a text
                <span aria-hidden="true">→</span>
              </a>
              <a href={`mailto:${BUSINESS_NAP.email}`} className="mt-3 flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                Email Jena
                <span aria-hidden="true">→</span>
              </a>
            </aside>
          </div>
        </section>

        <section data-contact-visit="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto max-w-[78rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="grid gap-8 border-b border-[hsl(var(--after-hours-plum)/0.3)] pb-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">01 / Visit</p>
              <h2 className="max-w-[12ch] font-heading text-[clamp(2.8rem,5vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">The Bangor studio.</h2>
            </div>

            <div className="grid gap-12 pt-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
              <div>
                <div className="border-t border-[hsl(var(--after-hours-plum)/0.28)]">
                  <div className="border-b border-[hsl(var(--after-hours-plum)/0.22)] py-6">
                    <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.7)]">Address</p>
                    <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 block max-w-[18ch] font-heading text-3xl font-semibold leading-tight">
                      {BUSINESS_NAP.address.full}
                    </a>
                  </div>
                  <div className="border-b border-[hsl(var(--after-hours-plum)/0.22)] py-6">
                    <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.7)]">Salon hours</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {BUSINESS_HOURS_DISPLAY.map((hours) => <li key={hours}>{hours}</li>)}
                    </ul>
                  </div>
                  <p className="py-6 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">For parking or access questions, call before visiting.</p>
                </div>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-plum)/0.45)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>
                  Open directions
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="min-h-[22rem] overflow-hidden border border-[hsl(var(--after-hours-plum)/0.28)] sm:min-h-[30rem]">
                <iframe
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  className="min-h-[22rem] sm:min-h-[30rem]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Hair Pinns at ${BUSINESS_NAP.address.full}`}
                />
              </div>
            </div>
          </div>
        </section>

        <section data-contact-message="" className="border-y border-[hsl(var(--after-hours-plum)/0.22)] bg-[#efe5df] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">02 / Leave a note</p>
              <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.7rem,4.5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">Tell Jena what you need.</h2>
              <p className="mt-6 max-w-[24rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">Use this form for product questions, service questions, order help, or anything else that needs a written reply.</p>
            </header>
            <ContactForm formName="contact_page" title="" description="" showTopic variant="editorial" className="[&_a]:!text-[hsl(var(--after-hours-plum))]" />
          </div>
        </section>

        <section data-contact-faq="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">03 / Before you visit</p>
              <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.7rem,4.5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">Useful details.</h2>
            </header>
            <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
              {contactFaqs.map((faq, index) => (
                <details key={faq.question} className="group border-b border-[hsl(var(--after-hours-plum)/0.22)]">
                  <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{faq.question}</span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p className="max-w-[44rem] pb-7 pl-11 text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.78)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section data-contact-close="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.64fr_0.36fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.74)]">For an appointment</p>
              <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em]" style={{ color: "hsl(var(--after-hours-cream))" }}>See live times in Fresha.</h2>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-6">
              <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBookingClick("contact_close", "/contact")} className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-plum))" }}>
                Book now
                <span aria-hidden="true">↗</span>
              </a>
              <Link to="/services" className="mt-3 flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                Browse services
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
