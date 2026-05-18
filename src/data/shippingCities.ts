/**
 * City-level shipping landing pages.
 *
 * Each entry powers a /shipping-to/<slug> page targeted at Australian shoppers
 * searching for hair-care delivery to their specific city, on top of the
 * state-level pages in src/data/shippingStates.ts. Cities capture
 * higher-intent queries (e.g. "QIQI delivery Melbourne", "salon shampoo
 * Brisbane") than the broader state surface.
 *
 * Lookup order in ShippingStatePage is cities first, then states, so a slug
 * like "melbourne" resolves to the city page rather than being interpreted
 * as a state. State slugs are kept verbose ("new-south-wales") to avoid
 * collision with their capital city slugs ("sydney").
 *
 * Editing
 * -------
 * `localIntro`, `cityHook`, `productPicks`, `faqs`, and `popularSuburbs` are
 * Jena-editable. Delivery windows are tighter than the parent state because
 * metro courier services usually beat the state-wide AusPost average. Update
 * only if a courier ETA changes.
 *
 * Build pipeline auto-discovers entries through `extractObjectKeys` in the
 * prerender and sitemap generators. Adding a new city = add an entry here,
 * everything else flows.
 */

export interface ShippingCityData {
  /** URL slug — kebab-case city name (e.g. "melbourne", "gold-coast"). */
  slug: string;
  /** Display name. */
  name: string;
  /** Two-or-three-letter state code (NSW, VIC, QLD...). */
  stateCode: string;
  /** Full state name. */
  stateName: string;
  /** Parent state slug for cross-linking back up. */
  stateSlug: string;
  /** Metro standard delivery window from Bangor dispatch (business days). */
  standardDeliveryDays: string;
  /** Metro express delivery window from Bangor dispatch (business days). */
  expressDeliveryDays: string;
  /** Population-weighted suburbs and surrounding regions covered. */
  popularSuburbs: string[];
  /** One-sentence city-specific hair-care framing in Jena's voice. */
  cityHook: string;
  /** Long-form intro paragraph (80–140 words). Jena's voice. */
  localIntro: string;
  /** 2–4 climate-tied product picks with reasoning. */
  productPicks: Array<{
    label: string;
    collectionPath: string;
    reason: string;
  }>;
  /** 4–6 city-specific FAQs. Unique across the site. */
  faqs: Array<{ question: string; answer: string }>;
  /** Optional cross-links to other cities for cluster connectivity. */
  nearbyCities?: string[];
}

