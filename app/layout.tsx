import './globals.css';
import {CartProvider} from '@/components/CartProvider';
import ConditionalShell from '@/components/ConditionalShell';
import {settings} from '@/lib/store';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const metadata={title:'Online Shopping | Meesho',description:'Maha Sale'};
export default async function RootLayout({children}:{children:React.ReactNode}){let pixel='',analytics='';try{const s=await settings();pixel=s.pixel_code||'';analytics=(s as any).analytics||'';}catch{}return <html lang="en-IN"><head><meta name="viewport" content="width=device-width,minimum-scale=1,user-scalable=no"/><meta name="theme-color" content="#9f2089"/><link rel="stylesheet" href="/assets/website/css/bootstrap.min.css"/><link rel="stylesheet" href="/assets/website/css/custom.css?v=20260902"/><link rel="stylesheet" href="/assets/website/css/checkout.css"/><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/></head><body className="expansion-alids-init"><CartProvider><ConditionalShell>{children}</ConditionalShell>{pixel&&<MetaPixel code={pixel}/>}<GoogleAnalytics value={analytics}/></CartProvider></body></html>}
