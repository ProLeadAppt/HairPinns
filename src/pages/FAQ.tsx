import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { comprehensiveFAQs, searchFAQs, type FAQ } from "@/data/faqs";
import { generateFAQPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import { BUSINESS_NAP } from "@/config/businessConfig";

const categories = [
  { key: "all", label: "All questions" },
  { key: "treatments", label: "Treatments" },
  { key: "colour", label: "Colour" },
  { key: "care", label: "Hair care" },
  { key: "products", label: "Products" },
  { key: "booking", label: "Booking" },
  { key: "general", label: "General" },
] as const;

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFAQs = (() => {
    let faqs: FAQ[] = comprehensiveFAQs;
    if (searchQuery.trim()) faqs = searchFAQs(searchQuery);
    if (activeCategory !== "all") faqs = faqs.filter((faq) => faq.category === activeCategory);
    return faqs;
  })();

  const schemas = [
    generateFAQPageSchema(comprehensiveFAQs.map((faq) => ({ question: faq.question, answer: faq.answer }))),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://hairpinns.com/" },
      { name: "FAQ", url: "https://hairpinns.com/faq" },
    ]),
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--after-hours-paper))]">
      <SEOHead
        title="FAQ | Hair Pinns | Common Questions About Hair Care and Shipping"
        description="Got questions about hair care, shipping, returns or booking? Here are the answers. If you can't find what you need, just call Jena on 0416 037 663."
        canonical="https://hairpinns.com/faq"
        ogImage={getOGImage("default")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />
      <Header />

      <div className="border-b border-[hsl(var(--after-hours-cream)/0.16)] bg-[hsl(var(--after-hours-plum))] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[78rem]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} variant="dark" />
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        <section className="bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))]" aria-labelledby="faq-title">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[0.65fr_0.35fr] lg:gap-20 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Hair Pinns / Straight answers</p>
              <h1 id="faq-title" className="mt-5 max-w-[9ch] font-heading text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-[hsl(var(--after-hours-cream))]">
                Questions from the chair.
              </h1>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.28)] pt-6">
              <p className="text-base leading-7 text-[hsl(var(--after-hours-cream)/0.72)]">
                Search Jena’s practical answers on hair care, colour, treatments, products, booking, and visiting the Bangor salon.
              </p>
              <div className="relative mt-8">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--after-hours-cream)/0.55)]" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search the questions"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="min-h-12 w-full rounded-none border border-[hsl(var(--after-hours-cream)/0.34)] bg-transparent pl-11 pr-4 text-sm text-[hsl(var(--after-hours-cream))] outline-none placeholder:text-[hsl(var(--after-hours-cream)/0.5)] focus:border-[hsl(var(--after-hours-copper))] focus:ring-1 focus:ring-[hsl(var(--after-hours-copper))]"
                  aria-label="Search frequently asked questions"
                />
              </div>
            </div>
          </div>
        </section>

        <nav aria-label="Filter questions" className="border-b border-[hsl(var(--after-hours-plum)/0.2)] bg-[hsl(var(--after-hours-paper))]">
          <div className="mx-auto max-w-[78rem] overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-max items-center gap-7 py-4">
              <span className="font-mono text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--after-hours-plum)/0.5)]">Filter /</span>
              {categories.map((category) => {
                const active = category.key === activeCategory;
                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    aria-pressed={active}
                    className={`min-h-11 border-b py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${active ? "border-[hsl(var(--after-hours-copper))] text-[hsl(var(--after-hours-plum))]" : "border-transparent text-[hsl(var(--after-hours-plum)/0.56)] hover:border-[hsl(var(--after-hours-plum)/0.34)] hover:text-[hsl(var(--after-hours-plum))]"}`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <section className="bg-[hsl(var(--after-hours-cream))] py-14 lg:py-24" aria-labelledby="faq-list-title">
          <div className="mx-auto grid max-w-[78rem] gap-12 px-4 sm:px-6 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20 lg:px-8">
            <header>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.62)]">{String(filteredFAQs.length).padStart(2, "0")} / Answers</p>
              <h2 id="faq-list-title" className="mt-5 max-w-[9ch] font-heading text-[clamp(2.8rem,5vw,5rem)] font-normal leading-[0.93] tracking-[-0.05em] text-[hsl(var(--after-hours-plum))]">
                What clients ask most.
              </h2>
            </header>

            {filteredFAQs.length === 0 ? (
              <div className="border-y border-[hsl(var(--after-hours-plum)/0.26)] py-10">
                <p className="text-sm text-[hsl(var(--after-hours-plum)/0.68)]">No questions match that search.</p>
                <button type="button" onClick={clearFilters} className="mt-6 min-h-11 border-b border-[hsl(var(--after-hours-copper))] text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--after-hours-plum))]">
                  Clear search
                </button>
              </div>
            ) : (
              <div className="border-t border-[hsl(var(--after-hours-plum)/0.3)]">
                {filteredFAQs.map((faq, index) => (
                  <details key={faq.id} className="group border-b border-[hsl(var(--after-hours-plum)/0.22)]">
                    <summary className="grid min-h-20 cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-3 py-5 text-[hsl(var(--after-hours-plum))] [&::-webkit-details-marker]:hidden">
                      <span className="font-mono text-[0.61rem] text-[hsl(var(--after-hours-plum)/0.5)]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-heading text-xl leading-tight sm:text-2xl">{faq.question}</span>
                      <span className="text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <div className="max-w-[45rem] pb-8 pl-11">
                      <p className="text-sm leading-7 text-[hsl(var(--after-hours-plum)/0.72)]">{faq.answer}</p>
                      {faq.relatedLinks?.length ? (
                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                          {faq.relatedLinks.map((link) => (
                            <Link key={link.url + link.text} to={link.url} className="border-b border-[hsl(var(--after-hours-copper))] text-xs font-semibold uppercase tracking-[0.1em] !text-[hsl(var(--after-hours-plum))] hover:no-underline">
                              {link.text} →
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]">
          <div className="mx-auto grid max-w-[78rem] gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.65fr_0.35fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Need a human answer?</p>
              <h2 className="mt-5 max-w-[11ch] font-heading text-[clamp(3rem,6vw,6rem)] font-normal leading-[0.92] tracking-[-0.05em] text-[hsl(var(--after-hours-cream))]">Ask Jena directly.</h2>
            </div>
            <div className="self-end border-t border-[hsl(var(--after-hours-cream)/0.28)] pt-6">
              <a href={BUSINESS_NAP.phone.tel} className="flex min-h-12 items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))] hover:no-underline">Call {BUSINESS_NAP.phone.display}<span aria-hidden="true">↗</span></a>
              <Link to="/contact" className="mt-3 flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">Send a message<span aria-hidden="true">→</span></Link>
              <Link to="/booking" className="mt-3 flex min-h-12 items-center justify-between border border-[hsl(var(--after-hours-cream)/0.34)] px-5 text-sm font-semibold !text-[hsl(var(--after-hours-cream))] hover:border-[hsl(var(--after-hours-copper))] hover:no-underline">Book a consultation<span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
