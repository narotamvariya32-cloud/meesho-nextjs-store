import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
const COOKIE='meesho_admin';
function secret(){const s=process.env.ADMIN_SESSION_SECRET;if(!s||s.length<32)throw new Error('Set ADMIN_SESSION_SECRET to a random 32+ character secret');return s;}
export function makeToken(adminId:number){const payload=Buffer.from(JSON.stringify({adminId,exp:Date.now()+7*86400000})).toString('base64url');const sig=createHmac('sha256',secret()).update(payload).digest('base64url');return `${payload}.${sig}`;}
export function verifyToken(token:string){try{const [p,s]=token.split('.');const expected=createHmac('sha256',secret()).update(p).digest();const actual=Buffer.from(s,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;const data=JSON.parse(Buffer.from(p,'base64url').toString());return data.exp>Date.now()?Number(data.adminId):null;}catch{return null;}}
export async function adminId(){const jar=await cookies();const t=jar.get(COOKIE)?.value;return t?verifyToken(t):null;}
export const adminCookieName=COOKIE;
