# Public journal article standard

New Shopify journal posts use `UpdatePost` through `/blog/<handle>/`. The shared
`publicArticle.css` styles provide typography, reading measure, spacing and
responsive image placement; article authors do not need inline layout styles.
The same template supports public `/updates/` editions.

Use an accurate title and a short, useful excerpt. Structure the body with one
`section` per topic, an `h2`, and separate paragraphs. For product recommendations,
put the exact product name and checked price in a paragraph with `strong`, then
explain who it suits and any relevant limitations. Keep the product link clear.
Place an optional `figure` at the end of that section, with meaningful image alt
text and a `figcaption` that states what is pictured. Illustrated sections pair
copy and imagery on desktop and stack in reading order on phones. Images are
contained, so the product remains visible. Interleaved figures retain their
authored order. Older flat `h2`/paragraph posts receive the same section rhythm.

Use lists for genuine steps or parallel choices. Keep a final price/availability
note when relevant. Do not use recipient identifiers, personal links, executable
markup or inline styling in public copy; sanitisation still applies before the
layout is arranged.

Before publication, verify product facts and destinations against the current
catalogue. Inspect 375px and desktop screenshots, check for overflow, loaded
images, readable captions, logical headings, visible keyboard focus and coherent
calls to action. Preserve the approved article text, canonical URL, publication
date and article schema. Run `public-article-layout.spec.ts` and the normal build
checks when changing the shared template. Rebuild the approved deployment branch
after publishing a new Shopify article so its direct URL and sitemap are ready.
