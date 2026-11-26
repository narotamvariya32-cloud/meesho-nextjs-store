import { NextResponse } from 'next/server'; import { query } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{return NextResponse.json({banners:await query('SELECT id,image,link,sort_order FROM tbl_banner WHERE status=1 ORDER BY sort_order ASC,id ASC')})}catch(e){console.error(e);return NextResponse.json({ok:false,message:'Database unavailable.'},{status:503})}}