export const shippingCities: Record<string, ShippingCityData> = {
  "sydney": {
    slug: "sydney",
    name: "Sydney",
    stateCode: "NSW",
    stateName: "New South Wales",
    stateSlug: "new-south-wales",
    standardDeliveryDays: "1–2",
    expressDeliveryDays: "1",
    popularSuburbs: ["Sydney CBD", "Bondi", "Manly", "Parramatta", "Sutherland Shire", "Inner West", "Eastern Suburbs", "Northern Beaches"],
    cityHook: "Sydney humidity is what my whole product wall is built for. Your hair is fighting moisture in the air ten months a year, and the right routine wins that fight.",
    localIntro: "Hi Sydney, I'm Jena. I'm in Bangor in the Sutherland Shire, so your orders are the fastest on my whole network. Most CBD, Eastern Suburbs, Inner West and Sutherland orders placed before 1pm land the next business day. The North Shore and Northern Beaches are the same window. Hills District and the outer west sometimes take two days but rarely more. Sydney's specific problem is the constant humidity, and after twenty years of doing hair in this city I've worked out exactly what holds up. QIQI smoothing aftercare for anyone with a treatment. Pure Sacred Mask weekly. A heat shield before any styling, because humidity-damp hair plus a hot tool is the fastest way to fry an end. Free shipping over $150.",
    productPicks: [
      {
        label: "Smoothing & frizz control",
        collectionPath: "/collections/frizz-free-must-haves",
        reason: "The Sydney humidity is the whole reason this collection exists. Built to hold a blow-dry past midday.",
      },
      {
        label: "QIQI smoothing aftercare",
        collectionPath: "/collections/qiqi",
        reason: "Sulphate-free aftercare that extends salon smoothing treatments by months, even in Sydney summers.",
      },
      {
        label: "Pure Lamellar Vitality range",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "My number-one daily pick for Sydney hair. Lightweight enough for fine hair, water-friendly for harder metro water.",
      },
    ],
    faqs: [
      {
        question: "How fast does Hair Pinns deliver to Sydney?",
        answer: "Most Sydney metro orders placed before 1pm arrive the next business day, including CBD, Eastern Suburbs, Inner West, Sutherland Shire, North Shore, and Northern Beaches. Outer suburbs (Hills District, Western Sydney) sometimes take two business days. Free shipping over $150.",
      },
      {
        question: "Do you deliver to specific Sydney suburbs like Bondi, Manly, or Parramatta?",
        answer: "Yes. Every Sydney postcode in the 2000–2249 range is covered by AusPost or courier from Bangor. Specific suburbs in the Eastern Suburbs (Bondi, Bronte, Coogee), Northern Beaches (Manly, Dee Why, Mona Vale), Inner West (Newtown, Marrickville, Glebe), and Greater Western Sydney (Parramatta, Penrith, Blacktown) all sit in the same one-to-two day window.",
      },
      {
        question: "Can I collect from the Bangor salon instead of paying for shipping?",
        answer: "Yes. Sydney customers are welcome to arrange a salon pickup from 60 Goorgool Rd, Bangor NSW 2234. No shipping cost and I'll add a personal product recommendation in person. Message Hair Pinns to coordinate a time.",
      },
      {
        question: "What hair products work best for Sydney humidity?",
        answer: "Smoothing-treatment aftercare (QIQI shampoo and conditioner), Pure Sacred Mask for weekly deep hydration, Juuce Botanic Oil Serum to seal cuticles, and a non-negotiable heat shield before any styling tool. Sulphate-free shampoos preserve treatments and stop colour leaching in the humidity.",
      },
    ],
    nearbyCities: ["newcastle", "wollongong", "canberra"],
  },

  "melbourne": {
    slug: "melbourne",
    name: "Melbourne",
    stateCode: "VIC",
    stateName: "Victoria",
    stateSlug: "victoria",
    standardDeliveryDays: "2–4",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Melbourne CBD", "St Kilda", "Brighton", "Carlton", "South Yarra", "Brunswick", "Frankston", "Werribee", "Box Hill"],
    cityHook: "Melbourne does four seasons in a day and your hair feels every single one. Bond repair plus weekly hydration is the routine that wins.",
    localIntro: "Hi Melbourne, Jena here. Your orders come down from Bangor and most metro postcodes have them in two to four days standard or one to two days express. CBD, Inner North (Carlton, Brunswick), Bayside (St Kilda, Brighton), Inner South (South Yarra, Prahran), and the Eastern suburbs (Box Hill, Glen Waverley) all sit in that same window. Frankston and the outer growth corridors take a day longer sometimes. My Melbourne clients tell me the same thing every time. The weather changes ruin their hair. Cold dry mornings then warm afternoons then heated indoor air at night. So I lean hard on bond repair to handle the structural damage from that cycle and weekly deep hydration to put back what the dryness strips out. Free shipping over $150.",
    productPicks: [
      {
        label: "Bond repair range",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Melbourne's temperature swings break bonds. Juuce daily bond repair rebuilds them without weight.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Heated indoor air through autumn and winter dehydrates hair fast. Weekly mask treatments are the antidote.",
      },
      {
        label: "Pure Lamellar Vitality",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Lightweight daily wash that handles Melbourne's seasonal swings without leaving build-up.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Melbourne?",
        answer: "Melbourne metro orders typically arrive within 2–4 business days via AusPost standard or 1–2 days express. CBD, Bayside (St Kilda, Brighton), Inner North, and Eastern suburbs are all in that window. Free shipping over $150.",
      },
      {
        question: "Do you deliver to specific Melbourne suburbs like St Kilda, Brighton, or South Yarra?",
        answer: "Yes. Every Melbourne metropolitan postcode is covered. Bayside (St Kilda, Brighton, Sandringham), Inner South (South Yarra, Prahran, Toorak), Inner North (Carlton, Fitzroy, Brunswick), and the Eastern suburbs (Box Hill, Camberwell, Glen Waverley) all sit in the 2–4 day window.",
      },
      {
        question: "Do you deliver to outer Melbourne (Frankston, Werribee, Pakenham, Cranbourne)?",
        answer: "Yes. Outer growth-corridor postcodes typically take 3–5 days standard depending on the AusPost route. Express drops it to 1–2 days regardless of distance.",
      },
      {
        question: "What products help with Melbourne's cold dry winter weather?",
        answer: "Weekly deep-hydration masks (Juuce Super Soft Hydration, Pure Sacred Mask), bond repair shampoo and conditioner for daily strength, finishing oils to seal ends, and a heat shield before any tool. The cycle of cold outside and heated inside dries hair faster than people realise.",
      },
    ],
    nearbyCities: ["geelong", "adelaide", "hobart"],
  },

  "brisbane": {
    slug: "brisbane",
    name: "Brisbane",
    stateCode: "QLD",
    stateName: "Queensland",
    stateSlug: "queensland",
    standardDeliveryDays: "2–4",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Brisbane CBD", "West End", "Paddington", "New Farm", "South Bank", "Indooroopilly", "Chermside", "Sunnybank"],
    cityHook: "Brisbane is humid most of the year and the sun is brutal even in winter. Your blonde fades faster, your smoothing wears off sooner, and your hair drinks moisture you didn't know it lost.",
    localIntro: "Hi Brisbane, I'm Jena. Your orders ship from Bangor and most metro postcodes get them in two to four days standard or one to two days express. CBD, West End, New Farm, Paddington and the inner ring are in that fast window. Indooroopilly, Chermside, Sunnybank and the outer suburbs sit at the longer end of standard. Brisbane hair has the toughest year of any capital city, full stop. Subtropical humidity, chlorinated pools half the year, salt air on the Bay side, and a UV index that does damage even when it's overcast. I've sent a lot of products to Brisbane addresses over the years and the pattern is the same. People bring blondes back to cool with Pure Forever Blonde, hold smoothing treatments together with QIQI aftercare, and block UV with Solar Enz. Free shipping over $150.",
    productPicks: [
      {
        label: "Blonde maintenance",
        collectionPath: "/collections/blonde-bombshells",
        reason: "QLD sun pulls blondes brassy fast. Twice-weekly purple shampoo keeps tone cool.",
      },
      {
        label: "Heat protection & UV",
        collectionPath: "/collections/heat-protection",
        reason: "Brisbane sun damages hair even in winter. Juuce Solar Enz blocks UV daily.",
      },
      {
        label: "QIQI smoothing aftercare",
        collectionPath: "/collections/qiqi",
        reason: "Tropical humidity erodes smoothing treatments fast. QIQI aftercare extends results.",
      },
    ],
    faqs: [
      {
        question: "How fast does Hair Pinns ship to Brisbane?",
        answer: "Brisbane metro orders typically arrive within 2–4 business days via AusPost standard, or 1–2 days express. CBD, West End, New Farm, Paddington, and the inner suburbs are in the faster window. Free shipping over $150.",
      },
      {
        question: "Do you deliver to specific Brisbane suburbs like New Farm, Paddington, or Indooroopilly?",
        answer: "Yes. Every Brisbane metropolitan postcode is covered. Inner suburbs (CBD, West End, New Farm, Paddington, Fortitude Valley), middle ring (Indooroopilly, Toowong, Bulimba), and outer suburbs (Chermside, Sunnybank, Mount Gravatt) all receive in the 2–4 day window.",
      },
      {
        question: "What products fight Brisbane sun damage and humidity?",
        answer: "Pure Forever Blonde Shampoo and Conditioner for cool tones, Juuce Solar Enz for daily UV protection, QIQI smoothing aftercare to hold treatments through humid weeks, and weekly Pure Sacred Mask to restore moisture lost to sun and chlorine.",
      },
      {
        question: "Do you ship from Bangor to the Gold Coast or Sunshine Coast?",
        answer: "Gold Coast and Sunshine Coast have their own delivery windows that match Brisbane closely (2–4 business days standard). Both are fully covered by every order placed at hairpinns.com.",
      },
    ],
    nearbyCities: ["gold-coast", "sunshine-coast"],
  },

  "perth": {
    slug: "perth",
    name: "Perth",
    stateCode: "WA",
    stateName: "Western Australia",
    stateSlug: "western-australia",
    standardDeliveryDays: "4–6",
    expressDeliveryDays: "2–4",
    popularSuburbs: ["Perth CBD", "Fremantle", "Cottesloe", "Subiaco", "Joondalup", "Mandurah", "Rockingham", "Midland"],
    cityHook: "Perth water is hard, the UV is relentless, and the Fremantle Doctor never sleeps. Three different things wrecking your hair at once, three different fixes.",
    localIntro: "Hi Perth, Jena here. You're the furthest city from my Bangor dispatch so your orders take a bit longer. Most metro postcodes (CBD, Fremantle, Cottesloe, Subiaco, Joondalup) land in four to six days standard or two to four days express. Mandurah and Rockingham are in the same window. Midland and the outer eastern suburbs take a day longer sometimes. Perth's hard water is the one nobody warns you about. Mineral residue builds up wash after wash and your shampoo can't always shift it, which is why hair looks dull no matter what you do. So I send Perth orders with clarifying treatments to clear that residue, daily Pure Lamellar Vitality that doesn't compound the dryness, and bond repair to undo what the UV does. Worth the wait. Free shipping over $150.",
    productPicks: [
      {
        label: "Clarifying & scalp health",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Hard Perth water leaves residue. Pure walnut scrub clarifies without stripping.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "UV plus hard water breaks bonds fast. Juuce bond repair rebuilds them daily.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Dry WA summers strip moisture. Weekly mask treatments are non-negotiable.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Perth?",
        answer: "Perth metro orders typically arrive within 4–6 business days via AusPost standard or 2–4 days via express. Distance from the east coast dispatch hub adds 1–2 days compared to capitals like Melbourne or Brisbane. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Perth suburbs like Fremantle, Subiaco, or Joondalup?",
        answer: "Yes. Every Perth metropolitan postcode is covered. CBD, Fremantle, Cottesloe, Subiaco, Leederville (inner ring), Joondalup, Wanneroo, Stirling (north), and Mandurah, Rockingham (south) all receive in the 4–6 day standard window.",
      },
      {
        question: "What products work best for Perth's hard water?",
        answer: "Pure walnut scrub or a weekly clarifying wash to remove mineral build-up, Pure Lamellar Vitality for lightweight daily hydration that doesn't compound the dryness, and sulphate-free shampoos so the wash itself isn't stripping natural oils on top of what the water already does.",
      },
      {
        question: "Is express shipping worth it for Perth orders?",
        answer: "If you need products within a week, yes. Express shaves 2–3 days off the AusPost standard window. For non-urgent orders standard works fine, just plan ahead.",
      },
    ],
    nearbyCities: ["adelaide", "darwin"],
  },

  "adelaide": {
    slug: "adelaide",
    name: "Adelaide",
    stateCode: "SA",
    stateName: "South Australia",
    stateSlug: "south-australia",
    standardDeliveryDays: "3–5",
    expressDeliveryDays: "2–3",
    popularSuburbs: ["Adelaide CBD", "North Adelaide", "Norwood", "Glenelg", "Henley Beach", "Mitcham", "Modbury", "Salisbury"],
    cityHook: "Adelaide is dry. Hot dry summers, cold dry winters, and the wind takes the rest. Your hair is constantly thirsty.",
    localIntro: "Hi Adelaide, I'm Jena. Your orders ship from Bangor and most metro postcodes have them in three to five days standard or two to three days express. CBD, North Adelaide, Norwood, Glenelg, Henley Beach and the inner ring are in that window. Mitcham, Modbury, Salisbury and the outer suburbs take a day longer sometimes. Adelaide hair is the opposite problem to Brisbane. It's dry, not humid, and the moisture loss is constant year-round. The summer wind makes it worse. So I pack Adelaide orders with a deep weekly mask to reset, light oil serums to seal ends, and sulphate-free shampoos so wash day isn't compounding the dryness. Nothing heavy because Adelaide hair already feels weighed down by mineral water without help. Free shipping over $150.",
    productPicks: [
      {
        label: "Deep hydration masks",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Adelaide's dry climate strips moisture faster than humid states. Weekly masks rebuild it.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Dry air plus colour treatments accelerate bond damage. Juuce bond repair restores structure.",
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
        answer: "Adelaide metro orders typically arrive within 3–5 business days via AusPost standard or 2–3 days express. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Adelaide suburbs like Norwood, Glenelg, or Henley Beach?",
        answer: "Yes. Every Adelaide metropolitan postcode is covered. Eastern (Norwood, Burnside), Beachside (Glenelg, Henley Beach, Brighton), CBD, North Adelaide, and outer suburbs (Modbury, Salisbury, Mitcham) all sit in the 3–5 day window.",
      },
      {
        question: "What products help dry Adelaide hair?",
        answer: "Weekly Juuce Super Soft Hydration Mask or Pure Sacred Mask, daily Pure Lamellar Vitality range, Juuce Botanic Oil Serum to seal ends, and sulphate-free shampoos that won't compound the moisture loss.",
      },
      {
        question: "Are products sulphate-free for sensitive Adelaide scalps?",
        answer: "Many are. Pure Certified Organic is fully sulphate-free, Aromaganic is plant-based, and Juuce offers sulphate-free options for colour-treated and damaged hair. Filter the collections page or message Hair Pinns for a recommendation.",
      },
    ],
    nearbyCities: ["melbourne", "perth"],
  },

  "hobart": {
    slug: "hobart",
    name: "Hobart",
    stateCode: "TAS",
    stateName: "Tasmania",
    stateSlug: "tasmania",
    standardDeliveryDays: "4–7",
    expressDeliveryDays: "3–5",
    popularSuburbs: ["Hobart CBD", "Battery Point", "Sandy Bay", "North Hobart", "Glenorchy", "Kingston", "Bellerive"],
    cityHook: "Hobart is cold, wet, and indoor-heated in equal parts through winter. That cycle breaks hair bonds and strips moisture faster than people realise.",
    localIntro: "Hi Hobart, Jena here. Your orders ship from Bangor in Sydney and the Bass Strait crossing adds a day or two compared to mainland cities. Most Hobart metro postcodes get orders in four to seven days standard or three to five days express. CBD, Battery Point, Sandy Bay, North Hobart, Glenorchy, Kingston and Bellerive are all in that window. Hobart hair has a specific problem. Wet cold outside, dry heated inside, every single day through winter. That cycle strips moisture out of hair and breaks bonds faster than any other climate I see. So I pack Hobart orders with Juuce bond repair for daily strength, weekly hydration masks to reset moisture, and a Wet Brush because wet hair gets brushed a lot in your climate and breakage is real. Free shipping over $150.",
    productPicks: [
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Cold-and-wet-then-hot-and-dry cycle breaks bonds. Juuce bond repair rebuilds them.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Indoor heating strips moisture every day. Weekly mask treatments restore it.",
      },
      {
        label: "Wet Brush detanglers",
        collectionPath: "/collections/wet-brush-detanglers",
        reason: "Tassie weather means wet hair more often. Wet Brush detangles without breakage.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Hobart?",
        answer: "Hobart metro orders typically arrive within 4–7 business days via AusPost standard or 3–5 days express. Bass Strait crossing adds 1–2 days compared to mainland capitals. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Hobart suburbs like Battery Point, Sandy Bay, or Kingston?",
        answer: "Yes. Every Hobart metropolitan postcode is covered. CBD, Battery Point, Sandy Bay, North Hobart, Glenorchy, Kingston, Bellerive and the broader Hobart catchment all receive in the 4–7 day window.",
      },
      {
        question: "What products work for Hobart's cold wet winters?",
        answer: "Bond-repair shampoo and conditioner (Juuce Bond Repair daily), weekly deep hydration masks (Juuce Super Soft Hydration or Pure Sacred), and lightweight finishing oils (Juuce Botanic Oil Serum) to lock moisture in after blow-drying.",
      },
      {
        question: "Can I get a refund if my Hobart order arrives late?",
        answer: "AusPost timeframes are estimates not guarantees. If your order is significantly late (more than 4 days beyond the standard window), contact Hair Pinns and I'll trace it with Australia Post and replace it if it's been lost.",
      },
    ],
    nearbyCities: ["melbourne"],
  },

  "darwin": {
    slug: "darwin",
    name: "Darwin",
    stateCode: "NT",
    stateName: "Northern Territory",
    stateSlug: "northern-territory",
    standardDeliveryDays: "5–9",
    expressDeliveryDays: "3–5",
    popularSuburbs: ["Darwin CBD", "Casuarina", "Nightcliff", "Palmerston", "Fannie Bay", "Howard Springs"],
    cityHook: "Darwin sweats your blow-dry out by morning and the wet season laughs at any styling product that isn't designed for tropical humidity.",
    localIntro: "Hi Darwin, I'm Jena. Your orders take the longest of any capital because of the distance from my Bangor dispatch hub. Most Darwin metro postcodes get orders in five to nine days standard or three to five days express. CBD, Casuarina, Nightcliff, Palmerston, Fannie Bay and Howard Springs are all in that window. Darwin hair has the most extreme version of the QLD problem. Tropical humidity all year, brutal UV, and a wet season that puts everything to the test. I pack Darwin orders with QIQI smoothing aftercare to hold treatments together, Juuce Solar Enz for the UV that never quits, and weekly hydration masks because tropical hair still gets dry in the air conditioning. Free shipping over $150.",
    productPicks: [
      {
        label: "QIQI smoothing aftercare",
        collectionPath: "/collections/qiqi",
        reason: "Tropical humidity erodes smoothing treatments fast. QIQI aftercare extends results.",
      },
      {
        label: "Heat protection & UV",
        collectionPath: "/collections/heat-protection",
        reason: "NT sun is brutal year-round. Juuce Solar Enz blocks UV every day.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "UV plus tropical humidity breaks bonds. Juuce bond repair rebuilds them.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Darwin?",
        answer: "Darwin metro orders typically arrive within 5–9 business days via AusPost standard or 3–5 days express. Distance from the east coast dispatch hub adds 2–4 days compared to southern capitals. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Darwin suburbs like Nightcliff, Casuarina, or Palmerston?",
        answer: "Yes. Every Darwin metropolitan postcode is covered. CBD, Casuarina, Nightcliff, Palmerston, Fannie Bay, and Howard Springs all receive in the 5–9 day window. Remote NT postcodes outside the Darwin metro take longer.",
      },
      {
        question: "What products help with Darwin's tropical humidity?",
        answer: "Sulphate-free smoothing aftercare (QIQI shampoo and conditioner), Juuce Botanic Oil Serum for daily shine and frizz control, heat-protection sprays before styling, and Juuce Solar Enz for the year-round UV.",
      },
      {
        question: "Is express shipping recommended for Darwin?",
        answer: "Yes for any time-sensitive orders. Express drops the delivery window from 5–9 days to 3–5 days. Standard works fine if you're stocking up rather than running out.",
      },
    ],
    nearbyCities: ["perth"],
  },

  "canberra": {
    slug: "canberra",
    name: "Canberra",
    stateCode: "ACT",
    stateName: "Australian Capital Territory",
    stateSlug: "australian-capital-territory",
    standardDeliveryDays: "2–4",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Canberra CBD", "Belconnen", "Tuggeranong", "Gungahlin", "Woden", "Weston Creek", "Queanbeyan"],
    cityHook: "Canberra is brutally dry in every season. Cold dry winters, hot dry summers, and indoor heating that never lets your hair recover.",
    localIntro: "Hi Canberra, Jena here. You're one of the closer cities to my Bangor dispatch so your orders are quick. Most ACT metro postcodes get orders in two to four days standard or one to two days express. CBD, Belconnen, Tuggeranong, Gungahlin, Woden and Weston Creek are all in that window. Queanbeyan just over the NSW border is the same. The Canberra problem is dryness, full stop. The continental climate strips moisture out of hair year-round and the heated indoor air finishes what the outside started. So I lean hydration heavy for Canberra orders. Weekly Juuce Super Soft Hydration Mask, daily Pure Lamellar Vitality, a finishing oil to seal ends, and bond repair if your hair is colour-treated. Free shipping over $150.",
    productPicks: [
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Canberra dryness strips moisture year-round. Weekly hydration is essential.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Dry winters and indoor heating break bonds. Juuce bond repair rebuilds them.",
      },
      {
        label: "Pure Lamellar Vitality",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Lightweight daily hydration that handles Canberra's seasonal swings.",
      },
    ],
    faqs: [
      {
        question: "How fast does shipping reach Canberra?",
        answer: "Canberra metro orders typically arrive within 2–4 business days via AusPost standard or 1–2 days express. Proximity to NSW makes this one of the faster windows on the network. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Canberra suburbs like Belconnen, Tuggeranong, or Gungahlin?",
        answer: "Yes. Every ACT postcode is covered. All metro Canberra suburbs (Belconnen, Tuggeranong, Gungahlin, Woden, Weston Creek) plus Queanbeyan just over the NSW border sit within the 2–4 day standard window.",
      },
      {
        question: "What products help dry Canberra hair?",
        answer: "Weekly deep-hydration masks (Juuce Super Soft Hydration), daily Pure Lamellar Vitality range, Juuce Botanic Oil Serum for ends, and Juuce Bond Repair if your hair is colour-treated.",
      },
      {
        question: "Can I pick up in Sydney instead?",
        answer: "If you'd prefer salon pickup, Hair Pinns is at 60 Goorgool Rd, Bangor NSW 2234. Roughly a 3hr drive from Canberra. Most ACT customers prefer the 2-day shipping.",
      },
    ],
    nearbyCities: ["sydney", "wollongong"],
  },

  "gold-coast": {
    slug: "gold-coast",
    name: "Gold Coast",
    stateCode: "QLD",
    stateName: "Queensland",
    stateSlug: "queensland",
    standardDeliveryDays: "2–4",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Surfers Paradise", "Broadbeach", "Burleigh Heads", "Coolangatta", "Robina", "Southport", "Palm Beach"],
    cityHook: "The Gold Coast is salt, sun, chlorine and humidity in equal parts. Your hair gets battered from every direction and the right routine is the difference between healthy and fried.",
    localIntro: "Hi Gold Coast, I'm Jena. Your orders ship from Bangor and most Gold Coast postcodes get them in two to four days standard or one to two days express. Surfers, Broadbeach, Burleigh, Coolangatta, Robina, Southport and Palm Beach are all in that window. Gold Coast hair lives a tougher life than Brisbane hair. Salt water from the ocean, chlorine from the pool, UV that doesn't quit, and humidity to seal it all in. So I pack Gold Coast orders with bond repair to undo the daily damage, Pure Forever Blonde to keep cool tones from going brassy, QIQI aftercare for anyone with a smoothing treatment, and weekly hydration masks because beach hair is dehydrated hair. Free shipping over $150.",
    productPicks: [
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Salt, chlorine and UV all break bonds. Juuce bond repair daily rebuilds them.",
      },
      {
        label: "Blonde maintenance",
        collectionPath: "/collections/blonde-bombshells",
        reason: "Gold Coast sun pulls blondes brassy fast. Pure Forever Blonde keeps tone cool.",
      },
      {
        label: "Heat protection & UV",
        collectionPath: "/collections/heat-protection",
        reason: "Beach plus pool plus sun = daily UV exposure. Juuce Solar Enz blocks it.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to the Gold Coast?",
        answer: "Gold Coast orders typically arrive within 2–4 business days via AusPost standard or 1–2 days express. Surfers Paradise, Broadbeach, Burleigh Heads, Coolangatta, Robina, Southport, and Palm Beach are all in this window. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Surfers Paradise, Burleigh Heads, or Coolangatta?",
        answer: "Yes. Every Gold Coast postcode in the 4209–4230 range is covered. Coastal suburbs (Surfers, Broadbeach, Burleigh, Palm Beach, Coolangatta) and inland suburbs (Robina, Southport, Helensvale, Nerang) all receive in 2–4 days standard.",
      },
      {
        question: "What products survive Gold Coast beach and pool hair?",
        answer: "Bond repair daily (Juuce Bond Repair shampoo and conditioner) to rebuild what salt and chlorine break, Pure Forever Blonde to fight brass from sun exposure, Juuce Solar Enz UV leave-in, and weekly Pure Sacred Mask to restore moisture stripped by salt water.",
      },
      {
        question: "Is rinsing hair before swimming worth the trouble?",
        answer: "Yes, every single time. Rinsing hair with fresh tap water before pool or ocean swimming saturates the cuticle so it absorbs less chlorine or salt. Plus a leave-in conditioner before the swim. Sounds fussy but it's the difference between healthy summer hair and August hay.",
      },
    ],
    nearbyCities: ["brisbane", "sunshine-coast"],
  },

  "newcastle": {
    slug: "newcastle",
    name: "Newcastle",
    stateCode: "NSW",
    stateName: "New South Wales",
    stateSlug: "new-south-wales",
    standardDeliveryDays: "1–3",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Newcastle CBD", "Merewether", "Cooks Hill", "Lambton", "Charlestown", "Maitland", "Cessnock"],
    cityHook: "Newcastle is beach humidity in summer and dry coastal wind the rest of the year. Different problems each season, same answer: a routine that holds up to both.",
    localIntro: "Hi Newy, I'm Jena. Your orders come up from Bangor in Sydney's south and most Newcastle metro postcodes get them in one to three days standard or one to two days express. CBD, Merewether, Cooks Hill, Lambton, Charlestown and the surrounding suburbs are all in that window. Maitland and Cessnock take a day longer sometimes. Newcastle hair has two seasons of damage. Summer is humid coastal beach hair where smoothing treatments wear faster and blondes go brassy from sun. Winter is dry coastal wind that strips moisture out of ends. So I pack Newy orders for the actual conditions, not generic Sydney-similar advice. Bond repair for the wind season, smoothing aftercare for the humid months, and weekly hydration year-round. Free shipping over $150.",
    productPicks: [
      {
        label: "Smoothing & frizz control",
        collectionPath: "/collections/frizz-free-must-haves",
        reason: "Newcastle summer humidity demands the same routine as Sydney. Frizz-free range delivers.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Winter coastal wind plus colour services break bonds. Juuce bond repair rebuilds them.",
      },
      {
        label: "Pure Forever Blonde",
        collectionPath: "/collections/blonde-bombshells",
        reason: "Beach sun pulls blondes brassy fast. Twice-weekly purple shampoo keeps tone cool.",
      },
    ],
    faqs: [
      {
        question: "How fast does Hair Pinns ship to Newcastle?",
        answer: "Newcastle metro orders typically arrive within 1–3 business days via AusPost standard or 1–2 days express. CBD, Merewether, Cooks Hill, Lambton, Charlestown and the broader Newcastle catchment all sit in that window. Free shipping over $150.",
      },
      {
        question: "Do you deliver to the Hunter Valley (Maitland, Cessnock, Singleton)?",
        answer: "Yes. Every Hunter Valley postcode is covered. Maitland, Cessnock, Singleton, and the wine-region towns typically arrive within 2–3 business days standard. Express drops it to 1–2 days.",
      },
      {
        question: "What products handle Newcastle beach humidity?",
        answer: "QIQI smoothing aftercare if you have a salon treatment, Pure Forever Blonde to fight beach sun brassiness in blondes, Juuce Botanic Oil Serum for daily smoothness, and weekly Pure Sacred Mask to restore moisture stripped by sun and salt.",
      },
      {
        question: "Can I drive down to Bangor for a salon visit?",
        answer: "Yes, plenty of Newcastle clients do. Roughly a 2hr drive south. Book online via Fresha or message Hair Pinns to coordinate. If shipping makes more sense, the 1–3 day window means you're not waiting long.",
      },
    ],
    nearbyCities: ["sydney", "wollongong"],
  },

  "wollongong": {
    slug: "wollongong",
    name: "Wollongong",
    stateCode: "NSW",
    stateName: "New South Wales",
    stateSlug: "new-south-wales",
    standardDeliveryDays: "1–3",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Wollongong CBD", "North Wollongong", "Thirroul", "Corrimal", "Figtree", "Dapto", "Shellharbour", "Kiama"],
    cityHook: "Wollongong is the same coastal humidity as Sydney plus a southern-coast wind chill. Your hair fights moisture in summer and dryness in winter.",
    localIntro: "Hi Wollongong, I'm Jena. Your orders come down from Bangor in Sydney's south so you're one of the closer cities on the network. Most Illawarra metro postcodes get orders in one to three days standard or one to two days express. CBD, North Wollongong, Thirroul, Corrimal, Figtree, Dapto and Shellharbour are all in that window. Kiama takes a day longer sometimes. The Illawarra has the same coastal humidity as Sydney but with more wind, so smoothing treatments and bond repair are both heavy on my Wollongong shipping list. Beach suburbs (Thirroul, Austinmer, Coalcliff) drink Pure Forever Blonde and Solar Enz, and the inland suburbs lean on the same hydration ranges as Sydney clients. Free shipping over $150.",
    productPicks: [
      {
        label: "Smoothing & frizz control",
        collectionPath: "/collections/frizz-free-must-haves",
        reason: "Illawarra coastal humidity is the same fight as Sydney. This collection holds up.",
      },
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Coastal wind plus colour services break bonds. Juuce bond repair daily rebuilds them.",
      },
      {
        label: "Pure Lamellar Vitality",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Lightweight daily hydration for the dry winter months when wind strips moisture.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Wollongong?",
        answer: "Wollongong metro orders typically arrive within 1–3 business days via AusPost standard or 1–2 days express. CBD, North Wollongong, Thirroul, Corrimal, Figtree, Dapto and Shellharbour all sit in that window. Free shipping over $150.",
      },
      {
        question: "Do you deliver to the wider Illawarra (Kiama, Shellharbour, Albion Park)?",
        answer: "Yes. Every Illawarra postcode is covered. Kiama, Albion Park, Lake Illawarra and the southern Illawarra towns typically arrive within 2–3 business days standard.",
      },
      {
        question: "What products work for Wollongong coastal hair?",
        answer: "QIQI smoothing aftercare for humidity-prone hair, Pure Forever Blonde for sun-exposed blondes, Juuce Bond Repair for daily strength, and a heat shield before any styling tool. The combo of beach humidity and coastal wind hits hair hard.",
      },
      {
        question: "Can I drive to Bangor for salon services?",
        answer: "Yes, Wollongong is roughly 90 minutes north of Bangor. Plenty of Illawarra clients come up for treatments. Book online via Fresha or message Hair Pinns to coordinate.",
      },
    ],
    nearbyCities: ["sydney", "canberra", "newcastle"],
  },

  "geelong": {
    slug: "geelong",
    name: "Geelong",
    stateCode: "VIC",
    stateName: "Victoria",
    stateSlug: "victoria",
    standardDeliveryDays: "3–5",
    expressDeliveryDays: "1–2",
    popularSuburbs: ["Geelong CBD", "Newtown", "Belmont", "Highton", "Ocean Grove", "Torquay", "Bellarine Peninsula"],
    cityHook: "Geelong is Melbourne weather plus a coastal wind. Your hair gets every Melbourne problem and a few extra ones from the Bellarine breeze.",
    localIntro: "Hi Geelong, Jena here. Your orders ship from Bangor and most Geelong metro postcodes get them in three to five days standard or one to two days express. CBD, Newtown, Belmont, Highton are all in that window. Ocean Grove, Torquay and the Bellarine Peninsula take a day longer sometimes. Geelong hair has the Melbourne problem (four seasons in a day, heating cycle, dry winters) plus a coastal wind off the bay that strips moisture out faster than inland Melbourne. So I pack Geelong orders with bond repair for daily strength, Pure Sacred Mask for weekly hydration that fights the wind, and a finishing oil to seal ends. Free shipping over $150.",
    productPicks: [
      {
        label: "Bond repair",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Melbourne-style seasonal swings plus coastal wind break bonds. Bond repair rebuilds them.",
      },
      {
        label: "Hydration & moisture",
        collectionPath: "/collections/juuce-botanicals",
        reason: "Heated air plus Bellarine wind strips moisture. Weekly mask treatments restore it.",
      },
      {
        label: "Pure Lamellar Vitality",
        collectionPath: "/collections/pure-certified-organic-hair-care",
        reason: "Lightweight daily hydration for the seasonal swing without product build-up.",
      },
    ],
    faqs: [
      {
        question: "How long does shipping take to Geelong?",
        answer: "Geelong metro orders typically arrive within 3–5 business days via AusPost standard or 1–2 days express. CBD, Newtown, Belmont, Highton and the Bellarine Peninsula all sit in that window. Free shipping over $150.",
      },
      {
        question: "Do you deliver to Ocean Grove, Torquay, or the Bellarine?",
        answer: "Yes. Every Geelong-region postcode is covered. Coastal Bellarine towns (Ocean Grove, Torquay, Barwon Heads, Queenscliff) typically arrive within 4–6 business days standard. Express drops it.",
      },
      {
        question: "What products work for Geelong coastal weather?",
        answer: "Juuce Bond Repair for daily strength against coastal wind, weekly Juuce Super Soft Hydration or Pure Sacred Mask, Juuce Botanic Oil Serum to seal ends, and Pure Lamellar Vitality as a daily lightweight wash.",
      },
      {
        question: "Is there a Hair Pinns physical store in Victoria?",
        answer: "No, the only Hair Pinns salon is in Bangor, NSW. But every product on the site ships to Geelong and the broader Bellarine within the standard window. Free shipping over $150.",
      },
    ],
    nearbyCities: ["melbourne", "adelaide"],
  },
};

/** Lookup a city by slug. */
export const getShippingCityData = (slug: string): ShippingCityData | undefined =>
  shippingCities[slug];

/** All city slugs. Used by sitemap + prerender generators. */
export const allShippingCitySlugs = Object.keys(shippingCities);
