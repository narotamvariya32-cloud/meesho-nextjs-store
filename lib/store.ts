import { query } from './db';

export type StoreSettings = {
  id?: number;
  upi_id: string;
  payment_method: string;
  netbanking: number;
  merchant_key: string;
  salt_key: string;
  pixel_code: string;
  website_url: string;
  analytics: string;
};

function canonicalSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
}

/**
 * The legacy PHP app selected settings by website_url. The supplied SQL dump
 * contains multiple historical website settings rows, so prefer the current
 * deployment URL and only fall back to the newest row until the admin saves
 * settings for this deployment.
 */
export async function matchingSettingsRecord(): Promise<StoreSettings | undefined> {
  const siteUrl = canonicalSiteUrl();
  if (!siteUrl) return undefined;
  const active = await query<StoreSettings>(
    "SELECT id,upi_id,payment_method,netbanking,merchant_key,salt_key,pixel_code,website_url,analytics FROM settings WHERE LOWER(TRIM(TRAILING '/' FROM website_url))=LOWER(?) ORDER BY id DESC LIMIT 1",
    [siteUrl],
  );
  return active[0];
}

export async function activeSettingsRecord(): Promise<StoreSettings | undefined> {
  const matching = await matchingSettingsRecord();
  if (matching) return matching;
  const latest = await query<StoreSettings>(
    'SELECT id,upi_id,payment_method,netbanking,merchant_key,salt_key,pixel_code,website_url,analytics FROM settings ORDER BY id DESC LIMIT 1',
  );
  return latest[0];
}

export async function settings(): Promise<StoreSettings> {
  const row = await activeSettingsRecord();
  return row || {
    upi_id: '',
    payment_method: 'gpay,phonepe,paytm,bhim_upi,cred,qr_code',
    netbanking: 0,
    merchant_key: '',
    salt_key: '',
    pixel_code: '',
    website_url: canonicalSiteUrl(),
    analytics: '',
  };
}

export function safeImage(src: string | null | undefined) {
  if (!src) return '/assets/placeholder.svg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src;
  return `/${src.replace(/^\/+/, '')}`;
}
