import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import { comprehensiveFAQs, searchFAQs, type FAQ } from "@/data/faqs";
import { generateFAQPageSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { getOGImage } from "@/lib/sitemap";
import TrustStrip from "@/components/conversion/TrustStrip";
import Breadcrumbs from "@/components/Breadcrumbs";

const categories = [
  { key: "all", label: "All" },
  { key: "treatments", label: "Treatments" },
  { key: "colour", label: "Colour" },
  { key: "care", label: "Hair Care" },
  { key: "products", label: "Products" },
  { key: "booking", label: "Booking" },
  { key: "general", label: "General" },
] as const;

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFAQs = (() => {
    let faqs: FAQ[] = comprehensiveFAQs;
    if (searchQuery.trim()) {
      faqs = searchFAQs(searchQuery);
    }
    if (activeCategory !== "all") {
      faqs = faqs.filter((f) => f.category === activeCategory);
    }
    return faqs;
  })();

  const faqSchema = generateFAQPageSchema(
    comprehensiveFAQs.map((f) => ({ question: f.question, answer: f.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://hairpinns.com/" },
    { name: "FAQ", url: "https://hairpinns.com/faq" },
  ]);

  const schemas = [faqSchema, breadcrumbSchema];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="FAQ | Hair Pinns | Common Questions About Hair Care and Shipping"
        description="Got questions about hair care, shipping, returns or booking? Here are the answers. If you can't find what you need, just call Jena on 0468 093 991."
        canonical="https://hairpinns.com/faq"
        ogImage={getOGImage("default")}
        ogType="website"
        hrefLang="en-AU"
        schemaJson={schemas}
      />

      <Header />

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "FAQ" }
          ]} />
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <section className="bg-gradient-to-b from-accent/30 to-background py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find your answer? Call me on{" "}
              <a href="tel:+61468093991" className="text-brand-500 font-medium hover:underline">
                0468 093 991
              </a>{" "}
              or send a message on the{" "}
              <Link to="/contact" className="text-brand-500 font-medium hover:underline">
                contact page
              </Link>
              .
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Category filters */}
        <section className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 py-4 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.key
                      ? "bg-brand-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No questions match your search.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <details
                    key={faq.id}
                    className="bg-card border border-border rounded-card p-6 hover:shadow-md transition-shadow group"
                  >
                    <summary className="font-semibold text-heading cursor-pointer text-base list-none flex items-center justify-between">
                      <span>{faq.question}</span>
                      <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl ml-4">+</span>
                    </summary>
                    <div className="mt-4 space-y-3">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {faq.relatedLinks.map((link, i) => (
                            <Link
                              key={i}
                              to={link.url}
                              className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                            >
                              {link.text} &rarr;
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Still have questions CTA */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-heading font-bold text-heading mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              I'm happy to help. Give me a call, send a message, or book in for a consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="primary">
                <a href="tel:+61468093991">Call 0468 093 991</a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Send a Message</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/booking">Book a Consultation</Link>
              </Button>
            </div>
          </div>
        </section>

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
