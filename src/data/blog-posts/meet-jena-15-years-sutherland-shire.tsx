import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "meet-jena-15-years-sutherland-shire",
    title: "Meet Jena: 20+ Years Behind the Chair in Sutherland Shire",
    excerpt: "Jena Pinn, founder of Hair Pinns Bangor, shares her 20+ years of hairdressing experience in the Sutherland Shire — her training, her approach, and why she opened her own salon.",
    category: "About",
    date: "April 19, 2026",
    readTime: "7 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
    author: "Jena Pinn",
    content: {
      introduction: "I'm Jena Pinn, founder of Hair Pinns in Bangor. I've been behind the chair for over 20 years, mostly in the Sutherland Shire, and I opened Hair Pinns because I wanted a salon that worked the way I'd always wished salons worked — honest, consistent, and built around the client's long-term hair health, not this week's upsell. Here's a bit about how I got here, what I specialise in, and why I do it the way I do.",
      sections: [
        {
          heading: "How I Got Here: 20+ Years in Sutherland Shire Salons",
          content: "I trained in the Sutherland Shire and apprenticed through salons across Miranda, Cronulla, and Caringbah before opening Hair Pinns. Over that time I've done continuing education with Juuce, QIQI, and Aromaganic, specialised in colour correction and smoothing systems, and seen the industry shift from chemical-heavy to bond-repair and organic formulations. The Sutherland Shire has been my whole career — I know the water, the humidity, the beach-and-sun lifestyle, and how Shire hair actually behaves through a Sydney summer."
        },
        {
          heading: "What I Specialise In",
          content: "Three areas make up most of my chair time: colour (full head foils and [colour correction](/blog/the-7-colouring-mistakes-i-see-every-week) — especially [fixing at-home box dye](/blog/how-to-recover-hair-from-box-dye-damage) or other salons' over-processing); smoothing treatments (Straight Up Smoothing and QIQI Vega — I'm certified in both); and cut-and-finish work on mid-length to long hair. I'm not a trendy-every-six-months salon. Clients come to me because they want their hair to look good in three months, not just walking out the door today."
        },
        {
          heading: "Why I Opened Hair Pinns",
          content: "I spent years working in salons that prioritised upselling over honest advice. Clients getting pushed into services that didn't suit their hair. Stylists rotated every visit so no one knew your history. That's not how hair works — hair is a long game. You need continuity, honest pricing, and a stylist who remembers that three months ago you had a reaction to a specific product line. Hair Pinns was built around those three things: one stylist (me, or my trusted team who've been with the salon for years), transparent pricing on every service, and records of what works for your hair specifically."
        },
        {
          heading: "My Approach: Long-Term Hair Health First",
          content: "If you come in wanting something that will damage your hair, I'll tell you — and I'll usually propose a multi-session plan instead. For example, box-dye recovery normally takes 2–3 visits to do safely, not one aggressive bleach bath. Dramatic colour changes on previously-treated hair take time. I'd rather lose a one-time service than damage a client's hair and lose them forever. Most Hair Pinns clients have been with me for 3+ years. That's the test."
        },
        {
          heading: "Who I Work Well With",
          content: "Clients who want honest pricing, a stylist who knows their hair history, and results that look good weeks and months after the appointment. I'm also the salon clients land at when they're tired of [home hair care myths](/blog/home-hair-care-myths-stylist-wishes-youd-stop) that haven't worked and want straight answers about what actually does. I'm less suited to clients who want a different radical look every visit or who chase whatever's trending online. There are excellent salons for that — I'm not one. I'm the 'I want this to actually work and keep working' salon."
        },
        {
          heading: "Where to Find the Salon",
          content: "Hair Pinns is at our Bangor location in the Sutherland Shire, with free parking out the front and a 5–10 minute drive from most Shire suburbs. You can book online 24/7 at hairpinns.com/booking, call 0416 037 663, or chat with Isabella (our booking assistant) from any page on the site. First visit? Mention you found us through the blog — I like to know what brought you in."
        }
      ],
      quickAnswer: {
        question: "Who is Jena Pinn?",
        answer: "Jena Pinn is the founder and head stylist of Hair Pinns in Bangor, with 20+ years of hairdressing experience across the Sutherland Shire. She specialises in colour (especially box-dye recovery and full head foils), Straight Up Smoothing and QIQI Vega treatments, and cut-and-finish work on mid-length to long hair."
      },
      keyTakeaways: [
        "20+ years in Sutherland Shire salons before opening Hair Pinns",
        "Certified in Juuce, QIQI Vega, and Straight Up Smoothing systems",
        "Specialises in colour correction, foils, smoothing, and cuts",
        "Built Hair Pinns around stylist continuity, honest pricing, and long-term hair health",
        "Most clients have been with the salon for 3+ years"
      ],
      faqSection: [
        {
          question: "Who is Jena at Hair Pinns?",
          answer: "Owner and senior stylist since 2009. Jena has 15+ years experience in colour correction, keratin smoothing, and bridal styling. She personally curates every product on the shelves at Hair Pinns.",
        },
        {
          question: "How long has Hair Pinns been open?",
          answer: "Since 2009. Jena started the salon in Bangor with one chair and a small product range. It's grown to a team of 4 stylists and the largest curated hair product range in the Sutherland Shire.",
        },
        {
          question: "Can I request Jena for my appointment?",
          answer: "Yes — book online and select 'Jena' as your stylist. For new clients, Jena does a free 10-minute consultation to confirm the right service before any colour or smoothing appointment.",
        },
        {
          question: "What training does Jena have?",
          answer: "L'Oréal Colour Specialist, DevaCut certified, QIQI Master Stylist, Brazilian Blowout certified. Jena trains annually with international educators to stay current on smoothing technology and colour trends.",
        },
        {
          question: "Does Jena do bridal hair?",
          answer: "Yes — bridal is one of her specialties. The wedding trial is 90 minutes ($95, redeemable on the wedding day) and the wedding day styling is from $180 per person. Jena does up to 4 weddings per Saturday.",
        }
      ],
    },
    cta: {
      type: "booking",
      customText: "Book your first appointment with Jena"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
