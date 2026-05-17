import { useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { getOGImage } from "@/lib/sitemap";
import {
  generateBreadcrumbSchema,
  generateDefinedTermSetSchema,
  generateWebPageSchema,
} from "@/lib/schema";
import { glossary, type GlossaryTerm } from "@/data/glossary";

const CATEGORY_LABELS: Record<GlossaryTerm["category"], string> = {
  treatments: "Treatments",
  colour: "Colour",
  products: "Products",
  techniques: "Techniques",
  care: "Care",
};

const CATEGORY_ORDER: GlossaryTerm["category"][] = [
  "treatments",
  "colour",
  "products",
  "techniques",
  "care",
];

const Glossary = () => {
  const grouped = useMemo(() => {
    const out: Record<GlossaryTerm["category"], GlossaryTerm[]> = {
      treatments: [],
      colour: [],
      products: [],
      techniques: [],
      care: [],
    };
    for (const term of glossary) out[term.category].push(term);
    return out;
  }, []);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com" },
    { name: "Glossary", url: "https://hairpinns.com/glossary" },
  ]);
  const definedTermSetSchema = generateDefinedTermSetSchema(
    glossary.map((g) => ({ id: g.id, term: g.term, definition: g.definition }))
  );
  const webPageSchema = generateWebPageSchema({
    name: "Hair Care Glossary | Hair Pinns",
    description:
      "Plain-English hair-care glossary — keratin treatments, balayage, bond repair, toner, sulphate-free, lamellar and more. Defined by Jena at Hair Pinns Bangor.",
    url: "https://hairpinns.com/glossary",
    speakable: { cssSelector: [".glossary-term-definition"] },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Hair Care Glossary | Plain-English Hair Terms | Hair Pinns"
        description="Hair-care terms explained simply by a 20-year salon owner. Keratin, balayage, bond repair, toner, sulphate-free, lamellar treatment and more — what they actually mean and when to use them."
        canonical="https://hairpinns.com/glossary"
        ogImage={getOGImage("default")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={[webPageSchema, breadcrumbSchema, definedTermSetSchema]}
      />

      <Header />

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Glossary" }]} />
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="flex-grow">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-h1 md:text-h1-lg font-heading font-bold text-heading mb-4">
              Hair Care Glossary
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              Plain-English definitions of the hair-care terms clients ask about most often.
              Written by Jena at Hair Pinns based on 20+ years in the salon. If you want the
              honest answer with the trade-offs, you're in the right place.
            </p>

            {/* Jump links */}
            <nav aria-label="Glossary categories" className="mb-12 flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((cat) =>
                grouped[cat].length > 0 ? (
                  <a
                    key={cat}
                    href={`#category-${cat}`}
                    className="px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:border-brand-500 hover:text-brand-500 transition-colors"
                  >
                    {CATEGORY_LABELS[cat]}
                  </a>
                ) : null
              )}
            </nav>

            {CATEGORY_ORDER.map((cat) => {
              const terms = grouped[cat];
              if (terms.length === 0) return null;
              return (
                <section
                  key={cat}
                  id={`category-${cat}`}
                  className="mb-14 scroll-mt-24"
                  aria-labelledby={`heading-${cat}`}
                >
                  <h2
                    id={`heading-${cat}`}
                    className="text-h2 font-heading font-semibold text-heading mb-6 pb-2 border-b border-border"
                  >
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <dl className="space-y-8">
                    {terms.map((term) => (
                      <div key={term.id} id={term.id} className="scroll-mt-24">
                        <dt className="font-heading text-xl font-semibold text-heading mb-2">
                          {term.term}
                        </dt>
                        <dd className="glossary-term-definition text-base text-foreground leading-relaxed">
                          {term.definition}
                        </dd>
                        {term.link && (
                          <p className="mt-2 text-sm">
                            <Link
                              to={term.link.href}
                              className="text-brand-500 hover:text-brand-600 hover:underline font-medium"
                            >
                              {term.link.label} →
                            </Link>
                          </p>
                        )}
                      </div>
                    ))}
                  </dl>
                </section>
              );
            })}

            <div className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-muted-foreground mb-4">
                Term we missed? Want to book the service behind one of these?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-btn font-medium transition-colors"
                >
                  Contact Jena
                </Link>
                <Link
                  to="/services"
                  className="px-5 py-2.5 border border-border bg-card hover:border-brand-500 hover:text-brand-500 rounded-btn font-medium transition-colors"
                >
                  See Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Glossary;
