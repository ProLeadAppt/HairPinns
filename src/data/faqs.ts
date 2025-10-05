/**
 * Comprehensive FAQ Database
 * 
 * Reusable across Services, PDP, Collections, and Suburb pages
 * Includes internal links for navigation and SEO
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: 'treatments' | 'colour' | 'care' | 'products' | 'booking' | 'general';
  relatedLinks?: Array<{
    text: string;
    url: string;
  }>;
}

export const comprehensiveFAQs: FAQ[] = [
  {
    id: 'keratin-vs-smoothing',
    question: "What's the difference between keratin and smoothing?",
    answer: "Keratin (formaldehyde-free modern formulas) restructures more deeply and reduces frizz for 2–4 months; smoothing is lighter, ideal for colour-treated or fine hair, lasting 4–8 weeks. Aftercare decides longevity: sulphate-free cleanser, low heat, UV protection, and regular hydration masks. Start with smoothing if you're new or blonde; move to keratin if your hair is coarse or highly porous.",
    category: 'treatments',
    relatedLinks: [
      { text: 'Book Keratin Treatment', url: '/services#smoothing' },
      { text: 'Shop Treatment Products', url: '/collections/treatments' },
    ]
  },
  {
    id: 'smoothing-duration',
    question: "How long do smoothing results last?",
    answer: "Typically 4–8 weeks. Wash less frequently, use heat protectant, and avoid salt/chlorine to maximise life. A silk pillowcase and microfibre towel help keep the cuticle smooth between washes.",
    category: 'treatments',
    relatedLinks: [
      { text: 'View Smoothing Services', url: '/services#smoothing' },
      { text: 'Aftercare Products', url: '/collections/hair-care' },
    ]
  },
  {
    id: 'blonde-care',
    question: "How do I care for blonde hair between toning?",
    answer: "Use a gentle, colour-safe cleanser, hydrate weekly, and apply a violet or blue-violet treatment every 1–2 weeks (short dwell time of 3–5 minutes). If water is mineral-rich (common around the Shire), chelate once a fortnight to keep brass at bay. In-salon glosses every 6–8 weeks will keep the tone fresher for longer.",
    category: 'colour',
    relatedLinks: [
      { text: 'Book Toning Service', url: '/services#colour' },
      { text: 'Shop Hair Care', url: '/collections/hair-care' },
    ]
  },
  {
    id: 'frizz-humidity',
    question: "Why does my hair get frizzy in humid weather?",
    answer: "Humidity swells the hair shaft, causing frizz. Balance moisture with light hold: start with a leave-in conditioner, add heat protectant before styling, then finish with a humidity-resistant spray. Avoid heavy oils that can collapse volume. A keratin-free smoothing treatment works best for Sydney's changeable climate.",
    category: 'care',
    relatedLinks: [
      { text: 'Anti-Frizz Treatments', url: '/services#smoothing' },
      { text: 'Styling Products', url: '/collections/styling' },
    ]
  },
  {
    id: 'colour-routine',
    question: "What's a simple routine for colour-treated hair?",
    answer: "Cleanse 2–3 times per week with sulphate-free shampoo, deep condition with a mask weekly, protect hair with heat and UV products before styling, and finish with a pH-balanced leave-in conditioner. This routine will extend your colour vibrancy and keep hair healthy between appointments.",
    category: 'colour',
    relatedLinks: [
      { text: 'Book Colour Service', url: '/services#colour' },
      { text: 'Treatment Products', url: '/collections/treatments' },
    ]
  },
  {
    id: 'brass-protection',
    question: "Which products protect against brassiness?",
    answer: "Violet/blue-violet treatments (purple shampoo or toning masks), UV filter sprays, and chelating washes used sparingly (once every 2–4 weeks). Choose products labelled 'colour-safe' and avoid over-toning, which can lead to ash buildup. Professional glosses every 6–8 weeks provide the best long-term brass protection.",
    category: 'products',
    relatedLinks: [
      { text: 'Shop Blonde Care', url: '/collections/hair-care' },
      { text: 'Toning Services', url: '/services#colour' },
    ]
  },
  {
    id: 'wash-after-colour',
    question: "Can I wash hair the same day after colour?",
    answer: "Wait 24–48 hours for the cuticle to fully close and the colour to set. When you do wash, use cool water and a gentle, sulphate-free cleanser. Protect from heat styling during the first week to maximize colour longevity.",
    category: 'colour',
    relatedLinks: [
      { text: 'Colour Services', url: '/services#colour' },
      { text: 'Aftercare Products', url: '/collections/hair-care' },
    ]
  },
  {
    id: 'repair-timeline',
    question: "When will I see repair results?",
    answer: "Surface smoothness appears immediately after treatment. Strength and elasticity improvements take 4–6 weeks with consistent care using bond-building treatments, protein masks, and heat protection. Severe damage may require multiple treatments spaced 4–6 weeks apart.",
    category: 'treatments',
    relatedLinks: [
      { text: 'Repair Treatments', url: '/services#smoothing' },
      { text: 'Shop Treatments', url: '/collections/treatments' },
    ]
  },
  {
    id: 'blowout-technique',
    question: "What brush/heat setting for blow-outs?",
    answer: "Use a medium round brush for tension and volume. Start with airflow to dry 80%, then apply brief heat for smoothing. Avoid maximum heat on fine or colour-treated hair—medium heat (150-180°C) is sufficient. Always use heat protectant before blow-drying.",
    category: 'care',
    relatedLinks: [
      { text: 'Book Blow Dry', url: '/services#cuts' },
      { text: 'Heat Protection Products', url: '/collections/styling' },
    ]
  },
  {
    id: 'trim-frequency',
    question: "How often should I trim?",
    answer: "Every 8–12 weeks to prevent split ends from migrating up the hair shaft. If you're growing hair out, trim every 12–16 weeks with 'dusting' (minimal length removal). Regular trims actually help hair grow healthier and longer by preventing breakage.",
    category: 'general',
    relatedLinks: [
      { text: 'Book a Cut', url: '/services#cuts' },
      { text: 'View Services', url: '/services' },
    ]
  },
  {
    id: 'cruelty-free',
    question: "Do you offer cruelty-free options?",
    answer: "Yes—we stock several cruelty-free and vegan product lines. Look for 'cruelty-free certified' badges on product pages, or filter by 'cruelty-free' when shopping collections. Ask Jena during your consultation for personalized cruelty-free recommendations.",
    category: 'products',
    relatedLinks: [
      { text: 'Shop All Products', url: '/collections' },
      { text: 'Book Consultation', url: '/booking' },
    ]
  },
  {
    id: 'click-collect',
    question: "Can I click-and-collect in Bangor?",
    answer: "Yes—choose 'Pick up in-salon' at checkout if enabled, or message us via the contact page to arrange pickup. We'll notify you when your order is ready (usually within 24 hours). Pick up during salon hours at 123 River Road, Bangor.",
    category: 'booking',
    relatedLinks: [
      { text: 'Contact Us', url: '/contact' },
      { text: 'Shop Collections', url: '/collections' },
    ]
  },
];

/**
 * Get FAQs by category
 */
export const getFAQsByCategory = (category: FAQ['category']): FAQ[] => {
  return comprehensiveFAQs.filter((faq) => faq.category === category);
};

/**
 * Get random FAQs for display
 */
export const getRandomFAQs = (count: number = 6): FAQ[] => {
  const shuffled = [...comprehensiveFAQs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get specific FAQs by IDs
 */
export const getFAQsByIds = (ids: string[]): FAQ[] => {
  return comprehensiveFAQs.filter((faq) => ids.includes(faq.id));
};

/**
 * Search FAQs by keyword
 */
export const searchFAQs = (keyword: string): FAQ[] => {
  const lowerKeyword = keyword.toLowerCase();
  return comprehensiveFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(lowerKeyword) ||
      faq.answer.toLowerCase().includes(lowerKeyword)
  );
};

export default comprehensiveFAQs;
