# GBP Silo Audit Prompt

Based on Caleb Ulku's AI SEO Mastery: Use Screaming Frog + AI to audit whether your website structure matches your Google Business Profile (GBP) categories and services. Run every 6–12 months or when GBP categories change.

## Prerequisites

1. **Screaming Frog SEO Spider** (free version: 500 URLs)
   - Download: [screamingfrog.co.uk](https://www.screamingfrog.co.uk/seo-spider/)
   - Crawl `https://hairpinns.com`
   - Export: **Internal** tab → Export → `internal_all.csv`
   - Export: **Links** tab → Export → `links_all.csv`

2. **GBP data** — From Jena's Google Business Profile:
   - Primary category (e.g. Hair Salon)
   - Secondary categories (e.g. Hair Stylist, Beauty Salon)
   - Full list of services

3. **Homepage content** — Copy the main text from the homepage (or provide URL for AI to reference)

## Hair Pinns Data Inputs

### GBP Categories (update from GMB)

- **Primary:** Hair Salon
- **Secondary:** (e.g. Hair Stylist, Beauty Salon — confirm with Jena)

### GBP Services (sample — expand from GMB)

- Straight Up Smoothing (mid-length, long/thick, teens)
- Foil packages (full head, half head, quarter head)
- Colour packages (long, mid-length, short hair)
- Cut & blow-dry packages
- Kids cut & blow-dry
- Primary / High school formal hairstyles
- Superior conditioning treatment
- etc.

### City / Area

- **Primary:** Bangor
- **Secondary:** Sutherland Shire

## Prompt Template (Caleb Ulku)

Use this with Claude or ChatGPT. Paste the prompt, then attach the CSV files and add the Hair Pinns data.

---

**Prompt Title:** Analyze Website for GBP Category & Services Silo Gaps

### Data Inputs

- **Screaming Frog Files:** `links_all.csv`, `internal_all.csv`
- **Homepage Content:** [Paste the homepage copy here or provide a reference]
- **GBP Categories:**
  - Primary: Hair Salon
  - Secondary: [List from GMB]
- **Services:** [List each service from GMB]
- **City Name:** Bangor / Sutherland Shire

### Analysis Goals

1. For each secondary GBP category, confirm there is a dedicated URL whose title tag includes the keyword phrase in the format `"GBP Category" + "City Name"` plus additional context (e.g. `"Hair Stylist Bangor | Expert Colour & Cuts | Hair Pinns"`).

2. Check that the homepage:
   - Mentions each of the secondary categories in the copy
   - Has an internal link to each secondary category page

3. For each service, ensure there is a dedicated URL whose title tag includes `"Service City Name"` (e.g. `"Straight Up Smoothing Bangor | Hair Pinns"`).

4. Assign each service to the most relevant GBP secondary category and ensure there is a link from that category's page to the specific service page.

### What to Output

- List of missing pages or title tag gaps
- Homepage: missing mentions or internal links to secondary categories
- Services without a dedicated page or correct title tag format
- Category pages missing links to relevant service pages
- Bulleted summary of all gaps
- Suggestions to fix: add content, links, or title tags

### Example Output Format

- "Hair Stylist category does not have a dedicated page with the correct format…"
- "Homepage does not have a link to the [Secondary Category Name] page…"
- "The [Service Name] page's title tag is missing the city name…"

---

## After Running the Audit

1. Review the AI output for gaps
2. Prioritize: missing pages > title tag fixes > internal link fixes
3. Implement changes in the codebase
4. Re-crawl with Screaming Frog to verify structure
5. Document in `docs/content-audit-notes.md` if needed

## Frequency

- **Every 6–12 months**
- **When GBP categories or services change**
- **After major site restructure**

## References

- [Caleb Ulku – Local SEO Acceleration](https://calebulku.com/local-seo-acceleration/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
