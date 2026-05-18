/**
 * State-by-state shipping landing pages.
 *
 * Each entry powers a /shipping-to/<slug> page targeted at Australian shoppers
 * searching for hair-care delivery to their state. Hair Pinns ships only
 * within Australia and dispatches from Bangor, NSW 2234.
 *
 * Why these pages exist
 * ---------------------
 * Shopify + a generic /policies/shipping page can't compete for state-level
 * intent ("hair products delivered to Melbourne", "salon shampoo Brisbane",
 * "QIQI shipping Perth"). One dedicated landing page per state, each with
 * unique climate hooks, product recommendations, and FAQs, captures that
 * intent at the keyword level and routes it to commercial pages.
 *
 * Editing this file
 * -----------------
 * The `localIntro`, `climateHook`, `productPicks`, `faqs`, and
 * `nearbyDestinations` fields are designed to be hand-edited by Jena.
 * Everything else (postcode ranges, delivery windows, capitals) is shipped
 * with safe defaults. change them only if Australia Post / courier ETAs
 * shift, or if a state's postcode range changes (it won't).
 *
 * Add a new entry by copy-pasting an existing block and updating fields.
 * The build pipeline auto-discovers entries:
 *   - scripts/collect-prerender-routes.js generates /shipping-to/<slug>
 *   - scripts/generate-sitemap.js adds the URL to sitemap.xml
 *   - vite-plugin-prerender snapshots the page HTML for crawlers
 */

export interface ShippingStateData {
  /** URL slug. kebab-case state name (e.g. "victoria", "western-australia"). */
  slug: string;
  /** Full state name (e.g. "Victoria", "Western Australia"). */
  name: string;
  /** Official abbreviation (NSW, VIC, QLD, WA, SA, TAS, ACT, NT). */
  abbreviation: string;
  /** Capital city. primary shipping destination. */
  capital: string;
  /** Australia Post postcode prefix range (e.g. "3000–3999"). */
  postcodeRange: string;
  /** Standard delivery window from Bangor dispatch (business days). */
  standardDeliveryDays: string;
  /** Express delivery window from Bangor dispatch (business days). */
  expressDeliveryDays: string;
  /**
   * Major destination cities and towns in the state, in rough order of
   * population. 4–6 entries is the sweet spot for "AI Overview ingestion +
   * not keyword-stuffed".
   */
  majorCities: string[];
  /**
   * One-sentence climate hook that ties the state's hair-care challenges to
   * the products Hair Pinns recommends. Jena's voice. edit freely.
   */
  climateHook: string;
  /**
   * Long-form local intro paragraph (50–120 words). Front-load the state
   * name and "Australia-wide shipping" intent. Jena's voice.
   */
  localIntro: string;
  /**
   * 2–4 product collection paths to feature for this state, chosen for
   * climate fit. Format: { label, collectionPath, reason }.
   */
  productPicks: Array<{
    label: string;
    collectionPath: string;
    reason: string;
  }>;
  /**
   * 4–6 state-specific FAQs. Lean on real shipping questions ("delivery to
   * <regional town>", "weekend delivery to <capital>") plus climate-tied
   * product questions. Each must be unique across the whole site. duplicate
   * FAQs across pages get filtered out of Google's FAQ rich results.
   */
  faqs: Array<{ question: string; answer: string }>;
  /**
   * Optional related state slugs for cross-linking in the page footer.
   * Helps Google crawl the cluster and gives users options.
   */
  nearbyStates?: string[];
}

