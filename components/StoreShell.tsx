'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useCart} from './CartProvider';

export default function StoreShell({children}:{children:React.ReactNode}) {
  const {items}=useCart();
  const [search,setSearch]=useState('');
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  const count=ready?items.reduce((n,x)=>n+x.qty,0):0;
  return <>
    <div id="container" style={{overflow:'hidden'}}>
      <div className="_2dxSCm">
        <div className="_3CzzrP"><div className="_38U37R"><div>
          <div className="_1FWdmb">
            <div className="d-flex align-items-center">
              <button className="_3NH1qf original-menu-button" id="showmenu" aria-label="Menu" type="button"><span>☰</span></button>
              <Link className="Z4_K_h original-meesho-logo" href="/">meesho</Link>
            </div>
            <div className="header-menu">
              <Link className="_3NH1qf" href="/" aria-label="Home"><svg width="24" height="25" viewBox="0 0 24 25"><path d="M22 9.2c0 3.7-1.9 7.2-9.7 12.4a.6.6 0 0 1-.6 0C3.9 16.4 2 12.9 2 9.2S4.6 3.7 7.3 3.7c3.2-.1 4.6 3.6 4.7 3.8.1-.2 1.5-3.9 4.7-3.8C19.4 3.7 22 5.5 22 9.2Z" fill="#ed3843"/></svg></Link>
              <Link className="_3NH1qf original-cart-icon" href="/cart" aria-label="Cart"><svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M2 3h2.5l2.7 13.2a2 2 0 0 0 2 1.6h10.5M7 7h15l-1.2 8H8.5M11 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm7 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" stroke="#9f2089" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>{count>0&&<span className="header__cart-count header__cart-count--floating">{count}</span>}</Link>
            </div>
          </div>
          <div className="search-bar"><div className="_3QNhdh"><div className="ORogdv"><div className="_1k9EoO"><div className="_2d36Hu"><div className="search-div"><span className="original-search-icon">⌕</span><input className="search-input-elm" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for Sarees, Kurtis, Cosmetics, etc." /></div></div></div></div></div></div>
        </div></div></div>
      </div>
      {children}
    </div>
    <div className="original-bottom-nav">
      <Link href="/" aria-label="Home" className="original-bottom-item active"><svg className="original-bottom-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.7 12 3l9 7.7v9.1a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 19.8z" fill="#9f2089" stroke="#9f2089" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9.2 21v-6.4h5.6V21" fill="#fff" stroke="#fff" strokeWidth="1.2"/></svg><span>Home</span></Link>
      <Link href="/" aria-label="Categories" className="original-bottom-item"><svg className="original-bottom-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="2.8" width="16" height="18.4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7h8M8 10h8M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg><span>Categories</span></Link>
      <Link href="/" aria-label="My Orders" className="original-bottom-item"><svg className="original-bottom-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 7 9-4 9 4v10l-9 4-9-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m3.5 7.2 8.5 4 8.5-4M12 11.2V21" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg><span>My Orders</span></Link>
      <Link href="/" aria-label="Help" className="original-bottom-item"><svg className="original-bottom-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M9.7 9a2.4 2.4 0 1 1 4.1 1.7c-1.1 1-1.8 1.3-1.8 2.8M12 17.2v.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg><span>Help</span></Link>
      <Link href="/" aria-label="Account" className="original-bottom-item"><svg className="original-bottom-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M8.5 14c.9 1.5 2.1 2.2 3.5 2.2s2.6-.7 3.5-2.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg><span>Account</span></Link>
    </div>
    <style jsx global>{`
      html,body{max-width:500px!important;margin:0 auto!important;background:#fff!important;font-family:'Mier demi',Arial,sans-serif!important;font-size:12px!important}
      #container{min-height:85vh;background:#fff}
      .original-meesho-logo{display:inline-block!important;font-family:Arial,sans-serif!important;font-size:28px!important;font-weight:500!important;letter-spacing:-1.35px!important;color:#570d48!important;line-height:34px!important;padding:0!important;margin:0 0 0 10px!important;max-width:none!important;text-decoration:none!important}
      .original-menu-button{background:transparent;border:0;color:#333!important;font-size:22px;display:block!important;width:26px!important}
      .original-cart-icon{position:relative}
      .original-cart-icon svg{vertical-align:middle}
      .header__cart-count--floating{position:absolute;top:-2px;right:-4px;background:#e11900;color:white;border-radius:50%;font-size:9px;min-width:15px;height:15px;text-align:center;line-height:15px}
      .search-bar{display:block!important;padding:0 0 9px;background:#fff}
      .search-div{display:flex!important;align-items:center;height:40px!important;border:1px solid #d6d6df!important;background:#fff!important;border-radius:7px!important;padding:0 10px!important;line-height:normal!important}
      .search-input-elm{border:0!important;outline:0!important;width:100%!important;height:36px!important;font-size:13px!important;background:transparent!important;color:#353543!important}
      .original-search-icon{font-size:24px;color:#777;margin-right:8px;line-height:1}
      .original-bottom-nav{position:fixed!important;left:50%!important;bottom:0!important;transform:translateX(-50%)!important;width:100%!important;max-width:500px!important;height:64px!important;min-height:64px!important;z-index:10000!important;background:#fff!important;border-top:1px solid #eee!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-around!important;box-shadow:0 -2px 8px #00000008!important;padding:4px 0 max(4px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important}.original-bottom-item{box-sizing:border-box!important;display:flex!important;flex:1 1 20%!important;min-width:0!important;height:54px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;color:#777!important;text-decoration:none!important;font-family:Arial,sans-serif!important;font-size:11px!important;font-weight:400!important;line-height:14px!important;padding:3px 0!important;white-space:nowrap!important}.original-bottom-item.active{color:#9f2089!important}.original-bottom-icon{width:24px!important;height:24px!important;display:block!important;color:#888!important;flex:0 0 24px!important;overflow:visible!important}.original-bottom-item.active .original-bottom-icon{color:#9f2089!important}.original-bottom-item span{display:block!important;visibility:visible!important;opacity:1!important}
      @media(min-width:501px){html,body{border-left:1px solid #eee;border-right:1px solid #eee}}
    `}</style>
  </>;
}
