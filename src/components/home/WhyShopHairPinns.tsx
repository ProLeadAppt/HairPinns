import { Sparkles, Scissors, Heart, Award } from "lucide-react";
import Section from "@/components/design-system/Section";

/**
 * WhyShopHairPinns — the "why us" four-up grid (rev 2).
 *
 * The old version was 13 lines of "20 years behind the chair" and wasted
 * an entire section break on a single sentence. This version makes the
 * section actually earn its place: 4 cards, each one a real promise Jena
 * makes to a customer, each with a real icon and a real number.
 */
const cards = [
  {
    icon: Scissors,
    title: "20 years behind the chair",
    body: "Every product on this site has been used on real clients in the Bangor salon — not bought in a meeting, not picked by an algorithm.",
  },
  {
    icon: Sparkles,
    title: "If I don't use it, I don't stock it",
    body: "A short shelf of products Jena actually reaches for, not a warehouse of 10,000 SKUs. Quality over selection, every time.",
  },
  {
    icon: Heart,
    title: "Australian-owned, Aussie-stocked",
    body: "Packed at 60 Goorgool Rd, Bangor NSW. Tracked shipping to every state and territory. Free over $150.",
  },
  {
    icon: Award,
    title: "4.9★ Google · 5.0★ Fresha",
    body: "762+ verified five-star reviews. If a product lets a customer down, we replace it — no drama, no fine print.",
  },
];

const WhyShopHairPinns = () => {
  return (
    <Section
      padding="md"
      className="bg-[hsl(var(--accent))] border-y border-[hsl(var(--brand-500))/15]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span
            className="eyebrow"
            style={{ color: "hsl(var(--brand-600))" }}
          >
            why hair pinns
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-heading mt-3 tracking-tight">
            A short shelf. Real chairs. Real results.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Four things we don't compromise on — and the receipts to prove it.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cards.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="group bg-card border border-border rounded-2xl p-6 md:p-7 hover:border-[hsl(var(--brand-500))/40] hover:shadow-[var(--shadow)] transition-all"
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-[hsl(var(--brand-500))]/10 text-[hsl(var(--brand-600))] group-hover:bg-[hsl(var(--brand-500))] group-hover:text-white transition-colors"
                aria-hidden="true"
              >
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <h3 className="font-heading font-semibold text-lg text-heading leading-snug mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default WhyShopHairPinns;