export const shippingStates: Record<string, ShippingStateData> = {
  "new-south-wales": {
    slug: "new-south-wales",
    name: "New South Wales",
    abbreviation: "NSW",
    capital: "Sydney",
    postcodeRange: "2000–2999",
    standardDeliveryDays: "1–3",
    expressDeliveryDays: "1–2",
    majorCities: ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Wagga Wagga", "Coffs Harbour"],
    climateHook: "Most NSW hair is fighting humidity ten months of the year. My whole product wall is built around that one problem.",
    localIntro: "Hi NSW, I'm Jena. I run Hair Pinns from my home salon in Bangor and ship everything from right here in 2234. That's why you're the fastest state on my list. Sydney usually lands the next business day, Newcastle, Wollongong and the Central Coast in two to three, and regional NSW (Wagga, Dubbo, Tamworth, the Mid North Coast) about the same. Twenty years of doing hair in Sydney's humidity has shaped my whole product wall, so what you're ordering is what I'm actually using on local heads every week. Free shipping over $150.",
    productPicks: [
      {
        label: "Smoothing & frizz control",
        collectionPath: "/collections/frizz-free-must-haves",
        reason: "Built for the coastal NSW humidity that turns blow-dries into halo frizz by midday.",
      },
      {
        label: "QIQI smoothing aftercare",
        collectionPath: "/collections/qiqi",
        reason: "Keeps salon smoothing treatments going for 3–5 months in Sydney's worst humid weeks.",
      },
      {
        label: "Pure Certified Organic",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Jena's #1 daily range. Sulphate-free, water-friendly for harder Sydney metro water.",
      },
    ],
    faqs: [
      {
        question: "How fast does Hair Pinns ship to Sydney?",
        answer: "Sydney metro orders placed before 1 pm typically arrive next business day via AusPost or courier. Standard delivery 1–3 business days; express 1–2 days. Free shipping on orders over $150 AUD.",
      },
      {
        question: "Do you deliver to regional NSW (Wagga Wagga, Coffs Harbour, Dubbo, Tamworth)?",
        answer: "Yes. AusPost covers every NSW postcode in the 2000–2999 range. Regional NSW typically lands within 2–3 business days; remote postcodes may extend to 4–5 days.",
      },
      {
        question: "What products work best for Sydney humidity?",
        answer: "Smoothing-treatment aftercare (QIQI), anti-frizz styling (Juuce Botanic Oil Serum, Pure Sacred Mask), and heat-protection sprays. Sulphate-free shampoos preserve smoothing treatments and stop colour from leaching.",
      },
      {
        question: "Can I pick up from the Bangor salon instead of shipping?",
        answer: "Yes. Message Hair Pinns to arrange a salon collection from 60 Goorgool Rd, Bangor NSW 2234. No shipping cost and you get Jena's product recommendation in person.",
      },
    ],
    nearbyStates: ["australian-capital-territory", "victoria", "queensland"],
  },

  "victoria": {
    slug: "victoria",
    name: "Victoria",
    abbreviation: "VIC",
    capital: "Melbourne",
    postcodeRange: "3000–3999",
    standardDeliveryDays: "3–5",
    expressDeliveryDays: "1–2",
    majorCities: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton", "Mildura"],
    climateHook: "Melbourne does four seasons in a day, and your hair feels every one of them. Bond repair and deep hydration are the two products you can't skip.",
    localIntro: "Hi Victoria, Jena here. I send your orders down from Bangor, NSW, so Melbourne usually has them in three to five days standard or one to two express. Geelong, Ballarat, Bendigo, Shepparton and Mildura all sit in that same window. My Melbourne clients always tell me the same thing. Winter strips moisture out of their hair, summer adds a different kind of damage, and the heating cycle through autumn ruins ends. So I lean hard on bond repair and weekly hydration when I'm picking products for VIC orders. Free shipping over $150.",
    productPicks: [
      {
        label: "Bond repair & damaged hair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Melbourne's dry winters and styling-tool overuse break bonds. Juuce bond repair rebuilds without weight.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Cold dry indoor heating strips moisture; weekly Juuce Super Soft Hydration Mask is the antidote.",
      },
      {
        label: "Pure Lamellar Vitality",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Lightweight daily hydration that works for Melbourne's seasonal swings without product build-up.",
      },
    ],
    faqs: [
      {
        question: "How long does Hair Pinns take to ship to Melbourne?",
        answer: "Melbourne metro deliveries typically arrive within 3–5 business days via AusPost standard or 1–2 days via express post. Free shipping over $150 AUD.",
      },
      {
        question: "Do you ship to regional Victoria (Geelong, Ballarat, Bendigo)?",
        answer: "Yes. Every Victorian postcode in the 3000–3999 range is covered. Regional VIC typically arrives in 3–5 business days; remote postcodes may take an extra day.",
      },
      {
        question: "What products help with Melbourne's dry winter hair?",
        answer: "Weekly deep hydration masks (Juuce Super Soft Hydration, Pure Lamellar Vitality), leave-in oils to lock moisture in (Juuce Botanic Oil Serum), and sulphate-free shampoos that don't strip natural oils.",
      },
      {
        question: "Can I track my Hair Pinns delivery to Victoria?",
        answer: "Yes. Every order ships with AusPost tracking; the tracking number arrives by email once your order leaves Bangor.",
      },
    ],
    nearbyStates: ["new-south-wales", "south-australia", "tasmania", "australian-capital-territory"],
  },

  "queensland": {
    slug: "queensland",
    name: "Queensland",
    abbreviation: "QLD",
    capital: "Brisbane",
    postcodeRange: "4000–4999",
    standardDeliveryDays: "3–5",
    expressDeliveryDays: "2–3",
    majorCities: ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns", "Toowoomba"],
    climateHook: "QLD weather is the worst combination for hair anywhere in the country. Chlorine, salt, UV and humidity all at once, all year. Your hair needs to fight back.",
    localIntro: "Hi Queensland, I'm Jena. I run Hair Pinns from Bangor in Sydney's south and your orders go out the same day Monday to Friday. Brisbane and the Gold Coast usually have them in three to five days standard, two to three days express. Sunshine Coast, Townsville, Cairns and Toowoomba sit in the same window. Your weather is the worst hair conditions in the country, no contest. So when I'm picking what to recommend for QLD orders I lean on the things that actually hold up. QIQI smoothing aftercare to keep humidity from undoing your blow-dry, Solar Enz to stop the sun cooking your colour, Pure Forever Blonde to keep brass at bay. Free shipping over $150.",
    productPicks: [
      {
        label: "Blonde & colour care",
        collectionPath: "/collections/blonde-bombshells",
        reason: "QLD sun pulls blondes brassy fast; purple shampoo + Pure Forever Blonde keeps tones cool.",
      },
      {
        label: "Heat protection",
        collectionPath: "/collections/heat-protection",
        reason: "Beach + sun + styling = breakage. Juuce Solar Enz and heat shields are non-negotiable in QLD.",
      },
      {
        label: "QIQI smoothing aftercare",
        collectionPath: "/collections/qiqi",
        reason: "Tropical humidity erodes smoothing treatments. Sulphate-free QIQI aftercare extends results.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping to Brisbane take?",
        answer: "Brisbane metro orders typically arrive within 3–5 business days via AusPost standard, or 2–3 days via express. Free shipping on orders over $150 AUD.",
      },
      {
        question: "Do you ship to Far North Queensland (Cairns, Townsville)?",
        answer: "Yes. Every QLD postcode in the 4000–4999 range is covered. Cairns and Townsville typically arrive within 4–5 business days; remote tropical postcodes may take an extra 1–2 days.",
      },
      {
        question: "What products protect blonde hair from Queensland sun?",
        answer: "Pure Forever Blonde Shampoo and Conditioner keep tone cool; Juuce Solar Enz blocks UV; weekly purple shampoo neutralises brassiness from sun and chlorine exposure.",
      },
      {
        question: "Can hair smoothing survive Queensland humidity?",
        answer: "Yes. But only with sulphate-free aftercare. QIQI smoothing-aftercare shampoo and conditioner extend the treatment by 2–3 months even in Cairns or Brisbane summer humidity.",
      },
    ],
    nearbyStates: ["new-south-wales", "northern-territory"],
  },

  "western-australia": {
    slug: "western-australia",
    name: "Western Australia",
    abbreviation: "WA",
    capital: "Perth",
    postcodeRange: "6000–6999",
    standardDeliveryDays: "5–8",
    expressDeliveryDays: "3–5",
    majorCities: ["Perth", "Fremantle", "Mandurah", "Bunbury", "Kalgoorlie", "Geraldton"],
    climateHook: "Perth's water is hard, the UV is brutal, and the wind never stops. Three different things damaging your hair at once, three different fixes.",
    localIntro: "Hi WA, Jena here. You're the furthest from my Bangor dispatch hub so your orders take a little longer than the east coast. Perth metro usually lands in five to eight days standard or three to five days express. Mandurah, Bunbury, Fremantle and the rest of the Perth peripheral are in that same window. Regional WA (Kalgoorlie, Geraldton, Broome, Albany) takes a bit longer. The thing about Perth hair is the water. It's mineral-heavy and it leaves residue your shampoo can't always shift. So when I'm picking products for WA orders I lean on scalp-detox treatments to clear that residue, and bond repair to fix what the UV and wind keep undoing. Worth the wait. Free shipping over $150.",
    productPicks: [
      {
        label: "Scalp health & detox",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Perth's mineral-rich water leaves residue; Pure walnut scrub clarifies without stripping.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "UV + hard water = bond damage. Juuce bond repair rebuilds keratin links from the inside.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Dry WA summers demand weekly mask routines to keep hair pliable and shiny.",
      },
    ],
    faqs: [
      {
        question: "How long does Hair Pinns take to ship to Perth?",
        answer: "Perth metro orders typically arrive within 5–8 business days via AusPost standard or 3–5 days via express post. Distance from the east-coast dispatch hub adds 1–2 days vs. east-coast capitals. Free shipping over $150 AUD.",
      },
      {
        question: "Do you ship to regional Western Australia?",
        answer: "Yes. Every WA postcode in the 6000–6999 range is covered. Regional towns (Kalgoorlie, Geraldton, Albany, Broome) typically arrive within 7–10 business days standard.",
      },
      {
        question: "What products work best for Perth's hard water?",
        answer: "Clarifying treatments (Pure walnut scrub, weekly chelating wash), Pure Lamellar Vitality for lightweight daily hydration, and sulphate-free shampoos that don't strip the natural oils Perth water already dries out.",
      },
      {
        question: "Is shipping insured?",
        answer: "Yes. Every Hair Pinns order ships with tracking and Australia Post / courier transit cover. Damaged goods are replaced or refunded; contact Hair Pinns within 7 days of delivery.",
      },
    ],
    nearbyStates: ["south-australia", "northern-territory"],
  },

  "south-australia": {
    slug: "south-australia",
    name: "South Australia",
    abbreviation: "SA",
    capital: "Adelaide",
    postcodeRange: "5000–5999",
    standardDeliveryDays: "4–6",
    expressDeliveryDays: "2–4",
    majorCities: ["Adelaide", "Mount Gambier", "Whyalla", "Murray Bridge", "Port Lincoln", "Victor Harbor"],
    climateHook: "Adelaide is dry. Hot dry summers, cold dry winters, and not enough rain in between. Your hair needs weekly hydration or it goes brittle fast.",
    localIntro: "Hi South Australia, I'm Jena. Your orders ship from my Bangor salon in Sydney and usually land in four to six days standard or two to four days express. Mount Gambier, Whyalla, Murray Bridge and the Fleurieu Peninsula are in that same window. SA hair is the opposite problem to Queensland. It's dry, not humid, and the moisture loss is constant. So when I'm packing SA orders I'm choosing deep hydration masks for the weekly reset, lightweight oil serums to seal ends, and sulphate-free shampoos so the dryness isn't getting worse with every wash. None of it heavy. Free shipping over $150.",
    productPicks: [
      {
        label: "Deep hydration masks",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Adelaide's dry climate strips moisture faster than humid states. Weekly mask treatments rebuild.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Dry air + colour treatments accelerate bond damage; Juuce bond repair restores structure.",
      },
      {
        label: "Pure Certified Organic",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Sulphate-free daily wash that doesn't compound the natural dryness of Adelaide water.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Adelaide?",
        answer: "Adelaide metro orders typically arrive within 4–6 business days via AusPost standard or 2–4 days express. Free shipping on orders over $150 AUD.",
      },
      {
        question: "Do you ship to regional South Australia?",
        answer: "Yes. Every SA postcode in the 5000–5999 range is covered. Mount Gambier, Whyalla, and the Fleurieu Peninsula typically arrive within 5–7 business days standard.",
      },
      {
        question: "What products help dry Adelaide hair?",
        answer: "Weekly Juuce Super Soft Hydration Mask, daily Pure Lamellar Vitality range, Juuce Botanic Oil Serum to seal ends. And sulphate-free shampoos that won't compound the moisture loss.",
      },
      {
        question: "Are products sulphate-free for sensitive scalps?",
        answer: "Many are. Pure Certified Organic is fully sulphate-free; Aromaganic is plant-based; Juuce offers sulphate-free options for colour-treated and damaged hair. Filter by 'sulphate-free' on the collections page or message Hair Pinns for a recommendation.",
      },
    ],
    nearbyStates: ["victoria", "western-australia", "northern-territory"],
  },

  "tasmania": {
    slug: "tasmania",
    name: "Tasmania",
    abbreviation: "TAS",
    capital: "Hobart",
    postcodeRange: "7000–7999",
    standardDeliveryDays: "5–8",
    expressDeliveryDays: "3–5",
    majorCities: ["Hobart", "Launceston", "Devonport", "Burnie", "Ulverstone"],
    climateHook: "Tassie cycles your hair through wet and cold then dry and heated, every single day in winter. Hair hates that. Bond repair and weekly hydration fix it.",
    localIntro: "Hi Tassie, I'm Jena. Hobart and Launceston usually get your orders in five to eight days from my Bangor dispatch, or three to five days express. Devonport, Burnie and the north-west coast are the same. Bass Strait adds a day or two compared to the mainland, but tracking comes through to your inbox the moment your order leaves. The Tassie hair problem is the cycle. Wet and cold outside, dry and heated inside, repeat. That cycle breaks bonds and strips moisture, so I pack TAS orders with Juuce Bond Repair for daily strength, a weekly hydration mask to reset, and a Wet Brush because wet hair gets brushed a lot in your climate. Free shipping over $150.",
    productPicks: [
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Indoor heating + cold winters break hair bonds; Juuce bond repair rebuilds them.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Heated air strips moisture fast. Weekly Juuce Super Soft Hydration Mask restores it.",
      },
      {
        label: "Wet Brush detanglers",
        collectionPath: "/collections/wet-brush-detanglers",
        reason: "Wet TAS weather means wet hair. Wet Brush detangles without breakage.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Tasmania?",
        answer: "Hobart and Launceston typically receive orders within 5–8 business days via AusPost standard or 3–5 days express. Bass Strait crossing adds 1–2 days vs. mainland states. Free shipping over $150 AUD.",
      },
      {
        question: "Do you ship to Devonport, Burnie, and the north-west coast?",
        answer: "Yes. Every TAS postcode in the 7000–7999 range is covered. North-west TAS typically arrives within 6–9 business days standard.",
      },
      {
        question: "What products work for cold wet Tasmanian winters?",
        answer: "Bond-repair treatments (Juuce range), weekly deep hydration masks, and lightweight finishing oils (Juuce Botanic Oil Serum) to lock moisture in after blow-drying.",
      },
      {
        question: "Can I get a refund if my order arrives late?",
        answer: "AusPost timeframes are estimates, not guarantees. If your order is significantly delayed (more than 5 days beyond the standard window), contact Hair Pinns and we'll trace it with Australia Post.",
      },
    ],
    nearbyStates: ["victoria", "new-south-wales"],
  },

  "australian-capital-territory": {
    slug: "australian-capital-territory",
    name: "Australian Capital Territory",
    abbreviation: "ACT",
    capital: "Canberra",
    postcodeRange: "0200–0299, 2600–2618, 2900–2920",
    standardDeliveryDays: "2–4",
    expressDeliveryDays: "1–2",
    majorCities: ["Canberra", "Belconnen", "Tuggeranong", "Gungahlin", "Woden"],
    climateHook: "Canberra winters are brutally dry, summers are brutally dry, and the heating cycles in between finish the job. Your hair is thirsty all year.",
    localIntro: "Hi Canberra, Jena here. You're one of the closest states to my Bangor dispatch hub so your orders are quick. Two to four days standard or one to two days express. All your suburbs (Belconnen, Tuggeranong, Gungahlin, Woden) are in that same window. The Canberra problem is dryness, full stop. Cold dry air in winter, hot dry air in summer, indoor heating cycling through both. So I lean hydration heavy for ACT orders. Weekly Juuce Super Soft Hydration Mask, daily Pure Lamellar Vitality, a finishing oil to seal ends, and bond repair if your hair is colour-treated. The dry climate hates your hair, but the right routine wins. Free shipping over $150.",
    productPicks: [
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Canberra's dry continental climate strips hair moisture year-round. Weekly hydration is essential.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Cold dry winters + indoor heating break bonds; Juuce bond repair rebuilds them.",
      },
      {
        label: "Pure Lamellar Vitality",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Lightweight daily hydration that handles Canberra's seasonal swings without weight.",
      },
    ],
    faqs: [
      {
        question: "How fast does shipping reach Canberra?",
        answer: "Canberra metro orders typically arrive within 2–4 business days via AusPost standard or 1–2 days express. One of the fastest windows on the Hair Pinns network. Free shipping over $150 AUD.",
      },
      {
        question: "Do you ship to all Canberra suburbs (Belconnen, Tuggeranong, Gungahlin)?",
        answer: "Yes. Every ACT postcode is covered. All metro Canberra suburbs sit within the 2–4 day standard window.",
      },
      {
        question: "What products help dry Canberra hair?",
        answer: "Weekly deep-hydration masks (Juuce Super Soft Hydration), daily Pure Lamellar Vitality range, finishing oils for ends, and bond-repair treatments to undo winter-and-summer damage.",
      },
      {
        question: "Can I pick up from Sydney instead?",
        answer: "If you'd prefer salon pickup, Hair Pinns is at 60 Goorgool Rd, Bangor NSW 2234. Roughly a 3 hr drive from Canberra. Most ACT customers prefer the 2-day shipping.",
      },
    ],
    nearbyStates: ["new-south-wales", "victoria"],
  },

  "northern-territory": {
    slug: "northern-territory",
    name: "Northern Territory",
    abbreviation: "NT",
    capital: "Darwin",
    postcodeRange: "0800–0899, 0900–0999",
    standardDeliveryDays: "6–10",
    expressDeliveryDays: "4–6",
    majorCities: ["Darwin", "Alice Springs", "Palmerston", "Katherine", "Nhulunbuy"],
    climateHook: "NT is two completely different hair problems in one territory. Darwin sweats your blow-dry out by morning, Alice Springs cooks your colour by lunchtime.",
    localIntro: "Hi NT, I'm Jena. You're the furthest from my Bangor dispatch hub so your orders take the longest. Darwin metro usually has them in six to ten days standard or four to six days express, and Alice Springs, Palmerston and Katherine are about the same. The Top End and the Red Centre are two completely different hair problems, so I pack NT orders differently depending on where you are. Up north it's the humidity, so smoothing aftercare from QIQI and frizz-control oils. Down in the centre it's UV and dry air, so heat protection, Solar Enz, weekly hydration masks. Tell me your postcode if you're on the fence and I'll point you at the right routine. Free shipping over $150.",
    productPicks: [
      {
        label: "QIQI smoothing aftercare",
        collectionPath: "/collections/qiqi",
        reason: "Darwin's tropical humidity erodes smoothing treatments. QIQI aftercare extends results by months.",
      },
      {
        label: "Heat protection & UV",
        collectionPath: "/collections/heat-protection",
        reason: "NT sun is brutal everywhere. Juuce Solar Enz blocks UV; sun-damaged colour fades fast otherwise.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "UV + arid Red Centre dryness break bonds; Juuce bond repair rebuilds keratin links.",
      },
    ],
    faqs: [
      {
        question: "How long does Hair Pinns take to ship to Darwin?",
        answer: "Darwin metro orders typically arrive within 6–10 business days via AusPost standard or 4–6 days express. NT's distance from east-coast dispatch hubs adds 2–4 days vs. NSW or VIC.",
      },
      {
        question: "Do you ship to Alice Springs and remote NT?",
        answer: "Yes. Every NT postcode is covered. Alice Springs typically arrives within 8–12 business days standard; remote and Indigenous community postcodes may extend further.",
      },
      {
        question: "What products work for Darwin's tropical humidity?",
        answer: "Sulphate-free smoothing aftercare (QIQI shampoo + conditioner), Juuce Botanic Oil Serum for shine and frizz control, heat-protection sprays before styling.",
      },
      {
        question: "What protects hair from the Red Centre sun?",
        answer: "Juuce Solar Enz UV protection leave-in, wide-brim hats, Pure Forever Blonde to neutralise sun-induced brassiness, and weekly deep-hydration masks to restore moisture stripped by sun and dry air.",
      },
    ],
    nearbyStates: ["queensland", "western-australia", "south-australia"],
  },
};

/** Lookup a state by slug. Falls back to undefined for unknown slugs. */
export const getShippingStateData = (slug: string): ShippingStateData | undefined =>
  shippingStates[slug];

/** All state slugs in order. used by sitemap + prerender generators. */
export const allShippingStateSlugs = Object.keys(shippingStates);
