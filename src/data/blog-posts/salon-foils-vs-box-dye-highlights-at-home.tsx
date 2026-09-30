import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "salon-foils-vs-box-dye-highlights-at-home",
    title: "Salon Foils vs Box Dye Highlights: Honest Talk From Someone Who Fixes Them",
    excerpt: "Box-dye highlight kits look like a $30 shortcut. After working behind the chair since 2009, here's what I think you're saving and what you're risking.",
    category: "Colour",
    date: "May 5, 2026",
    readTime: "6 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-091.jpg?v=1747026587",
    author: "Jena Pinn",
    content: {
      introduction: "I get a steady flow of clients in my chair after a box-dye disaster. They wanted highlights, spent thirty bucks at the chemist, and now they're sitting in front of me with patchy bands, brassy roots, or hair that won't take colour properly. So let me be straight with you about what box-dye highlights actually do at home, and when paying for foils is worth it.",
      sections: [
        {
          heading: "What box-dye highlight kits actually are",
          content: "The cap kits are the worst offenders. You pull strands of hair through a perforated cap with a crochet hook, slap bleach on them, and hope. The balayage-style kits look more modern but they're still a one-bottle developer and lightening cream. No tone control, no sectioning, no way to see what you've done at the back of your head. They are designed to give you a lifted result that looks 'fine' under bathroom lighting, not a placement that grows out cleanly six months later."
        },
        {
          heading: "Why your bathroom is the wrong place to lift hair",
          content: "Lightening hair is a chemistry problem. Heat from your scalp pushes the bleach to develop faster at the roots than the ends, which is why home jobs end up with bright roots and underprocessed mid-lengths. Bathroom lighting is yellow and warm, so the colour you see in the mirror is not the colour anyone else sees in daylight. And you can't see the back of your own head, so the back is almost always patchy. The professional version is foils because foils trap heat evenly, isolate sections from each other, and let me actually see what I'm doing."
        },
        {
          heading: "What I see in the chair after a box-dye job goes wrong",
          content: "Four recurring problems. Banding, which is horizontal stripes where the colour deposited unevenly. Hot roots, where the bleach lifted too fast near the scalp and now sits brassy or orange against unprocessed mid-lengths. Chemical breakage, which happens when bleach is left on too long or applied over previously coloured hair without knowing what's underneath. And patches at the back where you couldn't see. Fixing any of these costs more than just paying for foils in the first place, because I'm correcting damage as well as colour."
        },
        {
          heading: "What you're actually paying for at a salon",
          content: "Professional lightener (about three times more expensive than box, and gentler), a developer matched to your hair history, foils for even heat distribution, a toner to neutralise unwanted warmth, and twenty years of knowing what your specific hair will do based on a five-minute consultation. I can see when previous colour is still sitting in your hair. I can spot where you've used heat tools too much. I can lift your roots three levels without scorching them, because I know how to time it."
        },
        {
          heading: "How to compare the cost",
          content: "The box price is only one part of the decision. If a home colour does not turn out as expected, correcting it can take extra time and appointments. On the other hand, not everyone needs a full head of foils. Tell me what result you want and what you've used on your hair before, and I can explain the suitable options and current prices before you book."
        },
        {
          heading: "When DIY actually works",
          content: "I'll be honest, there are two cases where home colour is fine. The first is a permanent root touch-up on a solid base colour (not highlights), where you're matching a shade you've used before and it's a one-step deposit. The second is a temporary gloss or toner used on the lengths to refresh existing colour. Both are deposit-only, low-risk applications. Anything that involves lightening, lifting, or going more than one shade away from your natural tone needs a professional. Not because I'm trying to take your money, but because the chemistry is unforgiving and I see what happens when it goes wrong."
        }
      ],
      productModule: {
        title: "If you've already done a box-dye and want to recover",
        products: [
          { name: "Juuce Bond Repair Shampoo & Conditioner", link: "https://hairpinns.com/collections/juuce-botanicals", description: "Rebuilds the bonds bleach broke. Use four times a week for a month." },
          { name: "Pure Forever Blonde Shampoo & Conditioner", link: "https://hairpinns.com/collections/pure-certified-organic-hair-care", description: "Tones brassy roots while you wait for your appointment." },
          { name: "Pure Sacred Mask", link: "https://hairpinns.com/collections/pure-certified-organic-hair-care", description: "Weekly intense hydration to put moisture back into stripped hair." }
        ]
      },
      quickAnswer: {
        question: "Should I do highlights at home with a box-dye kit?",
        answer: "Home lightening can be difficult to place evenly, especially at the back of your head or over previous colour. If you're unsure what has already been used on your hair, ask a colourist before lightening it. Jena can talk through your options and give you a current price before you book."
      },
      keyTakeaways: [
        "Box-dye highlights cause four predictable problems: banding, hot roots, chemical breakage, and patches at the back",
        "Bathroom lighting and your own line of sight make even placement impossible at home",
        "How colour grows out depends on the placement, shade and your own hair",
        "Compare the full service and likely maintenance, not just the price of a box kit",
        "Home colour is fine for solid root touch-ups or temporary glosses, not for any lightening"
      ],
      faqSection: [
        { question: "Why does my box-dye job have stripes?", answer: "That's banding, and it happens because the bleach developed unevenly across your hair. Heat from your scalp makes the roots lift faster than the ends, and without foils to trap heat evenly the result is horizontal lines. It can be corrected with professional toning and a balayage placement to break up the stripes, but it takes a full appointment." },
        { question: "Can you fix a bad box-dye highlight?", answer: "Yes, in most cases. Bring photos of what you wanted, what you got, and any previous colour history. I'll do a strand test in the consultation to check what the existing colour will do under professional product, and we'll usually correct over one or two appointments depending on damage." },
        { question: "Is salon colour really gentler than box dye?", answer: "Yes, measurably. Salon developers go down to 10 volume for deposit-only and gentle lifting; most box dyes use 20 or 30 volume regardless of what you need. Salon lighteners include bond builders by default now. Box kits are formulated for the worst-case scenario, so they're stronger than most people need." },
        { question: "How long should I wait between a box-dye job and getting foils?", answer: "Wait at least four weeks if you can. Use Juuce bond repair shampoo and conditioner during that gap to rebuild what the box dye stripped. Some clients can be corrected immediately, but a four-week recovery makes the salon job better and reduces breakage risk." }
      ]
    },
    cta: {
      type: "service",
      servicePath: "/services/foil-packages/full-head-foils-package",
      customText: "See our full head foils package"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
