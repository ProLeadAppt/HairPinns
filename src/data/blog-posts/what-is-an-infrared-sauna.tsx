import { BlogPostTemplate } from "@/pages/BlogPost";

const post = {
    slug: "what-is-an-infrared-sauna",
    title: "What is an 'Infrared Sauna'?",
    excerpt: "If you haven't experienced the magic of infrared heat and color therapy combined… you're seriously missing out.",
    category: "Wellness",
    date: "April 11, 2025",
    readTime: "4 min read",
    image: "https://cdn.shopify.com/s/files/1/0691/6079/6341/files/Juuce-042.jpg?v=1744250283",
    author: "Jena Pinn",
    content: {
      introduction: "If you haven't experienced the magic of infrared heat and color therapy combined… you're seriously missing out. This isn't your average sauna session. It's a full-body, soul-soothing recharge that will leave you glowing from the inside out.",
      sections: [
        {
          heading: "What Makes It Different?",
          content: "Our infrared sauna uses gentle, deeply penetrating heat to melt away tension, relieve muscle aches, and support natural detoxification, without the overwhelming heat of traditional saunas. You'll sweat smarter, not harder.\n\nNow add in chromotherapy, or colour light therapy. It's a stunning, therapeutic experience that uses different hues to rebalance your mood and energy. Think: calming blues for stress, energizing reds when you're feeling flat, and soothing greens when you need to reset."
        },
        {
          heading: "The Benefits",
          content: "Together, infrared + chromotherapy creates a powerful wellness experience that helps:\n\n• Reduce stress and anxiety\n• Relieve muscle and joint pain\n• Boost circulation and detoxification\n• Improve skin tone and clarity\n• Leave you feeling lighter, brighter, and more grounded\n\nConnect to the Bluetooth speakers and listen to your favourite podcast or tunes or grab a book or simple sit and meditate 🧘‍♀️"
        },
        {
          heading: "Your Experience Awaits",
          content: "You'll walk out of the sauna feeling like you just hit reset on your whole day. Mind, body, and mood.\n\nReady to feel the difference? Book your session now and come experience the glow!\n\nP.S. Feel free to come in for a shampoo, head massage and blowdry straight after your Sauna Sesh for that extra pep in your step 😉"
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
      customText: "Ready to book your infrared sauna session?"
    }
  } as const;

export default function BlogPostPage() {
  return <BlogPostTemplate post={post as any} />;
}
