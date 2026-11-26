import Link from 'next/link';
import { query } from '@/lib/db';
import { safeImage } from '@/lib/store';

export const dynamic = 'force-dynamic';

type OrderItem = { id?: number; variant_id?: number | null; name?: string; price?: number; qty?: number; image?: string };
type Address = { name?: string; number?: string; flat?: string; area?: string; city?: string; state?: string; pin?: string };

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function methodLabel(value: string) {
  if (value === 'qr_code') return 'UPI QR';
  const labels: Record<string, string> = { gpay: 'Google Pay', phonepe: 'PhonePe', paytm: 'Paytm', bhim_upi: 'BHIM UPI', cred: 'CRED', payu: 'PayU' };
  return labels[value] || value;
}

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string; pending?: string; utr?: string }> }) {
  const params = await searchParams;
  const orderId = Number(params.order || 0);
  let order: any = null;
  let config: any = null;

  try {
    config = (await query<any>('SELECT title,message,delivery_days,button_text FROM tbl_success_settings ORDER BY id LIMIT 1'))[0] || null;
    if (Number.isSafeInteger(orderId) && orderId > 0) {
      order = (await query<any>(
        'SELECT order_number,total_amount,payment_method,payment_status,order_status,items_json,shipping_address,created_at FROM orders WHERE id=? LIMIT 1',
        [orderId],
      ))[0] || null;
    }
  } catch (error) {
    console.error('success page data', error);
  }

  const items = parseJson<OrderItem[]>(order?.items_json, []);
  const address = parseJson<Address>(order?.shipping_address, {});
  const deliveryDays = Math.max(1, Number(config?.delivery_days) || 5);
  const expectedDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date(Date.now() + deliveryDays * 86400000));
  const paid = order?.payment_status === 'paid';
  const failed = order?.payment_status === 'failed';
  const paymentStatusLabel = paid ? 'Paid' : failed ? 'Failed' : 'Pending verification';

  return (
    <main className="container narrow status-page">
      <div className="status-icon">✓</div>
      <h1>{config?.title || 'Order Received!'}</h1>
      <p>{config?.message || 'Your order has been received successfully.'}</p>

      {order ? (
        <>
          <section className="summary">
            <div>Order number <b>{order.order_number}</b></div>
            {params.utr ? <div>UTR / Transaction ID <b>{params.utr}</b></div> : null}
            <div>Total amount <b>₹{Number(order.total_amount || 0).toFixed(2)}</b></div>
            <div>Payment method <b>{methodLabel(String(order.payment_method || ''))}</b></div>
            <div>Payment status <b>{paymentStatusLabel}</b></div>
            <div>Order status <b>{order.order_status || 'pending'}</b></div>
          </section>

          {!paid && (
            <p className="muted">
              {failed ? 'The payment was marked as failed. If money was deducted, contact store support with your order number.' : 'If you completed UPI payment, your order will remain pending until the payment is verified. Opening a payment app or scanning a QR code does not confirm payment.'}
            </p>
          )}

          <section className="summary">
            <h2>Expected delivery: {expectedDate}</h2>
            <h3>Delivery address</h3>
            <p>
              {[address.name, address.number, address.flat, address.area, address.city, address.state, address.pin]
                .filter(Boolean).join(', ') || 'Address details saved with your order'}
            </p>
          </section>

          {items.length > 0 && (
            <section className="summary">
              <h3>Order items</h3>
              {items.map((item, index) => (
                <div className="cart-item" key={`${item.id || index}-${item.variant_id || ''}`}>
                  <img src={safeImage(item.image)} alt={item.name || 'Order item'} />
                  <div className="cart-desc">
                    <b>{item.name || 'Product'}</b>
                    <p>₹{Number(item.price || 0).toFixed(2)} × {Math.max(1, Number(item.qty || 1))}</p>
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      ) : (
        <p>Your order details are being processed.</p>
      )}

      <Link className="btn" href="/">{config?.button_text || 'Continue Shopping'}</Link>
    </main>
  );
}
