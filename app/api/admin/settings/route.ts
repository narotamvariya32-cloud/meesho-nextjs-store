import { NextRequest, NextResponse } from 'next/server';
import { adminId } from '@/lib/auth';
import { query } from '@/lib/db';
import { activeSettingsRecord, matchingSettingsRecord } from '@/lib/store';

export const runtime = 'nodejs';

export async function GET() {
  if (!await adminId()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json({ settings: await activeSettingsRecord() || {} });
  } catch {
    return NextResponse.json({ error: 'Could not load store settings' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!await adminId()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const p = await req.json();
    const upiId = String(p.upi_id || '').trim();
    const paymentMethod = String(p.payment_method || '').split(',').map((x: string) => x.trim()).filter(Boolean).join(',');
    const netbanking = p.netbanking ? 1 : 0;
    const merchantKey = String(p.merchant_key || '').trim();
    const saltKey = String(p.salt_key || '').trim();
    const pixelCode = String(p.pixel_code || '');
    const analytics = String(p.analytics || '');
    const websiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
    const current = await matchingSettingsRecord();

    if (current?.id) {
      await query(
        'UPDATE settings SET upi_id=?,payment_method=?,netbanking=?,merchant_key=?,salt_key=?,pixel_code=?,analytics=?,website_url=? WHERE id=?',
        [upiId, paymentMethod, netbanking, merchantKey, saltKey, pixelCode, analytics, websiteUrl || current.website_url, current.id],
      );
    } else {
      await query(
        'INSERT INTO settings (upi_id,payment_method,netbanking,merchant_key,salt_key,pixel_code,analytics,website_url) VALUES (?,?,?,?,?,?,?,?)',
        [upiId, paymentMethod, netbanking, merchantKey, saltKey, pixelCode, analytics, websiteUrl],
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('admin settings save', error);
    return NextResponse.json({ error: 'Settings save failed' }, { status: 500 });
  }
}
