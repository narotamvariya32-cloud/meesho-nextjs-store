# Go-live test checklist

## Database and storefront
- [ ] Import the database SQL into the chosen MySQL/MariaDB provider.
- [ ] Confirm product count, categories, variants, banners, and success settings load.
- [ ] Confirm all legacy image paths resolve under `/assets/` and `/legacy-upload/`.
- [ ] Test old MD5 product URLs and slug URLs.
- [ ] Confirm home listing loads 30 items at a time and Load More follows the original ordering.
- [ ] Test category pages, sale page, product image gallery, variant pricing and cart persistence.

## Checkout
- [ ] Test address validation and persistence.
- [ ] Confirm server-calculated order total matches selected product variants.
- [ ] Confirm QR code amount includes 10% discount and that the discount is approved.
- [ ] Test GPay, PhonePe, Paytm, BHIM, CRED and QR from Chrome, Facebook and Instagram on Android; test iOS separately.
- [ ] Confirm UPI app launch never automatically marks an order paid.
- [ ] Test PayU success and failure callbacks using the correct merchant credentials and production callback domain.
- [ ] Confirm callback hash and amount checks before any order is marked paid.

## Admin
- [ ] Login and immediately change the imported legacy admin password.
- [ ] Test product create/edit/hide/delete and variants.
- [ ] Test category and banner create/delete.
- [ ] Test Shopify CSV import on a small test CSV first; check repeated image rows and variants.
- [ ] Configure Vercel Blob and test image uploads.
- [ ] Test order status and manual UPI payment verification.
- [ ] Test payment settings, Meta Pixel and success-page settings.

## Platform and security
- [ ] `npm install` and `npm run build` pass locally and on Vercel.
- [ ] Secrets are set in Vercel environment variables and not committed to GitHub.
- [ ] Admin session secret is unique and at least 32 characters.
- [ ] Database user has only the permissions required by this store.
- [ ] Place a low-value real test order and reconcile it in the payment provider dashboard before ads go live.
