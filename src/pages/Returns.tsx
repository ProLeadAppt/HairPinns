import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const Returns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader title="Returns & Exchanges" />
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-foreground leading-relaxed mb-6">
              Your satisfaction is our priority. If you're not completely happy with your 
              purchase, we're here to help.
            </p>

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
            <ol className="space-y-2 text-foreground mb-6">
              <li>1. Contact us at hello@hairpinns.com with your order number</li>
              <li>2. Wait for return authorization and instructions</li>
              <li>3. Ship the item back using the provided label</li>
              <li>4. Receive your refund once we process the return</li>
            </ol>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Exchanges</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We're happy to exchange products of equal value. Contact us to arrange an exchange.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Questions?</h2>
            <p className="text-foreground leading-relaxed">
              Contact us at{" "}
              <a href="mailto:hello@hairpinns.com" className="text-brand-500 hover:text-brand-600">
                hello@hairpinns.com
              </a>{" "}
              or{" "}
              <a href="tel:+61468020624" className="text-brand-500 hover:text-brand-600">
                0468 020 624
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
