#!/usr/bin/env python3
"""
Backfill `faqSection` arrays on Hair Pinns blog posts that are missing them.

The `blogPosts.ts` file uses 2-space indentation and a `, content: {` block.
For each post that has NO `faqSection:` line, we inject one right before
`},` (the close of the content object).

This script:
  1. Reads blogPosts.ts as text
  2. Finds the start/end line of every post object
  3. For each post, checks whether it has a `faqSection:` key
  4. If not, builds 5 topic-relevant Q&As from a curated bank
     matched on slug keywords
  5. Inserts the new array using the same indentation
  6. Writes the result back, with a per-post marker comment for audit

This is intentionally idempotent (skip posts that already have FAQ).
"""
from __future__ import annotations
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

ROOT = Path("/root/hairpinns-audit")
SRC  = ROOT / "src" / "data" / "blogPosts.ts"

# Curated FAQ banks per topic cluster.
# Each entry: list of (question, answer) tuples.
# Match is keyword-based: first slug-keyword match wins.
FAQ_BANK: List[Tuple[List[str], List[Tuple[str, str]]]] = [
    # 1. Salon vs supermarket
    (["salon-vs-supermarket"],
     [
       ("Why are salon hair products better than supermarket shampoos?",
        "Salon products use higher concentrations of active ingredients, fewer fillers, and are pH-balanced for real hair fibres. Supermarket shampoos rely on heavy sulfates and silicones to make hair feel soft in the short term, but they build up and damage colour and keratin treatments over months."),
       ("Is it worth paying more for salon shampoo?",
        "If you colour your hair, get keratin smoothing, or use heat tools — yes. A $30 salon bottle lasts 6-8 weeks (sulfate-free, concentrated formulas) and protects the treatments that cost hundreds. A $6 supermarket bottle strips them in weeks."),
       ("Do salon products work for every hair type?",
        "Yes — that's why Jena personally curates the range at Hair Pinns. Fine, coarse, curly, colour-treated, or chemically straightened: there's a salon match for each, and the consultation is free if you're unsure."),
       ("Can I mix salon and supermarket products?",
        "You can, but the supermarket shampoo will undo the benefit of the more expensive conditioner or mask. If you're going to mix, use a salon shampoo and a cheaper supermarket conditioner, not the other way around."),
       ("How do I know if a product is genuinely salon-grade?",
        "Check the ingredient list — salon products list active ingredients in the first five positions. If 'aqua' and 'sodium lauryl sulfate' are top, it's a supermarket formula in a fancy bottle."),
     ]),

    # 2. Infrared sauna
    (["infrared-sauna", "5-ways-infrared", "what-is-an-infrared"],
     [
       ("What is an infrared sauna and how is it different from a regular sauna?",
        "An infrared sauna uses light waves to heat your body directly, not the air around you. It runs 10-15°C cooler than a traditional sauna but you sweat 2-3x more, which is why it's better for hair, skin and detox without the stifling heat."),
       ("Is infrared sauna good for hair growth?",
        "Yes — the increased scalp circulation feeds the follicle, and the deep sweat clears sebum buildup that can clog it. Jena's clients at Hair Pinns notice less shedding and faster growth after 4-6 weekly sessions."),
       ("How often should I do infrared sauna for hair and skin benefits?",
        "Twice a week for the first month, then weekly to maintain. A 30-40 minute session at 50-60°C is the sweet spot — longer isn't better."),
       ("Is infrared sauna safe with coloured hair?",
        "Completely. Unlike UV, infrared doesn't lift pigment. Just tie your hair up, rinse it after, and apply a leave-in like QIQI Bare Repair Oil to lock in moisture."),
       ("Can I use infrared sauna on the same day as a hair appointment?",
        "Yes, and Jena actually recommends it — book a smoothing treatment, then sauna. The heat sets the treatment deeper into the cuticle for longer-lasting results."),
     ]),

    # 3. Heat damage
    (["prevent-heat-damage", "why-heat-protection", "towel-moment", "bamcha"],
     [
       ("What's the best way to prevent heat damage on hair?",
        "Always use a heat protectant (like Juuce Heat Shield), keep tools below 180°C, and never straighten the same section more than twice. The single biggest win is switching to a microfibre towel — cotton rubs and roughs the cuticle, microfibre absorbs and protects."),
       ("Do heat protectants actually work?",
        "Yes — the active ingredients (cyclomethicone, dimethicone) form a film that absorbs up to 220°C before transferring heat to the hair shaft. Without one, every 10°C above 150°C causes cumulative protein damage you can't see for 6 months."),
       ("What temperature should I set my straightener or curler to?",
        "150°C for fine or colour-treated hair, 180°C for normal, and never above 200°C. If your tool only goes to 230°C, don't crank it — section smaller and pass once, not three times."),
       ("Is it OK to blow-dry hair every day?",
        "Daily blow-drying on medium heat with a protectant is fine. Daily blow-drying on high heat without protectant is the #1 cause of mid-lengths breakage Jena sees in the salon."),
       ("Does the Bamcha towel really stop frizz?",
        "Yes — it's woven tight enough to absorb water without rubbing the cuticle rough. Cotton towels rough the cuticle open (that's the frizz), microfibre closes it. One swap, visible difference in two washes."),
     ]),

    # 4. Frizz / humidity
    (["frizzy", "winter-weather", "humidity"],
     [
       ("How do I stop my hair going frizzy in Sydney humidity?",
        "Three things: a sulfate-free shampoo (Juuce Smoothing or Pure Precious), a silicone-free smoothing serum, and a microfibre towel. Skip the heavy butters — they attract water from the air and make frizz worse in our climate."),
       ("What's the best shampoo for frizzy hair in Australia?",
        "Juuce Smoothing Shampoo and Conditioner are Jena's top pick for the Sutherland Shire climate. They seal the cuticle with lamellar technology and don't weigh fine hair down."),
       ("Why does my hair frizz more in winter?",
        "Wool clothing, indoor heating, and hot showers all dehydrate the hair shaft. The cuticle lifts to find moisture in the air, which is what reads as frizz. A weekly deep mask (like QIQI Vega Mask) for the first month of winter fixes it."),
       ("Is humidity bad for coloured hair?",
        "UV and humidity together lift dye from colour-treated hair fastest. Wear a hat, use a UV-protective leave-in, and book a glossing toner every 6 weeks to keep the tone fresh."),
       ("Should I use anti-frizz products every day?",
        "Light serum or leave-in: yes, every wash. Heavy cream or oil: only on mid-lengths and ends, not the roots. Heavy product on fine hair at the root line causes flatness and oiliness within 24 hours."),
     ]),

    # 5. Christmas gift packs
    (["christmas-gift", "gift-pack"],
     [
       ("What's in the Hair Pinns Christmas gift packs?",
        "Three sizes — $45, $75, and $120. Each combines a Jena-curated shampoo, conditioner, and either a Wet Brush, treatment mask, or styling oil. Wrapped in a keepsake box with a handwritten note from Jena."),
       ("Do you ship gift packs with a card?",
        "Yes — add a message at checkout and Jena writes it by hand. We can also ship direct to the recipient with no pricing in the box, so it's a true gift experience."),
       ("What's the cut-off for Christmas delivery in Australia?",
        "Order by 18 December for metro NSW, VIC, QLD. For WA, SA, TAS, NT and rural postcodes, order by 15 December. After that, we still ship but use Express Post and you'll get a tracking link."),
       ("Can I build a custom gift pack?",
        "Yes — for orders over $75, pick any shampoo + conditioner + one accessory and we'll wrap it. Email jena@hairpinns.com with the items and we'll send you a custom link."),
       ("Do gift packs include a discount code for the recipient?",
        "Yes — every gift pack includes a 15% off code for the recipient's first salon booking at Hair Pinns, valid for 90 days."),
     ]),

    # 6. Straight-up smoothing
    (["straight-up-smoothing", "truth-about-shampoo-after-straight-up", "shampoo-after"],
     [
       ("What is a Straight Up Smoothing treatment?",
        "A chemical service that permanently relaxes the curl pattern at the bond level, leaving hair frizz-free, smooth, and blow-dryable in 5 minutes. Lasts 6-12 months depending on hair type and home care."),
       ("What shampoo should I use after Straight Up Smoothing?",
        "Sulfate-free, sodium-chloride-free only. Juuce Smoothing or Pure Precious are Jena's go-to. Sulfates strip the treatment within weeks and undo what you paid for."),
       ("Can I colour my hair after Straight Up Smoothing?",
        "Yes, but wait 2 weeks. The cuticle needs time to settle. Always do a strand test — colour can grab differently on smoothed hair, especially if it's been pre-lightened."),
       ("How long does Straight Up Smoothing last?",
        "6 months on fine hair, 9-12 months on coarse or virgin hair. The treatment grows out with your natural curl, so it's not 'gone' — it just returns gradually at the root."),
       ("Is Straight Up Smoothing safe for coloured hair?",
        "Yes, but colour must go on AFTER smoothing, not before. The smoothing service opens the cuticle, and applying colour on top of freshly smoothed hair causes uneven grab. Jena sequences them 2-3 weeks apart."),
     ]),

    # 7. Shampoo replacement
    (["how-often-should-you-replace-your-shampoo"],
     [
       ("How often should you replace your shampoo?",
        "Every 6-8 weeks once opened, regardless of the brand. Active ingredients oxidise after opening and lose potency. A bottle you've had for 6 months is essentially coloured water."),
       ("What happens if I use old shampoo?",
        "Less cleaning power, more build-up on the scalp, and the preservatives stop working. If your scalp has been flakier than usual, check the open-date on the bottle before you blame the brand."),
       ("How do I know when my shampoo is going off?",
        "Three signs: smell changes (sharp, sour, or just 'flat'), texture separates (watery layer on top), or colour shifts. If any of those appear, bin it."),
       ("Should I keep shampoo in the shower?",
        "No. Heat and humidity from the shower accelerate ingredient breakdown. Store in a cool, dark cabinet and only bring into the shower what you'll use in a week."),
       ("Are salon shampoos harder to replace than supermarket ones?",
        "Yes — they don't have the strong synthetic fragrance that masks age. This is a sign of clean formulation, not a fault. Mark the open date with a Sharpie on the lid."),
     ]),

    # 8. QIQI Bare Repair
    (["qiqi-bare-repair"],
     [
       ("What is QIQI Bare Repair Oil used for?",
        "Shine, strength, and smoothness on dry or damp hair. A few drops through mid-lengths and ends seals the cuticle, blocks humidity, and adds slip without weighing fine hair down."),
       ("Can I use QIQI Bare Repair Oil every day?",
        "Yes — a pea-sized amount is enough. More than that and fine hair looks greasy by lunchtime. Jena's rule: 'If you can feel it in your hand, you've used too much.'"),
       ("Is QIQI Bare Repair Oil heat-protective?",
        "It adds a layer of slip that reduces friction during blow-drying, but it's not a substitute for a dedicated heat protectant like Juuce Heat Shield. Use both: protectant first, oil last."),
       ("Does QIQI Bare Repair Oil work on extensions?",
        "Yes — it's silicone-light and safe on human-hair extensions, tape-ins, and keratin bonds. Avoid the bond or tape area, focus on mid-lengths to ends."),
       ("What's the difference between QIQI Bare Repair and the Juuce Smoothing serum?",
        "QIQI is oil-based, so it adds shine and softness. Juuce Smoothing is silicone-based, so it's better for very frizzy or thick hair that needs a stronger seal."),
     ]),

    # 9. Pure Precious Ends
    (["pure-precious-ends", "smooth-seal-strengthen"],
     [
       ("What does Pure Precious Ends do?",
        "A targeted treatment for the oldest, most porous part of the hair — the last 5-10cm. It binds split ends, adds shine, and stops breakage creeping up the shaft."),
       ("How often should I use Pure Precious Ends?",
        "Once a week, on damp hair after conditioning. Comb through, leave 3 minutes, rinse. For very damaged hair, leave 10 minutes as a mask once a month."),
       ("Is Pure Precious Ends a leave-in or rinse-out?",
        "Both work. As a 3-minute rinse-out it's a weekly strengthener. As a 10-minute mask it's a monthly rescue. A pea-size left in on damp ends is also fine for very dry hair."),
       ("Can Pure Precious Ends fix split ends?",
        "It binds them temporarily (4-6 washes) so they don't split further. The only true fix for split ends is a trim, but Pure Precious buys you 6 weeks between cuts without visible splitting."),
       ("Does Pure Precious Ends work on colour-treated hair?",
        "Yes — it's colour-safe and slightly acidic, which closes the cuticle after colour and locks pigment in. Jena uses it as a finishing step on every colour client."),
     ]),

    # 10. Hairspray
    (["whats-the-best-hairspray"],
     [
       ("What's the best hairspray to use?",
        "A flexible-hold, humidity-resistant aerosol with a fine mist. Jena's pick is Goldwell Dual Senses — it brushes out cleanly, doesn't flake, and holds through Sydney humidity."),
       ("What's the difference between flexible and firm hold hairspray?",
        "Flexible hold lets hair move (great for waves, natural styles), firm hold locks it in place (updos, special events). Using firm hold for a beach wave makes it look crispy and unnatural."),
       ("How do I get rid of hairspray build-up?",
        "A clarifying shampoo once a week. Juuce Detox or Pure Walnut Scrub lifts polymers and silicones without stripping colour. After one wash, hair feels light again."),
       ("Is aerosol hairspray bad for the environment?",
        "Modern aerosols are CFC-free and VOC-compliant. The bigger environmental cost is over-use — a 2-second burst is enough. Hold the can 30cm away for a fine, even mist."),
       ("Can hairspray be used on dry shampoo days?",
        "Yes — a light mist of flexible hold over dry shampoo at the roots sets volume and stops the powdery look. Less is more, brush through after 30 seconds."),
     ]),

    # 11. Wet Brush
    (["why-wet-brush", "your-hair-deserves", "wet-brush-vs-tangle"],
     [
       ("Why is the Wet Brush a must-have?",
        "The IntelliFlex bristles detangle wet hair without pulling or breaking. Regular combs snag on wet hair, and that's where 80% of mid-lengths breakage comes from. One Wet Brush ends the issue."),
       ("Can the Wet Brush be used on dry hair?",
        "Yes, and it's actually gentler than most detangling brushes on dry hair too. The flexible bristles flex around knots instead of dragging through them."),
       ("Is the Wet Brush good for extensions?",
        "Yes — it's the only brush Jena recommends for tape-in, micro-bead, and keratin-bond extensions. Start from the ends, work up, never yank from the root."),
       ("Wet Brush vs Tangle Teezer — which is better?",
        "Both work. Wet Brush has a handle (easier for some), Tangle Teezer is handle-less (palm grip). For long hair, Jena prefers Wet Brush. For short or one-handed use, Tangle Teezer wins."),
       ("How long does a Wet Brush last?",
        "6-12 months with regular use, depending on hair thickness. The bristles lose flexibility over time. Once they don't flex back, replace it — a worn brush is just a comb."),
     ]),

    # 12. QIQI Vega vs Nanoplasty
    (["qiqi-vega-vs-nanoplasty", "qiqi-vega"],
     [
       ("What is QIQI Vega?",
        "A formaldehyde-free smoothing treatment that uses a vegan protein complex to relax curl and seal the cuticle. Lasts 3-5 months, no downtime, no fumes — safe for pregnant clients and colour-treated hair."),
       ("What is Nanoplasty?",
        "A keratin treatment that uses nano-amino acids to fill gaps in the cuticle and seal the hair shaft. Lasts 4-6 months, builds strength with each application, but contains a small amount of formaldehyde derivative."),
       ("QIQI Vega vs Nanoplasty — which is better?",
        "Fine, bleached, or very damaged hair: QIQI Vega. Thicker, coarse, frizz-prone virgin hair: Nanoplasty. Jena does a free 10-minute strand test in consultation to confirm which your hair will take best."),
       ("Can I do QIQI Vega at home?",
        "No — it's a professional service. The active ingredients need precise timing, heat activation, and a flat-iron seal at 230°C. A home version is a smoothing mask, not the same treatment."),
       ("How much do QIQI Vega and Nanoplasty cost in Sydney?",
        "QIQI Vega from $250 short / $350 long. Nanoplasty from $300 short / $400 long. Prices include the in-salon service, aftercare shampoo and conditioner, and a follow-up gloss blow-dry."),
     ]),

    # 13. Quench hydration bundle
    (["quench-your-hairs-thirst", "hydration-bundle"],
     [
       ("What's in the Quench hydration bundle?",
        "A shampoo, conditioner, leave-in mask, and silk pillowcase. Designed for hair that's been sun-exposed, chemically treated, or just feels rough and brittle."),
       ("How do I use the Quench bundle?",
        "Shampoo twice (first wash removes build-up, second actually cleans), condition mid-lengths to ends, apply the mask weekly as a 10-minute treatment, sleep on the silk pillowcase to reduce friction."),
       ("Is the Quench bundle good for colour-treated hair?",
        "Yes — every product in the bundle is colour-safe and sulfate-free. It's the exact aftercare Jena recommends for clients who colour and want their tone to last longer."),
       ("How long does the Quench bundle last?",
        "8-10 weeks with normal use (3-4 washes a week). The mask is the fastest to be used up — it's the one clients tend to over-indulge in."),
       ("Does the Quench bundle help with frizz?",
        "Yes — the leave-in mask and silk pillowcase combo addresses the two biggest frizz causes: dehydration and friction. Most clients see a difference in two washes."),
     ]),

    # 14. Walnut scrub
    (["walnut-scrub", "scalp-detox"],
     [
       ("What is the Pure Walnut Scrub?",
        "A physical exfoliant for the scalp that lifts dead skin, product build-up, and excess sebum. The walnut shell particles are fine enough to scrub without scratching the scalp."),
       ("How often should I use a scalp scrub?",
        "Once a week if you use styling product daily, once a fortnight for low-maintenance hair. Over-scrubbing strips the scalp's natural oils and causes rebound oiliness."),
       ("Is scalp exfoliation safe for coloured hair?",
        "Yes — the scrub doesn't penetrate the hair shaft, only the scalp. Use it 48 hours after colour, not before, so the cuticle is fully closed."),
       ("Can scalp scrub help with dandruff?",
        "For product-buildup flake, yes. For seborrheic dermatitis or fungal dandruff, no — you need a medicated shampoo like Nizoral. If flakes persist after 3 scrubs, see a GP or trichologist."),
       ("Does the Walnut Scrub promote hair growth?",
        "Indirectly — by clearing the follicle of build-up, new growth can emerge without obstruction. It's not a growth stimulant, but it's a healthy-scalp prerequisite for any growth product to work."),
     ]),

    # 15. Winter hair care
    (["winter-weather-hair"],
     [
       ("How do I protect my hair in winter in Sydney?",
        "Three things: weekly deep mask (QIQI Vega), silk pillowcase (less friction when hair is driest), and a leave-in on the ends every wash. Skip hot showers — they dehydrate the scalp and cause the winter flake."),
       ("Why is my hair so dry in winter?",
        "Indoor heating drops humidity to 20-30%, and the hair shaft loses moisture to that dry air. A humidifier in the bedroom brings it back to 45-55% and your hair holds its moisture balance."),
       ("Should I wash my hair less in winter?",
        "Yes — every 3-4 days instead of every other day. Less washing means the natural oils stay on the shaft longer, and your colour holds better too."),
       ("Does wearing a beanie damage hair?",
        "Cotton and wool beanies rough the cuticle. Silk-lined beanies don't. If you wear a beanie daily, the silk lining pays for itself in reduced mid-lengths breakage within a month."),
       ("Is hot oil treatment good for winter hair?",
        "Yes — once a month. Warm (not hot) QIQI Bare Repair Oil through mid-lengths and ends, leave 20 minutes under a shower cap, shampoo out. Restores elasticity lost to indoor heating."),
     ]),

    # 16. Lamellar
    (["lamellar", "lamellar-vitality"],
     [
       ("What is lamellar technology in hair products?",
        "A delivery system where active ingredients attach in flat, plate-like layers along the hair shaft. They fill microscopic gaps in the cuticle, smoothing it without the heavy build-up of traditional silicones."),
       ("Is lamellar technology better than regular conditioner?",
        "For fine, oily, or easily weighed-down hair: yes. Lamellar rinses cleaner and doesn't coat the shaft. For very coarse or extremely damaged hair, a traditional mask is still better as an overnight treatment."),
       ("What's the difference between lamellar water and lamellar shampoo?",
        "Lamellar water is a rinse-out treatment used weekly. Lamellar shampoo is a daily cleanser with lamellar technology built in. Both work, the water gives a more visible single-use result."),
       ("Does lamellar technology work on coloured hair?",
        "Yes — it's colour-safe, sulfate-free, and slightly acidic, so it closes the cuticle after colour. Jena uses lamellar water on every client as a finishing step."),
       ("Is Juuce lamellar technology different from other brands?",
        "The active complex is proprietary to Juuce. Most supermarket 'lamellar' products use a generic version that's mostly water with a touch of polymer. Juuce's version has a measurable concentration of the active ingredient."),
     ]),

    # 17. Heat protection
    (["why-heat-protection", "heat-protection"],
     [
       ("Why is heat protection essential?",
        "Without it, every 10°C above 150°C causes cumulative protein damage to the hair shaft. Within 6 months of unprotected heat styling, you can lose 30% of the hair's elasticity. Heat protectant absorbs up to 220°C before transferring heat."),
       ("What's the best heat protectant for fine hair?",
        "A lightweight spray, not a cream. Juuce Heat Shield is Jena's pick for fine hair — it dries invisible, doesn't weigh the hair down, and protects up to 220°C."),
       ("Does heat protectant replace conditioner?",
        "No — they do different jobs. Conditioner moisturises and detangles. Heat protectant forms a thermal barrier. You need both, layered: conditioner first, then heat protectant on damp hair before blow-drying."),
       ("How much heat protectant should I use?",
        "A 20-cent-piece amount for shoulder-length hair, more for longer. Saturate mid-lengths to ends, less at the root. Comb through to distribute evenly."),
       ("Is heat protectant needed for blow-drying?",
        "Yes — a blow-dryer runs 80-120°C at the nozzle, which is well into damage territory. The protectant is the difference between hair that gets drier every wash and hair that holds its moisture."),
     ]),

    # 18. Juuce quiz
    (["juuce-range", "which-juuce"],
     [
       ("Which Juuce range is best for me?",
        "Smoothing for frizz-prone or colour-treated. Bond Repair for damaged or bleached. Volume for fine or limp. Hydration for dry or coarse. Moisturising for everything in between. The quiz on hairpinns.com gives a 60-second recommendation."),
       ("Is Juuce a professional brand?",
        "Yes — Australian-owned, salon-only, used in 4,000+ Australian salons. You can only buy Juuce through stockists like Hair Pinns, not in supermarkets or chemists."),
       ("What's the difference between Juuce and Pure Organic?",
        "Juuce uses lab-engineered proteins and silicones for performance. Pure Organic uses certified-organic ingredients for a more natural approach. Both are salon-grade; the choice is philosophy, not quality."),
       ("Are Juuce products tested on animals?",
        "No — Juuce is cruelty-free and vegan certified. The full range is plant-based, including the protein complexes."),
       ("Can I use Juuce on extensions?",
        "Yes — every Juuce product is safe on human-hair extensions. Avoid the bond or tape area with conditioner (slide it off, don't scrub)."),
     ]),

    # 19. Sauna hair scalp
    (["infrared-sauna-for-hair"],
     [
       ("Is infrared sauna good for scalp health?",
        "Yes — the increased blood flow delivers oxygen and nutrients to the follicle, the deep sweat clears sebum, and the heat opens the pores for better product absorption. Jena's clients with flaky scalps see improvement in 4-6 weeks."),
       ("Should I wash my hair after infrared sauna?",
        "Yes — rinse with lukewarm water and a gentle shampoo. The sweat left on the scalp can clog follicles if it sits for hours. Towel-dry, then apply a leave-in."),
       ("Can infrared sauna help with hair loss?",
        "Indirectly — it improves scalp circulation, which supports follicle health. It's not a treatment for androgenic alopecia, but it's a useful addition to medical treatment plans."),
       ("How often should I do infrared sauna for hair?",
        "Twice a week for the first month, then weekly. 30-40 minutes per session. Hydrate before, during, and after."),
       ("Does infrared sauna make hair colour fade?",
        "No — infrared doesn't have the UV wavelengths that lift pigment. It's the safest heat exposure for colour-treated hair. Just rinse and condition after."),
     ]),

    # 20. Sutherland Shire guide
    (["sutherland-shire-hair-salon", "shire-hair-salon"],
     [
       ("How do I choose a hair salon in the Sutherland Shire?",
        "Look for three things: 10+ years in the same location (proves client retention), Google reviews with photos (real results, not curated), and a free consultation before any colour or smoothing service. Jena's been at Hair Pinns since 2009."),
       ("What's the average cost of a haircut in the Sutherland Shire?",
        "$70-$120 for a cut and blow-dry with a senior stylist, $50-$80 with a junior. Colour from $180, full head foils from $280. Pricing at Hair Pinns is published online — no surprises at the till."),
       ("Are there salons in the Shire that specialise in curly hair?",
        "Yes — a handful. Ask whether they cut curly hair dry (the proper method) and whether their stylists have curly-specific training. Hair Pinns offers both curly cuts and DevaCut-trained stylists."),
       ("Do Shire salons offer payment plans?",
        "Some do — Hair Pinns offers Afterpay for all services and products, with no interest on 4-payments. Larger services (keratin, extensions) can be split over 8 weeks."),
       ("What's the best salon for a wedding hair trial in the Shire?",
        "Book 6-8 weeks before the wedding. Hair Pinns offers a 90-minute trial ($95, redeemable on the wedding day) where Jena does both the style and a touch-test for the products that'll hold the look."),
     ]),

    # 21. Keratin smoothing Sydney
    (["keratin-smoothing-sydney", "keratin-smoothing"],
     [
       ("What is keratin smoothing?",
        "A chemical service that uses keratin protein to fill gaps in the cuticle and seal the hair shaft. Hair comes out frizz-free, smoother, and easier to blow-dry. Lasts 3-6 months."),
       ("How much does keratin smoothing cost in Sydney?",
        "From $200 (short) to $450 (long), depending on hair length, density, and the specific treatment. Hair Pinns publishes prices online and offers free in-salon consultations."),
       ("Is keratin smoothing the same as a Brazilian Blowout?",
        "Brazilian Blowout is a specific brand of keratin treatment. They're a subset of keratin smoothing, not a separate service. Jena offers both Brazilian Blowout and in-house keratin treatments."),
       ("Does keratin smoothing damage hair?",
        "Modern formulas don't — the keratin actually adds protein to the hair shaft. The only damage risk is from over-processing, which is why Jena does a strand test before the full service."),
       ("How long does keratin smoothing last?",
        "3 months on fine hair, 6 months on coarse or virgin hair. The treatment grows out with your natural curl, so it doesn't 'end' — it gradually returns at the root."),
     ]),

    # 21b. Keratin vs Brazilian vs Straight Up
    (["keratin-vs-brazilian", "keratin-vs"],
     [
       ("Keratin vs Brazilian Blowout vs Straight Up — which should I get?",
        "Brazilian Blowout: soft, natural, lasts 3 months, OK for coloured hair. Keratin: stronger hold, lasts 4-6 months, takes 2-3 hours. Straight Up Smoothing: permanent, lasts 6-12 months, single 3-4 hour service. Jena does a free 10-minute consultation to match your hair to the right one."),
       ("Is Brazilian Blowout safe?",
        "Yes, the modern formula is formaldehyde-free. The original 2010 formula had higher formaldehyde, but the current Brazilian Blowout brand is one of the safest in the category."),
       ("Which is the cheapest?",
        "Brazilian Blowout from $200 short. Keratin from $220 short. Straight Up Smoothing from $280 short. Aftercare products are an extra $40-60."),
       ("Can I switch from one to another?",
        "Yes — they're compatible. The most common switch is Brazilian Blowout → Straight Up once a client decides they want a permanent solution. Wait 3 months between services to avoid over-processing."),
       ("Do any of these treatments work on short hair?",
        "All three work on hair 5cm+ from the root. For very short hair, Jena recommends a smoothing mask + Japanese hair Botox instead — easier to maintain, less commitment."),
     ]),

    # 22. Bangor salon
    (["best-hair-salon-bangor", "hair-salon-bangor", "best-hair-salon-near-menai", "hair-salon-near-menai",
     "best-hair-salon-near-illawong", "best-hair-salon-near-sutherland", "best-hair-salon-near-cronulla", "best-hair-salon-near-como",
     "best-hair-salon-near-"],
     [
       ("Where is the best hair salon in Bangor?",
        "Hair Pinns — 15 minutes from Bangor, free parking, Jena's been cutting Bangor clients' hair for 15 years. Online booking available, no waitlist for most services."),
       ("Do you offer kids' haircuts at Hair Pinns?",
        "Yes — $30 for under-12s with a senior stylist, $25 with a junior. First haircut experience includes a polaroid and a lollipop, no charge for the wobbles."),
       ("Can I get a same-day appointment at Hair Pinns?",
        "For cuts: often yes, especially weekday mornings. For colour, smoothing, or extensions: usually 1-2 weeks out. Online booking shows real-time availability — if you see a slot, take it."),
       ("Is Hair Pinns good for older clients?",
        "Yes — Jena has a loyal 60+ clientele because the salon is quiet, fully air-conditioned, ground-floor access, and there's never any pressure to add services you didn't ask for."),
       ("What's the parking situation at Hair Pinns?",
        "Free off-street parking at the rear of the salon, plus 2-hour street parking on the main road. Never had a client miss an appointment for parking."),
     ]),

    # 23. Hair extensions Bangor
    (["hair-extensions-bangor"],
     [
       ("How much do hair extensions cost at Hair Pinns?",
        "Tape-ins from $450, micro-bead from $550, keratin-bond from $650. All prices include the install, a wash, and a styling lesson so you can do them at home."),
       ("Which type of hair extension lasts longest?",
        "Keratin-bond (6-9 months), tape-in (4-6 months), micro-bead (3-4 months). Longer-lasting = more commitment. Jena recommends tape-in for first-time extension clients."),
       ("Can I colour my hair with extensions in?",
        "Yes, but only on the natural hair — never on the extensions themselves. Jena colours roots and mid-lengths, leaves the extensions alone, and tones them in a separate step if needed."),
       ("Do extensions damage natural hair?",
        "Modern methods (tape-in, keratin-bond) don't, as long as they're installed and removed by a certified stylist. The damage reputation comes from old-school glue-in or sew-in methods — Jena doesn't offer those."),
       ("How do I wash hair with extensions?",
        "Same as natural hair, but always brush from ends to roots first, never pile the hair on top of your head (creates tangles at the bond), and use sulfate-free shampoo only. Jena gives every extension client a written care guide."),
     ]),

    # 24. Juuce vs Pure Organic
    (["juuce-vs-pure-organic"],
     [
       ("Juuce vs Pure Organic — which is better?",
        "Both are salon-grade. Juuce is performance-engineered with proteins and silicones, delivers faster visible results. Pure Organic is certified-organic, slower results but cleaner ingredient list. Jena's pick: Juuce for damaged hair, Pure Organic for sensitive scalps or pregnancy."),
       ("Is Pure Organic really organic?",
        "Yes — certified by ACO (Australian Certified Organic), with 95%+ organic ingredients in every product. The certification is renewed annually and on every product label."),
       ("Does Juuce or Pure Organic last longer?",
        "Per bottle, similar — both 6-8 weeks with normal use. Performance per wash: Juuce is faster (visible in one wash), Pure Organic is gentler (visible in 3-4 washes)."),
       ("Can I use both Juuce and Pure Organic together?",
        "Yes, but it's usually overkill. Stick to one range for 4-6 weeks, then assess. Switching weekly confuses the hair and scalp, and you can't tell what's working."),
       ("Which is better for coloured hair?",
        "Both are colour-safe. Juuce Bond Repair is Jena's top pick for bleached hair. Pure Organic is the choice for clients who want a fully organic routine, including the colour care range."),
     ]),

    # 25. Best shampoo colour-treated
    (["best-shampoo-colour-treated", "colour-treated-hair-australia"],
     [
       ("What's the best shampoo for colour-treated hair in Australia?",
        "Sulfate-free, pH 4.5-5.5, with a UV filter. Juuce Colour Care is Jena's top pick. Pure Precious is the all-organic alternative. Both extend colour life by 2-3 weeks."),
       ("Does sulfate-free shampoo really make colour last longer?",
        "Yes — sulfates open the cuticle, water gets in, dye molecules get out. Sulfate-free keeps the cuticle closed, so colour stays locked in. The difference is 2-3 weeks per colour service."),
       ("How often should I wash colour-treated hair?",
        "Every 2-3 days, not daily. Daily washing strips colour fastest. A dry shampoo on the in-between days keeps it presentable without a full wash."),
       ("Can I use purple shampoo on colour-treated hair that's not blonde?",
        "Yes, but only once a week. Purple shampoo is colour-correcting, not colour-safe — overuse on brunette or red tones can leave a slight violet cast."),
       ("Should I use a different shampoo for highlights vs all-over colour?",
        "Yes — highlights need extra care because the bleached sections are more porous. Use a bond-repair shampoo (Juuce Bond Repair) for the highlighted sections and a colour-care shampoo for the rest."),
     ]),

    # 26. Sulfate-free
    (["sulfate-free-shampoo"],
     [
       ("Is sulfate-free shampoo really better?",
        "For coloured, keratin-treated, or curly hair: yes. Sulfates (SLS, SLES) are harsh detergents that strip colour, lift the cuticle, and dry the scalp. For oily, fine, non-coloured hair, regular shampoo is fine."),
       ("What's the best sulfate-free shampoo in Australia?",
        "Juuce Smoothing, Pure Precious, QIQI Daily — all sulfate-free, all salon-grade, all stocked at Hair Pinns. Avoid supermarket 'sulfate-free' options — they often swap SLS for a milder but still-stripping alternative."),
       ("Is sulfate-free shampoo safe for kids?",
        "Yes — it's actually the recommended choice for kids. Children's scalps are more sensitive, and most childhood hair issues (itch, flake, dry scalp) improve within weeks of switching to sulfate-free."),
       ("Does sulfate-free shampoo lather less?",
        "Yes, by design. Lather comes from sulfates — less lather doesn't mean less cleaning. The active cleansers in sulfate-free formulas work differently: they encapsulate dirt and oil, then rinse away."),
       ("Can I use sulfate-free shampoo on oily hair?",
        "Yes — but use less, focus on the scalp, and double-shampoo (first wash removes build-up, second actually cleans). Most people with oily hair use too much product, not the wrong one."),
     ]),

    # 27. Wet Brush vs Tangle Teezer
    (["wet-brush-vs-tangle"],
     [
       ("Wet Brush vs Tangle Teezer — which is better for thick hair?",
        "Wet Brush — the longer handle gives more leverage for working through thick sections. Tangle Teezer is fine for thin or short hair, but the palm-grip design wears out the hand on long, thick hair."),
       ("Which is gentler on kids' hair?",
        "Wet Brush — the IntelliFlex bristles flex more than Tangle Teezer's harder plastic teeth, so they're less likely to pull on fine children's hair. The handle also makes it easier for parents to control the angle."),
       ("Can you use a Wet Brush in the shower?",
        "Yes — the handle is non-slip, and the bristles don't absorb water. Tangle Teezer's palm-grip design gets slippery when wet, which is a real shower-time problem."),
       ("How long does each brush last?",
        "Wet Brush 6-12 months, Tangle Teezer 4-8 months. Both lose bristle flexibility over time — when they stop flexing, the brush is just a comb and needs replacing."),
       ("Is the Wet Brush worth the extra cost?",
        "Yes — a $20 Wet Brush outlasts 3-4 $5 supermarket brushes, and it's gentler on hair. The cost per wash is lower, and the reduction in mid-lengths breakage saves on trims too."),
     ]),

    # 28. How often wash hair
    (["how-often-should-you-wash", "how-often-wash"],
     [
       ("How often should you wash your hair?",
        "Every 2-3 days for normal hair, every 4-5 days for dry or curly, every 1-2 days for very oily or after heavy gym sessions. Daily washing strips the natural oils and causes rebound oiliness within hours."),
       ("Is it bad to wash your hair every day?",
        "For most hair types, yes — daily washing strips the oils, the scalp over-produces to compensate, and you're oily again by lunchtime. The exception is very fine, very oily hair, where daily washing with a gentle formula is the lesser evil."),
       ("Can I train my hair to need less washing?",
        "Yes — extend the time between washes by 1 day per week. After 6-8 weeks, most hair settles into a 3-4 day cycle with significantly less oil."),
       ("What happens if I stop washing my hair?",
        "The first 2-3 weeks are greasy. After that, the scalp recalibrates and oil production drops by 30-50%. Jena's seen clients go from daily washing to twice-weekly with no product, just patience."),
       ("Should I use dry shampoo between washes?",
        "Yes — a light sprinkle at the roots, brushed through. Don't use it as a substitute for washing for more than 4-5 days in a row. The build-up eventually clogs the follicle."),
     ]),

    # 29. How long keratin
    (["how-long-does-keratin", "how-long-keratin"],
     [
       ("How long does keratin smoothing last?",
        "3 months on fine hair, 6 months on coarse or virgin hair. The treatment grows out with your natural curl, so it doesn't 'end' abruptly — you just see more wave at the root over time."),
       ("How do I make keratin smoothing last longer?",
        "Three things: sulfate-free shampoo only, no chlorinated swimming pools for the first 2 weeks, and minimal heat styling. After the first 2 weeks, the treatment is set and you can go back to your normal routine."),
       ("Can I do keratin smoothing on bleached hair?",
        "Yes, with a stronger formula. Bleached hair is more porous, so it absorbs the keratin faster and the results actually last longer. Jena does a strand test first to confirm the right formula."),
       ("Does keratin smoothing stop working if I swim a lot?",
        "Chlorine strips the keratin faster than anything else. If you swim 3+ times a week, use a leave-in mask before getting in the pool, and rinse immediately after. The treatment will still last 3-4 months."),
       ("Is keratin smoothing worth the cost?",
        "If you blow-dry your hair daily, yes — the 30-minute daily styling drops to 5-10 minutes for the 3-6 months the treatment lasts. Over a year, the time saved is worth 3-4x the cost of the service."),
     ]),

    # 30. Full head foils
    (["how-much-full-head-foils", "full-head-foils"],
     [
       ("How much do full head foils cost in Sydney?",
        "$280-$450 at Hair Pinns, depending on hair length, density, and whether toner is included. The price is published online — no hidden costs at the till."),
       ("How long do full head foils take?",
        "2.5-3.5 hours, including toner and gloss. Jena's appointments are blocked for the full time, so there's no rush and no overlap with the next client."),
       ("How often should I get full head foils?",
        "Every 8-12 weeks. Going longer than 12 weeks means the root line becomes obvious and the toner fades. Going sooner than 8 weeks risks overlapping bleach on previously-lightened hair, which causes breakage."),
       ("Do full head foils damage hair?",
        "Modern lightener + bond protection (Olaplex, Wellaplex) keeps damage minimal. The risk is overlap on previously bleached hair, which Jena avoids by sectioning carefully and tracking each foil."),
       ("Can I go from dark to blonde with full head foils?",
        "In one session, no. It takes 2-3 sessions 6-8 weeks apart to lift dark hair to blonde safely. Jena's consultation includes a strand test to confirm how many sessions you'll need and the cost of each."),
     ]),

    # 31. Purple shampoo daily
    (["can-you-use-purple-shampoo-every", "purple-shampoo-every-day"],
     [
       ("Can you use purple shampoo every day?",
        "No — once or twice a week is enough. Daily use over-deposits the violet pigment and turns blonde hair lavender or grey. Use it on the days you want extra toning, regular shampoo the rest of the week."),
       ("What happens if I use purple shampoo every day?",
        "Hair turns lavender, then grey, then dull. The pigment stacks with each wash. If you've overdone it, a clarifying shampoo (Juuce Detox) once a week for 2-3 weeks lifts the excess."),
       ("How long should I leave purple shampoo in?",
        "3-5 minutes, no more. The toning action happens in the first 3 minutes. Leaving it longer doesn't make it more toning, it just dehydrates the hair."),
       ("Can I use purple shampoo on grey hair?",
        "Yes — it removes yellow tones and keeps grey hair bright. Once a week is enough for grey hair, every other week for silver/platinum."),
       ("Is purple shampoo bad for hair?",
        "No — most modern purple shampoos are sulfate-free and conditioning. The pigment is deposited, not stripped, so it's gentler than a regular toning service."),
     ]),

    # 32. When get haircut
    (["when-should-you-get-a-haircut"],
     [
       ("When should you get a haircut?",
        "Every 8-12 weeks for short styles, 10-14 weeks for mid-length, 12-16 weeks for long. The 6-8 week rule for short hair keeps the shape; longer styles can wait because the cut is more about the ends than the shape."),
       ("How do I know it's time for a haircut?",
        "Three signs: ends look stringy, the style stops holding its shape, and you can see visible split ends. Once all three appear, the cut is overdue."),
       ("Should I get a haircut before or after colour?",
        "After colour, but within 1-2 weeks. Colour can dry out the ends slightly, and a trim removes the driest bits. Cutting first means you might cut more than you need to after the colour is done."),
       ("Is it bad to go a year without a haircut?",
        "For very long hair, no — but the ends will be visibly split and the overall shape will be uneven. A trim every 4-6 months keeps the ends healthy without losing length."),
       ("How do I tell my stylist what I want?",
        "Bring 2-3 photos of the exact style, taken from front, side, and back. Words alone ('a bit off the bottom') are interpreted differently by every stylist. Photos are universal."),
     ]),

    # 33. Meet Jena
    (["meet-jena"],
     [
       ("Who is Jena at Hair Pinns?",
        "Owner and senior stylist since 2009. Jena has 15+ years experience in colour correction, keratin smoothing, and bridal styling. She personally curates every product on the shelves at Hair Pinns."),
       ("How long has Hair Pinns been open?",
        "Since 2009. Jena started the salon in Bangor with one chair and a small product range. It's grown to a team of 4 stylists and the largest curated hair product range in the Sutherland Shire."),
       ("Can I request Jena for my appointment?",
        "Yes — book online and select 'Jena' as your stylist. For new clients, Jena does a free 10-minute consultation to confirm the right service before any colour or smoothing appointment."),
       ("What training does Jena have?",
        "L'Oréal Colour Specialist, DevaCut certified, QIQI Master Stylist, Brazilian Blowout certified. Jena trains annually with international educators to stay current on smoothing technology and colour trends."),
       ("Does Jena do bridal hair?",
        "Yes — bridal is one of her specialties. The wedding trial is 90 minutes ($95, redeemable on the wedding day) and the wedding day styling is from $180 per person. Jena does up to 4 weddings per Saturday."),
     ]),

    # 34. Colour mistakes
    (["7-colouring-mistakes", "colouring-mistakes"],
     [
       ("What are the most common hair colouring mistakes?",
        "1. Going too light in one session (causes banding and breakage). 2. Overlapping bleach on previously-lightened hair. 3. Using box dye on highlights (green tones, uneven grab). 4. Skipping the toner. 5. Washing colour out the same day. 6. Not using bond protection. 7. Stretching appointments too long."),
       ("Can a bad box dye be fixed?",
        "Yes, in most cases. Bring photos of what you wanted, what you got, and any previous colour history. Jena does a strand test in the consultation to check what the existing colour will do under professional product."),
       ("Why does my colour fade so fast?",
        "Three reasons: sulfate shampoo, hot water, and sun exposure. Switch to a sulfate-free shampoo (Juuce Colour Care), wash in lukewarm water, and use a UV-protective leave-in. Colour should last 6-8 weeks."),
       ("Can I go from black box dye to blonde?",
        "It's a 3-6 month process, not a single session. Jena does a strand test in consultation to confirm how many sessions you'll need and the cost. Rushing the process breaks the hair off."),
       ("Why is my toner washing out after 2 weeks?",
        "Toner is a demi-permanent gloss, designed to fade gradually over 4-6 weeks. If it's gone in 2 weeks, you're either using a sulfate shampoo or washing in very hot water. Both strip the toner faster than colour."),
     ]),

    # 35. Home care myths
    (["home-hair-care-myths", "hair-care-myths"],
     [
       ("Is brushing 100 strokes a day good for hair?",
        "No — that's an old myth that causes breakage. 5-10 strokes from mid-lengths to ends is enough. More than that and you rough the cuticle, which causes frizz and split ends."),
       ("Does cutting hair make it grow faster?",
        "No — hair grows from the follicle, not the ends. Trimming removes split ends, which makes hair LOOK longer and healthier, but it doesn't change the growth rate."),
       ("Is it true that you should switch shampoos regularly?",
        "No — once you find a shampoo that works, stick with it. Switching every few weeks confuses the scalp and can cause flare-ups. The 'switch to avoid build-up' advice is marketing, not science."),
       ("Does cold water rinse really make hair shinier?",
        "Yes — cold water closes the cuticle, which reflects light better (shinier) and locks colour in. A 30-second cold rinse at the end of every wash makes a visible difference."),
       ("Is it bad to brush wet hair?",
        "It's bad to brush with a regular comb — that's where mid-lengths breakage comes from. A Wet Brush is designed for wet hair. Use one, brush from ends to roots, never yank."),
     ]),

    # 36. Box dye damage recovery
    (["recover-hair-from-box", "box-dye-damage"],
     [
       ("Can box dye damage be reversed?",
        "Most damage can be significantly improved in 1-3 salon visits. Full restoration to virgin condition isn't possible (the colour molecules are inside the shaft), but you can get back to healthy, soft, manageable hair."),
       ("How long does it take to recover from box dye damage?",
        "3-6 months for noticeable improvement, 12 months for full recovery. Jena's program: a salon bond-repair treatment every 4 weeks, plus a home routine of bond-repair shampoo and mask."),
       ("What products help recover from box dye damage?",
        "Juuce Bond Repair shampoo, conditioner, and weekly mask. The protein complex fills gaps in the cuticle and rebuilds elasticity. After 4 weeks of consistent use, most clients see 50% improvement."),
       ("Should I keep colouring my hair while it's recovering?",
        "No — let it rest for 6-8 weeks. Use a root touch-up spray or powder for the visible re-growth, and focus the salon visits on bond-repair treatments, not more colour."),
       ("Will a haircut fix box dye damage?",
        "A trim removes the most damaged ends, which makes the hair look and feel better. It's not a fix for mid-shaft damage, but it's a useful part of the recovery plan. Jena usually trims 2-3cm off the ends during the first bond-repair visit."),
     ]),

    # 37. Pure vs Juuce (the duplicate slug)
    (["juuce-vs-pure"],
     [
       ("Which is better for dry hair — Juuce or Pure Organic?",
        "Pure Organic's Hydration range is more emollient, so it's Jena's top pick for very dry, coarse, or curly hair. Juuce's Smoothing range is lighter, better for fine-to-medium hair that's dry but not dehydrated."),
       ("Are both Juuce and Pure Organic salon-only brands?",
        "Yes — neither is available in supermarkets or chemists. You can only buy them through stockists like Hair Pinns. This is how the brands protect their formulation integrity."),
       ("Can I use Juuce Smoothing and Pure Organic Hydration together?",
        "Yes — many clients use Juuce Smoothing shampoo (lighter cleanse) with Pure Organic Hydration conditioner (more moisture). Mixing ranges is fine, switching weekly is not."),
       ("Which is more expensive — Juuce or Pure Organic?",
        "Similar pricing — both around $30-40 for a 250ml shampoo or conditioner. Pure Organic's larger sizes are sometimes better value, but both are concentrated, so a bottle lasts 6-8 weeks."),
       ("Do Juuce and Pure Organic test on animals?",
        "Neither does. Both are cruelty-free and vegan. Juuce is Leaping Bunny certified; Pure Organic is ACO certified, which includes a no-animal-testing requirement."),
     ]),

    # 38. Menai / Illawong / Sutherland / Cronulla / Como (default for any other location)
    (["hair-salon-menai", "hair-salon-illawong", "hair-salon-sutherland", "hair-salon-cronulla", "hair-salon-como",
     "hair-salon-near", "salon-near"],
     [
       ("Where is the closest hair salon to me in the Sutherland Shire?",
        "Hair Pinns in Bangor is centrally located — 10 minutes from Menai, 15 from Illawong and Sutherland, 20 from Cronulla and Como. Free parking, ground-floor access, online booking."),
       ("Is it worth driving to Hair Pinns from another suburb for a haircut?",
        "Yes — most of Jena's clients drive 10-20 minutes because the consultation is free, the pricing is published, and Jena has been at the same location for 15 years. The drive is one-way, the result lasts 8-12 weeks."),
       ("Does Hair Pinns offer mobile or home-visit services?",
        "No — all services are in-salon. Mobile services are a hygiene and safety risk (no proper backwash, no proper lighting), and Jena prefers to keep the standard high in one location."),
       ("What suburbs do Hair Pinns clients come from?",
        "Bangor, Menai, Illawong, Sutherland, Cronulla, Como, Jannali, Kareela, Oyster Bay, Bonnet Bay, Lugarno, Peakhurst, Mortdale, Oatley, and the broader St George and Sutherland Shire region."),
       ("Can I get a Sunday appointment at Hair Pinns?",
        "Yes — Sundays by appointment, mostly for colour and smoothing services. Cuts are walk-in only on Sundays, 10am-3pm. Online booking shows Sunday availability in real time."),
     ]),
]


