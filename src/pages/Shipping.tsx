import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { generateBreadcrumbSchema, generateFAQPageSchema } from "@/lib/schema";

const SHIPPING_FAQS = [
  { question: "Do you ship to Melbourne?", answer: "Yes. Hair Pinns ships salon-quality hair care to Melbourne, Brisbane, Perth, Sydney, Adelaide, Darwin, Hobart, Canberra and all of Australia. Free shipping on orders over $150." },
  { question: "Is shipping free to Brisbane?", answer: "Yes. Free standard shipping on orders over $150. Brisbane, Queensland and all Australian states and territories are covered." },
  { question: "How long does delivery take to Perth?", answer: "Standard shipping: 3-5 business days. Express: 1-2 business days. Perth and Western Australia are fully covered." },
  { question: "Do you ship to Australia only?", answer: "Yes. We ship to Australia only. Every state and territory — NSW, VIC, QLD, WA, SA, TAS, NT, and ACT. No international shipping." },
];

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Free Shipping Australia-Wide | Hair Pinns Hair Care</title>
        <meta
          name="description"
          content="Hair Pinns ships salon-quality hair care products Australia-wide. Free shipping over $150. Standard and express options. Hair products delivered across Australia."
        />
        <link rel="canonical" href="https://hairpinns.com/policies/shipping" />
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: "Home", url: "https://hairpinns.com/" },
            { name: "Policies", url: "https://hairpinns.com/policies" },
            { name: "Shipping", url: "https://hairpinns.com/policies/shipping" },
          ]))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateFAQPageSchema(SHIPPING_FAQS))}
        </script>
      </Helmet>
      <Header />
      
      <main id="main-content" className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader title="Shipping Policy" />
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-foreground leading-relaxed mb-6">
              At Hair Pinns, we strive to get your professional hair care products to you 
              as quickly and safely as possible.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Shipping Rates</h2>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Standard Shipping (3-5 business days): $9.95</li>
              <li>• Express Shipping (1-2 business days): $14.95</li>
              <li>• <strong>FREE Standard Shipping on orders over {FREE_SHIPPING_THRESHOLD_DISPLAY}</strong></li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Processing Time</h2>
            <p className="text-foreground leading-relaxed mb-6">
              Orders are typically processed within 1-2 business days. You will receive a 
              confirmation email with tracking information once your order has shipped.
            </p>

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
