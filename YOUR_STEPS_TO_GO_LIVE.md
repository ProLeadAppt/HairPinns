# Your steps to get Jena's site live (one at a time)

The code fixes are done. Do these steps in order. One step, then the next.

---

## Step 1: Push the code

**What it means:** Send the fixed files to GitHub so Netlify can use them.

**What to do:**
1. In Cursor (or your terminal), commit the changes.
2. Push to your main branch (e.g. `git push origin main`).

**Why:** Netlify builds from GitHub. When you push, it will rebuild with the new checkout and redirect rules.

---

## Step 2: Check the store name in Netlify

**What it means:** The site talks to Shopify using a "store address." If the name is wrong, add-to-cart and checkout break.

**What to do:**
1. Open Netlify → your HairPinns site → **Environment variables**.
2. Find **SHOPIFY_MYSHOPIFY_DOMAIN**.
3. The value must be **exactly** what Shopify uses, e.g. `femtat-zu.myshopify.com`.
4. If it says `fentat-zu` (missing the "m"), change it to `femtat-zu.myshopify.com` and save.

**Why:** One wrong letter = wrong store = cart and checkout won’t work.

---

## Step 3: Wait for Netlify to finish building

**What it means:** After you push, Netlify builds the site. You need to wait until it’s done.

**What to do:**
1. In Netlify, go to **Deploys**.
2. Wait until the latest deploy shows a green check (Published).
3. If it’s red, open it and read the error; fix what it says and push again.

**Why:** The new redirect and checkout code only run after a successful deploy.

---

## Step 4: Test “Add to bag” on the live site

**What it means:** Make sure clicking “Quick Add” or “Add to bag” actually adds the product.

**What to do:**
1. Open the **live** site (your real URL, e.g. hairpinns.com or the Netlify URL).
2. Click **Quick Add** on a product on the homepage.
3. You should see something like “Added to bag” and the little cart drawer should open. You should **not** see “Couldn’t add to bag.”

**If it fails:** Check Netlify → **Functions** → open the **checkout** function → **Logs**. The error there will tell you what’s wrong (often the store name or token).

---

## Step 5: Test “Proceed to Checkout”

**What it means:** After adding something to the bag, the “Proceed to Checkout” button should send the customer to Shopify’s payment page.

**What to do:**
1. With at least one item in the bag, click **Proceed to Checkout** (in the cart drawer or wherever you have it).
2. The browser should take you to Shopify’s checkout page (payment form). You are **not** stuck on your site.

**If it fails:** Again, check the **checkout** function logs in Netlify. If the cart is “not found,” the cart ID might be missing or the store name/token might be wrong.

---

## Step 6 (optional): Do a real test order

**What it means:** Place a small real order (or use Shopify test mode) so Jena sees it in her Shopify admin.

**What to do:**
1. Add a product, go to checkout, fill in details, and pay (or use a test payment if she has test mode on).
2. In her Shopify admin, check that the order appears.

**Why:** Confirms the whole path: your site → Shopify cart → Shopify checkout → payment → order in her store.

---

## Done

After Step 5 (and optionally Step 6), the new site is ready for live use: cart and “Proceed to Checkout” work, and payment happens on Shopify’s page.

If something doesn’t work, use the **checkout function logs** in Netlify; they usually tell you exactly what to fix (store name, token, or something else).
