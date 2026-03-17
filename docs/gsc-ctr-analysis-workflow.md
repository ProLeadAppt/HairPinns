# GSC 5-Minute CTR Analysis Workflow

Based on Caleb Ulku's AI SEO approach: export Google Search Console data and use AI to analyze CTR, identify optimization opportunities, and get title tag recommendations in minutes instead of hours.

## When to Run

- **Quarterly** (every 3 months) for ongoing optimization
- **After major content changes** to measure impact
- **When rankings stall** to find quick wins

## Step 1: Export Data from Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Select the property: `hairpinns.com`
3. Open **Performance** (left sidebar)
4. Set date range: last 3–6 months
5. Export **two** datasets:

### Dataset A: Query-level data

- Click **Export** → **Export to CSV**
- Ensure columns include: Query, Clicks, Impressions, CTR, Position
- Save as `gsc-queries.csv`

### Dataset B: URL-level data

- In Performance, switch view to **Pages** (or use the Pages tab)
- Export with columns: URL, Clicks, Impressions, CTR, Position
- Save as `gsc-pages.csv`

## Step 2: Use the AI Analysis Prompt

Caleb Ulku's free prompt: [GSC 5-Minute Analysis Prompt](https://calebulku.com/wp-content/uploads/2025/05/GSC-5-Minute-Analysis-Prompt-1.txt)

**Tools:** Claude.ai or ChatGPT

**Process:**

1. Paste the prompt from the link above
2. Attach or paste the contents of `gsc-queries.csv` and `gsc-pages.csv`
3. Add Hair Pinns–specific context:

```
Focus on local queries: Bangor, Sutherland Shire, suburb names (Menai, Illawong, etc.), 
service + location (e.g. "hair salon Bangor", "smoothing treatment Sutherland Shire").
Prioritize pages under /near/, /services/, and key product/collection pages.
```

4. Run the analysis

## Step 3: Interpret Output

The AI will provide:

- **Top 10 / bottom 10 URLs by CTR**
- **High-impression, low-CTR pages** — prime for title tag and meta description updates
- **Primary keyword inference** per URL
- **Position analysis** — pages in positions 4–10 with CTR &lt; 2% are quick wins
- **Keyword cannibalization** — multiple pages competing for same query

## Step 4: Implement Changes

For each recommended optimization:

1. **Title tags** — Update in the page's Helmet/meta (e.g. `ServiceDetail.tsx`, `SuburbPage.tsx`, `Index.tsx`)
2. **Meta descriptions** — Ensure they include the primary keyword and a clear CTA
3. **Format:** `"Primary Keyword | Hair Pinns Bangor"` or `"Service Name Sutherland Shire | Hair Pinns"`

## Handoff

- **Jena** or site owner: Export GSC data quarterly, run prompt, share output
- **Developer** or you: Implement title/meta changes in codebase
- **Source of truth:** NAP and business info in `src/config/businessConfig.ts`

## References

- [Caleb Ulku – New SEO Landscape](https://calebulku.com/new-seo-landscape/)
- [Google Search Console](https://search.google.com/search-console/about)
- [Claude.ai](https://claude.ai/new)
