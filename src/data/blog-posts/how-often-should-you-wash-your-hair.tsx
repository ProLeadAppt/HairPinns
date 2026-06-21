import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "how-often-should-you-wash-your-hair",
    title: "How Often Should You Wash Your Hair? (By Hair Type)",
    excerpt: "A stylist's direct answer to how often you should wash your hair, broken down by hair type, scalp condition, and lifestyle.",
    category: "Education",
    date: "April 19, 2026",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-118.jpg?v=1747030560",
    author: "Jena Pinn",
    content: {
      introduction: "How often you wash your hair is one of the top questions [I get asked in the salon](/blog/meet-jena-15-years-sutherland-shire). The honest answer depends on your hair type, scalp, and routine — not a universal rule. Here's a direct breakdown so you can figure out what's right for you.",
      sections: [
        {
          heading: "The Short Answer by Hair Type",
          content: "Fine or straight hair: every 2 days. Thick or wavy hair: every 3–4 days. Curly hair: every 5–7 days (or co-wash between). Oily scalp: every 1–2 days (but use a gentle shampoo). Dry or colour-treated hair: every 3–4 days maximum. If you exercise daily or live somewhere humid, add one extra wash per week. If you don't exercise and have normal scalp oil production, you can usually go one day longer than you think."
        },
        {
          heading: "Why Washing Too Often Damages Hair",
          content: "Over-washing strips the scalp's natural oil (sebum), which actually signals your scalp to produce MORE oil — a feedback loop that makes hair greasier faster. For colour-treated hair, every wash fades colour. For smoothed or keratin-treated hair, frequent washing dissolves the treatment. For curly hair, frequent washing breaks the curl pattern and causes frizz. Once you reduce washes, the first week feels greasier — then your scalp rebalances and hair feels better than before."
        },
        {
          heading: "Why Washing Too Rarely Is Also a Problem",
          content: "If you go a week or more between washes, you risk: product buildup that flattens hair and weighs it down, scalp imbalance that causes itchiness or flakiness, and potential bacterial/fungal issues from trapped oil and sweat. The sweet spot isn't maximum time between washes — it's washing often enough to keep your scalp healthy and hair clean, but not so often you strip natural oils."
        },
        {
          heading: "Signs You're Washing Too Much",
          content: "Hair feels dry or brittle at the mid-lengths and ends. Colour fades within 4 weeks. Scalp feels tight or itchy the day after washing. Roots get greasy faster than they used to. These are all signals to reduce wash frequency by one day per week and see if your hair improves."
        },
        {
          heading: "Signs You're Not Washing Enough",
          content: "Scalp feels heavy or itchy. Visible flakes or dandruff. Hair lacks volume at the roots. Product doesn't perform the way it did fresh-washed. If any of these apply, add a wash back in. Some people need 3 washes per week; some only 1. There's no wrong answer as long as your scalp and hair are healthy."
        },
        {
          heading: "Sulfate-Free Shampoos Let You Wash More Often",
          content: "If you want to wash daily without damage, a gentle sulfate-free shampoo is the fix. Pure Sacred or Aromaganic Colour Care can be used daily without stripping hair because they use gentler surfactants. My fine-haired clients who need daily washes all use sulfate-free shampoos — they get clean hair without the compound damage of harsh detergents."
        }
      ],
      quickAnswer: {
        question: "How often should you wash your hair?",
        answer: "How often you wash your hair depends on your hair type: fine or straight hair every 2 days, thick or wavy every 3–4 days, curly every 5–7 days, oily scalp every 1–2 days with a gentle shampoo, and dry or colour-treated every 3–4 days maximum. Most people wash too often — reducing by one day per week usually improves hair health."
      },
      keyTakeaways: [
        "Fine: every 2 days. Thick: every 3–4. Curly: every 5–7. Oily: every 1–2.",
        "Over-washing strips oils and triggers more oil production — makes hair greasier",
        "Signs of over-washing: dry ends, faded colour, tight scalp, faster-greasing roots",
        "Signs of under-washing: itchy scalp, flakes, flat roots, products underperforming",
        "Sulfate-free shampoos allow safe daily washing if you need it"
      ],
      faqSection: [
        {
          question: "How often should you wash your hair?",
          answer: "Every 2-3 days for normal hair, every 4-5 days for dry or curly, every 1-2 days for very oily or after heavy gym sessions. Daily washing strips the natural oils and causes rebound oiliness within hours.",
        },
        {
          question: "Is it bad to wash your hair every day?",
          answer: "For most hair types, yes — daily washing strips the oils, the scalp over-produces to compensate, and you're oily again by lunchtime. The exception is very fine, very oily hair, where daily washing with a gentle formula is the lesser evil.",
        },
        {
          question: "Can I train my hair to need less washing?",
          answer: "Yes — extend the time between washes by 1 day per week. After 6-8 weeks, most hair settles into a 3-4 day cycle with significantly less oil.",
        },
        {
          question: "What happens if I stop washing my hair?",
          answer: "The first 2-3 weeks are greasy. After that, the scalp recalibrates and oil production drops by 30-50%. Jena's seen clients go from daily washing to twice-weekly with no product, just patience.",
        },
        {
          question: "Should I use dry shampoo between washes?",
          answer: "Yes — a light sprinkle at the roots, brushed through. Don't use it as a substitute for washing for more than 4-5 days in a row. The build-up eventually clogs the follicle.",
        }
      ],
    },
    cta: {
      type: "product",
      productPath: "https://hairpinns.com/collections/pure-certified-organic-hair-care",
      customText: "Shop sulfate-free shampoos"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
