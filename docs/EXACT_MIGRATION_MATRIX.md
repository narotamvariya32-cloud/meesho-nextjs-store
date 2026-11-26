# Exact PHP → Next.js migration matrix

Reference: `MEESHO KURI.zip` and `u913724331_oct23.sql` supplied by the owner. The PHP app is the source of truth. No redesign or feature substitution is allowed.

## Customer-facing views

| CodeIgniter source | Next.js target | Current state |
|---|---|---|
| `views/common_template/common.php` | `app/layout.tsx` | Partial: global CSS, fonts/assets, Pixel and analytics loader wired; original per-page head/meta and conditional footer/navigation still need exact parity |
| `views/common_template/header.php` | `components/StoreShell.tsx` | Partial: logo/menu/search/cart and mobile bottom nav recreated; exact original header behaviours/icons/conditions still need comparison |
| `views/common_template/footer.php` | `components/StoreShell.tsx` | Partial: simplified bottom navigation; original drawer/cart behaviours are not fully ported |
| `views/offer.php` | `app/page.tsx` | Partial: category row, marquee, banner carousel markup, benefits image, timer and products are present; original banner carousel JS and all page details need verification |
| `views/product_details.php` | `app/product/[slug]/page.tsx`, `components/ProductDetail.tsx` | Partial: legacy MD5 URL, variant query and detail component exist; exact layout/variant/cart interactions need parity pass |
| `views/categories.php` | `app/category/page.tsx` | Partial; exact layout not certified |
| `views/category_details.php` | `app/category/[slug]/page.tsx` | Partial; exact product listing parity not certified |
| `views/cart.php` | `app/cart/page.tsx`, `components/CartProvider.tsx` | Partial; original Buy-2-Get-1/free-unit and localStorage semantics need source-by-source verification |
| `views/address.php` | `app/address/page.tsx`, `components/CheckoutForm.tsx` | Partial; original field order, validation, storage and UI need exact parity |
| `views/payment.php` | `app/payment/page.tsx` | Incomplete: current payment UI and all deep-link branches/QR modal/UTR workflow do not yet match source |
| `views/success.php` | `app/success/page.tsx` | Partial; exact original page and settings need comparison |
| `views/failure.php` | `app/failure/page.tsx`, `app/payment/failure/page.tsx` | Partial; exact original page and callback behaviour need comparison |
| `views/sale.php` | `app/sale/page.tsx` | Partial; exact UI not certified |

## Admin views

| CodeIgniter source | Next.js target | Current state |
|---|---|---|
| `administrator/auth/admin_login.php` | `app/administrator/login/page.tsx` | Partial; authentication endpoint exists; exact original form/theme not certified |
| `administrator/dashboard.php` | `app/administrator/page.tsx`, `components/AdminPanel.tsx` | Incomplete: current custom admin layout is not a same-to-same port of the original dashboard/sidebar |
| `administrator/manage_products/view_products.php` | Admin Products tab + `/api/admin/products` | Partial CRUD; original filters/order/category/hide/show/bulk actions need parity |
| `administrator/manage_products/add_edit_products.php` | Admin Products tab + variants API | Partial CRUD; original form fields and exact layout need parity |
| `administrator/manage_category/view_category.php` | Admin Categories tab + API | Partial CRUD; exact UI/order controls need parity |
| `administrator/manage_category/add_edit_category.php` | Admin Categories tab + API | Partial CRUD; exact form and validation need parity |
| `administrator/manage_banners/manage_banners.php` | Admin Banners tab + API | Partial CRUD; exact table and controls need parity |
| `administrator/manage_banners/add_edit_banner.php` | Admin Banners tab + upload API | Partial CRUD; exact form/order/status behaviour needs parity |
| `administrator/manage_settings/add_edit_settings.php` | Admin Settings tab + API | Partial: UPI, source payment checkboxes, PayU keys and Pixel fields are present; exact theme/form and source-specific save behaviour need parity |
| `administrator/manage_settings/success_settings.php` | Admin Success tab + API | Partial; exact form/theme needs parity |

## Original database tables retained

`admin_master`, `category`, `orders`, `purchase`, `settings`, `tbl_banner`, `tbl_product`, `tbl_product_verient`, `tbl_success_settings`.

## Payment source behaviours to preserve exactly

- Admin payment method values in the PHP settings form: `gpay`, `phonepe`, `paytm`, `bhim_upi`, `cred`, `whatspp_pay`, `qr_code`, `cod`. The Next.js admin settings checkbox list now includes all of these values plus the source's conditional `mobikwik` value.
- `mobikwik` is also conditionally rendered in the PHP payment view if present in the stored payment-method list.
- Separate `netbanking` switch and PayU Merchant Key/Salt fields.
- QR path creates a UPI QR, exposes download, asks for UTR, and submits the UTR through the source's existing return route. The Next.js QR/UTR flow remains incomplete and is not certified.
- QR selection applies a 10% discount in the source JS.
- GPay and PhonePe use the same PhonePe-native payload on Android and `phonepe://upi//pay` on iOS in the supplied PHP source. The Next.js payment page retains this handoff pattern.
- WhatsApp Pay, Paytm, BHIM and CRED each have separate source deep-link branches.
- Facebook/Instagram in-app browser detection and Android intent package fallback are present in the source.
- PayU uses the original form post and success/failure callbacks.

## Deployment gate

Do not call this project production-ready until every row above has been visually and functionally compared against the supplied PHP source, `npm install` and `npm run build` pass, the original SQL is imported into the intended managed MySQL service, and real device/browser/payment tests are completed. Build could not be run in this environment because npm dependency installation timed out.
