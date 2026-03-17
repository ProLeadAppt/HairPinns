# IndexNow Setup

IndexNow lets you notify Bing and Yandex immediately when content changes. Faster indexing = faster visibility in cold traffic from these engines.

---

## How It Works

1. **Key file:** `public/hairpinns-indexnow-a1b2c3d4e5f6.txt` contains the verification key
2. **Deploy:** The key file is served at `https://hairpinns.com/hairpinns-indexnow-a1b2c3d4e5f6.txt`
3. **Submit:** Run the script to POST your sitemap URLs to IndexNow

---

## Running the Script

**Prerequisites:** Generate sitemap first (happens automatically on `npm run build`).

```bash
npm run submit-indexnow
```

This reads `public/sitemap.xml`, extracts all URLs, and submits them to `https://api.indexnow.org/indexnow`. Bing and Yandex receive the notification and re-crawl the URLs.

---

## When to Run

- **After deploy:** Run post-deploy to notify search engines of any new or updated pages
- **After content changes:** When adding new suburb pages, blog posts, or products
- **CI/CD (optional):** Add to your deploy pipeline so every deploy triggers IndexNow

---

## Key File

- **Location:** `public/hairpinns-indexnow-a1b2c3d4e5f6.txt`
- **Content:** The key only (UTF-8)
- **Do not change** the key without updating `scripts/submit-indexnow.js` and this doc

---

## Related Docs

- [Multi-Channel Map Setup](multi-channel-map-setup.md) — Bing Webmaster Tools, sitemap submission
- [GMB Sync Checklist](gmb-sync-checklist.md) — Google Business Profile
