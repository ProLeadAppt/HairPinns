import blogImg01 from "@/assets/images/Juuce-091.webp";
import blogImg02 from "@/assets/blog/jena-products.webp";
import blogImg03 from "@/assets/blog/lamellar-vitality-range.webp";
import blogImg04 from "@/assets/images/brunette-woman-getting-her-hair-washed.webp";
import blogImg05 from "@/assets/blog/infrared-sauna-room.webp";
import blogImg06 from "@/assets/blog/heat-protection-lifestyle.webp";
import blogImg07 from "@/assets/images/hair.pinns_1773039624_3848857784473839298_2244281067.avif";
import blogImg08 from "@/assets/blog/straight-up-smoothing-hero-1280w.webp";
import blogImg09 from "@/assets/images/Juuce-118.webp";
import blogImg10 from "@/assets/blog/infrared-sauna-experience.webp";
import blogImg11 from "@/assets/blog/hot-towel-treatment.webp";
import blogImg12 from "@/assets/blog/qiqi-bare-repair-oil.webp";
import blogImg13 from "@/assets/blog/pure-precious-ends.webp";
import blogImg14 from "@/assets/blog/juuce-hairspray-collection.webp";
import blogImg15 from "@/assets/blog/wet-brush-collection.webp";
import blogImg16 from "@/assets/blog/qiqi-vega-comparison.webp";
import blogImg17 from "@/assets/blog/hydration-bundle.webp";
import blogImg18 from "@/assets/blog/walnut-scrub-hero-1280w.webp";
import blogImg19 from "@/assets/images/hair.pinns_1765910087_3789049150835962518_2244281067.avif";
import blogImg20 from "@/assets/blog/winter-hair-care.webp";
import blogImg21 from "@/assets/blog/lamellar-vitality-pack.webp";
import blogImg22 from "@/assets/blog/heat-protection-products.webp";
import blogImg23 from "@/assets/blog/wet-brush-glitter.webp";
import blogImg24 from "@/assets/blog/juuce-quiz-hero-1280w.webp";
import blogImg25 from "@/assets/blog/infrared-sauna-interior.webp";
import blogImg26 from "@/assets/images/hair.pinns_1773312619_3851143514822403759_2244281067.avif";
import blogImg27 from "@/assets/images/hairdresser-taking-care-her-client.webp";
import blogImg28 from "@/assets/images/jena-headshot.webp";
import blogImg29 from "@/assets/images/hair.pinns_1764061240_3773541646932413211_2244281067.avif";
import blogImg30 from "@/assets/images/Aromaganic_Organic_Shampoo_Conditoner.webp";
import blogImg31 from "@/assets/images/Juuce-037.webp";
import blogImg32 from "@/assets/images/Juuce-038.webp";
import blogImg33 from "@/assets/images/IMG_0133.webp";
import blogImg34 from "@/assets/images/hair.pinns_1772611255_3845264367588032981_2244281067.avif";
import blogImg35 from "@/assets/images/front-view-man-hair-slugging-night-routine.webp";
import blogImg36 from "@/assets/images/hair.pinns_1772611255_3845264367739018965_2244281067.avif";
import blogImg37 from "@/assets/images/hair.pinns_1772611255_3845264368124921991_2244281067.avif";
import blogImg38 from "@/assets/images/Juuce-050.webp";
import blogImg39 from "@/assets/images/hair.pinns_1767003876_3798226265673657604_2244281067.avif";
import blogImg40 from "@/assets/images/hair.pinns_1765567383_3786176092718704887_2244281067.avif";
import blogImg41 from "@/assets/images/hair.pinns_1773039624_3848857784566087942_2244281067.avif";
import blogImg42 from "@/assets/images/happy-woman-singing-into-hairbrush-home.webp";
import blogImg43 from "@/assets/images/hair.pinns_1773039624_3848857785019078760_2244281067.avif";
import blogImg44 from "@/assets/blog/welcome-hero-1280w.webp";
import blogImg45 from "@/assets/images/hair.pinns_1765054212_3781871298285872308_2244281067.avif";
import blogImg46 from "@/assets/images/hair.pinns_1766558568_3794490749802781898_2244281067.avif";
import blogImg47 from "@/assets/images/hair.pinns_1764579624_3777890155324026767_2244281067.avif";
import blogImg48 from "@/assets/images/hair.pinns_1766442955_3793520917994535355_2244281067.avif";
import blogImg49 from "@/assets/images/hair.pinns_1766522746_3794190256418580882_2244281067.avif";
import blogImg50 from "@/assets/images/hair.pinns_1767331566_3800975130675413617_2244281067.avif";
import blogImg51 from "@/assets/images/1DA64B8E-CC51-41CF-85AF-226190D5BF4C.webp";
import blogImg52 from "@/assets/images/hair.pinns_1772611255_3845264368586306528_2244281067.avif";
import blogImg53 from "@/assets/images/hair.pinns_1764877632_3780390041894992722_2244281067.avif";
import blogImg54 from "@/assets/images/hair.pinns_1766355936_3792790949849160975_2244281067.avif";
import blogImg55 from "@/assets/images/hair.pinns_1773039624_3848857785019116769_2244281067.avif";
import blogImg56 from "@/assets/blog/leave-in-products.webp";
import blogImg57 from "@/assets/images/hair.pinns_1773039624_3848857785019133819_2244281067.avif";
import blogImg58 from "@/assets/images/Juuce-064.webp";
import blogImg59 from "@/assets/images/Juuce-120.webp";
import blogImg60 from "@/assets/images/hair.pinns_1765702800_3787312369484614778_2244281067.avif";


