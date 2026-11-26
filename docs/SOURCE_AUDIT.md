# Source application audit

The supplied archive is a CodeIgniter/PHP store. Its customer controllers cover Home, Product, Category, Cart, Address and Payment. The admin controllers cover Login, Home, Products, Banners, Category, Settings and Success_settings.

The supplied SQL uses the original tables `admin_master`, `category`, `orders`, `purchase`, `settings`, `tbl_banner`, `tbl_product`, `tbl_product_verient`, and `tbl_success_settings`. The Next.js app keeps those table names.

Important source behaviours carried into the rewrite:
- Homepage products are visible only when `is_show=1`, 30 per request, ordered by `MOD(id,17)` then `id`.
- Legacy product links use an MD5 hash of the numeric product ID.
- Product variants live in `tbl_product_verient` and can override price and image.
- Payment settings are stored in `settings`; the supported UPI methods include GPay, PhonePe, Paytm, BHIM, CRED and QR.
- QR payment applies a 10% discount in the source payment view.
- PayU uses `https://secure.payu.in/_payment`, SHA-512 request hashing, and success/failure callbacks.
- Orders are initially `verification_pending` / `pending`; UPI app handoff is not proof of payment.
- Success-page copy is stored in `tbl_success_settings`.

This is a framework rewrite, not a byte-for-byte port of the PHP templates. Visual layout and some browser behaviours have been recreated in React and must be checked against the live source on desktop and mobile.
