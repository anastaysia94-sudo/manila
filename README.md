# Manila

School letters + IEP / 504 war room. Mobile-first web app you can install on a phone.

**The letter arrived. The meeting is Thursday. Don’t walk in empty.**

## What it is

1. **Panic Paper** — paste a school letter. Manila classifies it, explains the cost of ignoring it, and drafts a reply.
2. **War Room** — parent concerns, three priorities, live They-say / You-say cards, meeting timer, log, same-night follow-up.
3. **Rights cards** — one-page FAPE + LRE sheets you can copy into Notes.
4. **Families First** — upload Medicaid / EBT / free-lunch proof. On-device scan against state document language. Auto half-price advocacy rates.
5. **Child file** — service minutes promised vs delivered, removal-day clock toward the 10-day MDR line.

Working demo. Data stays in the browser (`localStorage`). No account. No checkout.

Not legal advice. Not a lawyer or advocate.

## Run it

Open `index.html` on a phone or laptop.

- iPhone: Safari → Share → Add to Home Screen
- Android: Chrome → Add to Home Screen
- Or drop this folder on Netlify / Vercel / GitHub Pages

Empty inbox? Tap **Load 3 sample letters**.

## Families First

Standard advocacy menu is $129–$1,200. With an approved scan it halves.

The scanner reads the photo on-device (Tesseract from a CDN) and compares text to national program words plus state marks (Medi-Cal, Lone Star, MassHealth…). It does **not** call a state eligibility API in this demo.

## $100 / hour path

You sell the human. Manila is the factory.

- $129–$199 strategy hour ($65–$99 Families First)
- $350–$600 record review + concerns + one-pager
- $750–$1,200 prep + sit in the meeting

Or sell the OS to advocates later at $79–$149 / month.

## What production still needs

- Delete uploaded proof after the verdict
- Real payments
- Encrypted vault for two parents + one advocate
- Lawyer-reviewed state deadline tables
- FERPA / COPPA review before any server
