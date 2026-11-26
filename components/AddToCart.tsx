'use client';
import {useCart} from './CartProvider';
export default function AddToCart({product}:{product:{id:number;name:string;price:number;mrp:number;image:string}}){const {add}=useCart();return <button className="btn" onClick={()=>{add({id:product.id,name:product.name,price:product.price,mrp:product.mrp,image:product.image});alert('Added to cart');}}>Add to Cart</button>}