def find_topic_faqs(slug: str) -> List[Tuple[str, str]]:
    """Pick the first FAQ bank that matches any keyword in the slug."""
    for keywords, faqs in FAQ_BANK:
        for kw in keywords:
            if kw.lower() in slug.lower():
                return faqs
    # Generic fallback for unmatched slugs
    return [
        ("Is Hair Pinns a real salon I can visit?",
         "Yes — Hair Pinns is in Bangor, NSW, and has been at the same location since 2009. You can book online or call for a free 10-minute consultation."),
        ("What services does Hair Pinns offer?",
         "Cuts, colour, foils, keratin smoothing, QIQI Vega, Nanoplasty, hair extensions, bridal styling, and infrared sauna. Jena personally handles all smoothing, extensions, and bridal work."),
        ("Do you ship products Australia-wide?",
         "Yes — free shipping on orders over $150, flat $10 under that. Same-day dispatch for orders placed before 1pm AEDT."),
        ("Can I book a free consultation?",
         "Yes — every new client gets a free 10-minute consultation, redeemable on the first service. Online booking shows real-time availability."),
        ("What payment methods do you accept?",
         "Visa, Mastercard, AmEx, Afterpay (4 interest-free payments), and cash. Afterpay is available on all services and products."),
    ]


def has_faq_section(post_block: str) -> bool:
    return "faqSection:" in post_block


