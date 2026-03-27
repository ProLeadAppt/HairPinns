/**
 * Collection-specific FAQs for AEO (Answer Engine Optimization)
 * Maps collection handles to FAQ arrays for schema and content
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/** Fallback FAQs for collections without specific mapping */
const FALLBACK_FAQS: FAQItem[] = [
  {
    question: "Where can I buy salon hair products in Australia?",
    answer: "Hair Pinns ships professional hair care Australia-wide. Free shipping over $150. Picked by Jena since 2009. Shop Juuce, QIQI, Pure, Wet Brush and more.",
  },
  {
    question: "Does Hair Pinns ship to Melbourne, Brisbane and Perth?",
    answer: "Yes. Hair Pinns ships to Melbourne, Brisbane, Perth, Sydney, and all of Australia. Free shipping on orders over $150. Every state and territory.",
  },
];

/** Collection handle to FAQs mapping */
const COLLECTION_FAQS: Record<string, FAQItem[]> = {
  juuce: [
    { question: "What is Juuce hair care?", answer: "Juuce is a professional Australian hair care brand offering professional-grade shampoos, conditioners, treatments, and styling products. Hair Pinns stocks the full Juuce range and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Juuce in Australia?", answer: "Hair Pinns stocks Juuce hair care and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009. Shop the Juuce range at hairpinns.com." },
    { question: "Is Juuce available in Melbourne and Brisbane?", answer: "Yes. Hair Pinns ships Juuce to Melbourne, Brisbane, Perth, Sydney, and all of Australia. Free shipping on orders over $150." },
  ],
  "juuce-hair-care": [
    { question: "What is Juuce hair care?", answer: "Juuce is a professional Australian hair care brand offering professional-grade shampoos, conditioners, treatments, and styling products. Hair Pinns stocks the full Juuce range and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Juuce in Australia?", answer: "Hair Pinns stocks Juuce hair care and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009. Shop the Juuce range at hairpinns.com." },
  ],
  pure: [
    { question: "What is Pure hair care?", answer: "Pure is a certified organic hair care brand offering eco-friendly, high-performance shampoos, conditioners, and treatments. Hair Pinns stocks the Pure range and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Pure organic hair care in Australia?", answer: "Hair Pinns stocks Pure certified organic hair care and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009." },
    { question: "Does Pure ship to Sydney and Melbourne?", answer: "Yes. Hair Pinns ships Pure hair care to Sydney, Melbourne, Brisbane, Perth, and all of Australia. Free shipping on orders over $150." },
  ],
  "pure-organic": [
    { question: "What is Pure organic hair care?", answer: "Pure is a certified organic hair care brand offering eco-friendly, high-performance shampoos, conditioners, and treatments. Hair Pinns stocks the Pure range and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Pure in Australia?", answer: "Hair Pinns stocks Pure certified organic hair care and ships Australia-wide. Free shipping over $150. Shop at hairpinns.com." },
  ],
  "pure-certified-organic-hair-care": [
    { question: "What is Pure certified organic hair care?", answer: "Pure is a certified organic hair care brand offering eco-friendly, high-performance formulas. Hair Pinns stocks the Pure range and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Pure organic hair care in Australia?", answer: "Hair Pinns stocks Pure certified organic hair care and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009." },
  ],
  qiqi: [
    { question: "What is QIQI hair care?", answer: "QIQI is a professional hair care brand offering professional products including treatments, oils, and styling products. Hair Pinns stocks QIQI and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy QIQI in Australia?", answer: "Hair Pinns stocks QIQI professional hair care and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009." },
    { question: "Does QIQI ship to Brisbane and Perth?", answer: "Yes. Hair Pinns ships QIQI to Brisbane, Perth, Melbourne, Sydney, and all of Australia. Free shipping on orders over $150." },
  ],
  "wet-brush-detanglers": [
    { question: "What is Wet Brush?", answer: "Wet Brush is a popular detangling brush brand designed to gently detangle wet or dry hair without breakage. Hair Pinns stocks Wet Brush detanglers and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Wet Brush in Australia?", answer: "Hair Pinns stocks Wet Brush detanglers and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009." },
  ],
  "wet-brush": [
    { question: "What is Wet Brush?", answer: "Wet Brush is a popular detangling brush brand designed to gently detangle wet or dry hair without breakage. Hair Pinns stocks Wet Brush and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Wet Brush in Australia?", answer: "Hair Pinns stocks Wet Brush detanglers and ships Australia-wide. Free shipping over $150. Shop at hairpinns.com." },
  ],
  aromaganic: [
    { question: "What is Aromaganic hair care?", answer: "Aromaganic is a professional hair care range offering colour care, treatments, and styling products. Hair Pinns stocks Aromaganic and ships Australia-wide with free shipping over $150." },
    { question: "Where can I buy Aromaganic in Australia?", answer: "Hair Pinns stocks Aromaganic hair care and ships Australia-wide. Free shipping over $150. Picked by Jena since 2009." },
  ],
  gift: [
    { question: "Where can I buy hair care gift packs in Australia?", answer: "Hair Pinns offers hair care gift packs from Juuce and Pure. Shipped Australia-wide with free shipping over $150. Perfect for gifts across Australia." },
    { question: "Do Hair Pinns gift packs ship to Melbourne and Brisbane?", answer: "Yes. Hair Pinns ships gift packs to Melbourne, Brisbane, Perth, Sydney, and all of Australia. Free shipping on orders over $150." },
  ],
  "gift-packs": [
    { question: "Where can I buy hair care gift packs in Australia?", answer: "Hair Pinns offers hair care gift packs from Juuce and Pure. Shipped Australia-wide with free shipping over $150. Perfect for gifts across Australia." },
    { question: "Do Hair Pinns gift packs ship Australia-wide?", answer: "Yes. Hair Pinns ships gift packs to every state and territory. Free shipping on orders over $150." },
  ],
};

/**
 * Get FAQs for a collection by handle
 * Returns collection-specific FAQs or fallback
 */
export function getCollectionFAQs(collectionHandle: string | undefined): FAQItem[] {
  if (!collectionHandle) return FALLBACK_FAQS;
  const normalized = collectionHandle.toLowerCase().trim();
  return COLLECTION_FAQS[normalized] ?? FALLBACK_FAQS;
}
