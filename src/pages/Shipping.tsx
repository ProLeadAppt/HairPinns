import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { generateBreadcrumbSchema, generateFAQPageSchema } from "@/lib/schema";

const SHIPPING_FAQS = [
  { question: "Do you ship to Melbourne?", answer: "Yes. Hair Pinns ships professional hair care to Melbourne, Brisbane, Perth, Sydney, Adelaide, Darwin, Hobart, Canberra and all of Australia. Free shipping on orders over $150." },
  { question: "Is shipping free to Brisbane?", answer: "Yes. Free standard shipping on orders over $150. Brisbane, Queensland and all Australian states and territories are covered." },
  { question: "How long does delivery take to Perth?", answer: "Standard shipping: 3-5 business days. Express: 1-2 business days. Perth and Western Australia are fully covered." },
  { question: "Do you ship to Australia only?", answer: "Yes. We ship to Australia only. Every state and territory: NSW, VIC, QLD, WA, SA, TAS, NT, and ACT. No international shipping." },
];

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Free Shipping Australia-Wide | Hair Pinns Hair Care"
        description="Hair Pinns ships professional hair care products Australia-wide. Free shipping over $150. Standard and express options. Hair products delivered across Australia."
        canonical="https://hairpinns.com/policies/shipping"
        ogImage="https://hairpinns.com/og-default.jpg"
        schemaJson={[
          generateBreadcrumbSchema([
            { name: "Home", url: "https://hairpinns.com/" },
            { name: "Policies", url: "https://hairpinns.com/policies" },
            { name: "Shipping", url: "https://hairpinns.com/policies/shipping" },
          ]),
          generateFAQPageSchema(SHIPPING_FAQS),
        ]}
      />
      <Header />
      
      <main id="main-content" className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader as="h1" title="Shipping Policy" />
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-foreground leading-relaxed mb-6">
              At Hair Pinns, we get your hair care products to you 
              as quickly and safely as possible.
            </p>

            {/* Free shipping callout */}
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-card p-5 mb-8 text-center">
              <p className="text-lg font-semibold text-heading">Free shipping on orders over {FREE_SHIPPING_THRESHOLD_DISPLAY}</p>
              <p className="text-sm text-muted-foreground mt-1">Standard delivery, anywhere in Australia</p>
            </div>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Shipping Rates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="bg-card border border-border rounded-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Standard</p>
                <p className="text-xl font-bold text-heading">$9.95</p>
                <p className="text-xs text-muted-foreground">3-5 business days</p>
              </div>
              <div className="bg-card border border-border rounded-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Express</p>
                <p className="text-xl font-bold text-heading">$14.95</p>
                <p className="text-xs text-muted-foreground">1-2 business days</p>
              </div>
              <div className="bg-brand-500/5 border border-brand-500/20 rounded-card p-4 text-center">
                <p className="text-sm text-brand-500 font-medium">Orders {FREE_SHIPPING_THRESHOLD_DISPLAY}+</p>
                <p className="text-xl font-bold text-brand-500">FREE</p>
                <p className="text-xs text-muted-foreground">Standard delivery</p>
              </div>
            </div>

            {/* Visual timeline */}
            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">How It Works</h2>
            <div className="flex items-center justify-between max-w-lg mx-auto mb-8">
              {[
                { step: "Order", desc: "Place your order" },
                { step: "Pack", desc: "1-2 days processing" },
                { step: "Ship", desc: "3-5 days delivery" },
                { step: "Enjoy", desc: "At your door" },
              ].map((s, i) => (
                <div key={s.step} className="flex flex-col items-center text-center flex-1">
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold mb-1">{i + 1}</div>
                  <p className="text-xs font-medium text-heading">{s.step}</p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Delivery Areas</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We ship to Australia only. Every Australian state and territory: New South Wales, Victoria, Queensland, Western Australia, South Australia, Tasmania, Northern Territory, and Australian Capital Territory.
            </p>
            <p className="text-foreground leading-relaxed mb-4">
              We deliver to Melbourne, Brisbane, Perth, Sydney, Adelaide, Darwin, Hobart, Canberra, Gold Coast, Newcastle, Wollongong and all of Australia.{" "}
              <a href="/blog/hair-products-melbourne-brisbane-perth-australia" className="text-brand-500 hover:text-brand-600 font-medium">
                Read our guide to hair products Melbourne, Brisbane & Perth
              </a>.
            </p>
            <p className="text-foreground leading-relaxed mb-6">
              Local Sutherland Shire customers may also choose in-store pickup at no additional cost.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Questions?</h2>
            <p className="text-foreground leading-relaxed">
              For any shipping inquiries, please contact us at{" "}
              <a href="mailto:hairpinns1@gmail.com" className="text-brand-500 hover:text-brand-600">
                hairpinns1@gmail.com
              </a>{" "}
              or call{" "}
              <a href="tel:+61468093991" className="text-brand-500 hover:text-brand-600">
                0468 093 991
              </a>
              .
            </p>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
