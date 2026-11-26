import {NextRequest,NextResponse} from 'next/server';
import {randomBytes} from 'node:crypto';
import {query,db} from '@/lib/db';
import {settings} from '@/lib/store';
export const runtime='nodejs';
type Item={id:number;qty:number;variant?:string};
export async function POST(req:NextRequest){
 try{
  const body=await req.json();const items=body.items as Item[];const address=body.address;const method=String(body.payment_method||'');
  if(!Array.isArray(items)||!items.length||items.length>30||!address?.name||!/^[6-9]\d{9}$/.test(String(address.number||''))||!/^\d{6}$/.test(String(address.pin||''))||!address.flat||!address.area||!address.city||!address.state)return NextResponse.json({error:'Please complete all delivery details.'},{status:400});
  const s=await settings();const enabled=(s.payment_method||'').split(',').map(x=>x.trim());
  if(method==='payu'){if(Number(s.netbanking)!==1||!s.merchant_key||!s.salt_key)return NextResponse.json({error:'PayU is not enabled in store settings.'},{status:400})}
  else if(!['gpay','phonepe','paytm','bhim_upi','cred','mobikwik','whatspp_pay','qr_code','cod'].includes(method)||!enabled.includes(method))return NextResponse.json({error:'This payment method is not currently available.'},{status:400});
  else if(method!=='cod'&&!String(s.upi_id||'').trim())return NextResponse.json({error:'UPI ID is not configured in admin settings.'},{status:400});
  let total=0;const verified=[];
  for(const item of items){const id=Number(item.id),qty=Math.max(1,Math.min(20,Number(item.qty)||1));if(!Number.isInteger(id)||id<=0)return NextResponse.json({error:'Invalid cart item.'},{status:400});const rows=item.variant?await query<any>('SELECT v.id AS variant_id,v.product_id,p.name,v.selling_price,v.mrp,COALESCE(v.img1,p.img1) AS img1 FROM tbl_product_verient v JOIN tbl_product p ON p.id=v.product_id WHERE v.id=? AND p.is_show=1',[Number(item.variant)]):await query<any>('SELECT id AS product_id,NULL AS variant_id,name,selling_price,mrp,img1 FROM tbl_product WHERE id=? AND is_show=1',[id]);const p=rows[0];if(!p||Number(p.product_id)!==id)return NextResponse.json({error:'One of the products is unavailable.'},{status:400});const price=Number(p.selling_price)||0;if(price<=0)return NextResponse.json({error:'A product has an invalid price. Please contact the store.'},{status:400});total+=price*qty;verified.push({id,variant_id:p.variant_id,name:p.name,price,qty,image:p.img1});}
  if(method==='qr_code')total=Number((total*0.9).toFixed(2));
  const conn=await db().getConnection();let result:any;try{const orderNo='ORD'+Date.now().toString()+randomBytes(3).toString('hex').toUpperCase();const [r]=await conn.execute('INSERT INTO orders (order_number,customer_name,customer_mobile,shipping_address,items_json,total_amount,payment_method,payment_status,order_status) VALUES (?,?,?,?,?,?,?,?,?)',[orderNo,address.name,address.number,JSON.stringify(address),JSON.stringify(verified),total,method,method==='cod'?'pending':'verification_pending','pending']);result={id:(r as any).insertId,order_number:orderNo};const [purchaseRows]=await conn.execute('SELECT id FROM purchase WHERE date=CURDATE() ORDER BY id DESC LIMIT 1');const today=(purchaseRows as any[])[0];if(today)await conn.execute('UPDATE purchase SET count=COALESCE(count,0)+1,last_update_time=NOW() WHERE id=?',[today.id]);else await conn.execute('INSERT INTO purchase (date,count,last_update_time) VALUES (CURDATE(),1,NOW())');}finally{conn.release()}
  return NextResponse.json({ok:true,...result,total});
 }catch(e){console.error('checkout create',e);return NextResponse.json({error:'Could not create order. Check database connection.'},{status:503})}
}
