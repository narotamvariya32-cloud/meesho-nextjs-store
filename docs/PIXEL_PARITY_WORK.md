# Original UI parity work — iteration 1

Reference source: the uploaded `MEESHO KURI.zip` CodeIgniter project.

This iteration changes the Next.js storefront shell and homepage toward the original PHP storefront rather than the generic desktop placeholder:

- Loads the original website Bootstrap, `custom.css`, and checkout CSS from the copied original assets.
- Restores the original 500px mobile storefront canvas and Mier font rules from the source CSS.
- Recreates the original top menu/logo/favourite/cart/search header, mobile bottom navigation, category strip, animated sale marquee, banner carousel markup, benefits strip, daily-deals timer, and original two-column product card treatment.
- Keeps admin routes outside the storefront shell and loads the original administrator theme stylesheets there.

This is not a final same-to-same certification. Remaining parity work must compare and port every source view and controller, including the complete original admin layout and forms, product details, cart drawer and cart page, address, payment, success/failure, and all payment/deep-link edge cases. Runtime/build and live database/payment verification are still required.

## Iteration 2 — product-card source comparison (2026-11-26)

Compared `application/controllers/Home.php::product()` and the related product-card markup in `application/views/product_details.php` / `category_details.php` against `components/ProductGrid.tsx`.

Restored in the Next.js card footer:
- original special-offer pill with green rupee icon and saved amount;
- Free Delivery chip;
- green rating pill with star, rating count;
- the pink Meesho Mall shield/wordmark badge (the small trust symbol the original card shows at the bottom-right).

The source generates rating and rating-count display values randomly on each PHP response. The Next.js implementation uses a stable per-product pseudo-random value to avoid client hydration changes while retaining the same visual range.

## Confirmed parity gaps still open (do not deploy)

- Payment settings source supports `gpay`, `phonepe`, `paytm`, `bhim_upi`, `cred`, `whatspp_pay`, `mobikwik`, `qr_code`, and `cod`, plus a separate PayU/netbanking switch. The current Next.js payment page does not yet reproduce all these methods and exact source deep-link branches.
- Original QR payment modal includes QR generation, QR download, UTR/transaction ID input and submit flow. Current Next.js QR flow does not yet reproduce that complete UI/UTR submission path.
- Original admin settings are individual payment-method checkboxes and include Pixel Code, UPI, PayU enablement, Merchant Key and Salt Key. Current admin settings form is simplified and uses a comma-separated payment-method text field.
- Original product detail, cart, address, payment, success/failure and admin views still require view-by-view UI and behaviour comparison.
- Build cannot yet be certified in this environment: `npm install` timed out before dependencies were installed. A `tsc` attempt without the project dependencies cannot validate the app. One malformed/minified `ConditionalShell.tsx` line was reformatted; rerun install, typecheck and `next build` in a network-enabled environment.

## Iteration 3 — admin payment controls and source matrix

- Replaced the simplified comma-separated payment-method field in the Next.js admin settings tab with individual checkbox controls matching the original PHP settings view values: `gpay`, `phonepe`, `paytm`, `bhim_upi`, `cred`, `whatspp_pay`, `qr_code`, and `cod`.
- Kept the separate Netbanking/PayU enable switch and Merchant Key/Salt, Pixel Code and UPI fields.
- Added `EXACT_MIGRATION_MATRIX.md`, mapping every original customer/admin PHP view to its Next.js target and recording known parity gaps from direct source inspection.
- Confirmed the uploaded original `assets/` directory is copied into `public/assets/` (362 application asset files; only the two `.DS_Store` metadata files are not copied).
- Attempted dependency installation twice; npm install timed out in this execution environment. A production build is therefore not certified.
