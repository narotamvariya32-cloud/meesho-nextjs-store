import {NextRequest,NextResponse} from 'next/server';
import {createHash,timingSafeEqual} from 'node:crypto';
import {query} from '@/lib/db';
import {settings} from '@/lib/store';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 try{
  const form=await req.formData();const p:any={};form.forEach((v,k)=>p[k]=String(v));const s=await settings();
  const seq=['status','udf10','udf9','udf8','udf7','udf6','udf5','udf4','udf3','udf2','udf1','email','firstname','productinfo','amount','txnid','key'];
  const additionalCharges=String(p.additionalCharges||p.additional_charges||'');const reverseSource=additionalCharges?`${additionalCharges}|${s.salt_key}|${seq.map(k=>p[k]||'').join('|')}`:`${s.salt_key}|${seq.map(k=>p[k]||'').join('|')}`;const expected=createHash('sha512').update(reverseSource).digest();const supplied=Buffer.from(String(p.hash||''),'hex');
  const orderId=Number(p.udf1);const order=(await query<any>('SELECT id,total_amount FROM orders WHERE id=? LIMIT 1',[orderId]))[0];
  const valid=!!s.salt_key&&!!s.merchant_key&&p.key===s.merchant_key&&supplied.length===expected.length&&timingSafeEqual(expected,supplied)&&!!order&&Number(order.total_amount).toFixed(2)===Number(p.amount).toFixed(2);
  if(valid){const paid=String(p.status).toLowerCase()==='success';await query('UPDATE orders SET payment_status=?,order_status=? WHERE id=?',[paid?'paid':'failed',paid?'confirmed':'pending',orderId]);return NextResponse.redirect(new URL(paid?`/success?order=${orderId}`:`/failure?order=${orderId}`,req.url),303)}
  return NextResponse.redirect(new URL('/failure?reason=verification',req.url),303)
 }catch(e){console.error('PayU callback verification',e);return NextResponse.redirect(new URL('/failure?reason=verification',req.url),303)}
}
