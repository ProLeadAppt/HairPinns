import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
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
              <li>• <strong>FREE Standard Shipping on orders over $50</strong></li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Processing Time</h2>
            <p className="text-foreground leading-relaxed mb-6">
              Orders are typically processed within 1-2 business days. You will receive a 
              confirmation email with tracking information once your order has shipped.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Delivery Areas</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We currently ship throughout Australia. Local Sutherland Shire customers may 
              also choose in-store pickup at no additional cost.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Questions?</h2>
            <p className="text-foreground leading-relaxed">
              For any shipping inquiries, please contact us at{" "}
              <a href="mailto:hello@hairpinns.com" className="text-brand-500 hover:text-brand-600">
                hello@hairpinns.com
              </a>{" "}
              or call{" "}
              <a href="tel:+61295550123" className="text-brand-500 hover:text-brand-600">
                (02) 9555 0123
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