// Slim blog listing dataset extracted from blogPosts.ts

export interface BlogSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  archived?: boolean;
  redirectTo?: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
}

export const blogSummaries: BlogSummary[] = [
  {
    slug: 'best-hair-products-australia-2025',
    title: "Best Hair Products Australia 2025: Jena's Top Picks",
    excerpt: "Jena's top hair care picks for 2025. From bond repair to frizz control, these are the best hair products in Australia, shipped nationwide.",
    category: 'Products',
    date: 'February 25, 2025',
    readTime: '6 min read',
    image: blogImg01,
    author: 'Jena Pinn',
  },
  {
    slug: 'where-to-buy-salon-hair-products-australia',
    title: 'Where to Buy Salon Hair Products in Australia',
    excerpt: "Looking for professional hair care you can trust? Here's your guide to buying professional hair products in Australia, shipped Australia-wide.",
    category: 'Products',
    date: 'February 25, 2025',
    readTime: '4 min read',
    image: blogImg02,
    author: 'Jena Pinn',
  },
  {
    slug: 'hair-products-melbourne-brisbane-perth-australia',
    title: 'Hair Products Melbourne, Brisbane & Perth: Salon Hair Care Australia-Wide',
    excerpt: 'Where to buy professional hair products in Melbourne, Brisbane, Perth and across Australia. Hair Pinns ships hair care to every state and territory. Free shipping over $150.',
    category: 'Products',
    date: 'February 25, 2025',
    readTime: '4 min read',
    image: blogImg03,
    author: 'Jena Pinn',
  },
  {
    slug: 'salon-vs-supermarket-hair-products',
    title: 'Supermarket VS Salon Hair Products',
    excerpt: "We've all grabbed a $6 shampoo thinking we scored a bargain. But what if that 'cheap' product might be costing you more in the long run? Here's why salon hair products in Australia are the smarter choice.",
    category: 'Products',
    date: 'April 20, 2025',
    readTime: '5 min read',
    image: blogImg04,
    author: 'Jena Pinn',
  },
  {
    slug: 'what-is-an-infrared-sauna',
    title: "What is an 'Infrared Sauna'?",
    excerpt: "If you haven't experienced the magic of infrared heat and color therapy combined… you're seriously missing out.",
    category: 'Wellness',
    date: 'April 11, 2025',
    readTime: '4 min read',
    image: blogImg05,
    author: 'Jena Pinn',
  },
  {
    slug: 'prevent-heat-damage-on-your-hair',
    title: 'Do you Know how to Prevent Heat Damage on your Hair?',
    excerpt: "We all love a good styling session, but if you're not protecting your hair from heat, humidity, and environmental stressors, you're setting yourself up for dryness, breakage, and dull strands.",
    category: 'Hair Care',
    date: 'March 25, 2025',
    readTime: '6 min read',
    image: blogImg06,
    author: 'Jena Pinn',
  },
  {
    slug: 'say-goodbye-to-frizzy-hair-march-2025',
    title: 'Say Goodbye to Frizzy Hair for Good? (March Edition)',
    excerpt: 'Learn about our Straight Up treatment - all-natural straightening without harsh chemicals.',
    category: 'Treatments',
    date: 'March 21, 2025',
    readTime: '4 min read',
    image: blogImg07,
    author: 'Jena Pinn',
  },
  {
    slug: 'whats-a-straight-up-smoothing-treatment',
    title: "What's a Straight Up Smoothing Treatment?",
    excerpt: 'Smooth, soft, frizz-free hair with QIQI Vega — a hair-friendly smoothing system with no harsh chemicals, no downtime, and results that last up to 6 months.',
    category: 'Treatments',
    date: 'September 02, 2025',
    readTime: '5 min read',
    image: blogImg08,
    author: 'Jena Pinn',
  },
  {
    slug: 'how-often-should-you-replace-your-shampoo',
    title: 'How Often Should You Replace Your Shampoo?',
    excerpt: 'Understanding shampoo longevity helps you plan ahead and keeps your hair clean and healthy without wasting product or money.',
    category: 'Education',
    date: 'September 01, 2025',
    readTime: '3 min read',
    image: blogImg09,
    author: 'Jena Pinn',
  },
  {
    slug: '5-ways-infrared-sauna-boosts-hair-skin-glow',
    title: '5 Ways Infrared Sauna Sessions Boost Your Hair, Skin & Overall Glow',
    excerpt: "In today's fast paced world, stress, pollution, and product buildup can leave your strands dull. Our infrared sauna experience works from the inside out.",
    category: 'Wellness',
    date: 'August 12, 2025',
    readTime: '5 min read',
    image: blogImg10,
    author: 'Jena Pinn',
  },
  {
    slug: 'the-secret-behind-that-steamy-towel-moment',
    title: 'The Secret Behind That Steamy Towel Moment 🔥💆',
    excerpt: "Why hot towel treatments deserve a spot in your hair routine. Beyond the spa-like feels, there's real hair and scalp science happening.",
    category: 'Treatments',
    date: 'August 04, 2025',
    readTime: '4 min read',
    image: blogImg11,
    author: 'Jena Pinn',
  },
  {
    slug: 'qiqi-bare-repair-oil-shine-strength-smoothness',
    title: 'QIQI Bare Repair Oil – Shine, Strength & Smoothness in a Bottle',
    excerpt: "If you're chasing healthier, shinier, frizz-free hair without that heavy, greasy feel, QIQI Bare Repair Oil is the answer.",
    category: 'Products',
    date: 'July 27, 2025',
    readTime: '3 min read',
    image: blogImg12,
    author: 'Jena Pinn',
  },
  {
    slug: 'smooth-seal-strengthen-pure-precious-ends',
    title: '💧Smooth, Seal & Strengthen: Why Your Ends Need Pure Precious Ends',
    excerpt: 'If your hair feels dry at the ends, breaks easily, or looks frazzled, Pure Precious Ends is your new secret weapon.',
    category: 'Products',
    date: 'July 26, 2025',
    readTime: '3 min read',
    image: blogImg13,
    author: 'Jena Pinn',
  },
  {
    slug: 'whats-the-best-hairspray-to-use',
    title: "What's the Best Hairspray to Use?",
    excerpt: 'The 3 Types of Hair Spray We Love at Hair Pinns - delivering results without compromising hair health.',
    category: 'Products',
    date: 'July 13, 2025',
    readTime: '5 min read',
    image: blogImg14,
    author: 'Jena Pinn',
  },
  {
    slug: 'why-wet-brush-is-a-must-have',
    title: '💖 Why a Wet Brush Is a Must-Have in Every Hair Routine',
    excerpt: "Did you know your hair is at its most fragile when it's wet? That's why the right brush matters.",
    category: 'Products',
    date: 'July 13, 2025',
    readTime: '3 min read',
    image: blogImg15,
    author: 'Jena Pinn',
  },
  {
    slug: 'qiqi-vega-vs-nanoplasty-whats-the-difference',
    title: "QIQI Vega vs Nanoplasty: What's the Difference?",
    excerpt: "If you're looking for smoother, frizz-free hair that lasts, learn the key differences between QIQI Vega and nanoplasty treatments.",
    category: 'Treatments',
    date: 'June 12, 2025',
    readTime: '7 min read',
    image: blogImg16,
    author: 'Jena Pinn',
  },
  {
    slug: 'quench-your-hairs-thirst-hydration-bundle',
    title: "Quench Your Hair's Thirst This Winter with Our Hydration Bundle",
    excerpt: "Dry, dull, or brittle hair? It might be dehydrated. Transform thirsty strands with our Hydration Bundle featuring Juuce's moisture-rich must-haves.",
    category: 'Products',
    date: 'June 11, 2025',
    readTime: '4 min read',
    image: blogImg17,
    author: 'Jena Pinn',
  },
  {
    slug: 'pure-walnut-scrub-scalp-detox',
    title: "Pure Walnut Scrub – The Scalp Detox You Didn't Know You Needed",
    excerpt: 'When was the last time you gave your scalp a proper detox? Meet the Pure Walnut Scrub Hair & Scalp Pre-Wash Treatment.',
    category: 'Products',
    date: 'June 11, 2025',
    readTime: '3 min read',
    image: blogImg18,
    author: 'Jena Pinn',
  },
  {
    slug: 'truth-about-shampoo-after-straight-up-treatment',
    title: 'The Truth About Shampoo After Straight Up Treatment',
    excerpt: "As a stylist, I want my clients to get the best results from their QIQI Straight Up Treatment. Here's what you really need to know about aftercare.",
    category: 'Treatments',
    date: 'May 25, 2025',
    readTime: '5 min read',
    image: blogImg19,
    author: 'Jena Pinn',
  },
  {
    slug: 'winter-weather-hair-care-sydney',
    title: 'Winter Weather Hair Care in Sydney – Why It Matters & How to Protect Your Hair',
    excerpt: 'As chilly winds and heavy rains roll into Sydney, learn how to keep your hair healthy, hydrated, and fabulous all season long.',
    category: 'Seasonal',
    date: 'May 22, 2025',
    readTime: '6 min read',
    image: blogImg20,
    author: 'Jena Pinn',
  },
  {
    slug: 'what-is-lamellar-vitality-technology',
    title: 'What is Lamellar Vitality Technology?',
    excerpt: "See how cutting-edge lamellar technology that's changing hair care with ultra-lightweight, targeted repair and instant shine.",
    category: 'Education',
    date: 'May 20, 2025',
    readTime: '5 min read',
    image: blogImg21,
    author: 'Jena Pinn',
  },
  {
    slug: 'why-heat-protection-is-essential',
    title: '🔥 Why Heat Protection Is Essential for Healthy Hair',
    excerpt: "If you love your hair tools, then heat protectant needs to be your hair's best friend. Learn how to shield your strands from damage.",
    category: 'Education',
    date: 'May 18, 2025',
    readTime: '5 min read',
    image: blogImg22,
    author: 'Jena Pinn',
  },
  {
    slug: 'your-hair-deserves-the-best-wet-brush',
    title: 'Your Hair Deserves the BEST!',
    excerpt: 'Why you need the right hair brush and why we love Wet Brush Detanglers. Your choice of brush can completely change your hair health.',
    category: 'Products',
    date: 'May 09, 2025',
    readTime: '3 min read',
    image: blogImg23,
    author: 'Jena Pinn',
  },
  {
    slug: 'which-juuce-range-is-best-for-you-quiz',
    title: 'Which range is best for you?',
    excerpt: 'QUIZ: Which Juuce Shampoo & Conditioner Duo is Right for You? Your dream hair is one quiz away. Answer 7 quick questions to find your perfect match.',
    category: 'Education',
    date: 'April 20, 2025',
    readTime: '5 min read',
    image: blogImg24,
    author: 'Jena Pinn',
  },
  {
    slug: 'infrared-sauna-for-hair-scalp-health',
    title: "Infrared Sauna for Hair & Scalp Health. Yes, It's a Thing!",
    excerpt: 'At Hair Pinns, we combine luxury with wellness. See how infrared sauna sessions can work wonders for your hair and scalp health.',
    category: 'Wellness',
    date: 'April 20, 2025',
    readTime: '4 min read',
    image: blogImg25,
    author: 'Jena Pinn',
  },
  {
    slug: 'sutherland-shire-hair-salon-guide',
    title: 'The Sutherland Shire Hair Salon Guide: What to Look For',
    excerpt: "How to pick a Sutherland Shire hair salon that actually listens. A stylist's honest guide to colour, cuts, smoothing, and what makes a great local salon.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '8 min read',
    image: blogImg26,
    author: 'Jena Pinn',
  },
  {
    slug: 'keratin-smoothing-sydney-prices-brands',
    title: 'Keratin Smoothing Sydney: Prices, Brands & What You Actually Get',
    excerpt: "A stylist's honest breakdown of keratin smoothing in Sydney — what you pay, what brands work, and the difference between Straight Up, QIQI Vega, and Nanoplasty.",
    category: 'Treatments',
    date: 'April 19, 2026',
    readTime: '10 min read',
    image: blogImg27,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-menai',
    title: 'Best Hair Salon Near Menai: What the Locals Say',
    excerpt: "Looking for a hair salon near Menai? Here's what locals actually value — and why Hair Pinns in Bangor is the short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '5 min read',
    image: blogImg28,
    author: 'Jena Pinn',
  },
  {
    slug: 'hair-extensions-bangor',
    title: 'Hair Extensions in Bangor: Salon-Grade vs DIY Clip-Ins',
    excerpt: "Thinking about hair extensions in Bangor? Here's an honest breakdown of tape-ins, clip-ins, and ponytail extensions — what works, what doesn't, and where to shop.",
    category: 'Products',
    date: 'April 19, 2026',
    readTime: '6 min read',
    image: blogImg29,
    author: 'Jena Pinn',
  },
  {
    slug: 'juuce-vs-pure-organic-shampoo',
    title: 'Juuce vs Pure Organic Shampoo: Which Is Right for Your Hair?',
    excerpt: "A stylist's honest comparison of Juuce and Pure Organic shampoos — ingredients, performance, price, and which one actually suits your hair type.",
    category: 'Products',
    date: 'April 19, 2026',
    readTime: '8 min read',
    image: blogImg30,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-shampoo-colour-treated-hair-australia',
    title: 'Best Shampoo for Colour-Treated Hair in Australia (2026 Guide)',
    excerpt: "A stylist's guide to the best shampoos for colour-treated hair in Australia — what actually keeps colour vibrant, what strips it, and what to buy.",
    category: 'Products',
    date: 'April 19, 2026',
    readTime: '9 min read',
    image: blogImg31,
    author: 'Jena Pinn',
  },
  {
    slug: 'sulfate-free-shampoo-australia',
    title: 'The Best Sulfate-Free Shampoos Available in Australia',
    excerpt: 'What sulfate-free really means, why it matters for coloured, curly, or sensitive-scalp hair, and the best options shipped Australia-wide.',
    category: 'Products',
    date: 'April 19, 2026',
    readTime: '7 min read',
    image: blogImg32,
    author: 'Jena Pinn',
  },
  {
    slug: 'wet-brush-vs-tangle-teezer',
    title: 'Wet Brush vs Tangle Teezer: Honest Comparison (From a Stylist)',
    excerpt: "Wet Brush vs Tangle Teezer — which detangling brush is actually worth it? An honest side-by-side from a stylist who's used both for a decade.",
    category: 'Products',
    date: 'April 19, 2026',
    readTime: '5 min read',
    image: blogImg33,
    author: 'Jena Pinn',
  },
  {
    slug: 'keratin-vs-brazilian-blowout-vs-straight-up',
    title: 'Keratin vs Brazilian Blowout vs Straight Up: Which One?',
    excerpt: 'The three main smoothing treatments explained — true keratin, Brazilian blowout, and amino-acid Straight Up Smoothing. Which fits your hair and budget?',
    category: 'Treatments',
    date: 'April 19, 2026',
    readTime: '8 min read',
    image: blogImg34,
    author: 'Jena Pinn',
  },
  {
    slug: 'how-often-should-you-wash-your-hair',
    title: 'How Often Should You Wash Your Hair? (By Hair Type)',
    excerpt: "A stylist's direct answer to how often you should wash your hair, broken down by hair type, scalp condition, and lifestyle.",
    category: 'Education',
    date: 'April 19, 2026',
    readTime: '5 min read',
    image: blogImg35,
    author: 'Jena Pinn',
  },
  {
    slug: 'how-long-does-keratin-smoothing-last',
    title: 'How Long Does Keratin Smoothing Actually Last?',
    excerpt: 'A direct answer to how long keratin smoothing lasts — by treatment type, aftercare, and the single biggest factor that determines whether you get 4 weeks or 12.',
    category: 'Treatments',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg36,
    author: 'Jena Pinn',
  },
  {
    slug: 'how-much-full-head-foils-cost-sydney',
    title: 'How Much Does a Full Head of Foils Cost in Sydney?',
    excerpt: "Straight answers on the real price range for full head foils across Sydney, what's included, and when to expect extras.",
    category: 'Colour',
    date: 'April 19, 2026',
    readTime: '5 min read',
    image: blogImg37,
    author: 'Jena Pinn',
  },
  {
    slug: 'can-you-use-purple-shampoo-every-day',
    title: 'Can You Use Purple Shampoo Every Day? What Stylists Say',
    excerpt: 'A straight answer on whether daily purple shampoo use is safe, the overuse warning signs, and how often you actually need it.',
    category: 'Education',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg38,
    author: 'Jena Pinn',
  },
  {
    slug: 'when-should-you-get-a-haircut',
    title: "When Should You Get a Haircut? Signs You're Overdue",
    excerpt: "A stylist's guide to the five clear signs you're overdue for a haircut, and how often different lengths and hair types actually need trims.",
    category: 'Education',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg39,
    author: 'Jena Pinn',
  },
  {
    slug: 'meet-jena-15-years-sutherland-shire',
    title: 'Meet Jena: 20+ Years Behind the Chair in Sutherland Shire',
    excerpt: 'Jena Pinn, founder of Hair Pinns Bangor, shares her 20+ years of hairdressing experience in the Sutherland Shire — her training, her approach, and why she opened her own salon.',
    category: 'About',
    date: 'April 19, 2026',
    readTime: '7 min read',
    image: blogImg40,
    author: 'Jena Pinn',
  },
  {
    slug: 'the-7-colouring-mistakes-i-see-every-week',
    title: 'The 7 Colouring Mistakes I See Every Week (And How to Avoid Them)',
    excerpt: 'After 20+ years behind the chair, these are the seven hair-colouring mistakes I see every week — at-home and at other salons — and exactly how to avoid them.',
    category: 'Colour',
    date: 'April 19, 2026',
    readTime: '9 min read',
    image: blogImg41,
    author: 'Jena Pinn',
  },
  {
    slug: 'home-hair-care-myths-stylist-wishes-youd-stop',
    title: "Home Hair Care Myths a Stylist Wishes You'd Stop Believing",
    excerpt: 'After 20+ years in the salon, these are the home hair care myths I hear most often — and what actually works instead.',
    category: 'Education',
    date: 'April 19, 2026',
    readTime: '6 min read',
    image: blogImg42,
    author: 'Jena Pinn',
  },
  {
    slug: 'how-to-recover-hair-from-box-dye-damage',
    title: 'How to Recover Hair From Box Dye Damage',
    excerpt: "A stylist's honest guide to recovering hair from box dye damage — what the process actually looks like, how long it takes, and how much it costs in the Sutherland Shire.",
    category: 'Colour',
    date: 'April 19, 2026',
    readTime: '9 min read',
    image: blogImg43,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-bangor',
    title: 'The Best Hair Salon in Bangor: Meet Hair Pinns',
    excerpt: 'Hair Pinns is the hair salon in Bangor in the Sutherland Shire — 20+ years of local stylist experience, honest pricing, free parking, and a team that knows your hair history.',
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '5 min read',
    image: blogImg44,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-illawong',
    title: 'Best Hair Salon Near Illawong: What the Locals Say',
    excerpt: "Looking for a hair salon near Illawong? Here's what Illawong locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg45,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-sutherland',
    title: 'Best Hair Salon Near Sutherland: What the Locals Say',
    excerpt: "Looking for a hair salon near Sutherland? Here's what Sutherland locals value in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg46,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-cronulla',
    title: 'Best Hair Salon Near Cronulla: What the Locals Say',
    excerpt: "Looking for a hair salon near Cronulla? Here's what Cronulla locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg47,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-como',
    title: 'Best Hair Salon Near Como: What the Locals Say',
    excerpt: "Looking for a hair salon near Como? Here's what Como locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg48,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-miranda',
    title: 'Best Hair Salon Near Miranda: What the Locals Say',
    excerpt: "Looking for a hair salon near Miranda? Here's what Miranda locals look for in a family-friendly salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg49,
    author: 'Jena Pinn',
  },
  {
    slug: 'best-hair-salon-near-engadine',
    title: 'Best Hair Salon Near Engadine: What the Locals Say',
    excerpt: "Looking for a hair salon near Engadine? Here's what Engadine locals look for in a salon, and why Hair Pinns in Bangor is a short drive worth making.",
    category: 'Local',
    date: 'April 19, 2026',
    readTime: '4 min read',
    image: blogImg50,
    author: 'Jena Pinn',
  },
  {
    slug: 'summer-hair-care-australia-beach-sun-salt',
    title: 'Summer Hair Care in Australia: Beach, Sun, Salt Guide',
    excerpt: "A stylist's complete guide to summer hair care in Australia — how to protect your hair from sun, salt, chlorine, and humidity, and the products that actually work.",
    category: 'Seasonal',
    date: 'April 19, 2026',
    readTime: '7 min read',
    image: blogImg51,
    author: 'Jena Pinn',
  },
  {
    slug: 'winter-hair-care-sydney-2026',
    title: 'Winter Hair Care for Sydney Weather (2026 Guide)',
    excerpt: "A stylist's guide to winter hair care in Sydney — dealing with dry heat, wind, cold rain, and the specific problems Sydney winter causes for coloured and treated hair.",
    category: 'Seasonal',
    date: 'April 19, 2026',
    readTime: '6 min read',
    image: blogImg52,
    author: 'Jena Pinn',
  },
  {
    slug: 'school-formal-hair-trends-2026',
    title: "School Formal Hair Trends 2026: What's In and How to Book",
    excerpt: "A stylist's guide to 2026 school formal hair trends — what's in, what photographs well, how to prep, and when to book so you're not disappointed.",
    category: 'Seasonal',
    date: 'April 19, 2026',
    readTime: '6 min read',
    image: blogImg53,
    author: 'Jena Pinn',
  },
  {
    slug: 'christmas-hair-gifts-2026',
    title: 'Christmas Hair Care Gift Guide 2026',
    excerpt: "A stylist's Christmas gift guide for anyone who loves their hair — from $30 stocking fillers to premium bundles, shipped Australia-wide with free shipping over $150.",
    category: 'Seasonal',
    date: 'April 19, 2026',
    readTime: '5 min read',
    image: blogImg54,
    author: 'Jena Pinn',
  },
  {
    slug: 'beating-frizz-sydney-humidity',
    title: "Beating Frizz in Sydney Humidity: A Stylist's Complete Guide",
    excerpt: "A stylist's complete guide to beating frizz in Sydney humidity — why it happens, what actually works, and the salon treatments that give you months of smooth hair.",
    category: 'Seasonal',
    date: 'April 19, 2026',
    readTime: '7 min read',
    image: blogImg55,
    author: 'Jena Pinn',
  },
  {
    slug: 'when-do-i-use-a-leave-in-conditioner',
    title: "When Do I Use a Leave-In Conditioner? A Stylist's Honest Guide",
    excerpt: "A stylist's honest guide to when you should use a leave-in conditioner, how often, and which one suits your hair type — plus the leave-in mistakes most people make.",
    category: 'Education',
    date: 'May 14, 2026',
    readTime: '5 min read',
    image: blogImg56,
    author: 'Jena Pinn',
  },
  {
    slug: 'salon-foils-vs-box-dye-highlights-at-home',
    title: 'Salon Foils vs Box Dye Highlights: Honest Talk From Someone Who Fixes Them',
    excerpt: "Box-dye highlight kits look like a $30 shortcut. After 20 years of cleaning them up, here's what I actually think you're saving and what you're risking.",
    category: 'Colour',
    date: 'May 5, 2026',
    readTime: '6 min read',
    image: blogImg57,
    author: 'Jena Pinn',
  },
  {
    slug: 'olaplex-vs-k18-vs-juuce-bond-repair',
    title: "Olaplex vs K18 vs Juuce Bond Repair: What's Actually In The Bottle",
    excerpt: "Three big bond repair brands, three different science stories. Twenty years of salon experience and four hundred client trials later, here's which one I actually keep on my shelf and why.",
    category: 'Products',
    date: 'May 6, 2026',
    readTime: '7 min read',
    image: blogImg58,
    author: 'Jena Pinn',
  },
  {
    slug: 'bond-repair-vs-protein-treatment-difference',
    title: "Bond Repair vs Protein Treatment: They Don't Do The Same Job",
    excerpt: "Half my client consultations start with 'I've been doing protein treatments and my hair is getting worse, why?' Because protein treatments and bond repair fix different things. Here's how to know which one your hair actually needs.",
    category: 'Treatments',
    date: 'May 8, 2026',
    readTime: '5 min read',
    image: blogImg59,
    author: 'Jena Pinn',
  },
  {
    slug: 'permanent-vs-semi-permanent-vs-demi-permanent-vs-gloss',
    title: 'Permanent vs Semi-Permanent vs Demi-Permanent vs Gloss: A Plain English Guide',
    excerpt: "Colour terminology is a mess. Four different types of colour, all do different jobs, all last different amounts of time. Here's the plain English version so you know what you're actually booking.",
    category: 'Colour',
    date: 'May 12, 2026',
    readTime: '5 min read',
    image: blogImg60,
    author: 'Jena Pinn',
  },
];

export const blogPosts = blogSummaries;