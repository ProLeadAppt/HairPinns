import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { generateBreadcrumbSchema, generateFAQPageSchema } from "@/lib/schema";

const RETURNS_FAQS = [
  { question: "Can I return hair products in Australia?", answer: "Yes. Hair Pinns offers 14-day returns on unopened hair care products. We ship Australia-wide and accept returns from all Australian states and territories. Contact us at hairpinns1@gmail.com to start a return." },
  { question: "How do I return a product to Hair Pinns?", answer: "Contact us at hairpinns1@gmail.com with your order number. We'll send return authorization and instructions. Ship the item back using the provided label. Refunds are processed within 5-7 business days." },
  { question: "What is the returns policy for hair care?", answer: "14-day returns on unopened products in original condition. Products must be unused with seals intact. Opened products, gift cards, and sale items cannot be returned. Refunds processed within 5-7 business days." },
];

const Returns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Hair Product Returns Australia | 14-Day Returns | Hair Pinns"
        description="Hassle-free 14-day returns on hair care products. Hair Pinns ships Australia-wide. Contact us for returns and exchanges."
        canonical="https://hairpinns.com/policies/returns"
        ogImage="https://hairpinns.com/og-default.jpg"
        schemaJson={[
          generateBreadcrumbSchema([
            { name: "Home", url: "https://hairpinns.com/" },
            { name: "Policies", url: "https://hairpinns.com/policies" },
            { name: "Returns", url: "https://hairpinns.com/policies/returns" },
          ]),
          generateFAQPageSchema(RETURNS_FAQS),
        ]}
      />
      <Header />
      
      <main id="main-content" tabIndex={-1} className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader as="h1" title="Returns & Exchanges" />
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-foreground leading-relaxed mb-6">
              Not happy with your purchase? We'll sort it out. Here's how returns work.
            </p>

            {/* 14-day badge */}
            <div className="bg-green-50 border border-green-200 rounded-card p-5 mb-8 text-center">
              <p className="text-2xl font-bold text-green-700">14-Day Returns</p>
              <p className="text-sm text-green-600 mt-1">Changed your mind? No drama. Send it back.</p>
            </div>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Return Policy</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Changed your mind? 14-day easy returns on unopened products.
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Products must be unused and in original condition</li>
              <li>• Original packaging and seals must be intact</li>
              <li>• Proof of purchase required</li>
              <li>• Refunds processed within 5-7 business days</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Non-Returnable Items</h2>
            <p className="text-foreground leading-relaxed mb-4">
              For health and safety reasons, the following items cannot be returned:
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Opened or used products</li>
              <li>• Gift cards</li>
              <li>• Sale or clearance items</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">How to Return</h2>
            <div className="space-y-3 mb-6">
              {[
                { step: 1, text: "Email hairpinns1@gmail.com with your order number" },
                { step: 2, text: "Wait for return authorisation and instructions" },
                { step: 3, text: "Ship the item back using the provided label" },
                { step: 4, text: "Refund processed within 5-7 business days" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{s.step}</div>
                  <p className="text-foreground text-sm">{s.text}</p>
                </div>
              ))}
            </div>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Exchanges</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We're happy to exchange products of equal value. Contact us to arrange an exchange.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Questions?</h2>
            <p className="text-foreground leading-relaxed">
              Contact us at{" "}
              <a href="mailto:hairpinns1@gmail.com" className="text-brand-500 hover:text-brand-600">
                hairpinns1@gmail.com
              </a>{" "}
              or{" "}
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

export default Returns;
