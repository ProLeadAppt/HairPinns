import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { getOGImage } from "@/lib/sitemap";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { generateFAQPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { BUSINESS_NAP } from "@/config/businessConfig";

const bookingFaqs = [
  {
    question: "How do I book an appointment online?",
    answer: "Open the Hair Pinns Fresha page, choose your service, then select from the dates and times currently available. Fresha handles your booking confirmation.",
  },
  {
    question: "How can I see the next available appointment?",
    answer: "Fresha shows live appointment availability for each service. If the available times do not suit, call or text Jena on 0416 037 663.",
  },
  {
    question: "Will I need to pay a deposit?",
    answer: "If a deposit or other booking condition applies to your selected service, Fresha will show it before you confirm the appointment.",
  },
  {
    question: "How do I change or cancel a booking?",
    answer: "Use the booking-management link in your Fresha confirmation, or contact Hair Pinns directly if you need help. Any applicable terms are shown during booking.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer: "Reference photos are useful for discussing cut, colour, and styling ideas. If you are unsure which service to choose, call Jena before booking.",
  },
];

const bookingSteps = [
  { title: "Choose the service", text: "Start with the appointment that best matches what you need." },
  { title: "Pick an available time", text: "Fresha shows the current appointment options for that service." },
  { title: "Confirm in Fresha", text: "Review the booking details and any applicable conditions before confirming." },
];

const bookingNotes = [
  ["Live menu", "Service names, prices, durations, and availability are shown in Fresha."],
  ["Before confirming", "Any deposit or booking condition is displayed before you complete the booking."],
  ["After booking", "Fresha sends your confirmation and booking-management link."],
  ["Need a second opinion?", "Call or text Jena before choosing if you are not sure which service fits."],
];

const Booking = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-cream))]">
      <SEOHead
        title="Book a Hair Appointment | Hair Pinns Bangor"
        description="Choose your Hair Pinns service and view live appointment availability through Fresha. Need help choosing? Call Jena on 0416 037 663."
        canonical="https://hairpinns.com/booking"
        ogImage={getOGImage("service")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={[
          generateFAQPageSchema(bookingFaqs),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://hairpinns.com" },
            { name: "Booking", url: "https://hairpinns.com/booking" },
          ]),
        ]}
      />
      <Header />

      <main id="main-content" tabIndex={-1} data-booking-page="">
        <div className="border-b border-[hsl(var(--after-hours-cream)/0.14)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[78rem]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Booking" }]} variant="dark" />
          </div>
        </div>

        <section data-booking-hero="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[minmax(0,0.67fr)_minmax(19rem,0.33fr)] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.76)]">Hair Pinns / Bangor</p>
              <h1 className="mt-5 max-w-[12ch] font-heading text-[clamp(3.4rem,7vw,7.2rem)] font-semibold leading-[0.89] tracking-[-0.06em] text-[hsl(var(--after-hours-cream))]">
                Your appointment starts here.
              </h1>
              <p className="mt-8 max-w-[42rem] text-base leading-7 text-[hsl(var(--after-hours-cream)/0.82)] sm:text-lg sm:leading-8">
                Choose your service and see Hair Pinns’ live appointment availability in Fresha. You review the details there before anything is confirmed.
              </p>
            </div>

            <aside className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="Booking actions">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("booking_hero", "/booking")}
                className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold"
                style={{ color: "hsl(var(--after-hours-plum))" }}
              >
                {BOOK_CTA_LABEL}
                <span aria-hidden="true">↗</span>
              </a>
              <Link to="/services" className="mt-3 flex min-h-11 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>
                Browse the service menu
                <span aria-hidden="true">→</span>
              </Link>
              <p className="mt-5 text-xs leading-5 text-[hsl(var(--after-hours-cream)/0.66)]">Fresha opens in a new tab. No booking is made until you confirm there.</p>
            </aside>
          </div>
        </section>

        <section data-booking-steps="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto max-w-[78rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="grid gap-8 border-b border-[hsl(var(--after-hours-plum)/0.3)] pb-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20">
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">01 / The handoff</p>
              <h2 className="max-w-[13ch] font-heading text-[clamp(2.8rem,5vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">Three steps, all in Fresha.</h2>
            </div>
            <ol className="grid md:grid-cols-3">
              {bookingSteps.map((step, index) => (
                <li key={step.title} className="border-b border-[hsl(var(--after-hours-plum)/0.2)] py-9 md:min-h-64 md:border-b-0 md:border-r md:px-8 md:py-12 first:md:pl-0 last:md:border-r-0 last:md:pr-0">
                  <p className="font-mono text-xs text-[hsl(var(--after-hours-plum)/0.72)]">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-7 max-w-[13ch] font-heading text-3xl font-semibold leading-[1.05]">{step.title}</h3>
                  <p className="mt-5 max-w-[26rem] text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.76)]">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section data-booking-notes="" className="border-y border-[hsl(var(--after-hours-plum)/0.22)] bg-[#efe5df] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">02 / Before you confirm</p>
              <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.7rem,4.5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">Know what happens next.</h2>
            </header>
            <ol className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
              {bookingNotes.map(([term, description], index) => (
                <li key={term} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-[hsl(var(--after-hours-plum)/0.22)] py-6 sm:grid-cols-[2.5rem_12rem_1fr] sm:gap-5">
                  <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-heading text-xl font-semibold leading-tight">{term}</h3>
                  <p className="col-start-2 mt-2 text-sm leading-6 text-[hsl(var(--after-hours-plum)/0.78)] sm:col-start-3 sm:mt-0">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section data-booking-faq="" className="bg-[hsl(var(--after-hours-cream))] text-[hsl(var(--after-hours-plum))]">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:px-8 lg:py-24">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.74)]">03 / Questions</p>
              <h2 className="mt-4 max-w-[10ch] font-heading text-[clamp(2.7rem,4.5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">Before you book.</h2>
            </header>
            <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
              {bookingFaqs.map((faq, index) => (
                <details key={faq.question} className="group border-b border-[hsl(var(--after-hours-plum)/0.22)]">
                  <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[0.67rem] text-[hsl(var(--after-hours-plum)/0.72)]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{faq.question}</span>
                    <span aria-hidden="true" className="text-lg">+</span>
                  </summary>
                  <p className="max-w-[44rem] pb-7 pl-11 text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.78)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section data-booking-close="" className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.64fr_0.36fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-cream)/0.74)]">Ready when you are</p>
              <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em]" style={{ color: "hsl(var(--after-hours-cream))" }}>See what times are available.</h2>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.3)] pt-6">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("booking_close", "/booking")}
                className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 py-3 text-sm font-semibold"
                style={{ color: "hsl(var(--after-hours-plum))" }}
              >
                {BOOK_CTA_LABEL}
                <span aria-hidden="true">↗</span>
              </a>
              <a href={BUSINESS_NAP.phone.tel} className="mt-3 flex min-h-11 items-center border-b border-[hsl(var(--after-hours-cream)/0.26)] py-2 text-sm font-semibold" style={{ color: "hsl(var(--after-hours-cream))" }}>{BUSINESS_NAP.phone.display}</a>
              <a href="https://wa.me/61416037663?text=Hi%20Jena%2C%20I%27d%20like%20help%20choosing%20a%20service" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center border-b border-[hsl(var(--after-hours-cream)/0.26)] py-2 text-sm" style={{ color: "hsl(var(--after-hours-cream))" }}>WhatsApp Jena ↗</a>
              <div className="mt-6 flex flex-wrap gap-5 text-xs text-[hsl(var(--after-hours-cream)/0.7)]">
                <Link to="/privacy" style={{ color: "hsl(var(--after-hours-cream))" }}>Privacy</Link>
                <Link to="/terms" style={{ color: "hsl(var(--after-hours-cream))" }}>Terms</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
