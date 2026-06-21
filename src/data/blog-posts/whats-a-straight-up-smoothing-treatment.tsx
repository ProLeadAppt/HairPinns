import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "whats-a-straight-up-smoothing-treatment",
    title: "What's a Straight Up Smoothing Treatment?",
    excerpt: "Smooth, soft, frizz-free hair with QIQI Vega — a hair-friendly smoothing system with no harsh chemicals, no downtime, and results that last up to 6 months.",
    category: "Treatments",
    date: "September 02, 2025",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-050.jpg?v=1744178399",
    author: "Jena Pinn",
    content: {
      introduction: "If you've ever wished your hair would just behave — no frizz, no puff, no morning wrestling match — our Straight Up Smoothing Treatment might be the answer you've been dreaming of. We use QIQI Vega, one of the most advanced and hair-friendly smoothing systems in the world. QIQI Vega is the ideal entry-level smoothing for frizz-prone hair in Sydney's climate — gentle enough for colour-treated and blonde hair, but powerful enough to keep you sleek through humidity for months.",
      sections: [
        {
          heading: "This Isn't Your Typical Keratin Treatment",
          content: "There's no harsh chemicals, no overpowering fumes, and no \"don't wash your hair for three days\" awkwardness. You'll leave the salon with hair that looks and feels ready for anything and it stays that way for months."
        },
        {
          heading: "Why Clients Love QIQI Vega 💗",
          content: "Frizz? Gone. Humidity has nothing on you. Your hair will stay sleek and smooth, even on the muggiest days.\n\nTime-saving magic. Blow-drying is faster and easier, and some clients don't even need to touch the straightener afterward.\n\nKeeps your hair's natural body. It smooths without making hair poker straight, unless that's the look you want.\n\nShiny, healthy finish. Your hair will feel silky and soft, not coated or heavy.\n\nLasts for months. Enjoy your smooth, low-maintenance hair for up to 6 months, depending on your hair type and routine.\n\nNo downtime. Wash, style, and enjoy your hair the same day."
        },
        {
          heading: "Perfect For:",
          content: "• Hair that frizzes at the first hint of moisture\n• Waves or curls that you'd like to soften without losing all shape\n• Thick, hard-to-manage hair that takes forever to style\n• Anyone wanting a sleek, polished look without damage\n• Frizzy-haired clients new to smoothing treatments who want to start gentle before considering keratin"
        },
        {
          heading: "The QIQI Vega Difference",
          content: "Most straightening systems rely on formaldehyde or harsh chemicals that can leave hair brittle or flat. QIQI Vega is formaldehyde-free and works on all hair types, even bleached or colour-treated hair, without compromising condition. In fact, many clients find their hair feels healthier after the treatment because it locks in moisture and seals the cuticle."
        },
        {
          heading: "Your Hair Will Thank You 🙏🏼",
          content: "Imagine waking up and your hair already looks good.\n\nImagine walking out into humid weather and still having a great hair day.\n\nImagine cutting your styling time in half while your hair stays smooth, shiny, and soft for months.\n\nThat's what QIQI Vega delivers.\n\n💜 Book your Straight Up Smoothing Treatment today and let your hair do less fighting and more shining.\n\n📲 Send me a message with any further questions or to secure your appointment"
        }
      ],
      faqSection: [
        {
          question: "Keratin vs. smoothing: which lasts longer?",
          answer: "Smoothing services (like our Straight Up treatment using QIQI Vega) are the right starting point for most frizz-prone clients — gentler, colour-safe, no formaldehyde, no downtime, and results you can wash and style the same day. They last 4–8 weeks depending on hair type. Keratin treatments penetrate deeper and last 2–4 months, but they're a bigger commitment and harsher on colour-treated or fine hair. We almost always recommend starting with smoothing: if your hair still fights the humidity halfway through, that's the signal to graduate to keratin."
        },
        {
          question: "What's the best treatment for frizz in humid Sydney weather?",
          answer: "For Sydney's changeable climate — coastal humidity, summer storms, and salt air — keratin is the more durable option. It restructures the cuticle, locks out humidity, and holds for 2–4 months even through the worst of a Sydney summer. Smoothing (like our Straight Up QIQI Vega treatment) is the gentler choice for first-timers, blonde or colour-treated hair, and clients who don't want the longer appointment or aftercare rules. Most of our Sutherland Shire clients start with smoothing, then switch to keratin for the worst humidity months (December to March)."
        },
        {
          question: "How long does the Straight Up smoothing treatment take, and is there any downtime?",
          answer: "The appointment runs about 2–3 hours depending on hair length and thickness. There's zero downtime — you can wash, tie up, and style your hair the same day. No three-day waiting period like old-school keratin. Aftercare is simple: sulphate-free shampoo, less frequent washing, and a quality heat protectant. With the right routine, results last up to 6 months on most hair types."
        }
      ]
    },
    cta: {
      type: "call-jena",
      servicePath: "/services/smoothing/mid-length-straight-up-smoothing",
      customText: "Ready to book your Straight Up treatment?"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
