import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "how-much-full-head-foils-cost-sydney",
    title: "How Much Does a Full Head of Foils Cost in Sydney?",
    excerpt: "Straight answers on the real price range for full head foils across Sydney, what's included, and when to expect extras.",
    category: "Colour",
    date: "April 19, 2026",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
    author: "Jena Pinn",
    content: {
      introduction: "'How much does a full head of foils cost in Sydney?' The range is wider than most people realise — $180 at budget salons to $700+ at premium ones. Here's what actually drives the price and what to expect at each tier.",
      sections: [
        {
          heading: "The Sydney Price Range (April 2026)",
          content: "Budget salons: $180–$280. Usually shorter hair, fewer foils, often doesn't include cut or proper toner. Mid-tier: $300–$450. Full-head coverage, professional colour, toner included, often includes cut and blowdry. Premium/boutique: $450–$700+. Full-head foils with extended sectioning, high-quality colour (L'Oréal, Wella, Schwarzkopf top lines), toner, cut, and blowdry. Hair Pinns pricing: full-head foils package starts at $420 for mid-length and goes up based on hair length and thickness."
        },
        {
          heading: "What Makes Prices Different",
          content: "Hair length — anything below shoulders costs less; anything below waist costs considerably more. Hair thickness — thick hair needs more foils and more colour. Starting colour — going from dark to blonde requires multiple processes and more time. Toner — a quality toner adds $30–$80 but makes a massive visual difference. Cut and blowdry — often bundled, sometimes extra. Senior stylist premium — some salons charge more for specific stylists. Always ask whether the quoted price includes toner, cut, and blowdry."
        },
        {
          heading: "Hidden Fees to Watch For",
          content: "'Long hair surcharge' — can add $50–$150. 'Thick hair surcharge' — another $30–$80. Tone or 'glaze' as a separate line item ($30–$80). Bond-builder additive (Olaplex, etc.) as extra ($30–$50). Some salons quote 'from $220' but bill $450 after all the add-ons. Ask for the total estimate including your specific hair length and thickness before booking."
        },
        {
          heading: "What You Actually Get at Hair Pinns",
          content: "Our full head foils package includes: full head of foils, professional-grade colour, toner, cut, blowdry. No hidden fees. Price is quoted upfront based on your hair length and thickness. Mid-length: $420. Long: $480–$520. Extra-thick or longer than waist-length: we'll quote on consultation. Plus a free 15-minute consultation before booking if you've never been before."
        },
        {
          heading: "Worth the Premium?",
          content: "For a one-off: mid-tier ($300–$450) is usually the sweet spot. Budget is risky because cheap colour fades and damages more. For recurring colour (every 6–8 weeks): mid-to-premium pays off because hair stays healthier long-term and you don't end up paying a specialist later to fix a DIY disaster. Cheap colour done repeatedly costs more than quality colour done well."
        }
      ],
      quickAnswer: {
        question: "How much does a full head of foils cost in Sydney?",
        answer: "A full head of foils in Sydney costs $180–$280 at budget salons, $300–$450 at mid-tier salons, and $450–$700+ at premium/boutique salons (April 2026). At Hair Pinns in Bangor, our full head foils package starts at $420 for mid-length hair and includes colour, toner, cut, and blowdry with no hidden fees."
      },
      keyTakeaways: [
        "Budget: $180–$280. Mid-tier: $300–$450. Premium: $450–$700+.",
        "Watch for hidden fees: long-hair surcharge, toner extra, bond-builder extra",
        "Always ask for total estimate including your specific length and thickness",
        "Hair Pinns: $420 for mid-length, all inclusive — no hidden charges",
        "Mid-tier is the sweet spot for quality — budget risks fade and damage"
      ],
      faqSection: [
        {
          question: "How much do full head foils cost in Sydney?",
          answer: "$280-$450 at Hair Pinns, depending on hair length, density, and whether toner is included. The price is published online — no hidden costs at the till.",
        },
        {
          question: "How long do full head foils take?",
          answer: "2.5-3.5 hours, including toner and gloss. Jena's appointments are blocked for the full time, so there's no rush and no overlap with the next client.",
        },
        {
          question: "How often should I get full head foils?",
          answer: "Every 8-12 weeks. Going longer than 12 weeks means the root line becomes obvious and the toner fades. Going sooner than 8 weeks risks overlapping bleach on previously-lightened hair, which causes breakage.",
        },
        {
          question: "Do full head foils damage hair?",
          answer: "Modern lightener + bond protection (Olaplex, Wellaplex) keeps damage minimal. The risk is overlap on previously bleached hair, which Jena avoids by sectioning carefully and tracking each foil.",
        },
        {
          question: "Can I go from dark to blonde with full head foils?",
          answer: "In one session, no. It takes 2-3 sessions 6-8 weeks apart to lift dark hair to blonde safely. Jena's consultation includes a strand test to confirm how many sessions you'll need and the cost of each.",
        }
      ],
    },
    cta: {
      type: "service",
      servicePath: "/services/foil-packages/full-head-foils-package",
      customText: "See full head foils package pricing"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
