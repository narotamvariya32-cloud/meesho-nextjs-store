import './globals.css';
import Link from 'next/link';
import { CartProvider } from '@/components/CartProvider';
import { settings } from '@/lib/store';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const metadata={title:'Meesho Store | Online Shopping',description:'Shop daily deals and fashion collections'};
export default async function RootLayout({children}:{children:React.ReactNode}){let pixel='',analytics='';try{const s=await settings();pixel=s.pixel_code||'';analytics=(s as any).analytics||'';}catch{}return <html lang="en"><body><CartProvider><header className="site-header"><div className="header-inner"><Link className="brand" href="/">meesho</Link><nav><Link href="/">Home</Link><Link href="/category">Categories</Link><Link href="/cart">Cart</Link></nav></div></header>{children}<footer className="site-footer">© {new Date().getFullYear()} Meesho Store · Secure shopping</footer>{pixel&&<MetaPixel code={pixel}/>}<GoogleAnalytics value={analytics}/></CartProvider></body></html>}
