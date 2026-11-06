# DIY Travel Japan

DIY Travel Japan helps independent travelers compare destinations, plan an itinerary and keep booking notes together. The beta is available in English, Simplified Chinese, Traditional Chinese, Filipino, Indonesian and Malay. [Open the private beta](https://diy-japan-private-beta-20261105.a14c4d4a-c254-4605-95d4-59b9c84c3c80.chatgpt.site/).

## Save and reopen a checklist

1. Sign in through **My Trip** before filling out the checklist. If you already filled it out while signed out, use **Download checklist** before signing in, because sign-in reloads the page.
2. Open **Before you book**, enter the seller and activity, and record the price and fees in the same currency. Enter zero if there are no extra fees. Check the conditions you have reviewed.
3. Choose **Add notes to account trip**. After the save confirmation, follow **My Trip** to the saved itinerary. The checklist is appended as text below existing notes. You can reopen it on another device signed in to the same account.
4. For a reservation made through Airbnb, open **Help → Booked on another platform? → Airbnb**. That link opens the seller’s Help Center. For DIY Travel Japan account or planning questions, use the Tokyo Stays KK contact options on the same page.

## Run locally

Use Node.js 22.13 or later and npm. From the repository root, run:

```sh
npm run install:ci
npm run build
```

Initialize a **fresh local database** once. The checked-in migration creates the account and assistant usage tables. Skip this command if those tables already exist in your local preview.

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_wild_ultragirl.sql
npm run dev
```

Open the loopback address printed by the dev server (normally port 5173). The portable development server simulates sign-in with a local test account. To inspect the production build locally, use `npm start`; this preview requires a separate test identity for authenticated API checks. Account storage uses Cloudflare D1. The optional AI assistant requires a server-side `OPENAI_API_KEY` and API credit. Checklist, My Trip and Help work without an AI key.

## Verify changes

Run the automated checks from the project root:

```sh
node tests/booking-check.mjs && node tests/my-trip-save.cjs && node tests/checklist-save.cjs
node tests/locales.cjs && node tests/search.cjs && node tests/carousel.cjs
```

For desktop and mobile browser acceptance, repeat the following on a wide desktop viewport and a narrow phone viewport using a test account:

- Start with an existing itinerary. Save a checklist with a ¥1,200 quote and ¥300 in fees. Reopen My Trip from the confirmation, then refresh. Verify that the original itinerary, both amounts and the ¥1,500 total are visible.
- Switch between desktop and phone using the same account. Open the saved itinerary from the main navigation on desktop and the bottom navigation on mobile. Check that the keyboard and navigation leave the save button reachable.
- Open Help and locate Airbnb under external booking providers. Verify that the link opens Airbnb’s Help Center and that Tokyo Stays KK’s contact options are separately identifiable.
- Check keyboard focus, status announcements and tap targets in the rendered interface. Scripted application tests cover persistence and links; record viewport and browser for visual sign-off.

## Source map

| Path | Purpose |
| --- | --- |
| `public/` | Homepage, localized HTML, styles, guides, planner and checklist scripts |
| `i18n/` | Translation catalogs and checklist wording |
| `app/api/portal/`, `lib/portal-core.mjs` | Account-scoped trip storage and version checks |
| `app/api/assistant/` | Optional authenticated AI assistant |
| `drizzle/`, `worker/` | Database migration and production Worker |
| `tests/` | Regression checks |

Edit authored files under `public/`, `app/` or `lib/`. Use the build to regenerate `dist/`. Keep credentials in local environment settings or hosting secrets. Publishing to the private beta is a separate Sites deployment step.
