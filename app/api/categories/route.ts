import { NextResponse } from 'next/server'; import { query } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{return NextResponse.json({categories:await query('SELECT * FROM category ORDER BY `index` ASC,id ASC')})}catch(e){console.error(e);return NextResponse.json({ok:false,message:'Database unavailable.'},{status:503})}}
