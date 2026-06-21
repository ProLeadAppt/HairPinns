import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "5-ways-infrared-sauna-boosts-hair-skin-glow",
    title: "5 Ways Infrared Sauna Sessions Boost Your Hair, Skin & Overall Glow",
    excerpt: "In today's fast paced world, stress, pollution, and product buildup can leave your strands dull. Our infrared sauna experience works from the inside out.",
    category: "Wellness",
    date: "August 12, 2025",
    readTime: "5 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-043.jpg?v=1744250210",
    author: "Jena Pinn",
    content: {
      introduction: "When was the last time you gave your hair and skin the deep care they truly deserve? In today's fast paced world, stress, pollution, and product buildup can leave your strands dull and your skin feeling tired. At Hairpinns, our infrared sauna experience is more than just a way to relax it's a beauty and wellness treatment that works from the inside out. Whether you're looking for smoother hair, clearer skin, or an all over glow, here's how regular sauna sessions can transform your self care routine.",
      sections: [
        {
          heading: "1. Detox for Healthy Skin & Hair",
          content: "Infrared heat penetrates deeper than traditional saunas, encouraging a healthy sweat that helps remove toxins and impurities. By clearing out the buildup that clogs pores and weighs hair down, your scalp feels refreshed, and your hair can regain its natural shine."
        },
        {
          heading: "2. Boosted Blood Circulation",
          content: "Better circulation means more oxygen and nutrients reach your hair follicles and skin cells. This natural boost supports stronger hair growth, a healthier scalp, and a more radiant complexion helping you look and feel your best after every session."
        },
        {
          heading: "3. Deep Hydration & Product Absorption",
          content: "Heat from the infrared sauna gently opens the cuticles in your hair and the pores in your skin. This makes it the perfect time to apply nourishing treatments like our Hairpinns Hair Mask so they can penetrate deeper and work more effectively."
        },
        {
          heading: "4. Stress Relief = Better Hair Growth",
          content: "Stress is one of the most overlooked causes of hair thinning and poor skin health. Infrared sauna sessions help reduce cortisol (the stress hormone), creating a more relaxed state that supports healthy hair growth and a glowing complexion."
        },
        {
          heading: "5. The Ultimate Self-Care Ritual",
          content: "Pairing your sauna session with a hair mask, hydration, and relaxation time creates the ultimate self-care experience. You'll walk out not only looking refreshed but feeling renewed from the inside out."
        },
        {
          heading: "Ready to Experience the Glow-Up?",
          content: "Now is the perfect time to invest in your hair, skin, and overall wellness.\n\nFor a limited time at Hairpinns, enjoy our 10-session sauna pack for only $200 (was $250) and receive:\n✔ Free Head Towel\n✔ Free Hair Mask Sachet\n✔ Free Hairpinns Drink Bottle\n\n📅 Book your sauna experience today and let's make your self-care a priority."
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
      customText: "Book your infrared sauna session today"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