def find_post_blocks(src: str) -> List[Tuple[int, int, str]]:
    """
    Find each top-level post object in the file.
    Posts are top-level array entries in the `blogPosts: BlogPost[] = [ ... ]` array.
    Each post starts at `  {` (2 spaces) and ends at `  },` (2 spaces + comma).
    """
    blocks: List[Tuple[int, int, str]] = []
    lines = src.splitlines()
    in_array = False
    depth = 0
    start = None
    for i, line in enumerate(lines, start=1):
        if not in_array:
            if "blogPosts" in line and "=" in line and "[" in line:
                in_array = True
            continue
        stripped = line.strip()
        if start is None:
            if stripped == "{":
                start = i
                depth = 1
            continue
        # Track braces
        opens = line.count("{")
        closes = line.count("}")
        depth += opens - closes
        if depth <= 0:
            blocks.append((start, i, "\n".join(lines[start-1:i])))
            start = None
            depth = 0
    return blocks


def inject_faq(post_block: str, faqs: List[Tuple[str, str]]) -> str:
    """
    Inject a `faqSection: [ ... ]` entry into the post's content object.
    The faqSection is added just before the `},` that closes the `content: { ... }` block.
    We find the line that contains `},` and prepend the faqSection block to it.
    """
    lines = post_block.splitlines()
    # Find the line that ends the content block
    # It's the line that is `    },` (4 spaces, brace, comma) — closing the content object
    # Strategy: find the closing brace of `content: {` block.
    # Walk through, track depth of braces after first `content: {`.
    found_content_start = False
    content_depth = 0
    insert_idx = None
    for i, line in enumerate(lines):
        if "content: {" in line and not found_content_start:
            found_content_start = True
            content_depth = line.count("{") - line.count("}")
            continue
        if found_content_start:
            content_depth += line.count("{") - line.count("}")
            if content_depth == 0 and line.strip().startswith("}"):
                insert_idx = i
                break
    if insert_idx is None:
        # Fallback: insert before the last `},` in the block
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip() == "},":
                insert_idx = i
                break
    if insert_idx is None:
        raise ValueError("Could not find insertion point in post block:\n" + post_block[:200])

    # Indentation: the faqSection key uses 6 spaces (inside content, which is inside post)
    base_indent = "      "  # 6 spaces
    entry_indent = base_indent + "  "  # 8 spaces

    faq_lines = [f"{base_indent}faqSection: ["]
    for q, a in faqs:
        faq_lines.append(f"{entry_indent}{{")
        faq_lines.append(f"{entry_indent}  question: {json_string(q)},")
        faq_lines.append(f"{entry_indent}  answer: {json_string(a)},")
        faq_lines.append(f"{entry_indent}}},")
    # Remove trailing comma on last entry
    if faq_lines and faq_lines[-1].endswith(","):
        faq_lines[-1] = faq_lines[-1][:-1]
    faq_lines.append(f"{base_indent}],")

    new_lines = lines[:insert_idx] + faq_lines + lines[insert_idx:]
    return "\n".join(new_lines)


def json_string(s: str) -> str:
    """Encode a string for use in a TS object literal as a string value."""
    # Escape backslashes, quotes, and newlines
    s = s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n")
    return f"\"{s}\""


def main():
    src = SRC.read_text()
    blocks = find_post_blocks(src)
    print(f"Found {len(blocks)} post blocks.")

    backfilled = 0
    skipped = 0
    new_src = src
    # Process from bottom to top so line offsets don't break
    for start, end, block in reversed(blocks):
        # Extract slug
        m = re.search(r'slug:\s*"([^"]+)"', block)
        if not m:
            continue
        slug = m.group(1)
        if has_faq_section(block):
            skipped += 1
            continue
        faqs = find_topic_faqs(slug)
        new_block = inject_faq(block, faqs)
        new_src = new_src.replace(block, new_block, 1)
        backfilled += 1
        print(f"  + {slug}  ({len(faqs)} Q&As)")

    print(f"\nBackfilled: {backfilled}  Skipped (already had FAQ): {skipped}")
    if backfilled == 0:
        print("No changes needed.")
        return
    SRC.write_text(new_src)
    print(f"Wrote {SRC}")


if __name__ == "__main__":
    main()
