import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "when-should-you-get-a-haircut",
    title: "When Should You Get a Haircut? Signs You're Overdue",
    excerpt: "A stylist's guide to the five clear signs you're overdue for a haircut, and how often different lengths and hair types actually need trims.",
    category: "Education",
    date: "April 19, 2026",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-120.jpg?v=1747030506",
    author: "Jena Pinn",
    content: {
      introduction: "Most people wait too long between haircuts and notice hair feels 'off' without knowing why. Here are the five clear signs you're overdue for a cut, and how often each hair type and length actually needs a trim to stay its best.",
      sections: [
        {
          heading: "How Often You Actually Need a Haircut",
          content: "Short hair (pixie, bob): every 4–6 weeks. The shape loses definition quickly and a trim keeps it looking styled. Mid-length hair: every 8–10 weeks. Balances shape maintenance with growing out. Long hair: every 10–12 weeks minimum for a dusting, 12–14 weeks for a proper trim. Curly hair: every 10–12 weeks regardless of length — dry cutting every few months keeps curl shape intact. Damaged or colour-treated hair: every 6–8 weeks to stop split ends travelling up the shaft."
        },
        {
          heading: "Sign 1: Ends Feel 'Stringy' or Wispy",
          content: "Healthy ends feel the same density as mid-lengths. When the ends feel thinner, stringy, or wispy — that's split ends travelling up the hair shaft. Once splits start, they get worse until cut off. Waiting an extra month means losing an extra inch when you finally book."
        },
        {
          heading: "Sign 2: Styling Takes Longer or Doesn't Hold",
          content: "Your hair knows the shape it was cut in. When that shape grows out, styling becomes harder — the blowdry takes longer, curls don't hold, the part won't sit. If your styling routine has quietly gotten longer over a few months, your cut is growing out."
        },
        {
          heading: "Sign 3: Layers Look Flat or Undefined",
          content: "Layered cuts rely on specific lengths to create movement. After 10–12 weeks, layers grow out and the cut looks blunt or shapeless. If your hair looks 'flat' when you used to have movement, that's a cut signal."
        },
        {
          heading: "Sign 4: You Can't Remember When You Last Booked",
          content: "If you can't remember your last haircut date, you're overdue. Track it in your phone calendar. For most people, 10–12 weeks is the upper limit before hair health starts to decline."
        },
        {
          heading: "Sign 5: Hair Feels Dry and Products Don't Work",
          content: "Damaged ends don't absorb product. If your conditioner, leave-in, or mask feels like it's sitting on your hair instead of absorbing, the ends are damaged enough that they can't hold moisture anymore. Only a cut fixes this — no treatment brings damaged hair back."
        },
        {
          heading: "Don't Grow Out Hair Without Trimming",
          content: "The biggest mistake when growing hair: skipping trims entirely. Ends split, splits travel up the shaft, and eventually you have to cut more to remove damage than if you'd trimmed every 10–12 weeks. Even growing hair needs a 1cm trim every 3 months to stay healthy. Mention 'dusting — just the ends' and a good stylist will trim minimally."
        }
      ],
      quickAnswer: {
        question: "When should you get a haircut?",
        answer: "Get a haircut every 4–6 weeks for short hair, every 8–10 weeks for mid-length, and every 10–12 weeks for long hair. Signs you're overdue: stringy or wispy ends, styling taking longer than usual, layers looking flat, or products no longer absorbing into damaged ends. Even when growing hair out, trim every 3 months to prevent damage."
      },
      keyTakeaways: [
        "Short hair every 4–6 weeks, mid-length 8–10, long 10–12, curly every 10–12",
        "Sign #1: stringy or wispy ends (split ends travelling up the shaft)",
        "Sign #2: styling takes longer or doesn't hold as well",
        "Sign #3: layers look flat or undefined",
        "Even when growing hair, dust ends every 3 months to prevent damage"
      ],
      faqSection: [
        {
          question: "When should you get a haircut?",
          answer: "Every 8-12 weeks for short styles, 10-14 weeks for mid-length, 12-16 weeks for long. The 6-8 week rule for short hair keeps the shape; longer styles can wait because the cut is more about the ends than the shape.",
        },
        {
          question: "How do I know it's time for a haircut?",
          answer: "Three signs: ends look stringy, the style stops holding its shape, and you can see visible split ends. Once all three appear, the cut is overdue.",
        },
        {
          question: "Should I get a haircut before or after colour?",
          answer: "After colour, but within 1-2 weeks. Colour can dry out the ends slightly, and a trim removes the driest bits. Cutting first means you might cut more than you need to after the colour is done.",
        },
        {
          question: "Is it bad to go a year without a haircut?",
          answer: "For very long hair, no — but the ends will be visibly split and the overall shape will be uneven. A trim every 4-6 months keeps the ends healthy without losing length.",
        },
        {
          question: "How do I tell my stylist what I want?",
          answer: "Bring 2-3 photos of the exact style, taken from front, side, and back. Words alone ('a bit off the bottom') are interpreted differently by every stylist. Photos are universal.",
        }
      ],
    },
    cta: {
      type: "service",
      servicePath: "/services/cut-packages/mid-length-wash-cut-blowdry",
      customText: "Book a haircut at Hair Pinns"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
