'use client';
import Link from 'next/link';
type P={id:number;unique_name:string;md5_slug?:string;name:string|null;selling_price:number|null;mrp:number|null;img1:string|null};
function imageSrc(src:string|null){if(!src)return '/assets/placeholder.svg';if(src.startsWith('http://')||src.startsWith('https://')||src.startsWith('/'))return src;return `/${src.replace(/^\/+/, '')}`}
export default function ProductGrid({products}:{products:P[]}){return <div className="products-grid">{products.map(p=><Link className="product-card" href={`/product/${p.md5_slug||p.unique_name||p.id}`} key={p.id}><img src={imageSrc(p.img1)} alt={p.name||'Product'}/><div className="product-info"><div className="product-name">{p.name||'Fashion Product'}</div><div className="price-row"><b>₹{p.selling_price||0}</b>{Number(p.mrp)>0&&<s>₹{p.mrp}</s>}<span className="free-delivery">Free Delivery</span></div></div></Link>)}</div>}
