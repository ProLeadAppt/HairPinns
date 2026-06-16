/**
 * Hair-care glossary — plain-English definitions targeting "what is X"
 * search queries and AI Overviews. Each entry powers the /glossary page
 * AND a DefinedTerm schema entry under DefinedTermSet JSON-LD.
 *
 * Keep definitions:
 *  - 1–3 sentences
 *  - Plain English, no jargon-on-jargon
 *  - First answer in first sentence (AI Overviews truncate at 1–2 sentences)
 *  - Honest about trade-offs (Jena's voice — no marketing fluff)
 */

export interface GlossaryTerm {
  /** Slug-safe id for in-page anchor (also the schema @id) */
  id: string;
  /** Display term as a user would search for it */
  term: string;
  /** 1–3 sentence definition */
  definition: string;
  /** Optional internal link this term should cross-reference */
  link?: { label: string; href: string };
  /** Topic group for visual grouping on the page */
  category: "treatments" | "colour" | "products" | "techniques" | "care";
}

export const glossary: GlossaryTerm[] = [
  // --- Treatments ---
  {
    id: "keratin-treatment",
    term: "Keratin treatment",
    definition:
      "A salon treatment that uses keratin protein and heat to seal the hair cuticle, reducing frizz and cutting blow-dry time. Results last 8–12 weeks with sulphate-free aftercare. Formaldehyde-free formulas are the safe standard in Australia.",
    link: { label: "Keratin smoothing in Sydney", href: "/blog/keratin-smoothing-sydney-prices-brands" },
    category: "treatments",
  },
  {
    id: "straight-up-smoothing",
    term: "Straight Up Smoothing",
    definition:
      "A natural, formaldehyde-free amino-acid smoothing treatment that reduces frizz by up to 90% without flattening movement. Holds 8–12 weeks. Suits hair that wants smoothness but not stick-straight.",
    link: { label: "Straight Up Smoothing service", href: "/services/smoothing/mid-length-straight-up-smoothing" },
    category: "treatments",
  },
  {
    id: "nanoplasty",
    term: "Nanoplasty",
    definition:
      "A molecular smoothing and restoration treatment that uses smaller protein molecules to penetrate the hair shaft. Longer-lasting (up to 5 months) and stronger on damaged hair than standard smoothing, but takes 3–4 hours and costs more.",
    category: "treatments",
  },
  {
    id: "bond-repair",
    term: "Bond repair treatment",
    definition:
      "A salon or at-home treatment that rebuilds the disulphide bonds in hair broken by bleach, colour, or heat. Olaplex is the best-known brand; Juuce Bond Repair is the in-salon favourite at Hair Pinns. Used as a standalone or layered into colour services.",
    link: { label: "Juuce Bond Repair", href: "/collections/juuce-botanicals" },
    category: "treatments",
  },
  {
    id: "lamellar-treatment",
    term: "Lamellar treatment",
    definition:
      "A fast in-shower treatment that coats the hair cuticle with a thin lamellar layer of conditioning agents, giving instant smoothness and shine. Pure Lamellar Vitality is Jena's top pick for damaged or chemically-treated hair.",
    link: { label: "Pure Lamellar Vitality range", href: "/collections/pure-certified-organic-hair-care" },
    category: "treatments",
  },
  {
    id: "scalp-detox",
    term: "Scalp detox",
    definition:
      "A clarifying scalp treatment that removes product build-up, hard-water minerals and excess sebum. Booked every 6–12 weeks depending on hair routine. Useful before colour services so colour deposits evenly.",
    category: "treatments",
  },

  // --- Colour ---
  {
    id: "foils",
    term: "Foils (highlights)",
    definition:
      "A colouring technique that uses aluminium foil to isolate strands of hair while colour processes, giving brighter, more defined lightening with sharper contrast. Better for high-contrast looks and faster colour lift than freehand painting techniques.",
    link: { label: "Foil packages at Hair Pinns", href: "/services/foil-packages/full-head-foils-package" },
    category: "colour",
  },
  {
    id: "toner",
    term: "Toner",
    definition:
      "A semi-permanent colour service that neutralises unwanted tones in lightened hair — pulling out brass, warmth or yellow. Lasts 4–8 weeks; needed every 6–8 weeks to keep blondes cool.",
    category: "colour",
  },
  {
    id: "glaze",
    term: "Glaze",
    definition:
      "A clear or tinted shine treatment that seals the cuticle and refreshes colour vibrancy. Similar to a toner but more about shine than tone correction. Lasts 2–4 weeks.",
    category: "colour",
  },
  {
    id: "colour-correction",
    term: "Colour correction",
    definition:
      "Specialist multi-step service to fix unwanted colour outcomes — box-dye disasters, brassy blonde, banded foils, uneven regrowth. Often takes 2–3 sessions because doing it safely matters more than doing it fast.",
    category: "colour",
  },
  {
    id: "brassiness",
    term: "Brassiness",
    definition:
      "Unwanted warm orange or yellow tones in lightened hair, caused by sun, mineral-rich water, oxidation, and time. Counteracted with purple shampoo at home and a salon toner every 6–8 weeks.",
    category: "colour",
  },

  // --- Products ---
  {
    id: "sulfate-free",
    term: "Sulphate-free shampoo",
    definition:
      "Shampoo formulated without sodium lauryl sulphate or sodium laureth sulphate — the harsh detergents that strip colour and smoothing treatments. Essential after any colour or smoothing service if you want your investment to last.",
    category: "products",
  },
  {
    id: "purple-shampoo",
    term: "Purple shampoo",
    definition:
      "A violet-pigmented shampoo that neutralises yellow and brassy tones in blonde, silver or grey hair. Use 1–2 times a week with a 3–5 minute dwell time. Pure Forever Blonde is our most-recommended.",
    link: { label: "Pure Forever Blonde", href: "/collections/pure-certified-organic-hair-care" },
    category: "products",
  },
  {
    id: "heat-protectant",
    term: "Heat protectant",
    definition:
      "A leave-in spray, cream or oil that creates a thermal barrier between hair and hot tools (blow-dryer, straightener, curling iron). Non-negotiable before any heat styling — Juuce Heat Shield is the salon favourite.",
    link: { label: "Juuce Heat Shield", href: "/collections/juuce-botanicals" },
    category: "products",
  },
  {
    id: "leave-in-conditioner",
    term: "Leave-in conditioner",
    definition:
      "Lightweight conditioning product applied to damp hair and left in (not rinsed out). Adds moisture, controls frizz, and prepares hair for styling. Juuce Botanic Oil Serum is Jena's go-to for finishing.",
    category: "products",
  },
  {
    id: "clarifying-shampoo",
    term: "Clarifying shampoo",
    definition:
      "A deeper-cleaning shampoo that strips build-up from product, oil, chlorine and hard water. Used once every 2–4 weeks, not daily. Don't use it on freshly coloured or smoothed hair — it'll fade the result.",
    category: "products",
  },

  // --- Techniques & Care ---
  {
    id: "hair-porosity",
    term: "Hair porosity",
    definition:
      "How well your hair absorbs and holds moisture. Low porosity hair has a tightly-packed cuticle and resists products; high porosity hair absorbs everything but loses moisture fast. Knowing your porosity helps you choose the right shampoo, mask and oil.",
    category: "techniques",
  },
  {
    id: "hair-texture",
    term: "Hair texture",
    definition:
      "The thickness of a single hair strand — fine, medium or coarse. Different from density (how many strands you have). Fine hair needs lighter products to avoid being weighed down; coarse hair needs richer ones.",
    category: "techniques",
  },
  {
    id: "humidity-resistance",
    term: "Humidity-resistant styling",
    definition:
      "Products and techniques that prevent frizz when moisture in the air swells the hair cuticle. Critical in Sydney summers. The most effective long-term fix is a smoothing treatment; the best short-term fix is a silicone-based anti-humidity spray after styling.",
    category: "care",
  },
  {
    id: "hair-density",
    term: "Hair density",
    definition:
      "How many individual hair strands you have on your scalp — fine, medium or thick. Different from texture (strand thickness). High-density hair needs heavier products and more frequent cuts to remove weight; low-density hair needs volume-friendly formulas.",
    category: "techniques",
  },
  {
    id: "hair-elasticity",
    term: "Hair elasticity",
    definition:
      "How well a single strand stretches and bounces back. Healthy hair stretches about 30% and returns to shape. Low elasticity means the hair is damaged or over-processed and needs protein and moisture rebalancing. Test by gently stretching a wet strand.",
    category: "techniques",
  },
  {
    id: "co-wash",
    term: "Co-wash (conditioner-only washing)",
    definition:
      "Washing hair with a cleansing conditioner instead of shampoo, designed for curly, coily or very dry hair that doesn't tolerate frequent shampooing. Use every second or third wash, not as a permanent shampoo replacement — scalp build-up still needs clearing.",
    category: "care",
  },

  // --- Additional treatments ---
  {
    id: "olaplex",
    term: "Olaplex",
    definition:
      "A widely-known professional bond-repair system (No.3, No.6, No.7, etc.) that repairs the disulphide bonds in hair broken by bleach, colour or heat. Used in-salon during chemical services and as a weekly at-home treatment. Juuce Bond Repair is the in-salon alternative at Hair Pinns.",
    link: { label: "Juuce Bond Repair", href: "/collections/juuce-botanicals" },
    category: "treatments",
  },
  {
    id: "k18",
    term: "K18",
    definition:
      "A leave-in molecular-repair treatment that uses a bioactive peptide to reconnect broken polypeptide chains inside the hair. Used as a 4-minute mask after every chemical service. Strong on damaged, over-processed hair — comparable in goal to Olaplex but a different chemistry.",
    category: "treatments",
  },
  {
    id: "hair-botox",
    term: "Hair botox",
    definition:
      "A misleading marketing name — there's no actual botox in it. It's a deep conditioning and filler treatment that smooths and plumps damaged hair with proteins, peptides and emollients. Lasts 4–8 weeks. Less smoothing than keratin, more conditioning.",
    category: "treatments",
  },
  {
    id: "brazilian-blowout",
    term: "Brazilian Blowout",
    definition:
      "A smoothing system that uses a polymer-based formula to seal the cuticle and reduce frizz. Faster than traditional keratin (about 90 minutes) but historically contained formaldehyde. Formaldehyde-free versions exist in Australia. Lasts 8–12 weeks.",
    category: "treatments",
  },

  // --- Additional colour ---
  {
    id: "semi-permanent",
    term: "Semi-permanent colour",
    definition:
      "Colour that coats the outside of the hair shaft and washes out in 4–8 shampoos. Doesn't lift natural colour or contain ammonia. Good for refreshing tones, adding shine, or trying a colour without commitment.",
    category: "colour",
  },
  {
    id: "demi-permanent",
    term: "Demi-permanent colour",
    definition:
      "Sits between semi and permanent — uses low-volume developer (no ammonia) and lasts 12–24 washes. Won't lift natural colour but deposits tone evenly. Ideal for blending greys, tone correction, and gloss services.",
    category: "colour",
  },
  {
    id: "permanent-colour",
    term: "Permanent colour",
    definition:
      "Uses ammonia and developer to open the cuticle, lift natural colour, and deposit new colour molecules. Lasts until it grows out — regrowth needs touching up every 4–8 weeks. The only option that can lighten dark natural hair.",
    category: "colour",
  },
  {
    id: "babylights",
    term: "Babylights",
    definition:
      "Very fine, delicately-placed foils that mimic the soft natural highlights you'd see on a child's hair. More time-consuming than standard foils, but the effect is subtle, dimensional, and grows out beautifully.",
    category: "colour",
  },
  {
    id: "money-piece",
    term: "Money piece",
    definition:
      "A face-framing highlight technique that lightens the two front sections of hair around the face. Brightens the complexion without committing to full highlights. Can be added to any colour service for an extra dimensional kick.",
    category: "colour",
  },

  // --- Additional care ---
  {
    id: "hard-water-hair",
    term: "Hard water hair damage",
    definition:
      "Mineral build-up from Sydney's hard tap water can leave hair feeling waxy, dull or brassy. A monthly clarifying shampoo plus a chelating treatment after swimming or extended periods of hard-water exposure removes the build-up.",
    category: "care",
  },
  {
    id: "pre-poo",
    term: "Pre-poo treatment",
    definition:
      "Applying an oil or conditioner BEFORE shampooing to protect very dry, coily or chemically-treated hair from being stripped by the wash. Pure Walnut Scrub doubles as a pre-wash scalp treatment that doubles as a pre-poo.",
    link: { label: "Pure Walnut Scrub", href: "/products/walnut-scrub-hair-scalp-pre-wash-treatment" },
    category: "care",
  },
];

export const glossaryByCategory = (cat: GlossaryTerm["category"]): GlossaryTerm[] =>
  glossary.filter((g) => g.category === cat);

export const getGlossaryTerm = (id: string): GlossaryTerm | undefined =>
  glossary.find((g) => g.id === id);
