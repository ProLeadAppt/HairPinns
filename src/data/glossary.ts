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
    id: "balayage",
    term: "Balayage",
    definition:
      "A freehand colouring technique that paints highlights onto the surface of the hair for a soft, sun-kissed effect with no harsh regrowth line. Grows out beautifully over 3–4 months between full services.",
    link: { label: "Balayage in the Sutherland Shire", href: "/blog/balayage-sutherland-shire" },
    category: "colour",
  },
  {
    id: "foils",
    term: "Foils (highlights)",
    definition:
      "A colouring technique that uses aluminium foil to isolate strands of hair while colour processes, giving brighter, more defined lightening than balayage. Better for high-contrast looks and faster colour lift.",
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
];

export const glossaryByCategory = (cat: GlossaryTerm["category"]): GlossaryTerm[] =>
  glossary.filter((g) => g.category === cat);

export const getGlossaryTerm = (id: string): GlossaryTerm | undefined =>
  glossary.find((g) => g.id === id);
