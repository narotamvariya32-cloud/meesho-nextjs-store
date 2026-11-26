import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Product = {id:number;unique_name:string;md5_slug:string;name:string|null;selling_price:number|null;mrp:number|null;img1:string|null};
export async function GET(req: NextRequest) {
 try { const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') || 1)); const limit = 30; const offset = (page-1)*limit;
  const products = await query<Product>(`SELECT id, unique_name, MD5(CAST(id AS CHAR)) AS md5_slug, name, selling_price, CASE WHEN mrp > 0 THEN mrp ELSE 9999 END AS mrp, img1 FROM tbl_product WHERE is_show=1 ORDER BY MOD(id,17) ASC, id ASC LIMIT ? OFFSET ?`,[limit,offset]);
  const countRows = await query<{total:number}>('SELECT COUNT(*) AS total FROM tbl_product WHERE is_show=1');
  return NextResponse.json({products,total:Number(countRows[0]?.total||0),page,limit,totalPages:Math.ceil(Number(countRows[0]?.total||0)/limit)});
 } catch(e) { console.error('products API',e); return NextResponse.json({ok:false,message:'Database unavailable or schema not imported.'},{status:503}); }
}
