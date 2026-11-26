# Meesho Kuri — Next.js / Vercel migration

This repository is the Next.js + TypeScript rewrite workspace for the supplied CodeIgniter storefront. It keeps the original MySQL table names so the supplied SQL dump can be imported without a wholesale schema redesign.

## Implemented in this build

- Storefront home, category list/detail, sale page, product detail, image gallery and product variants.
- Legacy product URLs based on `MD5(product id)` as well as product slugs.
- 30-item home pagination using the original `MOD(id,17), id` ordering.
- Browser-persisted cart and address flow, retaining the legacy `products`, `cartTotalAmount`, and `address` localStorage values for compatibility.
- Server-side order pricing from MySQL product/variant rows (client-submitted prices are not trusted).
- UPI app launch support for Google Pay, PhonePe, Paytm, BHIM and CRED; Facebook/Instagram Android WebView intent fallback; QR code generation with the original 10% QR discount.
- PayU SHA-512 request hash and reverse-hash callback verification; payment only changes to `paid` after a valid callback.
- Admin login with signed HTTP-only session cookie, product/category/banner management, product variants, chunked Shopify/custom CSV import, orders and manual payment-status verification, payment settings, Meta Pixel settings, success-page settings, password change, and Vercel Blob image upload.
- Original storefront assets and uploaded image assets copied into `public/`.

## Required services

Vercel hosts the Next.js app; it does **not** provide a MySQL database. Use a reachable managed MySQL/MariaDB database. Vercel Blob is used for new admin image uploads (up to 4 MB per image; the old static assets remain in `public/`). The legacy SQL contains multiple historical `settings.website_url` rows: the app selects a row matching `NEXT_PUBLIC_SITE_URL`; when no row matches, it temporarily reads the newest row and creates a separate current-domain row when you save Admin → Settings, leaving the older domain rows intact.

## Local setup

1. Install Node.js 20 or newer.
2. Create a MySQL/MariaDB database and import the separate database SQL package. The supplied schema includes `admin_master`, `category`, `orders`, `purchase`, `settings`, `tbl_banner`, `tbl_product`, `tbl_product_verient`, and `tbl_success_settings`.
3. Copy `.env.example` to `.env.local` and fill in database credentials, `ADMIN_SESSION_SECRET` (random, 32+ characters), and `NEXT_PUBLIC_SITE_URL`.
4. Run `npm install`, then `npm run dev`.
5. Check `/api/health` for database connectivity, then open `/administrator/login`. Sign in with username `admin` and the temporary password provided in `DATABASE_SETUP.txt` inside the separate database ZIP, then immediately change it in Admin → Settings.
6. In Admin → Settings, confirm the UPI ID, enabled payment methods, PayU merchant key/salt (only if PayU is enabled), and Meta Pixel code. Set `BLOB_READ_WRITE_TOKEN` to enable image uploads.

## Vercel deployment

1. Push this project to a **private** GitHub repository. Do not commit `.env.local`, SQL dumps, database credentials, payment secrets, or admin passwords.
2. Import the repository into Vercel.
3. Add all variables from `.env.example` in Vercel Project → Settings → Environment Variables. `PAYU_PAYMENT_URL` is optional; use PayU’s test endpoint for test credentials and the secure endpoint for production. Set `NEXT_PUBLIC_SITE_URL` to the final production domain and set `DB_SSL` according to the database provider's connection requirements.
4. Add a Vercel Blob store and its `BLOB_READ_WRITE_TOKEN`.
5. Deploy. Test with a small-value order and PayU test/live credentials as appropriate before running ads.

## Important payment notes

- A UPI app opening is **not** proof of payment. UPI orders stay `verification_pending` until manually verified in Admin → Orders. Do not mark a payment paid based only on the customer returning to the site.
- PayU callback hash and amount are verified before an order is marked paid.
- The QR method applies the original 10% discount; verify that this discount is still commercially intended before launch.
- The app cannot guarantee that every Facebook/Instagram in-app browser or every installed UPI app will launch identically across devices. Test Android, iOS, Chrome, Facebook and Instagram before advertising.

## Known launch checks

The project still needs an end-to-end build and runtime verification against the actual production database and payment credentials. The current execution environment could not complete `npm install` (network timeout), so a successful `next build` has **not** been verified here. Do not treat the ZIP as payment-certified or production-tested until those checks pass. See `docs/GO_LIVE_TEST_CHECKLIST.md`.
