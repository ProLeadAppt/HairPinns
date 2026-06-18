# GSC Pulse — Setup for Tyson

Daily digest of how Google sees hairpinns.com. Catches:
- **CTR opportunities** — pages with ≥50 impressions but <1% CTR (rewrite the title/meta)
- **Indexing failures** — pages that exist on the site but GSC says they're not indexed
- **Trend flips** — clicks/impressions/position vs the previous 28-day window

Delivered every morning at 8:00 AM AEST to the `#hair-pinns` Discord channel.

---

## One-time setup (~10 min, on a laptop)

### 1. Google Cloud project

1. Go to https://console.cloud.google.com/projectcreate
2. Name: `hairpinns-seo`
3. Create

### 2. Enable the API

1. APIs & Services → Library
2. Search "Google Search Console API"
3. Click → Enable

### 3. Service account

1. APIs & Services → Credentials → **Create Credentials** → **Service Account**
2. Name: `gsc-pulse-reader`
3. Skip the IAM role step (we don't need any)
4. Done
5. Click the service account → **Keys** tab → **Add Key** → **Create new key** → **JSON** → save the file

### 4. Grant GSC access

1. Go to https://search.google.com/search-console/settings
2. Pick the hairpinns.com property
3. **Users and permissions** → **Add user**
4. Paste the service account email (looks like `gsc-pulse-reader@hairpinns-seo.iam.gserviceaccount.com`)
5. Permission: **Owner** (or Full — we only read)

**Critical:** the GSC property URL must match `GSC_SITE_URL` exactly:
- Domain property `sc-domain:hairpinns.com` → set `GSC_SITE_URL=sc-domain:hairpinns.com`
- URL-prefix `https://www.hairpinns.com/` → set `GSC_SITE_URL=https://www.hairpinns.com/`

The default in the script is `sc-domain:hairpinns.com`.

### 5. Drop the key on the server

```bash
# On the VM that runs the cron (where hairpinns-audit lives):
scp ~/Downloads/hairpinns-seo-*.json /root/hairpinns-audit/gsc-service-account.json
# (already in .gitignore)

# In /root/hairpinns-audit/.env (already ignored):
cat >> .env <<EOF
GOOGLE_APPLICATION_CREDENTIALS=/root/hairpinns-audit/gsc-service-account.json
GSC_SITE_URL=sc-domain:hairpinns.com
EOF
```

### 6. Smoke test

```bash
cd /root/hairpinns-audit
node scripts/gsc-pulse.mjs
```

Should print a digest. If it says `403 The caller does not have permission`, the service account email was not added in step 4 (or property URL doesn't match).

---

## Cron schedule (Hermes)

The cron agent picks up the env vars from `~/.hermes/config.yaml` (or whatever profile owns the hair-pinns channel), runs `scripts/gsc-pulse.mjs`, summarizes the digest, and posts to Discord.

```yaml
# Cron definition (translate to hermes cronjob tool)
name: gsc-pulse-hairpinns
schedule: "0 22 * * *"        # 22:00 UTC = 08:00 AEST
prompt: |
  You are the GSC pulse agent for hairpinns.com.
  1. cd /root/hairpinns-audit
  2. node scripts/gsc-pulse.mjs > /tmp/gsc-pulse.txt 2>&1
  3. cat /tmp/gsc-pulse.txt
  4. Write a SHORT morning brief (max 12 lines):
     - Top 3 CTR opportunities (page · impressions · CTR)
     - Any NOT-INDEXED pages from inspection
     - One-line trend (clicks up/down vs prior week — calculate from current vs last week's gsc-pulse.json if available)
  5. Deliver to #hair-pinns on Discord.
workdir: /root/hairpinns-audit
deliver: discord:#hair-pinns
```

The script writes `dist/gsc-pulse.json` with the raw payload. The cron keeps the last 28 days of snapshots in `dist/gsc-pulse-history/` (created automatically once you add the rotate step — see below).

---

## Cost

GSC API quotas:
- **Search Analytics**: 1,200 queries/day, 5/sec burst — we use 1/day = fine
- **URL Inspection**: 600/min, 2,000/day — we inspect 5/day = fine

Both well under the cap. Free.

---

## When something breaks

| Symptom | Cause | Fix |
|---|---|---|
| `403 caller does not have permission` | Service account not added to GSC, or wrong property URL | Re-do step 4, check `GSC_SITE_URL` |
| `404 requested entity was not found` | Property URL in GSC ≠ `GSC_SITE_URL` | Match them exactly (trailing slash matters for URL-prefix) |
| `401 invalid_grant` | Service account JSON rotated or private key out of sync | Re-download the JSON key, replace the file |
| `0 clicks / 0 impressions` | GSC has no data yet (new property) | Wait 2-3 days after the property was created |
