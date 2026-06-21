import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "infrared-sauna-for-hair-scalp-health",
    title: "Infrared Sauna for Hair & Scalp Health. Yes, It's a Thing!",
    excerpt: "At Hair Pinns, we combine luxury with wellness. See how infrared sauna sessions can work wonders for your hair and scalp health.",
    category: "Wellness",
    date: "April 20, 2025",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
    author: "Jena Pinn",
    content: {
      introduction: "At Hair Pinns, we're all about combining luxury with wellness, and that's exactly why we've introduced infrared sauna sessions to our salon experience. You've probably heard about infrared for detox and relaxation, but did you know it can also work wonders for your hair and scalp health?",
      sections: [
        {
          heading: "1. Boosts Scalp Circulation",
          content: "Infrared heat increases blood flow to the scalp, delivering more oxygen and nutrients to your hair follicles. Translation? Healthier, stronger hair growth over time."
        },
        {
          heading: "2. Supports Detox & Reduces Build-Up",
          content: "Our scalps collect a surprising amount of product, oil, and pollution. Infrared heat helps open pores and flush out toxins, leaving your scalp cleaner and more balanced."
        },
        {
          heading: "3. Strengthens Damaged Hair",
          content: "Infrared heat is gentler and more penetrative than traditional saunas. It helps strengthen weak or chemically treated hair from the inside out, especially when paired with restorative products like our Aromaganic Q-Plex Reconstructing range."
        },
        {
          heading: "4. Reduces Stress (Which Means Less Hair Loss)",
          content: "Hair loss is often linked to stress. One of the best things you can do for your hair? Chill out. Infrared sessions calm your nervous system, helping to balance cortisol and reduce stress-induced shedding."
        },
        {
          heading: "5. Pairs Perfectly With Hair Treatments",
          content: "Want to take your salon treatment to the next level? Use one of our hair mask sachets before you get into the sauna so your deep-conditioning treatment can penetrate even better."
        },
        {
          heading: "Ready to try it?",
          content: "Ask us about adding a 45 minute infrared sauna session to your next salon visit, or book it solo for a little self-care break that your scalp will thank you for.\n\nHealthy hair starts at the root, and we're here to help you glow from the inside out."
        }
      ],
      faqSection: [
        {
          question: "What is an infrared sauna and how is it different from a regular sauna?",
          answer: "An infrared sauna uses light waves to heat your body directly, not the air around you. It runs 10-15°C cooler than a traditional sauna but you sweat 2-3x more, which is why it's better for hair, skin and detox without the stifling heat.",
        },
        {
          question: "Is infrared sauna good for hair growth?",
          answer: "Yes — the increased scalp circulation feeds the follicle, and the deep sweat clears sebum buildup that can clog it. Jena's clients at Hair Pinns notice less shedding and faster growth after 4-6 weekly sessions.",
        },
        {
          question: "How often should I do infrared sauna for hair and skin benefits?",
          answer: "Twice a week for the first month, then weekly to maintain. A 30-40 minute session at 50-60°C is the sweet spot — longer isn't better.",
        },
        {
          question: "Is infrared sauna safe with coloured hair?",
          answer: "Completely. Unlike UV, infrared doesn't lift pigment. Just tie your hair up, rinse it after, and apply a leave-in like QIQI Bare Repair Oil to lock in moisture.",
        },
        {
          question: "Can I use infrared sauna on the same day as a hair appointment?",
          answer: "Yes, and Jena actually recommends it — book a smoothing treatment, then sauna. The heat sets the treatment deeper into the cuticle for longer-lasting results.",
        }
      ],
    },
    cta: {
      type: "call-jena",
      customText: "Book your infrared sauna session"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
